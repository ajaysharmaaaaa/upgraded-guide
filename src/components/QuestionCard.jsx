import React, { useState } from 'react';
import { InlineMath, BlockMath } from 'react-katex';

const QuestionCard = ({ question }) => {
  const [showSolution, setShowSolution] = useState(false);

  const renderLatex = (text) => {
    if (!text) return '';
    
    // Split text by LaTeX delimiters and render accordingly
    const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/);
    
    return parts.map((part, index) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        // Block math
        const math = part.slice(2, -2);
        return <BlockMath key={index} math={math} />;
      } else if (part.startsWith('$') && part.endsWith('$')) {
        // Inline math
        const math = part.slice(1, -1);
        return <InlineMath key={index} math={math} />;
      } else {
        // Regular text
        return <span key={index}>{part}</span>;
      }
    });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'var(--color-success)';
      case 'medium': return 'var(--color-warning)';
      case 'hard': return 'var(--color-error)';
      default: return 'var(--color-primary)';
    }
  };

  const getQuestionTypeColor = (type) => {
    switch (type) {
      case 'MCQ': return 'var(--color-primary)';
      case 'MSQ': return 'var(--color-secondary)';
      case 'NAT': return 'var(--color-accent)';
      case 'Subjective': return 'var(--color-warning)';
      default: return 'var(--color-text-secondary)';
    }
  };

  return (
    <div className="question-card">
      <div className="question-header">
        <div className="question-meta">
          <span 
            className="question-type-badge"
            style={{ backgroundColor: `${getQuestionTypeColor(question.question_type)}20`, color: getQuestionTypeColor(question.question_type) }}
          >
            {question.question_type}
          </span>
          <span 
            className="difficulty-badge"
            style={{ backgroundColor: `${getDifficultyColor(question.difficulty_level)}20`, color: getDifficultyColor(question.difficulty_level) }}
          >
            {question.difficulty_level}
          </span>
        </div>
        
        <div className="question-details">
          {question.topic_name && (
            <span className="detail-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
              {question.topic_name}
            </span>
          )}
          
          {question.correct_marks && (
            <span className="detail-item marking">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              +{question.correct_marks} / -{question.incorrect_marks || 0}
            </span>
          )}
          
          {question.time_minutes && (
            <span className="detail-item time">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              {question.time_minutes} min
            </span>
          )}
          
          {question.slot && (
            <span className="detail-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              {question.slot}
            </span>
          )}
          
          {question.part && (
            <span className="detail-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
              Part {question.part}
            </span>
          )}
        </div>
      </div>

      <div className="question-content">
        <div className="question-statement">
          <h3>Question:</h3>
          <div className="latex-content">
            {renderLatex(question.question_statement)}
          </div>
        </div>

        {question.options && question.options.length > 0 && (
          <div className="question-options">
            <h4>Options:</h4>
            <div className="options-list">
              {question.options.map((option, index) => (
                <div key={index} className="option-item">
                  <span className="option-label">{String.fromCharCode(65 + index)}.</span>
                  <div className="latex-content">
                    {renderLatex(option)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {question.answer && (
          <div className="question-answer">
            <h4>Answer:</h4>
            <div className="latex-content answer-content">
              {renderLatex(question.answer)}
            </div>
          </div>
        )}

        {question.solution && (
          <div className="question-solution">
            <button 
              className="solution-toggle"
              onClick={() => setShowSolution(!showSolution)}
            >
              {showSolution ? 'Hide Solution' : 'Show Solution'}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                style={{ transform: showSolution ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}
              >
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            
            {showSolution && (
              <div className="solution-content">
                <h4>Solution:</h4>
                <div className="latex-content">
                  {renderLatex(question.solution)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;