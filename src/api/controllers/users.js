const { generateSign } = require("../../config/jwt");
const { delCloudinary } = require("../../utils/delCloudinary");
const Category = require("../model/categories");
const Photo = require("../model/pictures");
const User = require("../model/users");
const bcrypt = require("bcrypt");

const getAllUser = async (req,res,next) => {
    try {
        if (req.user) {
            let {role, name} = req.user;
            if (role == "judges") {
                const allUsers = await User.find().select("-password").populate("photos");
                return res.status(200).json(allUsers);
            }
            else if (role == "contestant" && name) {
                const allUsers = await User.find().select("-password").populate({path: "photos", match: {$or: [{verificado: true} ,{ autor: name}]}});;
                return res.status(200).json(allUsers);
            }        
        }
        else if (!req.user) {
            const allUsers = await User.find().select("-password").populate({path: "photos", match: {verificado: true} });
            return res.status(200).json(allUsers);
        }       
    } catch (error) {
        return res.status(400).json("Ha fallado la petición")
    }
};

const getUser = async (req,res,next) => { 
    try {
        let {nombre} = req.params;     
        if (req.user) {
            let {name, role} = req.user;      
            if (role == "contestant" && name) {
                const singleUser = await User.findOne({ name: nombre }).select("-password").populate({path: "photos", match: {$or: [{verificado: true} ,{ autor: name}]}});   
                return res.status(200).json(singleUser);
            }
            else if (role == "judges") {
                const singleUser = await User.findOne({ name: nombre }).select("-password").populate("photos");
                return res.status(200).json(singleUser);
            }          
            else{
                const singleUser = await User.findOne({ name: nombre }).select("-password").populate({path: "photos", match: {verificado: true} });
                return res.status(200).json(singleUser);
            }
        }
        else if (!req.user) {
            const singleUser = await User.findOne({ name: nombre }).select("-password").populate({path: "photos", match: {verificado: true} });
            return res.status(200).json(singleUser);
        } 
    } catch (error) {
        return res.status(404).json({ message: "Usuario no encontrado" });
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
        let {nombre} = req.params;
        const userToModify = await User.findOne({ name: nombre });
        
        if (!userToModify) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }  
        else if (req.user){
            let {name, role} = req.user;
            if (nombre == name){
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
            let updatedUser = await User.findOneAndUpdate({ name: nombre }, {...req.body}, {new:true, runvalidators: true});
            return res.status(200).json(updatedUser);
        }
        if (nombre !== name){
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
    let {nombre} = req.params; 
    const userToDelete = await User.findOne({ name: nombre });
    try {  
        if (!userToDelete) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        } 
        else if (req.user){
            let {name, role} = req.user;

            if (nombre == name || role == "judges") {               
                let userPhotos = await User.find({name: nombre})

                for (const photoId of userPhotos[0].photos) {
                    await Category.updateMany(
                        { fotografias: photoId._id },
                        { $pull: { fotografias: photoId._id } }
                    );                                     
                   let photoUrl = await Photo.findById(photoId);   
                   delCloudinary(photoUrl.imagen)  
                }

                await Photo.deleteMany({ _id: { $in: userPhotos[0].photos }});
                await User.findOneAndDelete({ name: nombre }); 

                res.status(200).json({ message: `El usuario '${userPhotos[0].name}' y sus fotos han sido eliminados correctamente` });
            }
            else if(!req.user){
            return res.status(400).json("No permitido")
            }
            else{
                return res.status(400).json("No permitido")
            }}
    } catch (error) {
        return res.status(400).json("Usuario o contraseña incorrectos")
    }
};

module.exports = {register,login,userDelete,modifyUser,getUser,getAllUser};

