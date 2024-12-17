const Category = require("../model/categories");
const Photo = require("../model/pictures");
const User = require("../model/users");
const cloudinary = require("cloudinary").v2;

const getAllCategories = async (req,res,next) => {    
    try {
        if (req.user){
            let {role, name} = req.user;

            if (role == "judges") {
                allCategories = await Category.find().populate("fotografias");
                return res.status(200).json(allCategories);
            } 
            else if (role == "contestant" && name){
                allCategories = await Category.find().populate({path: "fotografias", match: {$or: [{verificado: true} ,{ autor: name}]}});                 
                return res.status(200).json(allCategories);
           }
        }
        else  if(!req.user){   
            let  allCategories = await Category.find().populate({path: "fotografias", match: {verificado: true}});
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
            let {role, name} = req.user;
            if (role == "judges") {
               let  singleCategory = await Category.findOne({categoria:categoria}).populate("fotografias");
                return res.status(200).json(singleCategory);
            }
            else if (role == "contestant" && name ){   
                let  singleCategory = await Category.findOne({categoria:categoria}).populate({path: "fotografias", match: {$or: [{verificado: true} ,{ autor: name}]}});              
                return res.status(200).json(singleCategory);
            }
        }
        else  if(!req.user){   
            let  singleCategory = await Category.findOne({categoria:categoria}).populate({path: "fotografias", match: {verificado: true}});
              return res.status(200).json(singleCategory);
        }     
    } catch (error) {
        return res.status(400).json("No se establece conexión")
    }
};

const postCategory = async (req,res,next) => {   
    try {
        if (!req.user || req.user.role == "contestant") {
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
        }
    } catch (error) {
        return res.status(400).json("No se ha creado la nueva categoría")
    }
};

const modifyCategory = async (req,res,next) => {
    let {categoria} = req.params;
    try {
        if (req.user.role == "judges") {
            let modifiedCategory = await Category.findOneAndUpdate({categoria: categoria},{...req.body},{new: true, runvalidators: true})
            return res.status(200).json(modifiedCategory);
        }
        else{
            return res.status(403).json("Autorización insuficiente")
        };
    } catch (error) {
        return res.status(400).json("No se ha actualizado la categoría")
    } 
}

const deleteCategory = async (req,res,next) => { 
    let {categoria} = req.params;   
    try {
        if (!req.user || req.user.role == "contestant") {
            return res.status(403).json("Autorización insuficiente")
        } 
        else if (req.user.role == "judges") {
            let deletedCategory  = await Category.findOne({categoria:categoria});
                
            await Photo.deleteMany({ _id: { $in: deletedCategory.fotografias }});

            const cloudImg = await cloudinary.api.resources({
                type: 'upload',
                prefix: `concurso/${deletedCategory.categoria}`, 
                resource_type: 'image',            
            });               
            await User.updateMany(
            { photos: { $in: deletedCategory.fotografias } },
            { $pull: { photos: { $in: deletedCategory.fotografias } } }
            );      
            await Category.findOneAndDelete({categoria:categoria});
            
            await cloudinary.api.delete_resources_by_prefix(
                `concurso/${deletedCategory.categoria}`, 
                { resource_type: "image" }    
            );     
            await cloudinary.api.delete_folder(`concurso/${deletedCategory.categoria}`);

            res.status(200).json({ message: `La categoría: '${deletedCategory.categoria}' y su contenido han sido eliminados correctamente` });
            }
    } catch (error) {
        return res.status(400).json("No se ha borrado la categoría")
    }
};

module.exports = {getAllCategories,postCategory,deleteCategory,getSingleCategory,modifyCategory};