
const { delCloudinary } = require("../../utils/delCloudinary");
const Category = require("../model/categories");
const Photo = require("../model/pictures");
const User = require("../model/users");
const cloudinary = require("cloudinary").v2;

const allPictures = async (req,res,next) => {
    try {
        if (req.user){
            let {role} = req.user;
            let { name } = req.user;
            if (role == "judges") {
                let allPhotos = await Photo.find(); 
                return res.status(200).json(allPhotos);
            }
            else if (name && role == "contestant") {
                console.log("punto1");
                
                let ownPhotos = await Photo.find( {
                    $or: [
                        { verificado: true }, 
                        { autor: name } 
                    ]
                })
                console.log(ownPhotos);
                
                return res.status(200).json(ownPhotos);
            }
            else if (role == "contestant" ){
                let  allPhotos = await Photo.find({verificado: true});
                return res.status(200).json(allPhotos);
            }
        }
        else  if(!req.user){   
            let  allPhotos = await Photo.find({verificado: true});       
              return res.status(200).json(allPhotos);
          }
    } catch (error) {
        return res.status(400).json("No se han cargado las imágenes")
    }
};

const picturesByAuthor = async (req,res,next) => { 
    try {
        let {nombre} = req.params;

        if (req.user){
            let {role} = req.user;
            let { name } = req.user;
            
            if (role == "judges"){
                let authorPhotos = await Photo.find(  
                    { autor: nombre } )   
                return res.status(200).json(authorPhotos);
            }
            else if (nombre == name && role == "contestant"){   
                let ownPhotos = await Photo.find(  
                        { autor: name } )     
                return res.status(200).json(ownPhotos);
            }
            else if (role == "contestant" ){
                let authorPhotos = await Photo.find({ autor: nombre ,verificado: true});
                return res.status(200).json(authorPhotos);
            }
        }  
        else  if(!req.user){
            let authorPhotos = await Photo.find(  
                { autor: nombre,
                verificado: true}
            )
            return res.status(200).json(authorPhotos);
        }
    } catch (error) {
        return res.status(400).json("No se han encontrado resultados")
    }
};

const postPicture = async (req,res,next) => { 
   
    try {
       if (req.user){
        let {categoryName} = req.params;

            const category = await Category.findOne({categoria:categoryName});
  
            let imagenUrl = await cloudinary.uploader.upload(req.file.path,
                    { folder:`concurso/${categoryName}`,
                    public_id: req.body.titulo});
              
            let newPhoto = new Photo({
             titulo: req.body.titulo,
            imagen: imagenUrl.secure_url,
            autor: req.user.name,
             }  );
            
            let savedPhoto = await newPhoto.save();
        
            category.fotografias.push(newPhoto.titulo);
            await category.save();

            await User.findOneAndUpdate(
                { name: req.user.name }, 
                { $push: { photos: newPhoto.imagen } }, 
                { new: true } 
            );         

            return res.status(201).json(savedPhoto);
        }
    else if(!req.user){
        return res.status(400).json("Sin acceso")
    }
    } catch (error) {
        return res.status(400).json("No se ha subido la fotografía")
    }
};

const modifyPicture = async (req,res,next) => {           
    let {titulo} = req.params;

    try {
        if (req.user){
            let {role} = req.user;
      
            if (role == "judges"){
                let modifiedPicture = await Photo.findOneAndUpdate({titulo: titulo},{...req.body},{new: true,runvalidators: true});         
                return res.status(200).json(modifiedPicture);
            }
                  else{
                    return res.status(403).json("Autorización insuficiente");
                  }
        }
        else if(!req.user){
            return res.status(400).json("Sin acceso")
        }
    } catch (error) {
        return res.status(400).json("No se ha actualizado la base de datos")
    }
};

const deletePicture = async (req, res,next) => { 
  try {
    let {id} = req.params;
    if (req.user){
    let {role} = req.user;
    let { name } = req.user;
    if (role === "judges") {
        let deletedPicture = await Photo.findByIdAndDelete(id);   
        
        await Category.updateMany(
            { fotografias: deletedPicture.titulo },
            { $pull: { fotografias: deletedPicture.titulo } }
        );

        await User.updateMany(
            { photos: deletedPicture.imagen  },
            { $pull: { photos:  deletedPicture.imagen  } }
        );
    
        delCloudinary(deletedPicture.imagen);
    
        return res.status(200).json({message: "foto borrada de su colección y de cualquier categoría asociada", deletedPicture});
    }
    else if (role === "contestant") {
        let photosByAuthor = await Photo.findOne({autor: name}) ;
        if (photosByAuthor.autor == name) {
            let deletedPicture = await Photo.findByIdAndDelete(id); 
            console.log(deletedPicture.imagen);
            await Category.updateMany(
                { fotografias: deletedPicture.titulo },
                { $pull: { fotografias: deletedPicture.titulo } }
            );

            await User.updateMany(
            { photos: deletedPicture.imagen  },
            { $pull: { photos:  deletedPicture.imagen  } }
        );
        
            delCloudinary(deletedPicture.imagen);
     
            return res.status(200).json({message: "foto borrada de su colección y de cualquier categoría asociada", deletedPicture});
        }
    }}
    else if(!req.user){
        return res.status(400).json("Sin acceso")
    }
  } catch (error) {
    return res.status(400).json("No se ha borrado la fotografía")
  }  
};

module.exports = {postPicture,allPictures,picturesByAuthor,deletePicture,modifyPicture};