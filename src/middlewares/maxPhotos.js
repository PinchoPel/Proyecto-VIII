const Photo = require("../api/model/pictures");


let maxPhotos = async (req,res,next) => {
    try {

    let limitPhotos = await Photo.countDocuments({autor: req.user.name});

    if (limitPhotos >= 2) {
    return res.status(400).json({message: "Máximo dos fotos por participante"})
    }

    next();

    } catch (error) {
        return res.status(400).json("No se ha subido la fotografía")
    }
};

module.exports = {maxPhotos};