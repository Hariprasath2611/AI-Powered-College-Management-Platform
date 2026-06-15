const prisma = require('../config/db');

// Create Company (Admin Only)
const createCompany = async (req, res, next) => {
  try {
    const { name, website, industry, contactEmail, description } = req.body;
    const company = await prisma.company.create({
      data: { name, website, industry, contactEmail, description }
    });
    res.status(201).json({ message: 'Company record created successfully', company });
  } catch (error) {
    next(error);
  }
};

// Fetch Companies
const getCompanies = async (req, res, next) => {
  try {
    const companies = await prisma.company.findMany();
    res.status(200).json({ companies });
  } catch (error) {
    next(error);
  }
};

// Schedule Placement Drive (Admin Only)
const scheduleDrive = async (req, res, next) => {
  try {
    const { companyId, jobTitle, description, date, eligibilityCriteria, salaryPackage } = req.body;
    
    const drive = await prisma.placementDrive.create({
      data: {
        companyId,
        jobTitle,
        description,
        date: new Date(date),
        eligibilityCriteria,
        salaryPackage
      }
    });

    res.status(201).json({ message: 'Placement drive scheduled successfully', drive });
  } catch (error) {
    next(error);
  }
};

// Get Drives
const getDrives = async (req, res, next) => {
  try {
    const studentId = req.user.role === 'STUDENT' ? req.user.profileId : null;
    
    const drives = await prisma.placementDrive.findMany({
      include: {
        company: true,
        applications: studentId ? { where: { studentId } } : true
      },
      orderBy: { date: 'asc' }
    });

    // Format with application info if student is checking
    const formatted = drives.map(d => {
      const applied = studentId ? d.applications.length > 0 : false;
      const status = applied ? d.applications[0].status : null;
      return {
        ...d,
        applied,
        applicationStatus: status
      };
    });

    res.status(200).json({ drives: formatted });
  } catch (error) {
    next(error);
  }
};

// Apply to Drive (Student Only)
const applyToDrive = async (req, res, next) => {
  try {
    const studentId = req.user.profileId;
    const { driveId } = req.params;

    // Get student details to retrieve default resume url
    const student = await prisma.student.findUnique({
      where: { id: studentId }
    });

    const application = await prisma.placementApplication.create({
      data: {
        driveId,
        studentId,
        resumeUrl: student.resumeUrl
      }
    });

    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error) {
    next(error);
  }
};

// Get Applications for a Drive (Admin/Faculty)
const getDriveApplications = async (req, res, next) => {
  try {
    const { driveId } = req.params;

    const applications = await prisma.placementApplication.findMany({
      where: { driveId },
      include: {
        student: { include: { department: true } }
      }
    });

    res.status(200).json({ applications });
  } catch (error) {
    next(error);
  }
};

// Update Application Status (Admin/Faculty)
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params; // application ID
    const { status } = req.body; // e.g. 'SHORTLISTED', 'OFFERED', 'REJECTED'

    const updated = await prisma.placementApplication.update({
      where: { id },
      data: { status }
    });

    res.status(200).json({ message: 'Application status updated successfully', application: updated });
  } catch (error) {
    next(error);
  }
};

// Get general stats
const getPlacementStats = async (req, res, next) => {
  try {
    const totalDrives = await prisma.placementDrive.count();
    const totalApplications = await prisma.placementApplication.count();
    
    // Group by status
    const offers = await prisma.placementApplication.count({
      where: { status: 'OFFERED' }
    });
    const rejected = await prisma.placementApplication.count({
      where: { status: 'REJECTED' }
    });
    const shortlisted = await prisma.placementApplication.count({
      where: { status: 'SHORTLISTED' }
    });

    res.status(200).json({
      totalDrives,
      totalApplications,
      offers,
      rejected,
      shortlisted
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCompany,
  getCompanies,
  scheduleDrive,
  getDrives,
  applyToDrive,
  getDriveApplications,
  updateApplicationStatus,
  getPlacementStats
};
