const prisma = require('../config/db');

// Faculty Dashboard Summary
const getDashboardSummary = async (req, res, next) => {
  try {
    const facultyId = req.user.profileId;
    if (!facultyId) {
      return res.status(400).json({ error: 'Faculty profile ID missing' });
    }

    // Classes assigned
    const assignedClasses = await prisma.facultySubject.findMany({
      where: { facultyId },
      include: { subject: { include: { department: true } } }
    });

    // Count of pending assignments
    const activeAssignments = await prisma.assignment.findMany({
      where: { facultyId },
      select: { id: true }
    });
    const assignmentIds = activeAssignments.map(a => a.id);

    const pendingSubmissions = await prisma.submission.count({
      where: {
        assignmentId: { in: assignmentIds },
        status: 'SUBMITTED'
      }
    });

    // Recent attendance records marked
    const attendanceCount = await prisma.attendance.count({
      where: { markedByFacultyId: facultyId }
    });

    res.status(200).json({
      assignedClassesCount: assignedClasses.length,
      pendingSubmissionsCount: pendingSubmissions,
      attendanceMarkedCount: attendanceCount,
      assignedClasses
    });
  } catch (error) {
    next(error);
  }
};

// Subject assignment
const assignSubject = async (req, res, next) => {
  try {
    const { facultyId, subjectId, section, academicYear } = req.body;

    const allocation = await prisma.facultySubject.create({
      data: {
        facultyId,
        subjectId,
        section,
        academicYear
      }
    });

    res.status(201).json({ message: 'Subject allocated to faculty successfully', allocation });
  } catch (error) {
    next(error);
  }
};

// Fetch assigned classes
const getAssignedClasses = async (req, res, next) => {
  try {
    const facultyId = req.user.profileId;
    const classes = await prisma.facultySubject.findMany({
      where: { facultyId },
      include: { subject: { include: { department: true } } }
    });
    res.status(200).json({ classes });
  } catch (error) {
    next(error);
  }
};

// Get Students list for marking attendance (by subject/section)
const getStudentsForAttendance = async (req, res, next) => {
  try {
    const { subjectId, section } = req.query;

    const subject = await prisma.subject.findUnique({
      where: { id: subjectId }
    });

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    // Get students in same department, semester, and section
    const students = await prisma.student.findMany({
      where: {
        departmentId: subject.departmentId,
        currentSemester: subject.semester,
        currentSection: section
      },
      orderBy: { rollNumber: 'asc' }
    });

    res.status(200).json({ students });
  } catch (error) {
    next(error);
  }
};

// Mark Attendance
const markAttendance = async (req, res, next) => {
  try {
    const facultyId = req.user.profileId;
    const { date, period, subjectId, students } = req.body; // students: [{studentId, status: 'PRESENT'|'ABSENT'}]

    const parsedDate = new Date(date);

    // Create bulk attendance
    const attendancePromises = students.map(record => {
      return prisma.attendance.upsert({
        where: {
          date_period_studentId_subjectId: {
            date: parsedDate,
            period: parseInt(period),
            studentId: record.studentId,
            subjectId
          }
        },
        update: {
          status: record.status,
          markedByFacultyId: facultyId
        },
        create: {
          date: parsedDate,
          period: parseInt(period),
          studentId: record.studentId,
          subjectId,
          status: record.status,
          markedByFacultyId: facultyId
        }
      });
    });

    await Promise.all(attendancePromises);

    res.status(200).json({ message: 'Attendance marked successfully' });
  } catch (error) {
    next(error);
  }
};

// Edit single attendance record
const editAttendance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await prisma.attendance.update({
      where: { id },
      data: { status }
    });

    res.status(200).json({ message: 'Attendance record updated', attendance: updated });
  } catch (error) {
    next(error);
  }
};

// Create Assignment
const createAssignment = async (req, res, next) => {
  try {
    const facultyId = req.user.profileId;
    const { title, description, dueDate, fileUrl, subjectId, section } = req.body;

    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        fileUrl,
        subjectId,
        section,
        facultyId
      }
    });

    res.status(201).json({ message: 'Assignment created successfully', assignment });
  } catch (error) {
    next(error);
  }
};

// Get Submissions for an Assignment
const getAssignmentSubmissions = async (req, res, next) => {
  try {
    const { id } = req.params; // assignmentId

    const submissions = await prisma.submission.findMany({
      where: { assignmentId: id },
      include: {
        student: true
      }
    });

    res.status(200).json({ submissions });
  } catch (error) {
    next(error);
  }
};

