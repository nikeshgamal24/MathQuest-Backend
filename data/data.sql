CREATE TABLE teachers (
    id SERIAL PRIMARY KEY, -- Unique identifier for each teacher
    full_name VARCHAR(255) NOT NULL, -- Teacher's full name (required)
    email VARCHAR(255) UNIQUE NOT NULL, -- Teacher's email (unique and required)
    username VARCHAR(50) UNIQUE NOT NULL, -- Teacher's username (unique and required)
    password VARCHAR(255) NOT NULL, -- Hashed password (required)
    created_at TIMESTAMP DEFAULT NOW() -- Date and time of registration
);


-- Create custom_questions table
CREATE TABLE custom_questions (
    id SERIAL PRIMARY KEY,
    teacher_id INTEGER REFERENCES teachers(id),
    operation VARCHAR(255) NOT NULL,
    difficulty VARCHAR(255) NOT NULL,
    question TEXT NOT NULL,
    correct_answer VARCHAR(255) NOT NULL,
    wrong_option1 VARCHAR(255) NOT NULL,
    wrong_option2 VARCHAR(255),
    wrong_option3 VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create student table
CREATE TABLE students (
    CREATE TABLE students (
    roll_number VARCHAR(255) PRIMARY KEY, -- roll_number is now the primary key
    name VARCHAR(255) NOT NULL,
    class VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
);


-- Create student_answers table
CREATE TABLE IF NOT EXISTS student_answers (
    id SERIAL PRIMARY KEY,
    quiz_session_id INTEGER REFERENCES quiz_sessions(id),
    question_id INTEGER REFERENCES custom_questions(id),
    student_answer VARCHAR(255),
    is_correct BOOLEAN,
    student_roll_number VARCHAR(255) REFERENCES students(roll_number),
    UNIQUE (quiz_session_id, question_id, student_roll_number)
);


-- Create quiz_sessions table
CREATE TABLE IF NOT EXISTS quiz_sessions (
    id SERIAL PRIMARY KEY,
    student_roll_number VARCHAR(255) REFERENCES students(roll_number),
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    score INTEGER
);

