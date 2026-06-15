const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Create Departments
  const departments = [
    { name: 'Computer Science & Engineering', code: 'CSE' },
    { name: 'Information Technology', code: 'IT' },
    { name: 'Electronics & Communication Engineering', code: 'ECE' },
    { name: 'Electrical & Electronics Engineering', code: 'EEE' },
    { name: 'Mechanical Engineering', code: 'MECH' },
    { name: 'Civil Engineering', code: 'CIVIL' }
  ];

  const deptMap = {};
  for (const dept of departments) {
    const d = await prisma.department.upsert({
      where: { code: dept.code },
      update: {},
      create: dept
    });
    deptMap[dept.code] = d.id;
    console.log(`Department created/verified: ${dept.code}`);
  }

  // 2. Create Users & Profiles
  // Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@college.edu' },
    update: {},
    create: {
      email: 'admin@college.edu',
      firebaseUid: 'mock-uid-admin',
      role: 'ADMIN'
    }
  });

  await prisma.admin.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      name: 'Super Admin',
      phone: '9999999999'
    }
  });
  console.log('Admin user and profile seeded.');

  // Faculty User
  const facultyUser = await prisma.user.upsert({
    where: { email: 'faculty@college.edu' },
    update: {},
    create: {
      email: 'faculty@college.edu',
      firebaseUid: 'mock-uid-faculty',
      role: 'FACULTY'
    }
  });

  const faculty = await prisma.faculty.upsert({
    where: { userId: facultyUser.id },
    update: {},
    create: {
      userId: facultyUser.id,
      employeeId: 'EMP101',
      name: 'Dr. Jane Smith',
      designation: 'Assistant Professor',
      phone: '9876543210',
      address: 'Staff Quarters, Campus',
      departmentId: deptMap['CSE']
    }
  });
  console.log('Faculty user and profile seeded.');

  // Student User
  const studentUser = await prisma.user.upsert({
    where: { email: 'student@college.edu' },
    update: {},
    create: {
      email: 'student@college.edu',
      firebaseUid: 'mock-uid-student',
      role: 'STUDENT'
    }
  });

  const student = await prisma.student.upsert({
    where: { userId: studentUser.id },
    update: {},
    create: {
      userId: studentUser.id,
      registerNumber: 'REG2026001',
      rollNumber: '26CSE001',
      name: 'John Doe',
      dob: new Date('2005-05-15'),
      phone: '9876543211',
      address: 'Hostel Block A, Room 302',
      admissionYear: 2023,
      currentSemester: 6,
      currentSection: 'A',
      departmentId: deptMap['CSE']
    }
  });
  console.log('Student user and profile seeded.');

  // 3. Create Subjects
  const subjects = [
    { name: 'Data Structures and Algorithms', code: 'CS301', departmentId: deptMap['CSE'], semester: 3, credits: 4 },
    { name: 'Database Management Systems', code: 'CS402', departmentId: deptMap['CSE'], semester: 4, credits: 4 },
    { name: 'Software Engineering', code: 'IT501', departmentId: deptMap['IT'], semester: 5, credits: 3 },
    { name: 'Computer Networks', code: 'CS601', departmentId: deptMap['CSE'], semester: 6, credits: 4 },
    { name: 'Artificial Intelligence', code: 'CS602', departmentId: deptMap['CSE'], semester: 6, credits: 3 }
  ];

  const subMap = {};
  for (const sub of subjects) {
    const s = await prisma.subject.upsert({
      where: { code: sub.code },
      update: {},
      create: sub
    });
    subMap[sub.code] = s.id;
    console.log(`Subject created: ${sub.code} - ${sub.name}`);
  }

  // 4. Assign Subject to Faculty
  await prisma.facultySubject.upsert({
    where: {
      facultyId_subjectId_section_academicYear: {
        facultyId: faculty.id,
        subjectId: subMap['CS601'],
        section: 'A',
        academicYear: '2025-2026'
      }
    },
    update: {},
    create: {
      facultyId: faculty.id,
      subjectId: subMap['CS601'],
      section: 'A',
      academicYear: '2025-2026'
    }
  });
  console.log('Faculty subject assignment seeded.');

  // 5. Seed Attendance Logs
  const attendanceDates = [
    new Date('2026-06-01'),
    new Date('2026-06-02'),
    new Date('2026-06-03'),
    new Date('2026-06-04'),
    new Date('2026-06-05'),
    new Date('2026-06-08'),
    new Date('2026-06-09'),
    new Date('2026-06-10')
  ];

  for (let i = 0; i < attendanceDates.length; i++) {
    // 6 days present, 2 days absent
    const status = i % 4 === 0 ? 'ABSENT' : 'PRESENT';
    await prisma.attendance.upsert({
      where: {
        date_period_studentId_subjectId: {
          date: attendanceDates[i],
          period: 1,
          studentId: student.id,
          subjectId: subMap['CS601']
        }
      },
      update: {},
      create: {
        date: attendanceDates[i],
        period: 1,
        studentId: student.id,
        subjectId: subMap['CS601'],
        status: status,
        markedByFacultyId: faculty.id
      }
    });
  }
  console.log('Mock student attendance logs seeded.');

  // 6. Seed Marks
  await prisma.mark.upsert({
    where: {
      studentId_subjectId_type: {
        studentId: student.id,
        subjectId: subMap['CS601'],
        type: 'INTERNAL_1'
      }
    },
    update: {},
    create: {
      studentId: student.id,
      subjectId: subMap['CS601'],
      type: 'INTERNAL_1',
      marksObtained: 82,
      maxMarks: 100
    }
  });

  await prisma.mark.upsert({
    where: {
      studentId_subjectId_type: {
        studentId: student.id,
        subjectId: subMap['CS601'],
        type: 'INTERNAL_2'
      }
    },
    update: {},
    create: {
      studentId: student.id,
      subjectId: subMap['CS601'],
      type: 'INTERNAL_2',
      marksObtained: 90,
      maxMarks: 100
    }
  });
  console.log('Mock student subject marks seeded.');

  // 7. Seed Companies and Placement Drives
  const google = await prisma.company.upsert({
    where: { name: 'Google' },
    update: {},
    create: {
      name: 'Google',
      website: 'https://careers.google.com',
      industry: 'Technology',
      contactEmail: 'recruiting@google.com',
      description: 'Global search and cloud technology leader'
    }
  });

  const drive = await prisma.placementDrive.upsert({
    where: { id: 'seed-drive-google' },
    update: {},
    create: {
      id: 'seed-drive-google',
      companyId: google.id,
      jobTitle: 'Associate Software Engineer',
      description: 'Looking for computer science graduates with deep knowledge of DS/Algo and web architectures.',
      date: new Date('2026-08-20'),
      eligibilityCriteria: 'CGPA > 8.0, No standing arrears',
      salaryPackage: '18 LPA'
    }
  });
  console.log('Google placement drive seeded.');

  // Student applies to the drive
  await prisma.placementApplication.upsert({
    where: {
      driveId_studentId: {
        driveId: drive.id,
        studentId: student.id
      }
    },
    update: {},
    create: {
      driveId: drive.id,
      studentId: student.id,
      status: 'SHORTLISTED',
      resumeUrl: 'https://res.cloudinary.com/mock-cloud/image/upload/v12345/resumes/john_doe_resume.pdf'
    }
  });
  console.log('Placement applications seeded.');

  // 8. Seed Events
  await prisma.event.upsert({
    where: { id: 'seed-event-techsymp' },
    update: {},
    create: {
      id: 'seed-event-techsymp',
      title: 'National Tech Symposium 2026',
      description: 'Annual flagship technical paper presentations, hackathons, and AI coding sprints.',
      date: new Date('2026-07-15'),
      venue: 'Main Auditorium',
      category: 'Technical',
      maxRegistrations: 300,
      qrCodeUrl: 'https://res.cloudinary.com/mock-cloud/image/upload/v12345/events/techsymp2026_qr.png'
    }
  });
  console.log('College events seeded.');

  console.log('🌱 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
