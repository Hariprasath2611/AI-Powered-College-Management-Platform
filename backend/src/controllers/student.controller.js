const prisma = require('../config/db');

// Calculate Grade Points based on marks percentage
const getGradePoints = (marksObtained, maxMarks) => {
  const percentage = (marksObtained / maxMarks) * 100;
  if (percentage >= 90) return 10.0;
  if (percentage >= 80) return 9.0;
  if (percentage >= 70) return 8.0;
  if (percentage >= 60) return 7.0;
  if (percentage >= 50) return 6.0;
  return 0.0; // Fail
};

// Student Dashboard Summary
const getDashboardSummary = async (req, res, next) => {
  try {
    const studentId = req.user.profileId;
    if (!studentId) {
      return res.status(400).json({ error: 'Student profile ID missing' });
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { department: true }
    });

    // 1. Attendance Overview
    const totalAttendance = await prisma.attendance.count({
      where: { studentId }
    });
    const presentAttendance = await prisma.attendance.count({
      where: { studentId, status: 'PRESENT' }
    });
    const attendancePercentage = totalAttendance > 0 
      ? Math.round((presentAttendance / totalAttendance) * 100)
      : 85; // Default placeholder if fresh account

    // 2. Assignment status count
    const totalAssignments = await prisma.assignment.count({
      where: {
        subject: { departmentId: student.departmentId, semester: student.currentSemester },
        section: student.currentSection
      }
    });

    const submittedAssignments = await prisma.submission.count({
      where: { studentId }
    });

    const pendingAssignments = Math.max(0, totalAssignments - submittedAssignments);

    // 3. Placement status count
    const appliedCompaniesCount = await prisma.placementApplication.count({
      where: { studentId }
    });

    // 4. GPA Calculation
    const semesterMarks = await prisma.mark.findMany({
      where: { studentId },
      include: { subject: true }
    });

    let gpa = 0.0;
    if (semesterMarks.length > 0) {
      let totalWeightedPoints = 0;
      let totalCredits = 0;

      semesterMarks.forEach(m => {
        const gradePoint = getGradePoints(m.marksObtained, m.maxMarks);
        const credits = m.subject.credits;
        totalWeightedPoints += (gradePoint * credits);
        totalCredits += credits;
      });

      gpa = totalCredits > 0 ? parseFloat((totalWeightedPoints / totalCredits).toFixed(2)) : 0.0;
    } else {
      gpa = 8.5; // Mock placeholder if fresh student
    }

    // 5. Upcoming events
    const upcomingEvents = await prisma.event.findMany({
      where: { date: { gte: new Date() } },
      orderBy: { date: 'asc' },
      take: 3
    });

    res.status(200).json({
      attendancePercentage,
      pendingAssignments,
      submittedAssignments,
      appliedCompaniesCount,
      gpa,
      upcomingEvents,
      student
    });
  } catch (error) {
    next(error);
  }
};

// Subject-wise detailed attendance
const getAttendance = async (req, res, next) => {
  try {
    const studentId = req.user.profileId;
    const student = await prisma.student.findUnique({
      where: { id: studentId }
    });

    const subjects = await prisma.subject.findMany({
      where: { departmentId: student.departmentId, semester: student.currentSemester }
    });

    const attendanceSummary = [];

    for (const subject of subjects) {
      const total = await prisma.attendance.count({
        where: { studentId, subjectId: subject.id }
      });
      const present = await prisma.attendance.count({
        where: { studentId, subjectId: subject.id, status: 'PRESENT' }
      });

      const percentage = total > 0 ? Math.round((present / total) * 100) : 100;

      attendanceSummary.push({
        subjectId: subject.id,
        subjectName: subject.name,
        subjectCode: subject.code,
        present,
        total,
        percentage
      });
    }

    // List recent logs
    const recentLogs = await prisma.attendance.findMany({
      where: { studentId },
      include: { subject: true, markedByFaculty: true },
      orderBy: { date: 'desc' },
      take: 10
    });

    res.status(200).json({ attendanceSummary, recentLogs });
  } catch (error) {
    next(error);
  }
};

