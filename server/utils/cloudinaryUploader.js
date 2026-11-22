const cloudinary = require('../config/cloudinary');
const streamifier = require('stream');

/**
 * Uploads a buffer to Cloudinary
 * @param {Buffer} buffer - File buffer from multer
 * @param {string} folder - Target Cloudinary folder (e.g. 'genugrin/products')
 * @returns {Promise<{url: string, public_id: string}>}
 */
const uploadBufferToCloudinary = (buffer, folder = 'genugrin/products') => {
  return new Promise((resolve, reject) => {
    // Check if Cloudinary credentials are valid
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      process.env.CLOUDINARY_CLOUD_NAME === 'your_cloudinary_cloud_name' ||
      process.env.CLOUDINARY_CLOUD_NAME === 'genugrin-demo'
    ) {
      console.warn('[Cloudinary Warning]: Cloudinary credentials not fully configured. Using fallback cloud mock URL.');
      const mockId = `mock_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      return resolve({
        url: `https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80`,
        public_id: mockId,
      });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { quality: 'auto:good' },
          { fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) {
          console.error('[Cloudinary Upload Stream Error]:', error);
          return reject(error);
        }
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    const readable = new streamifier.Readable();
    readable._read = () => {};
    readable.push(buffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
};

/**
 * Deletes an image from Cloudinary
 * @param {string} publicId - Cloudinary public id
 */
const deleteFromCloudinary = async (publicId) => {
  if (!publicId || publicId.startsWith('mock_')) {
    return true;
  }
  try {
    const res = await cloudinary.uploader.destroy(publicId);
    return res.result === 'ok';
  } catch (error) {
    console.error(`[Cloudinary Destroy Error for ${publicId}]:`, error.message);
    return false;
  }
};

module.exports = {
  uploadBufferToCloudinary,
  deleteFromCloudinary,
};
