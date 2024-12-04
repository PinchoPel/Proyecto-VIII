require("dotenv").config();
const jwt = require("jsonwebtoken");

const generateSign = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1week"})
};

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET)
};

module.exports = {generateSign, verifyToken};