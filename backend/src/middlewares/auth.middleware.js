const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const { isMockFirebase, admin } = require('../config/firebase');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtsecretforexpresstokencollegemanagement';

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access token missing or malformed' });
    }

    const token = authHeader.split(' ')[1];

    // 1. Try verifying with local JWT secret first
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      return next();
    } catch (jwtError) {
      // If verification fails, fall through to verify as a Firebase/Mock token
    }

    // 2. Mock Firebase Validation for local testing/development
    if (isMockFirebase && token.startsWith('mock-token-')) {
      const role = token.replace('mock-token-', '').toUpperCase(); // 'ADMIN', 'FACULTY', 'STUDENT'
      
      let user = await prisma.user.findFirst({
        where: { role: role },
        include: { student: true, faculty: true, admin: true }
      });

      if (!user) {
        // Create user
        user = await prisma.user.create({
          data: {
            email: `mock-${role.toLowerCase()}@college.edu`,
            firebaseUid: `mock-uid-${role.toLowerCase()}`,
            role: role,
          },
          include: { student: true, faculty: true, admin: true }
        });

        // Create specific profile if missing
        if (role === 'ADMIN') {
          user.admin = await prisma.admin.create({
            data: { userId: user.id, name: `Mock Admin` }
          });
        } else if (role === 'FACULTY') {
          let dept = await prisma.department.findUnique({ where: { code: 'CSE' } });
          if (!dept) {
            dept = await prisma.department.create({ data: { name: 'Computer Science & Engineering', code: 'CSE' } });
          }
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
          let dept = await prisma.department.findUnique({ where: { code: 'CSE' } });
          if (!dept) {
            dept = await prisma.department.create({ data: { name: 'Computer Science & Engineering', code: 'CSE' } });
          }
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
      }

      let profileId = null;
      if (role === 'STUDENT') profileId = user.student?.id;
      else if (role === 'FACULTY') profileId = user.faculty?.id;
      else if (role === 'ADMIN') profileId = user.admin?.id;

      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        profileId: profileId
      };
      return next();
    }

    // 3. Real Firebase token validation
    if (!isMockFirebase) {
      const decodedToken = await admin.auth().verifyIdToken(token);
      const { email, uid } = decodedToken;

      let user = await prisma.user.findUnique({
        where: { firebaseUid: uid },
        include: { student: true, faculty: true, admin: true }
      });

      if (!user) {
        return res.status(404).json({ error: 'User profile not registered in local database' });
      }

      let profileId = null;
      if (user.role === 'STUDENT') profileId = user.student?.id;
      else if (user.role === 'FACULTY') profileId = user.faculty?.id;
      else if (user.role === 'ADMIN') profileId = user.admin?.id;

      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        profileId: profileId
      };
      return next();
    }

    return res.status(401).json({ error: 'Invalid authentication credentials' });
  } catch (error) {
    console.error('Auth Middleware Error:', error.message);
    return res.status(401).json({ error: 'Authentication failed: ' + error.message });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient privileges' });
    }
    next();
  };
};

module.exports = {
  authenticate,
  authorizeRoles
};
