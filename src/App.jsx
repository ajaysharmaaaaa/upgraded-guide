import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import QuestionCard from './components/QuestionCard';
import 'katex/dist/katex.min.css';

function App() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data, error } = await supabase
          .from('new_questions')
          .select(`
            id,
            question_statement,
            question_type,
            options,
            answer,
            solution,
            difficulty_level,
            topic_name,
            slot,
            part,
            correct_marks,
            incorrect_marks,
            time_minutes,
            created_at
          `)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }
        setQuestions(data);
      } catch (err) {
        console.error('Error fetching questions:', err.message);
        setError('Failed to load questions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  return (
    <div className="container">
      <header className="header">
        <h1>Question Preview System</h1>
        <p>Explore a curated collection of questions, complete with detailed markings, time limits, and categorization.</p>
      </header>

      {loading && <p className="loading">Loading questions...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && questions.length === 0 && (
        <p className="loading">No questions available for preview.</p>
      )}

      {!loading && !error && questions.length > 0 && (
        <div className="grid-container">
          {questions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
