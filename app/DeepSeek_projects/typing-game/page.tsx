'use client';

import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { FaCog } from 'react-icons/fa';

const words = [
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

export default function SpeedTyper() {
  const [randomWord, setRandomWord] = useState('');
  const [inputText, setInputText] = useState('');
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(10);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [showSettings, setShowSettings] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize game
  useEffect(() => {
    // Load difficulty from localStorage
    const savedDifficulty = localStorage.getItem('difficulty');
    if (savedDifficulty === 'easy' || savedDifficulty === 'medium' || savedDifficulty === 'hard') {
      setDifficulty(savedDifficulty);
    }

    // Generate first word
    getRandomWord();

    // Focus input
    inputRef.current?.focus();

    // Start timer
    timeIntervalRef.current = setInterval(updateTime, 1000);

    // Cleanup interval on unmount
    return () => {
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
      }
    };
  }, []);

  // Handle input change
  useEffect(() => {
    if (inputText === randomWord && randomWord !== '') {
      // Update score
      setScore(prev => prev + 1);

      // Generate new word
      getRandomWord();

      // Clear input
      setInputText('');

      // Add time based on difficulty
      if (difficulty === 'hard') {
        setTime(prev => prev + 2);
      } else if (difficulty === 'medium') {
        setTime(prev => prev + 3);
      } else {
        setTime(prev => prev + 5);
      }
    }
  }, [inputText, randomWord, difficulty]);

  // Handle game over when time reaches 0
  useEffect(() => {
    if (time === 0) {
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
      }
      setGameOver(true);
    }
  }, [time]);

  const getRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * words.length);
    setRandomWord(words[randomIndex]);
  };

  const updateTime = () => {
    setTime(prev => {
      if (prev <= 0) {
        return 0;
      }
      return prev - 1;
    });
  };

  const handleDifficultyChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newDifficulty = e.target.value as 'easy' | 'medium' | 'hard';
    setDifficulty(newDifficulty);
    localStorage.setItem('difficulty', newDifficulty);
  };

  const handleRestart = () => {
    setScore(0);
    setTime(10);
    setInputText('');
    setGameOver(false);
    getRandomWord();
    
    if (timeIntervalRef.current) {
      clearInterval(timeIntervalRef.current);
    }
    timeIntervalRef.current = setInterval(updateTime, 1000);
    
    inputRef.current?.focus();
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
          border: none;
        }

        select {
          width: 200px;
          padding: 5px;
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          border-radius: 0;
          background-color: #a7c5e3;
          border: none;
        }

        select:focus,
        button:focus,
        input:focus {
          outline: 0;
        }

        .settings-btn {
          position: absolute;
          bottom: 30px;
          left: 30px;
          background-color: rgba(0, 0, 0, 0.3);
          color: white;
          border: none;
          border-radius: 4px;
          padding: 10px;
          font-size: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.3s;
        }

        .settings-btn:hover {
          background-color: rgba(0, 0, 0, 0.5);
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
          z-index: 10;
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
          font-size: 2.5rem;
          min-height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        input {
          border: 0;
          border-radius: 4px;
          font-size: 14px;
          width: 300px;
          padding: 12px 20px;
          margin-top: 10px;
        }

        small {
          display: block;
          margin-bottom: 20px;
          font-size: 0.9rem;
          color: #ccc;
        }

        .score-container {
          position: absolute;
          top: 60px;
          right: 20px;
          font-size: 1.2rem;
        }

        .time-container {
          position: absolute;
          top: 60px;
          left: 20px;
          font-size: 1.2rem;
        }

        .end-game-container {
          background-color: inherit;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          border-radius: 4px;
        }

        .end-game-container h1 {
          margin-bottom: 20px;
        }

        .end-game-container p {
          font-size: 1.2rem;
          margin-bottom: 20px;
        }

        .end-game-container button {
          background-color: #a7c5e3;
          color: #2c3e50;
          font-weight: bold;
          padding: 10px 20px;
        }

        @media (max-width: 600px) {
          .container {
            width: 90%;
            max-width: 400px;
          }
          
          input {
            width: 100%;
          }
          
          .settings {
            height: 100px;
            padding: 10px;
          }
          
          select {
            width: 150px;
          }
        }
      `}</style>

      <div className="game-container">
        <button 
          className="settings-btn" 
          onClick={() => setShowSettings(!showSettings)}
          aria-label="Settings"
        >
          <FaCog />
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

          <h1 id="word">{randomWord}</h1>

          <input
            type="text"
            id="text"
            ref={inputRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type the word here..."
            autoComplete="off"
            autoFocus
            disabled={gameOver}
          />

          <p className="time-container">
            Time left: <span id="time">{time}s</span>
          </p>

          <p className="score-container">
            Score: <span id="score">{score}</span>
          </p>

          {gameOver && (
            <div id="end-game-container" className="end-game-container">
              <h1>Time ran out</h1>
              <p>Your final score is {score}</p>
              <button onClick={handleRestart}>Reload</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}