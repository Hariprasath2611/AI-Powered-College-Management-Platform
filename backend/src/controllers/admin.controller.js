const prisma = require('../config/db');

const getDashboardStats = async (req, res, next) => {
  try {
    const totalStudents = await prisma.student.count();
    const totalFaculty = await prisma.faculty.count();
    const totalDepartments = await prisma.department.count();
    const totalSubjects = await prisma.subject.count();

    const totalDrives = await prisma.placementDrive.count();
    const totalApplications = await prisma.placementApplication.count();
    const offersGranted = await prisma.placementApplication.count({
      where: { status: 'OFFERED' }
    });

    const placementPercentage = totalStudents > 0 
      ? Math.round((offersGranted / totalStudents) * 100)
      : 0;

    const totalAttendanceRecords = await prisma.attendance.count();
    const presentRecords = await prisma.attendance.count({
      where: { status: 'PRESENT' }
    });
    const avgAttendance = totalAttendanceRecords > 0
      ? Math.round((presentRecords / totalAttendanceRecords) * 100)
      : 82; 

    const totalEvents = await prisma.event.count();
    const totalRegistrations = await prisma.eventRegistration.count();

    res.status(200).json({
      totalStudents,
      totalFaculty,
      totalDepartments,
      totalSubjects,
      placementStats: {
        totalDrives,
        totalApplications,
        offersGranted,
        placementPercentage
      },
      attendanceAnalytics: {
        avgAttendance
      },
      eventStats: {
        totalEvents,
        totalRegistrations
      }
    });
  } catch (error) {
    next(error);
  }
};

const createStudent = async (req, res, next) => {
  try {
    const { email, firebaseUid, registerNumber, rollNumber, name, dob, phone, address, admissionYear, currentSemester, currentSection, departmentId } = req.body;

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          firebaseUid,
          role: 'STUDENT'
        }
      });

      const student = await tx.student.create({
        data: {
          userId: user.id,
          registerNumber,
          rollNumber,
          name,
          dob: new Date(dob),
          phone,
          address,
          admissionYear: parseInt(admissionYear),
          currentSemester: parseInt(currentSemester),
          currentSection,
          departmentId
        }
      });

      return { user, student };
    });

    res.status(201).json({
      message: 'Student created successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const createFaculty = async (req, res, next) => {
  try {
    const { email, firebaseUid, employeeId, name, designation, phone, address, departmentId } = req.body;

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          firebaseUid,
          role: 'FACULTY'
        }
      });

      const faculty = await tx.faculty.create({
        data: {
          userId: user.id,
          employeeId,
          name,
          designation,
          phone,
          address,
          departmentId
        }
      });

      return { user, faculty };
    });

    res.status(201).json({
      message: 'Faculty created successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params; 
    const { name, dob, phone, address, currentSemester, currentSection, departmentId } = req.body;

    const updated = await prisma.student.update({
      where: { id },
      data: {
        name,
        dob: dob ? new Date(dob) : undefined,
        phone,
        address,
        currentSemester: currentSemester ? parseInt(currentSemester) : undefined,
        currentSection,
        departmentId
      }
    });

    res.status(200).json({ message: 'Student updated successfully', student: updated });
  } catch (error) {
    next(error);
  }
};

const updateFaculty = async (req, res, next) => {
  try {
    const { id } = req.params; 
    const { name, designation, phone, address, departmentId } = req.body;

    const updated = await prisma.faculty.update({
      where: { id },
      data: {
        name,
        designation,
        phone,
        address,
        departmentId
      }
    });

    res.status(200).json({ message: 'Faculty updated successfully', faculty: updated });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params; 
    await prisma.user.delete({
      where: { id }
    });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const { role } = req.query;
    const whereClause = role ? { role } : {};
    const users = await prisma.user.findMany({
      where: whereClause,
      include: {
        student: { include: { department: true } },
        faculty: { include: { department: true } },
        admin: true
      }
    });
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

const createDepartment = async (req, res, next) => {
  try {
    const { name, code } = req.body;
    const dept = await prisma.department.create({
      data: { name, code }
    });
    res.status(201).json({ message: 'Department created successfully', department: dept });
  } catch (error) {
    next(error);
  }
};

const getDepartments = async (req, res, next) => {
  try {
    const depts = await prisma.department.findMany({
      include: {
        _count: {
          select: { students: true, faculty: true }
        }
      }
    });
    res.status(200).json({ departments: depts });
  } catch (error) {
    next(error);
  }
};

const createSubject = async (req, res, next) => {
  try {
    const { name, code, departmentId, semester, credits } = req.body;
    const subject = await prisma.subject.create({
      data: {
        name,
        code,
        departmentId,
        semester: parseInt(semester),
        credits: parseInt(credits)
      }
    });
    res.status(201).json({ message: 'Subject created successfully', subject });
  } catch (error) {
    next(error);
  }
};

const getSubjects = async (req, res, next) => {
  try {
    const subjects = await prisma.subject.findMany({
      include: { department: true }
    });
    res.status(200).json({ subjects });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  createStudent,
  createFaculty,
  updateStudent,
  updateFaculty,
  deleteUser,
  getUsers,
  createDepartment,
  getDepartments,
  createSubject,
  getSubjects
};
