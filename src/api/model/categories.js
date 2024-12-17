const mongoose = require("mongoose");
const Photo = require("./pictures");


const categorySchema = new mongoose.Schema({
    categoria: {type: String},
    primer_premio: {type: Number},
    segundo_premio: {type: Number},
    fotografias: [{type: mongoose.Schema.Types.ObjectId, ref: Photo}]
},{
    timestamps: true,
    collection: "categories",
    versionKey: false
});

const Category = mongoose.model("category", categorySchema, "categories");

module.exports = Category;