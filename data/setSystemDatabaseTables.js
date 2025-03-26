import createCustomQuestionsTable from "./CustomQuestionsTable/createCustomQuestions.js";
import createQuizSessions from "./quiz-sessions-table/createQuizSessionTable.js";
import createStudentAnswers from "./quiz-sessions-table/createStudentAnswersTable.js";
import createStudentTable from "./StudentsTable/createStudentTable.js";
import createTeacherTable from "./TeachersTable/createTeacherTable.js";

export const setSystemDatabaseTables = async () => {
  try {
    await Promise.all([createTeacherTable(), createStudentTable()]);

    await Promise.all([createCustomQuestionsTable(), createQuizSessions()]);

    await Promise.all([createStudentAnswers()]);
    console.log("Database tables created successfully.");
  } catch (error) {
    console.error("Error setting up database:", error);
  }
};
