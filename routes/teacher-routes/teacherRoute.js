import express from "express";
import {
  getStudentList,
  deleteStudent,
  deleteTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  getStudentDetails,
  getQuestionsList,
  updateQuestion,
  deleteQuestion,
  questionsHistory,
  getStudentPerformance,
} from "../../controllers/teacher-controllers/teacherController.js";
import verifyJWT from "../../middlewares/verifyJWT.js";
import { createQuestion } from "../../controllers/custom_questions/customQuestionsController.js";

const router = express.Router();

// operation on student data route
router.get("/students-list", verifyJWT, getStudentList);
router.delete("/student/:rollNumber", verifyJWT, deleteStudent);
router.get("/student/:rollNumber", verifyJWT, getStudentDetails);
router.get("/questions-list", verifyJWT, getQuestionsList);
router.get("/history-questions", verifyJWT, questionsHistory);
router.put("/question/:id", verifyJWT, updateQuestion);
router.delete("/question/:id", verifyJWT, deleteQuestion);
router.get("/student-performance/:rollNumber", verifyJWT, getStudentPerformance);


//teacher CRUD operation
router.get("", verifyJWT, getAllTeachers);
router.get("/:id", verifyJWT, getTeacherById);
router.put("/:id", verifyJWT, updateTeacher);
router.delete("/:id", verifyJWT, deleteTeacher);

//create custom questions
router.post("/custom-quetsions", verifyJWT, createQuestion);

export default router;
