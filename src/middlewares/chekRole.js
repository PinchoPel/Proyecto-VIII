const { auth } = require("./auth");

const checkRole = async (req,res,next) => {

    auth(req,res, () => {
        
        try {
            if (req.user) {
                let {role} = req.user;
                if (role === "judges") {
                   return next();
                }
                else if (role === "contestant") {
                 return next();
                }
            }
           
            else if (!req.user){
                return next();
            }
        } catch (error) {
            return res.status(400).json("Acceso no disponible")
        }
    });
};

module.exports = {checkRole};


