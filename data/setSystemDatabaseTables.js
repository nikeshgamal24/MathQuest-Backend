import createCustomQuestionsTable from "./CustomQuestionsTable/createCustomQuestions.js";
import createQuizSessions from "./quiz-sessions-table/createQuizSessionTable.js";
import createStudentAnswers from "./quiz-sessions-table/createStudentAnswersTable.js";
import createStudentTable from "./StudentsTable/createStudentTable.js";
import createTeacherTable from "./TeachersTable/createTeacherTable.js";

export const setSystemDatabaseTables = async () => {
  try {
    await createTeacherTable();
    await createCustomQuestionsTable();
    await createStudentTable();
    await createQuizSessions();
    await createStudentAnswers();
    console.log("Database tables created successfully.");
  } catch (error) {
    console.error("Error setting up database:", error);
  }
};
