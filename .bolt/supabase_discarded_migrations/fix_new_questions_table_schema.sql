/*
  # Fix new_questions table schema and re-seed data
  1. Schema Correction: Ensure 'question_text' column exists in 'new_questions' table.
  2. Security: Re-enable RLS and policy for anonymous users.
  3. Data Seeding: Re-insert sample questions for preview (if not already present).
*/

-- Ensure the table exists and has the correct schema
CREATE TABLE IF NOT EXISTS new_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  question_text text NOT NULL DEFAULT '', -- Added DEFAULT '' for robustness
  marking integer NOT NULL DEFAULT 0,
  time_limit integer NOT NULL DEFAULT 0, -- in minutes
  slot text NOT NULL DEFAULT '',
  part text NOT NULL DEFAULT '',
  difficulty text NOT NULL DEFAULT 'Medium'
);

-- CRITICAL FIX: Add question_text column if it does not exist.
-- This handles cases where the table was created without this column in a previous failed attempt.
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='new_questions' AND column_name='question_text') THEN
        ALTER TABLE new_questions ADD COLUMN question_text text NOT NULL DEFAULT '';
    END IF;
END
$$;


ALTER TABLE new_questions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to read questions for preview purposes
CREATE POLICY "Allow public read access to new_questions" ON new_questions FOR SELECT TO anon USING (true);

-- Insert some sample data for demonstration, only if the table is empty to prevent duplicates
INSERT INTO new_questions (question_text, marking, time_limit, slot, part, difficulty)
SELECT * FROM (VALUES
  ('What is the capital of France?', 5, 2, 'Slot A', 'Part 1', 'Easy'),
  ('Explain the concept of polymorphism in OOP.', 10, 5, 'Slot A', 'Part 2', 'Medium'),
  ('Derive the formula for the sum of an arithmetic progression.', 8, 4, 'Slot B', 'Part 1', 'Medium'),
  ('Analyze the impact of climate change on global ecosystems.', 15, 10, 'Slot B', 'Part 3', 'Hard'),
  ('Describe the main components of a relational database.', 7, 3, 'Slot C', 'Part 1', 'Easy'),
  ('Implement a quicksort algorithm in JavaScript.', 12, 8, 'Slot C', 'Part 2', 'Hard'),
  ('Discuss the ethical implications of AI in healthcare.', 10, 6, 'Slot D', 'Part 3', 'Medium'),
  ('Calculate the definite integral of x^2 from 0 to 1.', 6, 3, 'Slot D', 'Part 1', 'Easy'),
  ('Compare and contrast SQL and NoSQL databases.', 9, 5, 'Slot E', 'Part 2', 'Medium'),
  ('Design a user authentication flow for a mobile application.', 14, 9, 'Slot E', 'Part 3', 'Hard')
) AS data(question_text, marking, time_limit, slot, part, difficulty)
WHERE NOT EXISTS (SELECT 1 FROM new_questions WHERE question_text = data.question_text); -- Prevent duplicate inserts based on question_text