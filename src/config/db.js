const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log("Proyecto VIII funcionando");  
    } catch (error) {
      console.log("NO ha sido posible conectar con la base de datos");
    }
};

module.exports = {connectDB};