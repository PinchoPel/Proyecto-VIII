const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const {CloudinaryStorage} = require("multer-storage-cloudinary");


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
       folder: (req) => `concurso/${req.params.categoryName}`,
        allowed_formats:  ["jpg","png","jpeg","gif"],
        public_id: (req) => req.body.titulo,
      },
    },
  );

  const uploadImg = multer({storage});
  
  module.exports = uploadImg;