// Retrieve Assignments
const getAssignments = async (req, res, next) => {
  try {
    const studentId = req.user.profileId;
    const student = await prisma.student.findUnique({
      where: { id: studentId }
    });

    const assignments = await prisma.assignment.findMany({
      where: {
        subject: { departmentId: student.departmentId, semester: student.currentSemester },
        section: student.currentSection
      },
      include: {
        subject: true,
        submissions: {
          where: { studentId }
        }
      },
      orderBy: { dueDate: 'asc' }
    });

    // Format output with submission status
    const list = assignments.map(a => {
      const submission = a.submissions[0] || null;
      return {
        id: a.id,
        title: a.title,
        description: a.description,
        dueDate: a.dueDate,
        fileUrl: a.fileUrl,
        subjectName: a.subject.name,
        subjectCode: a.subject.code,
        status: submission ? (submission.status === 'GRADED' ? 'GRADED' : 'SUBMITTED') : 'PENDING',
        submission: submission
      };
    });

    res.status(200).json({ assignments: list });
  } catch (error) {
    next(error);
  }
};

// Submit Assignment
const submitAssignment = async (req, res, next) => {
  try {
    const studentId = req.user.profileId;
    const { assignmentId, fileUrl } = req.body;

    const submission = await prisma.submission.upsert({
      where: {
        assignmentId_studentId: {
          assignmentId,
          studentId
        }
      },
      update: {
        fileUrl,
        submittedAt: new Date(),
        status: 'SUBMITTED',
        grade: null,
        feedback: null,
        gradedById: null
      },
      create: {
        assignmentId,
        studentId,
        fileUrl,
        status: 'SUBMITTED'
      }
    });

    res.status(201).json({ message: 'Assignment submitted successfully', submission });
  } catch (error) {
    next(error);
  }
};

// Marks Sheets & GPAs
const getMarks = async (req, res, next) => {
  try {
    const studentId = req.user.profileId;

    const marks = await prisma.mark.findMany({
      where: { studentId },
      include: { subject: true }
    });

    // Group by Semester
    const marksBySemester = {};
    marks.forEach(m => {
      const sem = m.subject.semester;
      if (!marksBySemester[sem]) {
        marksBySemester[sem] = [];
      }
      marksBySemester[sem].push({
        id: m.id,
        subjectName: m.subject.name,
        subjectCode: m.subject.code,
        credits: m.subject.credits,
        type: m.type,
        marksObtained: m.marksObtained,
        maxMarks: m.maxMarks,
        gradePoint: getGradePoints(m.marksObtained, m.maxMarks)
      });
    });

    // Calculate Semester GPAs
    const semGpas = {};
    let totalWeightedPoints = 0;
    let totalCredits = 0;

    Object.keys(marksBySemester).forEach(sem => {
      let semWeightedPoints = 0;
      let semCredits = 0;
      const subjectsProcessed = new Set();

      marksBySemester[sem].forEach(m => {
        // To avoid counting multiple exams for the same subject twice in credits
        if (!subjectsProcessed.has(m.subjectCode)) {
          subjectsProcessed.add(m.subjectCode);
          semCredits += m.credits;
        }
        semWeightedPoints += (m.gradePoint * m.credits);
      });

      semGpas[sem] = semCredits > 0 ? parseFloat((semWeightedPoints / (semCredits * 2)).toFixed(2)) : 0.0; // Assume 2 exam types logged
      totalWeightedPoints += semWeightedPoints;
      totalCredits += semCredits;
    });

    const cgpa = totalCredits > 0 ? parseFloat((totalWeightedPoints / (totalCredits * 2)).toFixed(2)) : 0.0;

    res.status(200).json({ marksBySemester, semGpas, cgpa });
  } catch (error) {
    next(error);
  }
};

// Profile details
const getProfile = async (req, res, next) => {
  try {
    const studentId = req.user.profileId;
    const profile = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        department: true,
        user: { select: { email: true } }
      }
    });

    res.status(200).json({ profile });
  } catch (error) {
    next(error);
  }
};

// Update Profile details
const updateProfile = async (req, res, next) => {
  try {
    const studentId = req.user.profileId;
    const { phone, address, resumeUrl } = req.body;

    const updated = await prisma.student.update({
      where: { id: studentId },
      data: {
        phone,
        address,
        resumeUrl
      }
    });

    res.status(200).json({ message: 'Profile updated successfully', profile: updated });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardSummary,
  getAttendance,
  getAssignments,
  submitAssignment,
  getMarks,
  getProfile,
  updateProfile
};
