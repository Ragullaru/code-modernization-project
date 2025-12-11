'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const WORDS = [
  'sigh',
  'tense',
  'airplane',
  'ball',
  'pies',
  'juice',
  'warlike',
  'bad',
  'north',
  'dependent',
  'steer',
  'silver',
  'highfalutin',
  'superficial',
  'quince',
  'eight',
  'feeble',
  'admit',
  'drag',
  'loving'
];

type Difficulty = 'easy' | 'medium' | 'hard';

const TIME_BONUS: Record<Difficulty, number> = {
  easy: 5,
  medium: 3,
  hard: 2
};

export default function TypingGame() {
  const [currentWord, setCurrentWord] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(10);
  const [isGameOver, setIsGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [showSettings, setShowSettings] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const getRandomWord = useCallback(() => {
    return WORDS[Math.floor(Math.random() * WORDS.length)];
  }, []);

  const startNewWord = useCallback(() => {
    setCurrentWord(getRandomWord());
  }, [getRandomWord]);

  const gameOver = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsGameOver(true);
  }, []);

  const updateTime = useCallback(() => {
    setTime((prevTime) => {
      const newTime = prevTime - 1;
      if (newTime <= 0) {
        gameOver();
        return 0;
      }
      return newTime;
    });
  }, [gameOver]);

  // Load difficulty from localStorage on mount
  useEffect(() => {
    const savedDifficulty = localStorage.getItem('difficulty') as Difficulty | null;
    if (savedDifficulty && ['easy', 'medium', 'hard'].includes(savedDifficulty)) {
      setDifficulty(savedDifficulty);
    }
    startNewWord();
  }, [startNewWord]);

  // Start timer
  useEffect(() => {
    if (!isGameOver) {
      timerRef.current = setInterval(updateTime, 1000);
      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [isGameOver, updateTime]);

  // Focus input on start
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value === currentWord) {
      setScore((prev) => prev + 1);
      setInputValue('');
      startNewWord();
      setTime((prev) => prev + TIME_BONUS[difficulty]);
    }
  };

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDifficulty = e.target.value as Difficulty;
    setDifficulty(newDifficulty);
    localStorage.setItem('difficulty', newDifficulty);
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <>
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
          background-color: #2c3e50;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
          font-family: Verdana, Geneva, Tahoma, sans-serif;
        }

        button {
          cursor: pointer;
          font-size: 14px;
          border-radius: 4px;
          padding: 5px 15px;
        }

        select {
          width: 200px;
          padding: 5px;
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          border-radius: 0;
          background-color: #a7c5e3;
        }

        select:focus,
        button:focus {
          outline: 0;
        }

        .settings-btn {
          position: absolute;
          bottom: 30px;
          left: 30px;
        }

        .settings {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          background-color: rgba(0, 0, 0, 0.3);
          height: 70px;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: translateY(0);
          transition: transform 0.3s ease-in-out;
        }

        .settings.hide {
          transform: translateY(-100%);
        }

        .container {
          background-color: #34495e;
          padding: 20px;
          border-radius: 4px;
          box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
          color: #fff;
          position: relative;
          text-align: center;
          width: 500px;
        }

        h2 {
          background-color: rgba(0, 0, 0, 0.3);
          padding: 8px;
          border-radius: 4px;
          margin: 0 0 40px;
        }

        h1 {
          margin: 0;
        }

        input {
          border: 0;
          border-radius: 4px;
          font-size: 14px;
          width: 300px;
          padding: 12px 20px;
          margin-top: 10px;
        }

        .score-container {
          position: absolute;
          top: 60px;
          right: 20px;
        }

        .time-container {
          position: absolute;
          top: 60px;
          left: 20px;
        }

        .end-game-container {
          background-color: inherit;
          display: none;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .end-game-container.show {
          display: flex;
        }
      `}</style>

      <button
        id="settings-btn"
        className="settings-btn"
        onClick={() => setShowSettings(!showSettings)}
        aria-label="Settings"
      >
        <i className="fas fa-cog">⚙️</i>
      </button>

      <div className={`settings ${showSettings ? '' : 'hide'}`}>
        <form id="settings-form">
          <div>
            <label htmlFor="difficulty">Difficulty</label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={handleDifficultyChange}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </form>
      </div>

      <div className="container">
        <h2>👩‍💻 Speed Typer 👨‍💻</h2>
        <small>Type the following:</small>

        <h1 id="word">{currentWord}</h1>

        <input
          ref={inputRef}
          type="text"
          id="text"
          autoComplete="off"
          placeholder="Type the word here..."
          value={inputValue}
          onChange={handleInputChange}
          disabled={isGameOver}
        />

        <p className="time-container">
          Time left: <span id="time">{time}s</span>
        </p>

        <p className="score-container">
          Score: <span id="score">{score}</span>
        </p>

        <div
          id="end-game-container"
          className={`end-game-container ${isGameOver ? 'show' : ''}`}
        >
          <h1>Time ran out</h1>
          <p>Your final score is {score}</p>
          <button onClick={handleReload}>Reload</button>
        </div>
      </div>
    </>
  );
}