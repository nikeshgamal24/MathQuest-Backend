import express from "express";

import { handleLogout, loginTeacher, registerTeacher } from "../../controllers/auth-controllers/authController.js";

const router = express.Router();

router.post("/register", registerTeacher);
router.post("/login", loginTeacher);
router.get("/logout", handleLogout);


export default router;
