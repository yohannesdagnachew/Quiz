import { Router } from "express";
import { deposit, check } from "../controller/transactionController.js";



const router = Router();


router.post("/deposit", deposit);
router.post("/check", check);

export default router;