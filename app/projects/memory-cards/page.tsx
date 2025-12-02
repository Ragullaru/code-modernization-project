"use client";

import Head from "next/head";
import { useEffect, useState } from "react";

type CardData = {
  question: string;
  answer: string;
};

const STORAGE_KEY = "cards";

const MemoryCardsPage = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [flippedIndices, setFlippedIndices] = useState<Set<number>>(
    () => new Set()
  );

  // Load cards from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: CardData[] = JSON.parse(stored);
        setCards(parsed);
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Persist cards to localStorage whenever they change
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    } catch {
      // ignore storage errors
    }
  }, [cards]);

  const handleNext = () => {
    if (cards.length === 0) return;
    setCurrentIndex((prev) => Math.min(prev + 1, cards.length - 1));
  };

  const handlePrev = () => {
    if (cards.length === 0) return;
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleToggleFlip = (index: number) => {
    setFlippedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const handleAddCard = () => {
    const question = newQuestion.trim();
    const answer = newAnswer.trim();

    if (!question || !answer) return;

    const newCard: CardData = { question, answer };
    const updated = [...cards, newCard];

    setCards(updated);
    setNewQuestion("");
    setNewAnswer("");
    setShowAddPanel(false);

    if (cards.length === 0) {
      setCurrentIndex(0);
    }
  };

  const handleClearCards = () => {
    setCards([]);
    setCurrentIndex(0);
    setFlippedIndices(new Set());
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  };

  const currentText =
    cards.length > 0 ? `${currentIndex + 1} / ${cards.length}` : "0 / 0";

  return (
    <>
      <Head>
        <title>Memory Cards</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Font Awesome 5 */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css"
          integrity="sha256-+N4/V/SbAFiW1MPBCXnfnP9QSN3+Keu+NlB+0ev/YKQ="
          crossOrigin="anonymous"
        />
      </Head>

      <button className="clear btn" onClick={handleClearCards}>
        <i className="fas fa-trash" /> Clear Cards
      </button>

      <h1>
        Memory Cards
        <button
          className="btn btn-small"
          onClick={() => setShowAddPanel(true)}
        >
          <i className="fas fa-plus" /> Add New Card
        </button>
      </h1>

      <div className="cards">
        {cards.map((card, index) => {
          let className = "card";
          if (index === currentIndex) {
            className += " active";
          } else if (index < currentIndex) {
            className += " left";
          }
          if (flippedIndices.has(index)) {
            className += " show-answer";
          }

          return (
            <div
              key={index}
              className={className}
              onClick={() => handleToggleFlip(index)}
            >
              <div className="inner-card">
                <div className="inner-card-front">
                  <p>{card.question}</p>
                </div>
                <div className="inner-card-back">
                  <p>{card.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="navigation">
        <button
          className="nav-button"
          onClick={handlePrev}
          disabled={cards.length <= 1 || currentIndex === 0}
        >
          <i className="fas fa-arrow-left" />
          <span>Prev</span>
        </button>

        <p className="nav-status">{currentText}</p>

        <button
          className="nav-button"
          onClick={handleNext}
          disabled={cards.length <= 1 || currentIndex === cards.length - 1}
        >
          <span>Next</span>
          <i className="fas fa-arrow-right" />
        </button>
      </div>

      <div className={`add-container ${showAddPanel ? "show" : ""}`}>
        <h1>
          Add New Card
          <button
            className="btn btn-small btn-ghost"
            onClick={() => setShowAddPanel(false)}
          >
            <i className="fas fa-times" />
          </button>
        </h1>

        <div className="form-group">
          <label htmlFor="question">Question</label>
          <textarea
            id="question"
            placeholder="Enter question..."
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="answer">Answer</label>
          <textarea
            id="answer"
            placeholder="Enter Answer..."
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
          />
        </div>

        <button className="btn" onClick={handleAddCard}>
          <i className="fas fa-plus" /> Add Card
        </button>
      </div>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css?family=Lato:300,500,700&display=swap");

        * {
          box-sizing: border-box;
        }

        html,
        body,
        #__next {
          height: 100%;
        }

        body {
          background-color: #fafafa;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
          overflow: hidden;
          font-family: "Lato", sans-serif;
          color: #111;
        }

        h1 {
          position: relative;
          color: #111;
        }

        h1 button {
          position: absolute;
          right: 0;
          transform: translate(120%, -50%);
          z-index: 2;
        }

        .btn {
          cursor: pointer;
          background-color: #fff;
          border: 1px solid #444;
          border-radius: 3px;
          font-size: 14px;
          margin-top: 20px;
          padding: 10px 15px;
          color: #111;
        }

        .btn-small {
          font-size: 12px;
          padding: 5px 10px;
        }

        .btn-ghost {
          border: 0;
          background-color: transparent;
          color: #111;
        }

        .clear {
          position: absolute;
          bottom: 30px;
          left: 30px;
        }

        .cards {
          perspective: 1000px;
          position: relative;
          height: 300px;
          width: 500px;
          max-width: 100%;
        }

        .card {
          position: absolute;
          opacity: 0;
          font-size: 1.5em;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          transform: translateX(50%) rotateY(-10deg);
          transition: transform 0.4s ease, opacity 0.4s ease;
        }

        .card.active {
          cursor: pointer;
          opacity: 1;
          z-index: 10;
          transform: translateX(0) rotateY(0deg);
        }

        .card.left {
          transform: translateX(-50%) rotateY(10deg);
        }

        .inner-card {
          box-shadow: 0 1px 10px rgba(0, 0, 0, 0.3);
          border-radius: 4px;
          height: 100%;
          width: 100%;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.4s ease;
          background: #fff;
          color: #111;
        }

        .card.show-answer .inner-card {
          transform: rotateX(180deg);
        }

        .inner-card-front,
        .inner-card-back {
          backface-visibility: hidden;
          position: absolute;
          top: 0;
          left: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          width: 100%;
          background: #fff;
          color: #111;
          padding: 20px;
          text-align: center;
        }

        .inner-card-front {
          transform: rotateX(0deg);
          z-index: 2;
        }

        .inner-card-back {
          transform: rotateX(180deg);
        }

        .inner-card-front::after,
        .inner-card-back::after {
          content: "\\f021  Flip";
          font-family: "Font Awesome 5 Free", Lato, sans-serif;
          position: absolute;
          top: 10px;
          right: 10px;
          font-weight: 900;
          font-size: 14px;
          color: #555;
        }

        .navigation {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin: 20px 0;
          color: #111;
        }

        .nav-status {
          margin: 0;
          font-size: 14px;
          min-width: 80px;
          text-align: center;
        }

        .nav-button {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 4px;
          border: 1px solid #444;
          background-color: #fff;
          color: #111;
          cursor: pointer;
          font-size: 14px;
        }

        .nav-button i {
          font-size: 14px;
        }

        .nav-button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .add-container {
          opacity: 0;
          z-index: -1;
          background-color: #f4f4f4;
          border-top: 2px solid #ddd;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 10px 0;
          position: absolute;
          top: 0;
          bottom: 0;
          width: 100%;
          transition: 0.3s ease;
          color: #111;
        }

        .add-container.show {
          opacity: 1;
          z-index: 2;
        }

        .form-group label {
          display: block;
          margin: 20px 0 10px;
          color: #111;
        }

        .form-group textarea {
          border: 1px solid #444;
          border-radius: 3px;
          font-size: 16px;
          padding: 12px;
          min-width: 500px;
          max-width: 100%;
          color: #111;
          background: #fff;
        }
      `}</style>
    </>
  );
};

export default MemoryCardsPage;
