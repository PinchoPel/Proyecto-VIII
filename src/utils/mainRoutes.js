const categoriesRoutes = require("../api/routes/categories");
const picturesRoutes = require("../api/routes/pictures");
const usersRoutes = require("../api/routes/users");

const mainRoutes = require("express").Router();

mainRoutes.use("/pictures", picturesRoutes);
mainRoutes.use("/categories", categoriesRoutes);
mainRoutes.use("/users", usersRoutes);

module.exports = mainRoutes;