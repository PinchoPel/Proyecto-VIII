const mongoose = require("mongoose");



const photoSchema = new mongoose.Schema({
    titulo: {type: String, required: true},
    imagen: {type: String, required: true},
    autor: {type: String},
    verificado: {type: Boolean, default: false}
},{
    timestamps: true,
    collection: "pictures",
    versionKey: false
});

const Photo = mongoose.model("picture", photoSchema, "pictures");

module.exports = Photo;