"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function SpeakNumberGuess() {
  const [randomNum] = useState(() => Math.floor(Math.random() * 100) + 1);
  const [message, setMessage] = useState<string>("");
  const [feedback, setFeedback] = useState<string[]>([]);
  const [gameWon, setGameWon] = useState(false);
  const [winningNumber, setWinningNumber] = useState<number | null>(null);
  const [recognitionSupported, setRecognitionSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    console.log("Number:", randomNum);

    // Check if speech recognition is supported
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setRecognitionSupported(false);
        return;
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      // Capture user speak
      recognition.addEventListener("result", (e: any) => {
        const msg = e.results[0][0].transcript;
        writeMessage(msg);
        checkNumber(msg);
      });

      // Restart recognition when it ends
      recognition.addEventListener("end", () => {
        if (!gameWon && recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (err) {
            console.error("Recognition restart error:", err);
          }
        }
      });

      recognition.addEventListener("error", (e: any) => {
        console.error("Speech recognition error:", e.error);
        if (e.error !== "aborted" && e.error !== "no-speech") {
          setTimeout(() => {
            if (!gameWon && recognitionRef.current) {
              try {
                recognitionRef.current.start();
              } catch (err) {
                console.error("Recognition restart error:", err);
              }
            }
          }, 1000);
        }
      });

      // Start recognition
      try {
        recognition.start();
      } catch (err) {
        console.error("Recognition start error:", err);
      }

      return () => {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
          recognitionRef.current = null;
        }
      };
    }
  }, [randomNum, gameWon]);

  const writeMessage = (msg: string) => {
    setMessage(msg);
    setFeedback([]);
  };

  const checkNumber = (msg: string) => {
    const num = +msg;
    const newFeedback: string[] = [];

    // Check if valid number
    if (Number.isNaN(num)) {
      newFeedback.push("That is not a valid number");
      setFeedback(newFeedback);
      return;
    }

    // Check in range
    if (num > 100 || num < 1) {
      newFeedback.push("Number must be between 1 and 100");
      setFeedback(newFeedback);
      return;
    }

    // Check number
    if (num === randomNum) {
      setGameWon(true);
      setWinningNumber(num);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } else if (num > randomNum) {
      newFeedback.push("GO LOWER");
      setFeedback(newFeedback);
    } else {
      newFeedback.push("GO HIGHER");
      setFeedback(newFeedback);
    }
  };

  const playAgain = () => {
    window.location.reload();
  };

  if (!recognitionSupported) {
    return (
      <div style={styles.body}>
        <h1>Speech Recognition Not Supported</h1>
        <p>
          Your browser does not support the Web Speech API. Please try Chrome or
          Edge.
        </p>
      </div>
    );
  }

  if (gameWon) {
    return (
      <div style={styles.body}>
        <h2>
          Congrats! You have guessed the number!
          <br />
          <br />
          It was {winningNumber}
        </h2>
        <button style={styles.playAgain} onClick={playAgain}>
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div style={styles.body}>
      <div style={styles.micContainer}>
        <svg
          width="100"
          height="100"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={styles.micIcon}
        >
          <path
            d="M12 14C13.66 14 15 12.66 15 11V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V11C9 12.66 10.34 14 12 14Z"
            fill="white"
          />
          <path
            d="M17 11C17 13.76 14.76 16 12 16C9.24 16 7 13.76 7 11H5C5 14.53 7.61 17.43 11 17.92V21H13V17.92C16.39 17.43 19 14.53 19 11H17Z"
            fill="white"
          />
        </svg>
      </div>

      <h1 style={styles.h1}>Guess a Number Between 1 - 100</h1>

      <h3 style={styles.h3}>Speak the number into your microphone</h3>

      <div style={styles.msg}>
        {message && (
          <>
            <div>You said:</div>
            <span style={styles.box}>{message}</span>
          </>
        )}
        {feedback.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  body: {
    background: "#2f3542",
    backgroundImage:
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    margin: 0,
    fontFamily: "Arial, Helvetica, sans-serif",
    padding: "20px",
  },
  micContainer: {
    marginBottom: "20px",
  },
  micIcon: {
    filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))",
  },
  h1: {
    marginBottom: 0,
    fontSize: "2rem",
  },
  h3: {
    marginBottom: 0,
    marginTop: "10px",
    fontWeight: "normal",
  },
  playAgain: {
    padding: "8px 15px",
    border: 0,
    background: "#f4f4f4",
    borderRadius: "5px",
    marginTop: "10px",
    cursor: "pointer",
    fontSize: "16px",
  },
  msg: {
    fontSize: "1.5em",
    marginTop: "40px",
  },
  box: {
    border: "1px solid #dedede",
    display: "inline-block",
    fontSize: "30px",
    margin: "20px",
    padding: "10px",
    borderRadius: "5px",
    background: "rgba(255, 255, 255, 0.1)",
  },
};