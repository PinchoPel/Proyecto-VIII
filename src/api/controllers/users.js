const { generateSign } = require("../../config/jwt");
const { delCloudinary } = require("../../utils/delCloudinary");
const Category = require("../model/categories");
const Photo = require("../model/pictures");
const User = require("../model/users");
const bcrypt = require("bcrypt");

const getAllUser = async (req,res,next) => {
    try {
        const allUsers = await User.find().select("-password");
        return res.status(200).json(allUsers);
    } catch (error) {
        return res.status(400).json("Ha fallado la petición")
    }
};

const getUser = async (req,res,next) => { 
    try {
        let {authorName} = req.params;
        const user = await User.findOne({ name: authorName });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        if (req.user) {
            let {name} = req.user;
            if (name == authorName) {
                return res.status(200).json(user); 
            }
            else if (name !== authorName) {
                let { password, ...authorProfile } = user.toObject();  
            return res.status(200).json(authorProfile);
            }
        }
        else if(!req.user){
            let { password, ...authorProfile } = user.toObject();  
            return res.status(200).json(authorProfile);
        }
    } catch (error) {
        return res.status(400).json("Ha fallado la petición")
    }
};

const register = async (req,res,next) => {
    try {
        let newUser = new User({
            name: req.body.name,
            password: req.body.password,
            role: "contestant"
        });
        
        let duplicatedUser = await User.findOne({name: req.body.name}); 

        if (duplicatedUser) {
            return res.status(400).json("nombre de usuario existente");
        };

        let userSaved = await newUser.save();

        return res.status(201).json(userSaved);
    } catch (error) {
        return res.status(400).json("No ha sido posible darse de alta en el sistema")
    }
};

const login = async (req,res,next) => {
    try {
        let {name, password} = req.body;
        
        let user = await User.findOne({name});  
        let correctPassword = await bcrypt.compare(password, user.password);  

        if (!correctPassword) {
            return res.status(400).json("Usuario o contraseña incorrectos");
        }
        const token = generateSign(user._id);
        
        return res.status(200).json({user, token});
    } catch (error) {
        return res.status(400).json("Usuario o contraseña incorrectos")
    }
};

const modifyUser = async (req,res,next) => { 

    try {
        let {userName} = req.params;
        const userToModify = await User.findOne({ name: userName });
        
        if (!userToModify) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }  
        else if (req.user){
            let {name} = req.user;
            let {role} = req.user;
        if (userName == name){
            if (req.body.password) {
                let {password} = req.body
              userToModify.password = password;
                await userToModify.save();
                return res.status(200).json(userToModify); 
            }
           else if (req.body.name) {
                return res.status(403).json("No se puede cambiar el nombre del usuario");
              }
              else if (req.body.role) {
                return res.status(403).json("Autorización insuficiente");
              }
        }
        else if (role == "judges") {
            let updatedUser = await User.findOneAndUpdate({ name: userName }, {...req.body}, {new:true, runvalidators: true});
            return res.status(200).json(updatedUser);
        }
        if (userName !== name){
            return res.status(404).json({ message: "Datos incorrectos" });
        }}
        else if(!req.user){
            return res.status(400).json("Sin acceso")
        }
    } catch (error) {
        return res.status(400).json("No ha sido posible actualizar el perfil")
    }
};

const userDelete = async (req,res,next) => { 
    let {userDeleted} = req.params; 
    const userToDelete = await User.findOne({ name: userDeleted });
    try {
       
        if (!userToDelete) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        } 
        else if (req.user){
            let {name} = req.user;
            let {role} = req.user;

         if (userDeleted == name) {
            
            for (const photoUrl of userToDelete.photos) {  
               delCloudinary(photoUrl)
            };

            const userPhotos = await Photo.find({ autor: userDeleted });

            for (const photo of userPhotos) { 
                
                await Category.updateMany(
                    { fotografias: photo.titulo },
                    { $pull: { fotografias: photo.titulo } }
                );
            }

            await Photo.deleteMany({ autor: userDeleted }); 
        
            await User.findOneAndDelete({ name: userDeleted }); 

            res.status(200).json({ message: `El usuario '${userDeleted}' y sus fotos han sido eliminados correctamente` });
        }
       else if (role == "judges") {

        for (const photoUrl of userToDelete.photos) {  
            delCloudinary(photoUrl)
         };

         const userPhotos = await Photo.find({ autor: userDeleted });

            for (const photo of userPhotos) { 
                await Category.updateMany(
                    { fotografias: photo.titulo },
                    { $pull: { fotografias: photo.titulo } }
                );
            }

            await Photo.deleteMany({ autor: userDeleted }); 
        
            await User.findOneAndDelete({ name: userDeleted }); 

            res.status(200).json({ message: `El usuario '${userDeleted}' y sus fotos han sido eliminados correctamente` });
       }
       else if (userDeleted !== name){
        return res.status(400).json("No permitido")
       }}
       else if(!req.user){
        return res.status(400).json("No permitido")
    }
    } catch (error) {
        return res.status(400).json("Usuario o contraseña incorrectos")
    }
};

module.exports = {register,login,userDelete,modifyUser,getUser,getAllUser};

