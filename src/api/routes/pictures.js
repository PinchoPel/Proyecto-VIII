
const { checkCategory } = require("../../middlewares/checkCategory");
const { checkRole } = require("../../middlewares/chekRole");
const uploadImg = require("../../middlewares/cloudinary");
const { maxPhotos } = require("../../middlewares/maxPhotos");
const { postPicture,  allPictures, picturesByAuthor,  deletePicture, modifyPicture } = require("../controllers/pictures");


const picturesRoutes = require("express").Router();

picturesRoutes.get("/:nombre",[checkRole], picturesByAuthor);
picturesRoutes.get("/",[checkRole], allPictures);

picturesRoutes.post("/concurso/:categoryName", [checkRole],[maxPhotos],[checkCategory],[uploadImg.single("imagen")],postPicture);

picturesRoutes.put("/:categoria/:titulo",[checkRole],modifyPicture);

picturesRoutes.delete("/:id", [checkRole], deletePicture);

module.exports = picturesRoutes;