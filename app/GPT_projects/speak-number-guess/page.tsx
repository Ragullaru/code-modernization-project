"use client";

import React, { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
  }
}

type SupportedSpeechRecognition = {
  start: () => void;
  stop: () => void;
  addEventListener: (type: string, listener: (e: any) => void) => void;
  removeEventListener: (type: string, listener: (e: any) => void) => void;
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
};

const getRandomNumber = () => Math.floor(Math.random() * 100) + 1;

const SpeakNumberGuessPage: React.FC = () => {
  const [randomNum, setRandomNum] = useState<number | null>(null);
  const [spokenText, setSpokenText] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [srSupported, setSrSupported] = useState<boolean | null>(null);

  const recognitionRef = useRef<SupportedSpeechRecognition | null>(null);
  const gameWonRef = useRef<boolean>(false);

  // Initialize random number and speech recognition
  useEffect(() => {
    setRandomNum(getRandomNumber());

    if (typeof window === "undefined") {
      return;
    }

    const SpeechRecognitionCtor =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      setSrSupported(false);
      return;
    }

    setSrSupported(true);

    const recognition: SupportedSpeechRecognition = new SpeechRecognitionCtor();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    const handleResult = (e: any) => {
      const transcript = e.results[0][0].transcript as string;
      handleSpokenInput(transcript);
    };

    const handleEnd = () => {
      if (!gameWonRef.current) {
        recognition.start();
      }
    };

    recognition.addEventListener("result", handleResult);
    recognition.addEventListener("end", handleEnd);

    recognitionRef.current = recognition;
    recognition.start();

    return () => {
      recognition.removeEventListener("result", handleResult);
      recognition.removeEventListener("end", handleEnd);
      try {
        recognition.stop();
      } catch {
        // ignore stop errors on unmount
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSpokenInput = (msg: string) => {
    setSpokenText(msg);

    setMessages((prev) => {
      const updated = [...prev];
      // We will add validation messages and hints after the "You said" line
      const newMessages: string[] = [];

      const num = Number(msg);

      if (Number.isNaN(num)) {
        newMessages.push("That is not a valid number");
      } else if (num < 1 || num > 100) {
        newMessages.push("Number must be between 1 and 100");
      } else if (randomNum !== null) {
        if (num === randomNum) {
          setGameWon(true);
          gameWonRef.current = true;
        } else if (num > randomNum) {
          newMessages.push("GO LOWER");
        } else {
          newMessages.push("GO HIGHER");
        }
      }

      return [...updated, ...newMessages];
    });
  };

  const handlePlayAgain = () => {
    const newNum = getRandomNumber();
    setRandomNum(newNum);
    setSpokenText("");
    setMessages([]);
    setGameWon(false);
    gameWonRef.current = false;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch {
        // ignore start errors if already running
      }
    }
  };

  const renderGameContent = () => {
    if (gameWon && randomNum !== null) {
      return (
        <>
          <h2>
            Congrats! You have guessed the number!
            <br />
            <br />
            It was {randomNum}
          </h2>
          <button className="play-again" onClick={handlePlayAgain}>
            Play Again
          </button>
        </>
      );
    }

    return (
      <>
        {/* Simple inline mic icon instead of external image for single file */}
        <div className="mic-icon" aria-hidden="true">
          🎤
        </div>

        <h1>Guess a Number Between 1 - 100</h1>
        <h3>Speak the number into your microphone</h3>

        <div className="msg">
          {spokenText && (
            <>
              <div>You said:</div>
              <span className="box">{spokenText}</span>
            </>
          )}
          {messages.map((m, idx) => (
            <div key={idx}>{m}</div>
          ))}
        </div>
      </>
    );
  };

  return (
    <main className="page">
      {srSupported === false && (
        <p>
          Your browser does not support the Web Speech API. Please try a
          different browser to play this game.
        </p>
      )}
      {srSupported !== false && renderGameContent()}

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;
          margin: 0;
          padding: 0;
          font-family: Arial, Helvetica, sans-serif;
          background: #2f3542 radial-gradient(circle at top, #57606f, #2f3542);
          color: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        h1,
        h3 {
          margin-bottom: 0;
        }

        p {
          line-height: 1.5;
          margin: 0;
        }

        .mic-icon {
          font-size: 72px;
          margin-bottom: 20px;
        }

        .play-again {
          padding: 8px 15px;
          border: 0;
          background: #f4f4f4;
          border-radius: 5px;
          margin-top: 10px;
          cursor: pointer;
        }

        .play-again:hover {
          background: #e0e0e0;
        }

        .msg {
          font-size: 1.5em;
          margin-top: 40px;
        }

        .box {
          border: 1px solid #dedede;
          display: inline-block;
          font-size: 30px;
          margin: 20px;
          padding: 10px;
        }
      `}</style>
    </main>
  );
};

export default SpeakNumberGuessPage;
