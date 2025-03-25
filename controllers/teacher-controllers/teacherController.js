// backend/src/controllers/teacherController.js

import handleResponse from "../../middlewares/handleResponse.js";
import { deleteTeacherService, getAllTeachersService, getTeacherByIdService, updateTeacherService } from "../../models/teacherModel.js";


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
