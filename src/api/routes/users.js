const { checkRole } = require("../../middlewares/chekRole");
const { register, login, userDelete, getUser, getAllUser, modifyUser } = require("../controllers/users");


const usersRoutes = require("express").Router();

usersRoutes.get("/:authorName", [checkRole],getUser);
usersRoutes.get("/",getAllUser);

usersRoutes.post("/register", register);
usersRoutes.post("/login", login);

usersRoutes.put("/:userName", [checkRole],modifyUser);

usersRoutes.delete("/:userDeleted",[checkRole], userDelete);


module.exports = usersRoutes;