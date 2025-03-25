import express from "express";

import { handleLogout, loginStudent, loginTeacher, registerStudent, registerTeacher } from "../../controllers/auth-controllers/authController.js";

const router = express.Router();

// login and signup routes for teacher
router.post("/register/teacher", registerTeacher);
router.post("/login/teacher", loginTeacher);

//login and sign up routes for student
router.post("/register/student", registerStudent);
router.post("/login/student", loginStudent);

router.get("/logout", handleLogout);


export default router;
