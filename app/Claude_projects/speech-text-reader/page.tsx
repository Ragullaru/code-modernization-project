'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function SpeechTextReader() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [textBoxVisible, setTextBoxVisible] = useState(false);
  const [customText, setCustomText] = useState('');
  const [activeBox, setActiveBox] = useState<number | null>(null);
  const messageRef = useRef<SpeechSynthesisUtterance | null>(null);

  const data = [
    {
      image: '/img/drink.jpg',
      text: "I'm Thirsty"
    },
    {
      image: '/img/food.jpg',
      text: "I'm Hungry"
    },
    {
      image: '/img/tired.jpg',
      text: "I'm Tired"
    },
    {
      image: '/img/hurt.jpg',
      text: "I'm Hurt"
    },
    {
      image: '/img/happy.jpg',
      text: "I'm Happy"
    },
    {
      image: '/img/angry.jpg',
      text: "I'm Angry"
    },
    {
      image: '/img/sad.jpg',
      text: "I'm Sad"
    },
    {
      image: '/img/scared.jpg',
      text: "I'm Scared"
    },
    {
      image: '/img/outside.jpg',
      text: 'I Want To Go Outside'
    },
    {
      image: '/img/home.jpg',
      text: 'I Want To Go Home'
    },
    {
      image: '/img/school.jpg',
      text: 'I Want To Go To School'
    },
    {
      image: '/img/grandma.jpg',
      text: 'I Want To Go To Grandmas'
    }
  ];

  useEffect(() => {
    // Initialize speech synthesis utterance
    messageRef.current = new SpeechSynthesisUtterance();

    // Load voices
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0 && !selectedVoice) {
        setSelectedVoice(availableVoices[0]);
        if (messageRef.current) {
          messageRef.current.voice = availableVoices[0];
        }
      }
    };

    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, [selectedVoice]);

  const speakText = (text: string) => {
    if (messageRef.current) {
      messageRef.current.text = text;
      if (selectedVoice) {
        messageRef.current.voice = selectedVoice;
      }
      window.speechSynthesis.speak(messageRef.current);
    }
  };

  const handleBoxClick = (text: string, index: number) => {
    speakText(text);
    setActiveBox(index);
    setTimeout(() => setActiveBox(null), 800);
  };

  const handleReadText = () => {
    if (customText.trim()) {
      speakText(customText);
    }
  };

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const voice = voices.find(v => v.name === e.target.value);
    if (voice) {
      setSelectedVoice(voice);
      if (messageRef.current) {
        messageRef.current.voice = voice;
      }
    }
  };

  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css?family=Lato');

        * {
          box-sizing: border-box;
        }

        :global(body) {
          background: #ffefea;
          font-family: 'Lato', sans-serif;
          min-height: 100vh;
          margin: 0;
        }

        .container {
          margin: auto;
          padding: 20px;
        }

        h1 {
          text-align: center;
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

        .box-image {
          width: 100%;
          object-fit: cover;
          height: 200px;
          position: relative;
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

      <div className="container">
        <h1>Speech Text Reader</h1>
        <button
          className="btn btn-toggle"
          onClick={() => setTextBoxVisible(!textBoxVisible)}
        >
          Toggle Text Box
        </button>
        <div className={`text-box ${textBoxVisible ? 'show' : ''}`}>
          <div className="close" onClick={() => setTextBoxVisible(false)}>
            X
          </div>
          <h3>Choose Voice</h3>
          <select value={selectedVoice?.name || ''} onChange={handleVoiceChange}>
            {voices.map((voice) => (
              <option key={voice.name} value={voice.name}>
                {voice.name} {voice.lang}
              </option>
            ))}
          </select>
          <textarea
            placeholder="Enter text to read..."
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
          />
          <button className="btn" onClick={handleReadText}>
            Read Text
          </button>
        </div>
        <main>
          {data.map((item, index) => (
            <div
              key={index}
              className={`box ${activeBox === index ? 'active' : ''}`}
              onClick={() => handleBoxClick(item.text, index)}
            >
              <div className="box-image">
                <Image
                  src={item.image}
                  alt={item.text}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 500px) 100vw, (max-width: 760px) 50vw, (max-width: 1100px) 33vw, 25vw"
                />
              </div>
              <p className="info">{item.text}</p>
            </div>
          ))}
        </main>
      </div>
    </>
  );
}