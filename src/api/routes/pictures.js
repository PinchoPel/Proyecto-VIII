
const { auth } = require("../../middlewares/auth");
const { checkCategory } = require("../../middlewares/checkCategory");
const uploadImg = require("../../middlewares/cloudinary");
const { maxPhotos } = require("../../middlewares/maxPhotos");
const { postPicture,  allPictures, picturesByAuthor,  deletePicture, modifyPicture } = require("../controllers/pictures");


const picturesRoutes = require("express").Router();

picturesRoutes.get("/:nombre",[auth], picturesByAuthor);
picturesRoutes.get("/",[auth], allPictures);

picturesRoutes.post("/concurso/:categoryName", [auth],[maxPhotos],[checkCategory],[uploadImg.single("imagen")],postPicture);

picturesRoutes.put("/:categoria/:titulo",[auth],modifyPicture);

picturesRoutes.delete("/:id", [auth], deletePicture);

module.exports = picturesRoutes;