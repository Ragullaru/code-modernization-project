"use client";

import React, { useEffect, useState } from "react";
import Head from "next/head";

type DataItem = {
  image: string;
  text: string;
};

const DATA: DataItem[] = [
  {
    image: "/img/drink.jpg",
    text: "I'm Thirsty",
  },
  {
    image: "/img/food.jpg",
    text: "I'm Hungry",
  },
  {
    image: "/img/tired.jpg",
    text: "I'm Tired",
  },
  {
    image: "/img/hurt.jpg",
    text: "I'm Hurt",
  },
  {
    image: "/img/happy.jpg",
    text: "I'm Happy",
  },
  {
    image: "/img/angry.jpg",
    text: "I'm Angry",
  },
  {
    image: "/img/sad.jpg",
    text: "I'm Sad",
  },
  {
    image: "/img/scared.jpg",
    text: "I'm Scared",
  },
  {
    image: "/img/outside.jpg",
    text: "I Want To Go Outside",
  },
  {
    image: "/img/home.jpg",
    text: "I Want To Go Home",
  },
  {
    image: "/img/school.jpg",
    text: "I Want To Go To School",
  },
  {
    image: "/img/grandma.jpg",
    text: "I Want To Go To Grandmas",
  },
];

const SpeechTextReaderPage: React.FC = () => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>("");
  const [customText, setCustomText] = useState<string>("");
  const [showTextBox, setShowTextBox] = useState<boolean>(false);
  const [activeBoxIndex, setActiveBoxIndex] = useState<number | null>(null);

  // Load voices from Web Speech API
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("speechSynthesis" in window)) return;

    const synth = window.speechSynthesis;

    const loadVoices = () => {
      const loadedVoices = synth.getVoices();
      if (loadedVoices.length > 0) {
        setVoices(loadedVoices);
        // Default to the first voice if none selected yet
        if (!selectedVoiceName) {
          setSelectedVoiceName(loadedVoices[0].name);
        }
      }
    };

    loadVoices();

    synth.addEventListener("voiceschanged", loadVoices);
    return () => {
      synth.removeEventListener("voiceschanged", loadVoices);
    };
  }, [selectedVoiceName]);

  const speak = (text: string) => {
    if (typeof window === "undefined") return;
    if (!("speechSynthesis" in window)) return;
    if (!text.trim()) return;

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find((v) => v.name === selectedVoiceName);
    if (voice) {
      utterance.voice = voice;
    }

    window.speechSynthesis.speak(utterance);
  };

  const handleBoxClick = (item: DataItem, index: number) => {
    speak(item.text);
    setActiveBoxIndex(index);
    window.setTimeout(() => setActiveBoxIndex(null), 800);
  };

  const handleToggleTextBox = () => {
    setShowTextBox((prev) => !prev);
  };

  const handleCloseTextBox = () => {
    setShowTextBox(false);
  };

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVoiceName(e.target.value);
  };

  const handleReadCustomText = () => {
    speak(customText);
  };

  return (
    <>
      <Head>
        <title>Speech Text Reader</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Google Font from original project */}
        <link
          href="https://fonts.googleapis.com/css?family=Lato&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="container">
        <h1>Speech Text Reader</h1>
        <button
          id="toggle"
          className="btn btn-toggle"
          type="button"
          onClick={handleToggleTextBox}
        >
          Toggle Text Box
        </button>

        <div
          id="text-box"
          className={`text-box ${showTextBox ? "show" : ""}`}
        >
          <div
            id="close"
            className="close"
            onClick={handleCloseTextBox}
            role="button"
            aria-label="Close text box"
          >
            X
          </div>
          <h3>Choose Voice</h3>
          <select
            id="voices"
            value={selectedVoiceName}
            onChange={handleVoiceChange}
          >
            {voices.map((voice) => (
              <option key={voice.name} value={voice.name}>
                {voice.name} {voice.lang}
              </option>
            ))}
          </select>
          <textarea
            id="text"
            placeholder="Enter text to read..."
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
          />
          <button
            className="btn"
            id="read"
            type="button"
            onClick={handleReadCustomText}
          >
            Read Text
          </button>
        </div>

        <main>
          {DATA.map((item, index) => (
            <div
              key={item.text}
              className={`box ${activeBoxIndex === index ? "active" : ""}`}
              onClick={() => handleBoxClick(item, index)}
            >
              <img src={item.image} alt={item.text} />
              <p className="info">{item.text}</p>
            </div>
          ))}
        </main>
      </div>

      {/* Global styles from original style.css */}
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
          background: #ffefea;
          font-family: "Lato", sans-serif;
          min-height: 100vh;
          margin: 0;
        }

        h1 {
          text-align: center;
        }

        .container {
          margin: auto;
          padding: 20px;
        }

        .btn {
          cursor: pointer;
          background-color: darksalmon;
          border: 0;
          border-radius: 4px;
          color: #fff;
          font-size: 16px;
          padding: 8px;
        }

        .btn:active {
          transform: scale(0.98);
        }

        .btn:focus,
        select:focus {
          outline: 0;
        }

        .btn-toggle {
          display: block;
          margin: auto;
          margin-bottom: 20px;
        }

        .text-box {
          width: 70%;
          position: absolute;
          top: 30%;
          left: 50%;
          transform: translate(-50%, -800px);
          background-color: #333;
          color: #fff;
          padding: 20px;
          border-radius: 5px;
          transition: all 1s ease-in-out;
          z-index: 10;
        }

        .text-box.show {
          transform: translate(-50%, 0);
        }

        .text-box select {
          background-color: darksalmon;
          border: 0;
          color: #fff;
          font-size: 12px;
          height: 30px;
          width: 100%;
        }

        .text-box textarea {
          border: 1px #dadada solid;
          border-radius: 4px;
          font-size: 16px;
          padding: 8px;
          margin: 15px 0;
          width: 100%;
          height: 150px;
        }

        .text-box .btn {
          width: 100%;
        }

        .text-box .close {
          float: right;
          text-align: right;
          cursor: pointer;
        }

        main {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-gap: 10px;
        }

        .box {
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          border-radius: 5px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: box-shadow 0.2s ease-out;
        }

        .box.active {
          box-shadow: 0 0 10px 5px darksalmon;
        }

        .box img {
          width: 100%;
          object-fit: cover;
          height: 200px;
        }

        .box .info {
          background-color: darksalmon;
          color: #fff;
          font-size: 18px;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin: 0;
          padding: 10px;
          text-align: center;
          height: 100%;
        }

        @media (max-width: 1100px) {
          main {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 760px) {
          main {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 500px) {
          main {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
};

export default SpeechTextReaderPage;
