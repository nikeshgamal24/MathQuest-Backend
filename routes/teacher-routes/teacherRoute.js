import express from "express";
import {
  getStudentList,
  deleteStudent,
  deleteTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  getStudentDetails,
} from "../../controllers/teacher-controllers/teacherController.js";
import verifyJWT from "../../middlewares/verifyJWT.js";
import { createQuestion } from "../../controllers/custom_questions/customQuestionsController.js";

const router = express.Router();

// operation on student data route
router.get("/students-list", verifyJWT, getStudentList);
router.delete("/student/:rollNumber", verifyJWT, deleteStudent);
router.get("/student/:rollNumber", getStudentDetails);


//teacher CRUD operation
router.get("", verifyJWT, getAllTeachers);
router.get("/:id", verifyJWT, getTeacherById);
router.put("/:id", verifyJWT, updateTeacher);
router.delete("/:id", verifyJWT, deleteTeacher);

//create custom questions
router.post("/custom-quetsions", verifyJWT, createQuestion);

export default router;
