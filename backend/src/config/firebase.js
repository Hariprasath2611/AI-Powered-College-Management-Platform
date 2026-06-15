const admin = require('firebase-admin');

let firebaseApp = null;
let isMockFirebase = false;

try {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY 
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : null;

  if (!projectId || !clientEmail || !privateKey || projectId === 'mock-firebase-project-id') {
    console.warn("⚠️ Firebase configuration missing or mock. Firebase auth will run in MOCK mode.");
    isMockFirebase = true;
  } else {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
    console.log("✅ Firebase Admin SDK initialized successfully.");
  }
} catch (error) {
  console.error("❌ Failed to initialize Firebase Admin SDK. Falling back to MOCK mode.", error.message);
  isMockFirebase = true;
}

module.exports = {
  admin,
  firebaseApp,
  isMockFirebase,
};
