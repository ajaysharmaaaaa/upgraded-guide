/*
  # Create new_questions table
  1. New Tables: new_questions (id uuid, question_text text, marking integer, time_limit integer, slot text, part text, difficulty text, created_at timestamp)
  2. Security: Enable RLS, add read policy for anonymous users
  3. Data Seeding: Insert sample questions for preview
*/
CREATE TABLE IF NOT EXISTS new_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  question_text text NOT NULL,
  marking integer NOT NULL DEFAULT 0,
  time_limit integer NOT NULL DEFAULT 0, -- in minutes
  slot text NOT NULL DEFAULT '',
  part text NOT NULL DEFAULT '',
  difficulty text NOT NULL DEFAULT 'Medium'
);

ALTER TABLE new_questions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to read questions for preview purposes
CREATE POLICY "Allow public read access to new_questions" ON new_questions FOR SELECT TO anon USING (true);

-- Insert some sample data for demonstration
INSERT INTO new_questions (question_text, marking, time_limit, slot, part, difficulty)
VALUES
  ('What is the capital of France?', 5, 2, 'Slot A', 'Part 1', 'Easy'),
  ('Explain the concept of polymorphism in OOP.', 10, 5, 'Slot A', 'Part 2', 'Medium'),
  ('Derive the formula for the sum of an arithmetic progression.', 8, 4, 'Slot B', 'Part 1', 'Medium'),
  ('Analyze the impact of climate change on global ecosystems.', 15, 10, 'Slot B', 'Part 3', 'Hard'),
  ('Describe the main components of a relational database.', 7, 3, 'Slot C', 'Part 1', 'Easy'),
  ('Implement a quicksort algorithm in JavaScript.', 12, 8, 'Slot C', 'Part 2', 'Hard'),
  ('Discuss the ethical implications of AI in healthcare.', 10, 6, 'Slot D', 'Part 3', 'Medium'),
  ('Calculate the definite integral of x^2 from 0 to 1.', 6, 3, 'Slot D', 'Part 1', 'Easy'),
  ('Compare and contrast SQL and NoSQL databases.', 9, 5, 'Slot E', 'Part 2', 'Medium'),
  ('Design a user authentication flow for a mobile application.', 14, 9, 'Slot E', 'Part 3', 'Hard');