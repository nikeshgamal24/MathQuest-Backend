import dotenv from "dotenv";
import handleResponse from "../../middlewares/handleResponse";
import { loginStudentService } from "../../services/studentServices";

dotenv.config();

export const loginStudent = async (req, res, next) => {
  try {
    const { rollNumber } = req.body;

    const student = await loginStudentService(rollNumber);

    if (!student) {
      return handleResponse(res, 401, "Invalid roll number");
    }

    // Generate JWT token
    const accessToken = jwt.sign(
      {
        UserInfo: {
          id: student.roll_number,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ accessToken, student }); // Send the token and student data
  } catch (error) {
    console.error("Error in student login:", error);
    return handleResponse(res, 500, "Internal server error");
  }
};
