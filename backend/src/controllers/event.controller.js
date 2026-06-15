const prisma = require('../config/db');
const QRCode = require('qrcode');

// Create Event (Admin Only)
const createEvent = async (req, res, next) => {
  try {
    const { title, description, date, venue, category, maxRegistrations } = req.body;

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        venue,
        category,
        maxRegistrations: parseInt(maxRegistrations)
      }
    });

    // Generate event check-in URL as a QR code DataURI
    // For local scanner, QR holds the event's unique ID
    const qrData = JSON.stringify({ eventId: event.id });
    const qrCodeUrl = await QRCode.toDataURL(qrData);

    // Save QR Code
    const updated = await prisma.event.update({
      where: { id: event.id },
      data: { qrCodeUrl }
    });

    res.status(201).json({ message: 'Event created successfully', event: updated });
  } catch (error) {
    next(error);
  }
};

// Fetch Events
const getEvents = async (req, res, next) => {
  try {
    const studentId = req.user.role === 'STUDENT' ? req.user.profileId : null;

    const events = await prisma.event.findMany({
      include: {
        registrations: studentId ? { where: { studentId } } : true
      },
      orderBy: { date: 'asc' }
    });

    // Format output with registration info
    const formatted = events.map(e => {
      const registered = studentId ? e.registrations.length > 0 : false;
      const checkedIn = registered ? e.registrations[0].checkedIn : false;
      const certificateUrl = registered ? e.registrations[0].certificateUrl : null;
      return {
        ...e,
        registered,
        checkedIn,
        certificateUrl
      };
    });

    res.status(200).json({ events: formatted });
  } catch (error) {
    next(error);
  }
};

// Register for Event (Student Only)
const registerForEvent = async (req, res, next) => {
  try {
    const studentId = req.user.profileId;
    const { eventId } = req.params;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { registrations: true }
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.registrations.length >= event.maxRegistrations) {
      return res.status(400).json({ error: 'Event registrations are full' });
    }

    const reg = await prisma.eventRegistration.create({
      data: {
        eventId,
        studentId
      }
    });

    res.status(201).json({ message: 'Registered for event successfully', registration: reg });
  } catch (error) {
    next(error);
  }
};

// Scan check-in (Admin/Faculty/Scanner)
const checkInEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { studentId } = req.body;

    const registration = await prisma.eventRegistration.findUnique({
      where: {
        eventId_studentId: { eventId, studentId }
      }
    });

    if (!registration) {
      return res.status(404).json({ error: 'Registration not found for this student and event' });
    }

    if (registration.checkedIn) {
      return res.status(200).json({ message: 'Student already checked in', registration });
    }

    // Generate mock certificate URL representing a Cloudinary-backed PDF
    const certificateUrl = `https://res.cloudinary.com/mock-cloud/image/upload/v12345/certificates/${eventId}-${studentId}.pdf`;

    const updated = await prisma.eventRegistration.update({
      where: {
        eventId_studentId: { eventId, studentId }
      },
      data: {
        checkedIn: true,
        checkedInAt: new Date(),
        certificateUrl
      }
    });

    res.status(200).json({ message: 'Check-in successful. Certificate generated.', registration: updated });
  } catch (error) {
    next(error);
  }
};

// Event Registrations & Checkins Analytics
const getEventAnalytics = async (req, res, next) => {
  try {
    const { id } = req.params; // Event ID

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        registrations: {
          include: { student: { include: { department: true } } }
        }
      }
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const totalRegistrations = event.registrations.length;
    const checkins = event.registrations.filter(r => r.checkedIn).length;
    const checkinRatio = totalRegistrations > 0 ? Math.round((checkins / totalRegistrations) * 100) : 0;

    res.status(200).json({
      eventTitle: event.title,
      totalRegistrations,
      checkins,
      checkinRatio,
      registrations: event.registrations
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEvent,
  getEvents,
  registerForEvent,
  checkInEvent,
  getEventAnalytics
};
