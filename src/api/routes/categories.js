
const { checkRole } = require("../../middlewares/chekRole");
const { getAllCategories, postCategory, deleteCategory, getSingleCategory } = require("../controllers/categories");


const categoriesRoutes = require("express").Router();

categoriesRoutes.get("/:categoria", [checkRole], getSingleCategory);
categoriesRoutes.get("/",[checkRole], getAllCategories);

categoriesRoutes.post("/",[checkRole], postCategory);

categoriesRoutes.delete("/:categoria",[checkRole], deleteCategory);

module.exports = categoriesRoutes;