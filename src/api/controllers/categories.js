const Category = require("../model/categories");
const Photo = require("../model/pictures");
const User = require("../model/users");
const cloudinary = require("cloudinary").v2;

const getAllCategories = async (req,res,next) => { 
   
    try {
        if (req.user){
            let {role} = req.user;
            const { name } = req.user;
            
            if (role == "judges") {
                allCategories = await Category.find().populate("fotografias");
                return res.status(200).json(allCategories);
            } 
            else if (role == "contestant" && name ){
                allCategories = await Category.find();
                    for (let category of allCategories) {
                        category.fotografias = await Photo.find({
                            titulo: { $in: category.fotografias }, 
                            $or: [
                                { verificado: true }, 
                                { autor: name } 
                            ]  
                        }).select("titulo");
                    }
                return res.status(200).json(allCategories);
            }
            else if (role == "contestant") {
                allCategories = await Category.find()
                  for (let category of allCategories) {
                    category.fotografias = await Photo.find({
                        titulo: { $in: category.fotografias }, 
                        verificado: true                      
                    }).select("titulo");
                }
                    return res.status(200).json(allCategories);
            }}
        else  if(!req.user){   
              let  allCategories = await Category.find()
              for (let category of allCategories) {
                category.fotografias = await Photo.find({
                    titulo: { $in: category.fotografias }, 
                    verificado: true                      
                }).select("titulo");
            }
                return res.status(200).json(allCategories);
            }
    } catch (error) {
        return res.status(400).json("No se establece conexión")
    }
};

const getSingleCategory = async (req,res,next) => { 
   
    let {categoria} = req.params;
    try {
        if (req.user){
            let {role} = req.user;
            const { name } = req.user;
            if (role == "judges") {
               let  singleCategory = await Category.findOne({categoria:categoria}).populate("fotografias");
                return res.status(200).json(singleCategory);
            }
            else if (role == "contestant" && name ){
                let  singleCategory = await Category.findOne({categoria:categoria})
                let verifiedPictures =   await Photo.find({
                    titulo: { $in: singleCategory.fotografias },
                    $or: [
                        { verificado: true }, 
                        { autor: name } 
                    ]
                }).select("titulo");
                singleCategory.fotografias = verifiedPictures;               
                return res.status(200).json(singleCategory);
            }
            else if (role == "contestant") {
                let  singleCategory = await Category.findOne({categoria:categoria}).populate({path: "fotografias", match: {verificado: true}});
                    return res.status(200).json(singleCategory);
            }
        }
        else  if(!req.user){   
            let  singleCategory = await Category.findOne({categoria:categoria});
             let verifiedPictures =   await Photo.find({
                    titulo: { $in: singleCategory.fotografias },
                    verificado: true             
                }).select("titulo");         
                singleCategory.fotografias = verifiedPictures;
              return res.status(200).json(singleCategory);
            }     
    } catch (error) {
        return res.status(400).json("No se establece conexión")
    }
};

const postCategory = async (req,res,next) => { 
   
    try {
        if (!req.user) {
            return res.status(403).json("Autorización insuficiente")
        }        
        else if (req.user) {
            let {role} = req.user;
            if (role == "judges") {
                let newCategory = new Category({
                    categoria: req.body.categoria,
                    primer_premio: req.body.primer_premio,
                    segundo_premio: req.body.segundo_premio
                });
        
                await newCategory.save();
        
                return res.status(200).json(newCategory)
            }
            else{
                return res.status(403).json("Autorización insuficiente")
            }}
    } catch (error) {
        return res.status(400).json("No se ha creado la nueva categoría")
    }
};

const deleteCategory = async (req,res,next) => { 

    let {categoria} = req.params;
      
    try {
        if (!req.user) {
            return res.status(403).json("Autorización insuficiente")
        } 
        else if (req.user){
            let {role} = req.user;
            if (role == "judges") {

                let deletedCategory  = await Category.findOne({categoria:categoria}).populate("fotografias");
                
                let photoDeleted = deletedCategory.fotografias;
                
                 await Photo.deleteMany({ titulo: { $in: photoDeleted } });

                    const cloudImg = await cloudinary.api.resources({
                        type: 'upload',
                        prefix: `concurso/${deletedCategory.categoria}`, 
                        resource_type: 'image',            
                    });
                    let photoUrl = cloudImg.resources.map((photo) => photo.secure_url);
                    
                    await User.updateMany(
                    { photos: { $in: photoUrl } },
                    { $pull: { photos: { $in: photoUrl } } }
                );
          
                await Category.findOneAndDelete({categoria:categoria});
              
                await cloudinary.api.delete_resources_by_prefix(
                    `concurso/${deletedCategory.categoria}`, 
                    { resource_type: "image" }    
                );
               
                await cloudinary.api.delete_folder(`concurso/${deletedCategory.categoria}`);
                
                res.status(200).json({ message: `La categoría: '${deletedCategory.categoria}' y su contenido han sido eliminados correctamente` });
            }
            else{
                return res.status(403).json("Autorización insuficiente")
            }
        }
       
    } catch (error) {
        return res.status(400).json("No se ha borrado la categoría")
    }
};

module.exports = {getAllCategories,postCategory,deleteCategory,getSingleCategory,modifyCategory};