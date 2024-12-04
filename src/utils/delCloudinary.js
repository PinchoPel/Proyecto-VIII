const cloudinary = require("cloudinary").v2;

const delCloudinary = (urlImagen) =>{
  let urlSplited = urlImagen.split("/");

  let folderName = urlSplited[7];
  let subFolderName = urlSplited.at(-2);
  let imagen = urlSplited.at(-1).split(".")[0];
  
  let deleteImagenCloud = `${folderName}/${subFolderName}/${imagen}`;
  
  cloudinary.uploader.destroy(deleteImagenCloud, ()=>{})
};

module.exports = {delCloudinary};