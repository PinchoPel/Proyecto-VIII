const { auth } = require("../../middlewares/auth");
const { register, login, userDelete, getUser, getAllUser, modifyUser } = require("../controllers/users");

const usersRoutes = require("express").Router();

usersRoutes.get("/:nombre", [auth],getUser);
usersRoutes.get("/",[auth],getAllUser);

usersRoutes.post("/register", register);
usersRoutes.post("/login", login);

usersRoutes.put("/:nombre", [auth],modifyUser);

usersRoutes.delete("/:nombre",[auth], userDelete);

module.exports = usersRoutes;