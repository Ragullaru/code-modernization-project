"use client";

import React, { useEffect, useState } from "react";

const WORDS = ["application", "programming", "interface", "wizard"];

const getRandomWord = () => WORDS[Math.floor(Math.random() * WORDS.length)];

const HangmanPage: React.FC = () => {
  const [selectedWord, setSelectedWord] = useState<string>(() => getRandomWord());
  const [correctLetters, setCorrectLetters] = useState<string[]>([]);
  const [wrongLetters, setWrongLetters] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [finalMessage, setFinalMessage] = useState<string>("");
  const [finalMessageRevealWord, setFinalMessageRevealWord] = useState<string>("");
  const [notificationVisible, setNotificationVisible] = useState<boolean>(false);

  const errors = wrongLetters.length;
  const maxErrors = 6; // number of drawable figure parts

  const hasWon = React.useMemo(() => {
    const uniqueLetters = Array.from(new Set(selectedWord.split("")));
    return uniqueLetters.every((letter) => correctLetters.includes(letter));
  }, [selectedWord, correctLetters]);

  const hasLost = errors === maxErrors;

  // Update game end states when letters change
  useEffect(() => {
    if (hasWon && !showPopup) {
      setFinalMessage("Congratulations! You won! 😃");
      setFinalMessageRevealWord("");
      setShowPopup(true);
    } else if (hasLost && !showPopup) {
      setFinalMessage("Unfortunately you lost. 😕");
      setFinalMessageRevealWord(`...the word was: ${selectedWord}`);
      setShowPopup(true);
    }
  }, [hasWon, hasLost, selectedWord, showPopup]);

  // Show notification for duplicate letter
  const showNotification = () => {
    setNotificationVisible(true);
    setTimeout(() => {
      setNotificationVisible(false);
    }, 2000);
  };

  // Keyboard input listener
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (showPopup) return;

      const letter = e.key.toLowerCase();

      if (!/^[a-z]$/.test(letter)) return;

      if (selectedWord.includes(letter)) {
        if (!correctLetters.includes(letter)) {
          setCorrectLetters((prev) => [...prev, letter]);
        } else {
          showNotification();
        }
      } else {
        if (!wrongLetters.includes(letter)) {
          setWrongLetters((prev) => [...prev, letter]);
        } else {
          showNotification();
        }
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [selectedWord, correctLetters, wrongLetters, showPopup]);

  const handlePlayAgain = () => {
    setCorrectLetters([]);
    setWrongLetters([]);
    setSelectedWord(getRandomWord());
    setShowPopup(false);
    setFinalMessage("");
    setFinalMessageRevealWord("");
  };

  const isPartVisible = (index: number) => errors > index;

  return (
    <>
      <div className="app-root">
        <h1>Hangman</h1>
        <p>Find the hidden word - Enter a letter</p>

        <div className="game-container">
          <svg height="250" width="200" className="figure-container">
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
              className={`figure-part ${isPartVisible(0) ? "visible" : ""}`}
            />
            {/* Body */}
            <line
              x1="140"
              y1="90"
              x2="140"
              y2="150"
              className={`figure-part ${isPartVisible(1) ? "visible" : ""}`}
            />
            {/* Arms */}
            <line
              x1="140"
              y1="120"
              x2="120"
              y2="100"
              className={`figure-part ${isPartVisible(2) ? "visible" : ""}`}
            />
            <line
              x1="140"
              y1="120"
              x2="160"
              y2="100"
              className={`figure-part ${isPartVisible(3) ? "visible" : ""}`}
            />
            {/* Legs */}
            <line
              x1="140"
              y1="150"
              x2="120"
              y2="180"
              className={`figure-part ${isPartVisible(4) ? "visible" : ""}`}
            />
            <line
              x1="140"
              y1="150"
              x2="160"
              y2="180"
              className={`figure-part ${isPartVisible(5) ? "visible" : ""}`}
            />
          </svg>

          <div className="wrong-letters-container">
            <div id="wrong-letters">
              {wrongLetters.length > 0 && <p>Wrong</p>}
              {wrongLetters.map((letter) => (
                <span key={letter}>{letter}</span>
              ))}
            </div>
          </div>

          <div className="word" id="word">
            {selectedWord.split("").map((letter, index) => (
              <span key={`${letter}-${index}`} className="letter">
                {correctLetters.includes(letter) ? letter : ""}
              </span>
            ))}
          </div>
        </div>

        {/* Popup container */}
        <div
          id="popup-container"
          className={`popup-container ${showPopup ? "show" : ""}`}
        >
          <div className="popup">
            <h2 id="final-message">{finalMessage}</h2>
            <h3 id="final-message-reveal-word">{finalMessageRevealWord}</h3>
            <button id="play-button" onClick={handlePlayAgain}>
              Play Again
            </button>
          </div>
        </div>

        {/* Notification */}
        <div
          id="notification-container"
          className={`notification-container ${
            notificationVisible ? "show" : ""
          }`}
        >
          <p>You have already entered this letter</p>
        </div>
      </div>

      {/* Styles, adapted from original style.css */}
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
          background-color: #34495e;
          color: #fff;
          font-family: Arial, Helvetica, sans-serif;
          margin: 0;
          overflow: hidden;
        }

        .app-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 80vh;
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

        .figure-part {
          display: none;
        }

        .figure-part.visible {
          display: block;
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
          display: none;
          align-items: center;
          justify-content: center;
        }

        .popup-container.show {
          display: flex;
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
          left: 50%;
          transform: translateX(-50%);
          transition: transform 0.3s ease-in-out;
        }

        .notification-container p {
          margin: 0;
        }

        .notification-container.show {
          transform: translate(-50%, -50px);
        }
      `}</style>
    </>
  );
};

export default HangmanPage;
