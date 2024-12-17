
const { auth } = require("../../middlewares/auth");
const { getAllCategories, postCategory, deleteCategory, getSingleCategory, modifyCategory } = require("../controllers/categories");


const categoriesRoutes = require("express").Router();

categoriesRoutes.get("/:categoria", [auth], getSingleCategory);
categoriesRoutes.get("/",[auth], getAllCategories);

categoriesRoutes.post("/",[auth], postCategory);

categoriesRoutes.put("/:categoria", [auth], modifyCategory);

categoriesRoutes.delete("/:categoria",[auth], deleteCategory);

module.exports = categoriesRoutes;