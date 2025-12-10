'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

// Don't redeclare the global SpeechRecognition interface
// Use TypeScript's built-in types

// Create a type for the recognition instance we'll use
type SpeechRecognitionInstance = {
  start(): void;
  stop(): void;
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror?: ((event: Event) => void) | null;
};

export default function SpeakNumberGuess() {
  const [randomNum, setRandomNum] = useState<number>(0);
  const [message, setMessage] = useState<string>('');
  const [userGuess, setUserGuess] = useState<string>('');
  const [gameOver, setGameOver] = useState<boolean>(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  // Initialize random number
  useEffect(() => {
    const num = Math.floor(Math.random() * 100) + 1;
    setRandomNum(num);
    console.log('Number:', num);
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Use type assertion for the window object
    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setMessage('Speech recognition is not supported in your browser.');
      return;
    }

    const recognition = new SpeechRecognition() as SpeechRecognitionInstance;
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      handleSpeech(transcript);
    };

    recognition.onend = () => {
      if (!gameOver && recognitionRef.current) {
        recognitionRef.current.start();
      }
    };

    recognition.start();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [gameOver]);

  const handleSpeech = useCallback((transcript: string) => {
    setUserGuess(transcript);
    checkNumber(transcript);
  }, [randomNum]);

  const checkNumber = useCallback((msg: string) => {
    const num = +msg;

    // Check if valid number
    if (Number.isNaN(num)) {
      setMessage(prev => `${prev ? prev + ' ' : ''}That is not a valid number`);
      return;
    }

    // Check in range
    if (num > 100 || num < 1) {
      setMessage(prev => `${prev ? prev + ' ' : ''}Number must be between 1 and 100`);
      return;
    }

    // Check number
    if (num === randomNum) {
      setGameOver(true);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } else if (num > randomNum) {
      setMessage(prev => `${prev ? prev + ' ' : ''}GO LOWER`);
    } else {
      setMessage(prev => `${prev ? prev + ' ' : ''}GO HIGHER`);
    }
  }, [randomNum]);

  const handlePlayAgain = () => {
    const num = Math.floor(Math.random() * 100) + 1;
    setRandomNum(num);
    setMessage('');
    setUserGuess('');
    setGameOver(false);
    
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  if (gameOver) {
    return (
      <div style={styles.container}>
        <h2 style={styles.gameOverTitle}>
          Congrats! You have guessed the number! <br /><br />
          It was {randomNum}
        </h2>
        <button 
          onClick={handlePlayAgain} 
          style={styles.playAgainButton}
          className="play-again"
        >
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Image 
        src="/img/mic.png" 
        alt="Speak" 
        width={100}
        height={100}
        style={styles.micImage}
      />

      <h1 style={styles.title}>Guess a Number Between 1 - 100</h1>
      <h3 style={styles.subtitle}>Speak the number into your microphone</h3>

      <div style={styles.messageContainer} className="msg">
        {userGuess && (
          <>
            <div>You said:</div>
            <span style={styles.guessBox} className="box">{userGuess}</span>
          </>
        )}
        {message && (
          <div style={styles.feedback}>{message}</div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: '#2f3542 url("/bg.jpg") no-repeat left center/cover',
    color: '#fff',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center' as const,
    margin: 0,
    fontFamily: 'Arial, Helvetica, sans-serif',
    padding: '20px',
  },
  micImage: {
    marginBottom: '20px',
  },
  title: {
    marginBottom: '10px',
    fontSize: '2rem',
  },
  subtitle: {
    marginBottom: '30px',
    fontSize: '1.2rem',
  },
  messageContainer: {
    fontSize: '1.5em',
    marginTop: '40px',
    minHeight: '120px',
  },
  guessBox: {
    border: '1px solid #dedede',
    display: 'inline-block',
    fontSize: '30px',
    margin: '20px',
    padding: '10px',
  },
  feedback: {
    marginTop: '10px',
    fontSize: '1.2rem',
  },
  gameOverTitle: {
    fontSize: '2rem',
    marginBottom: '30px',
  },
  playAgainButton: {
    padding: '8px 15px',
    border: 0,
    background: '#f4f4f4',
    borderRadius: '5px',
    marginTop: '10px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
};