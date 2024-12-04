require("dotenv").config();
const express = require("express");
const { connectDB } = require("./src/config/db");
const connectCloudinary = require("./src/config/cloudinary");
const mainRoutes = require("./src/utils/mainRoutes");


const app = express();
connectDB();
connectCloudinary();

app.use(express.json());

app.use("/api/v1", mainRoutes);

app.use("/prueba", (req,res,next)=>{ 
    return res.status(200).json("Proyecto VIII ok")
});

app.use("*", (req,res,next) => {
    return res.status(404).json("Ruta no encontrada")
});

app.listen(3000, () =>{});