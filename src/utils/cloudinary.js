const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');

const uploadImage = (folderName, image) => new Promise((resolve, reject) => {
  const uploadStream = cloudinary.uploader.upload_large(
    {
      folder: folderName,
    },
    (error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    },
  );

  streamifier.createReadStream(image).pipe(uploadStream);
});

const pathImage = async (old_image) => {
  const pathNames = old_image.split('/');
  const publicId = `${pathNames[pathNames.length - 2]}/${pathNames[pathNames.length - 1]}`.split('.')[0];

  return (publicId);
};

const deleteImage = async (publicId) => {
  cloudinary.uploader.destroy(publicId);
};

module.exports = { uploadImage, deleteImage,pathImage };