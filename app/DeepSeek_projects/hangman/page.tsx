'use client';

import { useState, useEffect, useCallback } from 'react';

const WORDS = ['application', 'programming', 'interface', 'wizard'];
const MAX_WRONG_GUESSES = 6;

export default function Hangman() {
  const [selectedWord, setSelectedWord] = useState('');
  const [correctLetters, setCorrectLetters] = useState<string[]>([]);
  const [wrongLetters, setWrongLetters] = useState<string[]>([]);
  const [playable, setPlayable] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [finalMessage, setFinalMessage] = useState('');
  const [revealWord, setRevealWord] = useState('');

  // Initialize game
  const initGame = useCallback(() => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setSelectedWord(randomWord);
    setCorrectLetters([]);
    setWrongLetters([]);
    setPlayable(true);
    setShowPopup(false);
    setFinalMessage('');
    setRevealWord('');
  }, []);

  // Initialize on mount
  useEffect(() => {
    initGame();
  }, [initGame]);

  // Handle key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!playable) return;

      if (e.keyCode >= 65 && e.keyCode <= 90) {
        const letter = e.key.toLowerCase();

        if (selectedWord.includes(letter)) {
          if (!correctLetters.includes(letter)) {
            setCorrectLetters(prev => [...prev, letter]);
          } else {
            showDuplicateNotification();
          }
        } else {
          if (!wrongLetters.includes(letter)) {
            setWrongLetters(prev => [...prev, letter]);
          } else {
            showDuplicateNotification();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playable, correctLetters, wrongLetters, selectedWord]);

  // Check win/lose conditions
  useEffect(() => {
    if (!selectedWord) return;

    // Check win
    const wordArray = selectedWord.split('');
    const isWin = wordArray.every(letter => correctLetters.includes(letter));

    if (isWin) {
      setFinalMessage('Congratulations! You won! 😃');
      setRevealWord('');
      setShowPopup(true);
      setPlayable(false);
      return;
    }

    // Check lose
    if (wrongLetters.length >= MAX_WRONG_GUESSES) {
      setFinalMessage('Unfortunately you lost. 😕');
      setRevealWord(`...the word was: ${selectedWord}`);
      setShowPopup(true);
      setPlayable(false);
    }
  }, [correctLetters, wrongLetters, selectedWord]);

  const showDuplicateNotification = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  const handlePlayAgain = () => {
    initGame();
  };

  // Render word with blanks/letters
  const renderWord = () => {
    return selectedWord.split('').map((letter, index) => (
      <span key={index} className="letter">
        {correctLetters.includes(letter) ? letter : ''}
      </span>
    ));
  };

  // Render hangman figure parts
  const renderFigureParts = () => {
    const parts = [
      <circle key="head" cx="140" cy="70" r="20" />,
      <line key="body" x1="140" y1="90" x2="140" y2="150" />,
      <line key="left-arm" x1="140" y1="120" x2="120" y2="100" />,
      <line key="right-arm" x1="140" y1="120" x2="160" y2="100" />,
      <line key="left-leg" x1="140" y1="150" x2="120" y2="180" />,
      <line key="right-leg" x1="140" y1="150" x2="160" y2="180" />,
    ];

    return parts.map((part, index) => (
      <g key={index} style={{ display: index < wrongLetters.length ? 'block' : 'none' }}>
        {part}
      </g>
    ));
  };

  return (
    <>
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
          background-color: #34495e;
          color: #fff;
          font-family: Arial, Helvetica, sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 80vh;
          margin: 0;
          overflow: hidden;
        }

        h1 {
          margin: 20px 0 0;
        }

        .game-container {
          padding: 20px 30px;
          position: relative;
          margin: auto;
          height: 350px;
          width: 450px;
        }

        .figure-container {
          fill: transparent;
          stroke: #fff;
          stroke-width: 4px;
          stroke-linecap: round;
        }

        .wrong-letters-container {
          position: absolute;
          top: 20px;
          right: 20px;
          display: flex;
          flex-direction: column;
          text-align: right;
        }

        .wrong-letters-container p {
          margin: 0 0 5px;
        }

        .wrong-letters-container span {
          font-size: 24px;
        }

        .word {
          display: flex;
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
        }

        .letter {
          border-bottom: 3px solid #2980b9;
          display: inline-flex;
          font-size: 30px;
          align-items: center;
          justify-content: center;
          margin: 0 3px;
          height: 50px;
          width: 20px;
        }

        .popup-container {
          background-color: rgba(0, 0, 0, 0.3);
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          display: ${showPopup ? 'flex' : 'none'};
          align-items: center;
          justify-content: center;
          z-index: 100;
        }

        .popup {
          background: #2980b9;
          border-radius: 5px;
          box-shadow: 0 15px 10px 3px rgba(0, 0, 0, 0.1);
          padding: 20px;
          text-align: center;
        }

        .popup button {
          cursor: pointer;
          background-color: #fff;
          color: #2980b9;
          border: 0;
          margin-top: 20px;
          padding: 12px 20px;
          font-size: 16px;
        }

        .popup button:active {
          transform: scale(0.98);
        }

        .popup button:focus {
          outline: 0;
        }

        .notification-container {
          background-color: rgba(0, 0, 0, 0.3);
          border-radius: 10px 10px 0 0;
          padding: 15px 20px;
          position: absolute;
          bottom: -50px;
          transition: transform 0.3s ease-in-out;
        }

        .notification-container p {
          margin: 0;
        }

        .notification-container.show {
          transform: translateY(-50px);
        }
      `}</style>

      <h1>Hangman</h1>
      <p>Find the hidden word - Enter a letter</p>
      
      <div className="game-container">
        <svg height="250" width="200" className="figure-container">
          {/* Rod */}
          <line x1="60" y1="20" x2="140" y2="20" />
          <line x1="140" y1="20" x2="140" y2="50" />
          <line x1="60" y1="20" x2="60" y2="230" />
          <line x1="20" y1="230" x2="100" y2="230" />
          
          {/* Hangman parts */}
          {renderFigureParts()}
        </svg>

        <div className="wrong-letters-container">
          {wrongLetters.length > 0 && <p>Wrong</p>}
          <div>
            {wrongLetters.map((letter, index) => (
              <span key={index}>{letter}</span>
            ))}
          </div>
        </div>

        <div className="word">
          {renderWord()}
        </div>
      </div>

      {/* Popup for win/lose */}
      <div className="popup-container">
        <div className="popup">
          <h2>{finalMessage}</h2>
          <h3>{revealWord}</h3>
          <button onClick={handlePlayAgain}>Play Again</button>
        </div>
      </div>

      {/* Notification for duplicate letters */}
      <div className={`notification-container ${showNotification ? 'show' : ''}`}>
        <p>You have already entered this letter</p>
      </div>
    </>
  );
}