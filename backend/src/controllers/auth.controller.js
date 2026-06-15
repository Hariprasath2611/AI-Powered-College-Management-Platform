const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const { admin, isMockFirebase } = require('../config/firebase');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtsecretforexpresstokencollegemanagement';

const register = async (req, res, next) => {
  try {
    const { email, role, firebaseUid, name, detail } = req.body;
    
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { firebaseUid }] }
    });

    if (existing) {
      return res.status(400).json({ error: 'User with this email or firebaseUid already exists' });
    }

    const user = await prisma.user.create({
      data: {
        email,
        role,
        firebaseUid
      }
    });

    let profile = null;
    if (role === 'ADMIN') {
      profile = await prisma.admin.create({
        data: { userId: user.id, name }
      });
    } else if (role === 'FACULTY') {
      profile = await prisma.faculty.create({
        data: {
          userId: user.id,
          employeeId: detail.employeeId,
          name,
          designation: detail.designation || 'Lecturer',
          phone: detail.phone || '',
          address: detail.address || '',
          departmentId: detail.departmentId
        }
      });
    } else if (role === 'STUDENT') {
      profile = await prisma.student.create({
        data: {
          userId: user.id,
          registerNumber: detail.registerNumber,
          rollNumber: detail.rollNumber,
          name,
          dob: new Date(detail.dob),
          phone: detail.phone || '',
          address: detail.address || '',
          admissionYear: parseInt(detail.admissionYear),
          currentSemester: parseInt(detail.currentSemester) || 1,
          currentSection: detail.currentSection || 'A',
          departmentId: detail.departmentId
        }
      });
    }

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user.id, email: user.email, role: user.role, profile }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: 'Firebase ID Token is required' });
    }

    let email = null;
    let uid = null;

    if (isMockFirebase && token.startsWith('mock-token-')) {
      const role = token.replace('mock-token-', '').toUpperCase();
      email = `mock-${role.toLowerCase()}@college.edu`;
      uid = `mock-uid-${role.toLowerCase()}`;
    } else {
      const decodedToken = await admin.auth().verifyIdToken(token);
      email = decodedToken.email;
      uid = decodedToken.uid;
    }

    let user = await prisma.user.findUnique({
      where: { firebaseUid: uid },
      include: { student: true, faculty: true, admin: true }
    });

    if (!user) {
      if (isMockFirebase && token.startsWith('mock-token-')) {
        const role = token.replace('mock-token-', '').toUpperCase();
        user = await prisma.user.create({
          data: { email, firebaseUid: uid, role },
          include: { student: true, faculty: true, admin: true }
        });

        let dept = await prisma.department.findFirst();
        if (!dept) {
          dept = await prisma.department.create({ data: { name: 'Computer Science', code: 'CSE' } });
        }

        if (role === 'ADMIN') {
          user.admin = await prisma.admin.create({ data: { userId: user.id, name: 'Mock Admin' } });
        } else if (role === 'FACULTY') {
          user.faculty = await prisma.faculty.create({
            data: {
              userId: user.id,
              employeeId: 'EMP101',
              name: 'Mock Faculty Prof. Jane',
              designation: 'Assistant Professor',
              phone: '9876543210',
              address: 'Campus St',
              departmentId: dept.id
            }
          });
        } else if (role === 'STUDENT') {
          user.student = await prisma.student.create({
            data: {
              userId: user.id,
              registerNumber: 'REG2026001',
              rollNumber: '26CSE001',
              name: 'Mock Student John Doe',
              dob: new Date('2005-01-01'),
              phone: '9876543211',
              address: 'Hostel Block A',
              admissionYear: 2023,
              currentSemester: 6,
              currentSection: 'A',
              departmentId: dept.id
            }
          });
        }
      } else {
        return res.status(404).json({ error: 'User email not registered in local college system' });
      }
    }

    let profileId = null;
    let name = '';
    if (user.role === 'STUDENT') {
      profileId = user.student?.id;
      name = user.student?.name;
    } else if (user.role === 'FACULTY') {
      profileId = user.faculty?.id;
      name = user.faculty?.name;
    } else if (user.role === 'ADMIN') {
      profileId = user.admin?.id;
      name = user.admin?.name;
    }

    const customToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role, profileId, name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      token: customToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name,
        profileId
      }
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const { id } = req.user;
    let user = await prisma.user.findUnique({
      where: { id },
      include: {
        student: { include: { department: true } },
        faculty: { include: { department: true } },
        admin: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe
};
