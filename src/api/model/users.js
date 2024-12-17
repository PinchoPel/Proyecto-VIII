const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Photo = require("./pictures");

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    password: {type: String, required: true},
    photos: [{type: mongoose.Schema.Types.ObjectId, ref: Photo}],
    role: {type: String, required:true, enum:["judges","contestant"]}
},{
    timestamps: true,
    collection: "users",
    versionKey: false
});

userSchema.pre("save", function () {
    this.password = bcrypt.hashSync(this.password, 10);
});

const User = mongoose.model("user", userSchema, "users");

module.exports = User;