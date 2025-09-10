import express from "express"
import { create, getAllUsers ,getUserById, updateUser,deleteUser} from "../controller/userController.js"; 

const route = express.Router();

route.post("/user",create);
route.get("/user", getAllUsers);
route.get("/user/:id",getUserById);
route.put("/user/:id", updateUser);
route.delete("/user/:id", deleteUser);

export default route ;



