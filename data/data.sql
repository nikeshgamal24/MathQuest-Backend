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