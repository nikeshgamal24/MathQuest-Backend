// backend/src/controllers/teacherController.js

import handleResponse from "../../middlewares/handleResponse.js";
import {
  deleteQuestionService,
  getQuestionsListService,
  updateQuestionService,
} from "../../services/customQuestionServices.js";
import { getStudentPerformanceService } from "../../services/getStudentPerformanceService.js";
import { questionHistoryService } from "../../services/questionsHistoryService.js";
import {
  deleteStudentService,
  deleteTeacherService,
  getAllTeachersService,
  getStudentDetailsService,
  getStudentListService,
  getTeacherByIdService,
  updateTeacherService,
} from "../../services/teacherServices.js";

export const getAllTeachers = async (req, res, next) => {
  try {
    const teachers = await getAllTeachersService();
    if (!teachers || teachers.length === 0) {
      return handleResponse(res, 404, "No teachers found");
    }
    handleResponse(res, 200, "Fetched All Teachers Successfully", teachers);
  } catch (err) {
    console.error("Error in getAllTeachers:", err);
    next(err);
  }
};

export const getTeacherById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const teacher = await getTeacherByIdService({ id });
    if (!teacher) {
      return handleResponse(res, 404, "Teacher Not Found");
    }
    handleResponse(res, 200, "Fetched Teacher By Id Successfully", teacher);
  } catch (err) {
    console.error("Error in getTeacherById:", err);
    next(err);
  }
};

export const updateTeacher = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fullName, email, username, password } = req.body;

    const updatedTeacher = await updateTeacherService({
      id,
      fullName,
      email,
      username,
      password, // Assuming the service hashes it
    });

    if (!updatedTeacher) {
      return handleResponse(res, 404, "Teacher Not Found or Update Failed");
    }

    handleResponse(res, 200, "Teacher Updated Successfully", updatedTeacher);
  } catch (err) {
    console.error("Error in updateTeacher:", err);
    next(err);
  }
};

export const deleteTeacher = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedTeacher = await deleteTeacherService({ id });

    if (!deletedTeacher) {
      return handleResponse(res, 404, "Teacher Not Found or Delete Failed");
    }

    handleResponse(res, 200, "Teacher Deleted Successfully", deletedTeacher);
  } catch (err) {
    console.error("Error in deleteTeacher:", err);
    next(err);
  }
};

export const getStudentList = async (req, res, next) => {
  try {
    const students = await getStudentListService();
    console.log("🚀 ~ getStudentList ~ students:", students);
    handleResponse(res, 200, "Fetched Students List Successfully", students);
  } catch (error) {
    next(error);
  }
};

export const deleteStudent = async (req, res, next) => {
  try {
    const { rollNumber } = req.params;
    console.log("🚀 ~ deleteStudent ~ rollNumber:", rollNumber);
    const deletedStudent = await deleteStudentService(rollNumber);
    console.log("🚀 ~ deleteStudent ~ deletedStudent:", deletedStudent);

    if (deletedStudent) {
      handleResponse(res, 200, "Student deleted successfully.", deletedStudent);
    } else {
      handleResponse(res, 404, "Student not found.");
    }
  } catch (error) {
    next(error);
  }
};

export const getStudentDetails = async (req, res, next) => {
  try {
    const { rollNumber } = req.params;
    const studentDetails = await getStudentDetailsService(rollNumber);
    if (!studentDetails) {
      // return res.status(404).json({ message: "Student not found." });
      handleResponse(res, 404, "Student not found.", studentDetails);
    }
    handleResponse(
      res,
      200,
      "Fetched Student Details Successfully.",
      studentDetails
    );
  } catch (error) {
    next(error);
  }
};

export const getQuestionsList = async (req, res, next) => {
  try {
    const questions = await getQuestionsListService();
    console.log("🚀 ~ getQuestionsList ~ questions:", questions);
    handleResponse(res, 200, "Fetched Questions Successfully", questions);
  } catch (error) {
    next(error);
  }
};

export const updateQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      question,
      operation,
      difficulty,
      correctAnswer,
      wrongOption1,
      wrongOption2,
      wrongOption3,
    } = req.body;

    const updatedQuestion = await updateQuestionService(
      id,
      question,
      operation,
      difficulty,
      correctAnswer,
      wrongOption1,
      wrongOption2,
      wrongOption3
    );
    handleResponse(res, 200, "Question updated successfully.", updatedQuestion); // Include updatedQuestion in the response
  } catch (error) {
    next(error);
  }
};

export const deleteQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedQuestion = await deleteQuestionService(id);
    console.log("🚀 ~ deleteQuestion ~ deletedQuestion:", deletedQuestion);
    handleResponse(res, 200, "Question deleted successfully.", deletedQuestion);
  } catch (error) {
    next(error);
  }
};

export const questionsHistory = async (req, res, next) => {
  try {
    const history = await questionHistoryService();
    console.log("🚀 ~ questionsHistory ~ history:", history);
    handleResponse(res, 200, "Fetched Questions History Sucessfully", history);
  } catch (error) {
    next(error);
  }
};

export const getStudentPerformance = async (req, res, next) => {
  try {
    const { rollNumber } = req.params; // Get rollNumber from request parameters
    const studentPerformance = await getStudentPerformanceService(rollNumber);
    handleResponse(res, 200, "Student performance retrieved successfully.", studentPerformance);
  } catch (error) {
    next(error);
  }
};
