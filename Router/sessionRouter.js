import { Router } from "express";
import { login } from "../controller/loginController.js";



const router = Router();


router.get("/login", login);

export default router;