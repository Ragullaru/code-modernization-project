"use client";

import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";

type Difficulty = "easy" | "medium" | "hard";

const WORDS = [
  "sigh",
  "tense",
  "airplane",
  "ball",
  "pies",
  "juice",
  "warlike",
  "bad",
  "north",
  "dependent",
  "steer",
  "silver",
  "highfalutin",
  "superficial",
  "quince",
  "eight",
  "feeble",
  "admit",
  "drag",
  "loving",
];

const INITIAL_TIME = 10;

const SpeedTyperPage: React.FC = () => {
  const [currentWord, setCurrentWord] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [time, setTime] = useState<number>(INITIAL_TIME);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [settingsOpen, setSettingsOpen] = useState<boolean>(true);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  // Load difficulty from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedDifficulty = window.localStorage.getItem("difficulty") as
      | Difficulty
      | null;
    if (storedDifficulty === "easy" || storedDifficulty === "medium" || storedDifficulty === "hard") {
      setDifficulty(storedDifficulty);
    }
  }, []);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Initialize first word
  useEffect(() => {
    setCurrentWord(getRandomWord());
  }, []);

  // Timer effect
  useEffect(() => {
    if (isGameOver) return;

    const intervalId = window.setInterval(() => {
      setTime(prevTime => {
        if (prevTime <= 1) {
          window.clearInterval(intervalId);
          setIsGameOver(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isGameOver]);

  function getRandomWord(): string {
    return WORDS[Math.floor(Math.random() * WORDS.length)];
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setInputValue(value);

    if (value === currentWord && !isGameOver) {
      // Correct word typed
      const nextWord = getRandomWord();
      setCurrentWord(nextWord);
      setScore(prev => prev + 1);
      setInputValue("");

      // Add time based on difficulty
      setTime(prevTime => {
        let increment = 0;
        if (difficulty === "hard") increment = 2;
        else if (difficulty === "medium") increment = 3;
        else increment = 5;
        return prevTime + increment;
      });

      // Keep focus on input
      inputRef.current?.focus();
    }
  }

  function handleToggleSettings() {
    setSettingsOpen(prev => !prev);
  }

  function handleDifficultyChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value as Difficulty;
    setDifficulty(value);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("difficulty", value);
    }
  }

  function handleReload() {
    // Simple reset to mimic location.reload behavior while staying in React
    setScore(0);
    setTime(INITIAL_TIME);
    setIsGameOver(false);
    setCurrentWord(getRandomWord());
    setInputValue("");
    inputRef.current?.focus();
  }

  return (
    <>
      <Head>
        <title>Speed Typer</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Font Awesome dependency from original app */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css"
          integrity="sha256-+N4/V/SbAFiW1MPBCXnfnP9QSN3+Keu+NlB+0ev/YKQ="
          crossOrigin="anonymous"
        />
      </Head>

      <button
        id="settings-btn"
        className="settings-btn"
        type="button"
        onClick={handleToggleSettings}
      >
        <i className="fas fa-cog" />
      </button>

      <div
        id="settings"
        className={`settings ${settingsOpen ? "" : "hide"}`}
      >
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
          type="text"
          id="text"
          autoComplete="off"
          placeholder="Type the word here..."
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
        />

        <p className="time-container">
          Time left: <span id="time">{time}s</span>
        </p>

        <p className="score-container">
          Score: <span id="score">{score}</span>
        </p>

        <div
          id="end-game-container"
          className="end-game-container"
          style={{ display: isGameOver ? "flex" : "none" }}
        >
          <h1>Time ran out</h1>
          <p>Your final score is {score}</p>
          <button type="button" onClick={handleReload}>
            Reload
          </button>
        </div>
      </div>

      {/* Global styles ported from original style.css */}
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
          z-index: 2;
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
          z-index: 3;
        }
      `}</style>
    </>
  );
};

export default SpeedTyperPage;
