import express from "express";
import {
  deleteTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
} from "../../controllers/teacher-controllers/teacherController.js";
import verifyJWT from "../../middlewares/verifyJWT.js";
import { createQuestion } from "../../controllers/custom_questions/customQuestionsController.js";

const router = express.Router();

router.get("", verifyJWT,getAllTeachers);
router.get("/:id", verifyJWT,getTeacherById);
router.put("/:id", verifyJWT,updateTeacher);
router.delete("/:id",verifyJWT, deleteTeacher);

//create custom questions
router.post("/custom-quetsions", verifyJWT,createQuestion);


export default router;
