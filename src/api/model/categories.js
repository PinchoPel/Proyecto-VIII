const mongoose = require("mongoose");


const categorySchema = new mongoose.Schema({
    categoria: {type: String},
    primer_premio: {type: Number},
    segundo_premio: {type: Number},
    fotografias: [{type:String}]
},{
    timestamps: true,
    collection: "categories",
    versionKey: false
});

const Category = mongoose.model("category", categorySchema, "categories");

module.exports = Category;