import express from "express";
import { Login, Register, getAllUser, getUserDetail } from "../controllers/auth";
const router = express.Router();
router.get("/user", getAllUser)
router.post("/user/register", Register);
router.post("/user/login", Login);
router.delete("/user/:id", getUserDetail)
export default router;