// Grade Submission
const gradeSubmission = async (req, res, next) => {
  try {
    const facultyId = req.user.profileId;
    const { submissionId } = req.params;
    const { grade, feedback } = req.body;

    const updated = await prisma.submission.update({
      where: { id: submissionId },
      data: {
        grade,
        feedback,
        status: 'GRADED',
        gradedById: facultyId
      }
    });

    res.status(200).json({ message: 'Submission graded successfully', submission: updated });
  } catch (error) {
    next(error);
  }
};

// Add or Update Exam Marks
const addMarks = async (req, res, next) => {
  try {
    const { subjectId, type, marks } = req.body; // marks: [{ studentId, marksObtained, maxMarks }]

    const marksPromises = marks.map(m => {
      return prisma.mark.upsert({
        where: {
          studentId_subjectId_type: {
            studentId: m.studentId,
            subjectId,
            type
          }
        },
        update: {
          marksObtained: parseFloat(m.marksObtained),
          maxMarks: parseFloat(m.maxMarks)
        },
        create: {
          studentId: m.studentId,
          subjectId,
          type,
          marksObtained: parseFloat(m.marksObtained),
          maxMarks: parseFloat(m.maxMarks)
        }
      });
    });

    await Promise.all(marksPromises);

    res.status(200).json({ message: 'Marks submitted successfully' });
  } catch (error) {
    next(error);
  }
};

// Monitoring: Low Attendance Alerts (< 75%)
const getLowAttendanceAlerts = async (req, res, next) => {
  try {
    const facultyId = req.user.profileId;

    // Get subjects taught by faculty
    const subjects = await prisma.facultySubject.findMany({
      where: { facultyId },
      select: { subjectId: true, section: true }
    });

    const alerts = [];

    for (const sub of subjects) {
      const subject = await prisma.subject.findUnique({
        where: { id: sub.subjectId }
      });

      // Get students
      const students = await prisma.student.findMany({
        where: {
          departmentId: subject.departmentId,
          currentSemester: subject.semester,
          currentSection: sub.section
        }
      });

      for (const student of students) {
        const totalSessions = await prisma.attendance.count({
          where: { studentId: student.id, subjectId: subject.id }
        });

        const presentSessions = await prisma.attendance.count({
          where: { studentId: student.id, subjectId: subject.id, status: 'PRESENT' }
        });

        const percentage = totalSessions > 0 
          ? (presentSessions / totalSessions) * 100
          : 100; // Assume 100 if no classes held yet

        if (percentage < 75) {
          alerts.push({
            studentId: student.id,
            name: student.name,
            rollNumber: student.rollNumber,
            subjectName: subject.name,
            subjectCode: subject.code,
            section: sub.section,
            attendancePercentage: Math.round(percentage),
            presentSessions,
            totalSessions
          });
        }
      }
    }

    res.status(200).json({ alerts });
  } catch (error) {
    next(error);
  }
};

// Get Academic Report Analysis
const getClassReport = async (req, res, next) => {
  try {
    const { subjectId, type, section } = req.query;

    const subject = await prisma.subject.findUnique({
      where: { id: subjectId }
    });

    const students = await prisma.student.findMany({
      where: {
        departmentId: subject.departmentId,
        currentSemester: subject.semester,
        currentSection: section
      },
      select: { id: true }
    });

    const studentIds = students.map(s => s.id);

    const marks = await prisma.mark.findMany({
      where: {
        subjectId,
        type,
        studentId: { in: studentIds }
      },
      include: { student: true }
    });

    if (marks.length === 0) {
      return res.status(200).json({ message: 'No marks logged for this query', stats: null });
    }

    const marksObtained = marks.map(m => m.marksObtained);
    const totalMarks = marks[0].maxMarks;
    const sum = marksObtained.reduce((a, b) => a + b, 0);
    const average = sum / marks.length;
    const highest = Math.max(...marksObtained);
    const lowest = Math.min(...marksObtained);

    // Pass is marksObtained >= 50% of total
    const passCount = marks.filter(m => m.marksObtained >= (totalMarks * 0.5)).length;
    const passPercentage = (passCount / marks.length) * 100;

    res.status(200).json({
      stats: {
        average: parseFloat(average.toFixed(2)),
        highest,
        lowest,
        passPercentage: parseFloat(passPercentage.toFixed(2)),
        totalStudentsEvaluated: marks.length,
        maxMarks: totalMarks
      },
      marks
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardSummary,
  assignSubject,
  getAssignedClasses,
  getStudentsForAttendance,
  markAttendance,
  editAttendance,
  createAssignment,
  getAssignmentSubmissions,
  gradeSubmission,
  addMarks,
  getLowAttendanceAlerts,
  getClassReport
};
