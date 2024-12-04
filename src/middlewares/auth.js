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

/*const auth = async (req,res,next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
       
    let {id} = verifyToken(token);

    const user = await User.findById(id);

    req.user = user; 

    next();
    } catch (error) {
        return res.status(400).json("error de verificación")
    }
    
};*/

const isJudges = async (req,res,next) => {
    try {
    if (user.role === "judges") { 
        next();
    }
    else{
        return res.status(400).json(error)
    }
    } catch (error) {
        return res.status(400).json(error)
    }
};

const isContestant = async (req,res,next) => {
    try {

        const token = req.headers.authorization.split(" ")[1];
       
        let {id} = verifyToken(token);
        
        const user = await User.findById(id);

        req.user = user; 
        
    if (user.role === "contestant") { 

        next();
    }
    else{
        return res.status(400).json(error)
    }
    } catch (error) {
        return res.status(400).json(error)
    }
};

module.exports = {isContestant, isJudges,auth};