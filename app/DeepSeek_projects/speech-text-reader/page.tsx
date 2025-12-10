'use client';

import { useState, useEffect, useRef } from 'react';

interface SpeechBox {
  image: string;
  text: string;
}

const data: SpeechBox[] = [
  { image: '/img/drink.jpg', text: "I'm Thirsty" },
  { image: '/img/food.jpg', text: "I'm Hungry" },
  { image: '/img/tired.jpg', text: "I'm Tired" },
  { image: '/img/hurt.jpg', text: "I'm Hurt" },
  { image: '/img/happy.jpg', text: "I'm Happy" },
  { image: '/img/angry.jpg', text: "I'm Angry" },
  { image: '/img/sad.jpg', text: "I'm Sad" },
  { image: '/img/scared.jpg', text: "I'm Scared" },
  { image: '/img/outside.jpg', text: 'I Want To Go Outside' },
  { image: '/img/home.jpg', text: 'I Want To Go Home' },
  { image: '/img/school.jpg', text: 'I Want To Go To School' },
  { image: '/img/grandma.jpg', text: 'I Want To Go To Grandmas' }
];

interface Voice {
  name: string;
  lang: string;
}

export default function SpeechTextReader() {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [customText, setCustomText] = useState<string>('');
  const [showTextBox, setShowTextBox] = useState<boolean>(false);
  const [activeBox, setActiveBox] = useState<number | null>(null);
  
  const messageRef = useRef<SpeechSynthesisUtterance | null>(null);
  const speechSynth = typeof window !== 'undefined' ? window.speechSynthesis : null;

  useEffect(() => {
    if (!speechSynth) return;

    const loadVoices = () => {
      const availableVoices = speechSynth.getVoices();
      const voiceList = availableVoices.map(voice => ({
        name: voice.name,
        lang: voice.lang
      }));
      setVoices(voiceList);
      if (voiceList.length > 0 && !selectedVoice) {
        setSelectedVoice(voiceList[0].name);
      }
    };

    loadVoices();
    speechSynth.addEventListener('voiceschanged', loadVoices);

    messageRef.current = new SpeechSynthesisUtterance();

    return () => {
      speechSynth.removeEventListener('voiceschanged', loadVoices);
      speechSynth.cancel();
    };
  }, [speechSynth, selectedVoice]);

  const setTextMessage = (text: string) => {
    if (messageRef.current) {
      messageRef.current.text = text;
    }
  };

  const speakText = () => {
    if (!speechSynth || !messageRef.current) return;

    const selectedVoiceObj = speechSynth
      .getVoices()
      .find(voice => voice.name === selectedVoice);
    
    if (selectedVoiceObj && messageRef.current) {
      messageRef.current.voice = selectedVoiceObj;
    }

    speechSynth.speak(messageRef.current);
  };

  const handleBoxClick = (text: string, index: number) => {
    setTextMessage(text);
    speakText();
    setActiveBox(index);
    setTimeout(() => setActiveBox(null), 800);
  };

  const handleReadCustomText = () => {
    if (!customText.trim()) return;
    setTextMessage(customText);
    speakText();
  };

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVoice(e.target.value);
  };

  return (
    <div className="container">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css?family=Lato');
        
        * {
          box-sizing: border-box;
        }
        
        body {
          background: #ffefea;
          font-family: 'Lato', sans-serif;
          min-height: 100vh;
          margin: 0;
        }
        
        h1 {
          text-align: center;
        }
        
        .container {
          margin: auto;
          padding: 20px;
          max-width: 1200px;
        }
        
        .btn {
          cursor: pointer;
          background-color: darksalmon;
          border: 0;
          border-radius: 4px;
          color: #fff;
          font-size: 16px;
          padding: 8px;
          transition: transform 0.1s;
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
          position: fixed;
          top: 30%;
          left: 50%;
          transform: translate(-50%, -800px);
          background-color: #333;
          color: #fff;
          padding: 20px;
          border-radius: 5px;
          transition: all 1s ease-in-out;
          z-index: 1000;
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
          margin-bottom: 15px;
        }
        
        .text-box textarea {
          border: 1px #dadada solid;
          border-radius: 4px;
          font-size: 16px;
          padding: 8px;
          margin: 15px 0;
          width: 100%;
          height: 150px;
          font-family: inherit;
        }
        
        .text-box .btn {
          width: 100%;
        }
        
        .text-box .close {
          float: right;
          text-align: right;
          cursor: pointer;
          font-size: 20px;
          line-height: 1;
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
          
          .text-box {
            width: 90%;
          }
        }
        
        @media (max-width: 500px) {
          main {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <h1>Speech Text Reader</h1>
      
      <button 
        className="btn btn-toggle" 
        onClick={() => setShowTextBox(!showTextBox)}
      >
        Toggle Text Box
      </button>
      
      <div className={`text-box ${showTextBox ? 'show' : ''}`}>
        <div className="close" onClick={() => setShowTextBox(false)}>X</div>
        <h3>Choose Voice</h3>
        <select 
          id="voices" 
          value={selectedVoice} 
          onChange={handleVoiceChange}
        >
          {voices.map((voice, index) => (
            <option key={index} value={voice.name}>
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
        <button className="btn" id="read" onClick={handleReadCustomText}>
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
            <img src={item.image} alt={item.text} />
            <p className="info">{item.text}</p>
          </div>
        ))}
      </main>
    </div>
  );
}