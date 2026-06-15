const cloudinary = require('cloudinary').v2;

let isMockCloudinary = false;

try {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret || cloudName === 'mock_cloudinary_name') {
    console.warn("⚠️ Cloudinary configuration missing or mock. Uploads will run in MOCK mode.");
    isMockCloudinary = true;
  } else {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
    console.log("✅ Cloudinary initialized successfully.");
  }
} catch (error) {
  console.error("❌ Failed to initialize Cloudinary. Falling back to MOCK mode.", error.message);
  isMockCloudinary = true;
}

module.exports = {
  cloudinary,
  isMockCloudinary,
};
