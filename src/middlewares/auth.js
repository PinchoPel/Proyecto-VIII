const User = require("../api/model/users");
const { verifyToken } = require("../config/jwt");

const auth = async (req,res,next) => {

    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
       
    let {id} = verifyToken(token);

    const user = await User.findById(id);

    req.user = user; 

    next();
        }

        else if (!req.headers.authorization) {
            
            next();
        }
    } catch (error) {
        return res.status(400).json("error de verificación")
    }
    
};

module.exports = {auth};