import express from "express";
import verifyJWT from "../../middlewares/verifyJWT.js";
import { createQuestion } from "../../controllers/custom_questions/customQuestionsController.js";

const router = express.Router();

router.post("", verifyJWT,createQuestion);

export default router;
