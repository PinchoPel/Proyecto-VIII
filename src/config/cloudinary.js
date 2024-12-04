const cloudinary = require("cloudinary").v2;

const connectCloudinary = async () => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET
        });
        console.log("conectado a cloudinary");
        
    } catch (error) {
        console.log("NO se ha conectado cloudinary");
        
    }
};

module.exports = connectCloudinary;