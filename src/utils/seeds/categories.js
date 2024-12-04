const mongoose = require("mongoose");
const categorySeed = require("../../data/seeds/categories");
const Category = require("../../api/model/categories");


const launchSeed = async () => {
    try {
        await mongoose.connect("mongodb+srv://proyectoviii:Bbeh2quxufsOOwhQ@cluster0.auihd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

        await Category.collection.drop();
        console.log(("borrada la base de datos de categorías y sus fotos"));
        
        await Category.collection.insertMany(categorySeed);
        console.log("Restaurada la base de datos de los categorías");

        await mongoose.disconnect();
        console.log("desconectado de la base de datos");
        
    } catch (error) {
        console.log(("No se ha lanzado la semilla"));
        
    }
};

launchSeed();