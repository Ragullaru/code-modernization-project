'use client';

import { useState, useEffect, useCallback } from 'react';

export default function HangmanGame() {
  const words = ['application', 'programming', 'interface', 'wizard'];
  
  const [selectedWord, setSelectedWord] = useState('');
  const [correctLetters, setCorrectLetters] = useState<string[]>([]);
  const [wrongLetters, setWrongLetters] = useState<string[]>([]);
  const [playable, setPlayable] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');

  // Initialize game
  const initGame = useCallback(() => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setSelectedWord(randomWord);
    setCorrectLetters([]);
    setWrongLetters([]);
    setPlayable(true);
    setShowPopup(false);
    setGameStatus('playing');
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  // Check win condition
  useEffect(() => {
    if (!selectedWord) return;
    
    const allLettersGuessed = selectedWord
      .split('')
      .every(letter => correctLetters.includes(letter));
    
    if (allLettersGuessed && correctLetters.length > 0) {
      setGameStatus('won');
      setShowPopup(true);
      setPlayable(false);
    }
  }, [correctLetters, selectedWord]);

  // Check lose condition
  useEffect(() => {
    if (wrongLetters.length === 6) {
      setGameStatus('lost');
      setShowPopup(true);
      setPlayable(false);
    }
  }, [wrongLetters]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (!playable) return;
      
      if (e.keyCode >= 65 && e.keyCode <= 90) {
        const letter = e.key.toLowerCase();

        if (selectedWord.includes(letter)) {
          if (!correctLetters.includes(letter)) {
            setCorrectLetters(prev => [...prev, letter]);
          } else {
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 2000);
          }
        } else {
          if (!wrongLetters.includes(letter)) {
            setWrongLetters(prev => [...prev, letter]);
          } else {
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 2000);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [playable, selectedWord, correctLetters, wrongLetters]);

  const handlePlayAgain = () => {
    initGame();
  };

  return (
    <div style={styles.body}>
      <h1 style={styles.h1}>Hangman</h1>
      <p>Find the hidden word - Enter a letter</p>
      
      <div style={styles.gameContainer}>
        <svg height="250" width="200" style={styles.figureContainer}>
          {/* Rod */}
          <line x1="60" y1="20" x2="140" y2="20" />
          <line x1="140" y1="20" x2="140" y2="50" />
          <line x1="60" y1="20" x2="60" y2="230" />
          <line x1="20" y1="230" x2="100" y2="230" />

          {/* Head */}
          <circle 
            cx="140" 
            cy="70" 
            r="20" 
            style={{ ...styles.figurePart, display: wrongLetters.length > 0 ? 'block' : 'none' }} 
          />
          {/* Body */}
          <line 
            x1="140" 
            y1="90" 
            x2="140" 
            y2="150" 
            style={{ ...styles.figurePart, display: wrongLetters.length > 1 ? 'block' : 'none' }} 
          />
          {/* Arms */}
          <line 
            x1="140" 
            y1="120" 
            x2="120" 
            y2="100" 
            style={{ ...styles.figurePart, display: wrongLetters.length > 2 ? 'block' : 'none' }} 
          />
          <line 
            x1="140" 
            y1="120" 
            x2="160" 
            y2="100" 
            style={{ ...styles.figurePart, display: wrongLetters.length > 3 ? 'block' : 'none' }} 
          />
          {/* Legs */}
          <line 
            x1="140" 
            y1="150" 
            x2="120" 
            y2="180" 
            style={{ ...styles.figurePart, display: wrongLetters.length > 4 ? 'block' : 'none' }} 
          />
          <line 
            x1="140" 
            y1="150" 
            x2="160" 
            y2="180" 
            style={{ ...styles.figurePart, display: wrongLetters.length > 5 ? 'block' : 'none' }} 
          />
        </svg>

        <div style={styles.wrongLettersContainer}>
          {wrongLetters.length > 0 && (
            <>
              <p style={styles.wrongLettersP}>Wrong</p>
              {wrongLetters.map((letter, index) => (
                <span key={index} style={styles.wrongLettersSpan}>{letter}</span>
              ))}
            </>
          )}
        </div>

        <div style={styles.word}>
          {selectedWord.split('').map((letter, index) => (
            <span key={index} style={styles.letter}>
              {correctLetters.includes(letter) ? letter : ''}
            </span>
          ))}
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div style={styles.popupContainer}>
          <div style={styles.popup}>
            <h2>
              {gameStatus === 'won' 
                ? 'Congratulations! You won! 😃' 
                : 'Unfortunately you lost. 😕'}
            </h2>
            {gameStatus === 'lost' && (
              <h3>...the word was: {selectedWord}</h3>
            )}
            <button onClick={handlePlayAgain} style={styles.button}>
              Play Again
            </button>
          </div>
        </div>
      )}

      {/* Notification */}
      <div 
        style={{
          ...styles.notificationContainer,
          transform: showNotification ? 'translateY(-50px)' : 'translateY(0)'
        }}
      >
        <p style={styles.notificationP}>You have already entered this letter</p>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  body: {
    backgroundColor: '#34495e',
    color: '#fff',
    fontFamily: 'Arial, Helvetica, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    margin: 0,
    overflow: 'hidden',
    padding: '20px',
  },
  h1: {
    margin: '20px 0 0',
  },
  gameContainer: {
    padding: '20px 30px',
    position: 'relative',
    margin: 'auto',
    height: '350px',
    width: '450px',
    maxWidth: '100%',
  },
  figureContainer: {
    fill: 'transparent',
    stroke: '#fff',
    strokeWidth: 4,
    strokeLinecap: 'round',
  },
  figurePart: {
    display: 'none',
  },
  wrongLettersContainer: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'right',
  },
  wrongLettersP: {
    margin: '0 0 5px',
  },
  wrongLettersSpan: {
    fontSize: '24px',
  },
  word: {
    display: 'flex',
    position: 'absolute',
    bottom: '10px',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  letter: {
    borderBottom: '3px solid #2980b9',
    display: 'inline-flex',
    fontSize: '30px',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 3px',
    height: '50px',
    width: '20px',
  },
  popupContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  popup: {
    background: '#2980b9',
    borderRadius: '5px',
    boxShadow: '0 15px 10px 3px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    textAlign: 'center',
  },
  button: {
    cursor: 'pointer',
    backgroundColor: '#fff',
    color: '#2980b9',
    border: 0,
    marginTop: '20px',
    padding: '12px 20px',
    fontSize: '16px',
    borderRadius: '4px',
  },
  notificationContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '10px 10px 0 0',
    padding: '15px 20px',
    position: 'fixed',
    bottom: '-50px',
    transition: 'transform 0.3s ease-in-out',
  },
  notificationP: {
    margin: 0,
  },
};