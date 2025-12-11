'use client';

import React, { useState, useEffect } from 'react';
import { Trash2, Plus, X, ArrowLeft, ArrowRight } from 'lucide-react';

interface Card {
  question: string;
  answer: string;
}

export default function MemoryCardsPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [currentActiveCard, setCurrentActiveCard] = useState(0);
  const [showAddContainer, setShowAddContainer] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

  // Load cards from localStorage on mount
  useEffect(() => {
    const storedCards = localStorage.getItem('cards');
    if (storedCards) {
      try {
        const parsedCards = JSON.parse(storedCards);
        setCards(Array.isArray(parsedCards) ? parsedCards : []);
      } catch (error) {
        setCards([]);
      }
    }
  }, []);

  // Save cards to localStorage whenever they change
  const saveCards = (newCards: Card[]) => {
    localStorage.setItem('cards', JSON.stringify(newCards));
    setCards(newCards);
  };

  const handleAddCard = () => {
    if (question.trim() && answer.trim()) {
      const newCard: Card = { question, answer };
      const newCards = [...cards, newCard];
      saveCards(newCards);
      setQuestion('');
      setAnswer('');
      setShowAddContainer(false);
      setCurrentActiveCard(newCards.length - 1);
    }
  };

  const handleClearCards = () => {
    if (confirm('Are you sure you want to clear all cards?')) {
      localStorage.clear();
      setCards([]);
      setCurrentActiveCard(0);
      setFlippedCards(new Set());
    }
  };

  const handlePrev = () => {
    setCurrentActiveCard((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentActiveCard((prev) => Math.min(cards.length - 1, prev + 1));
  };

  const toggleFlip = (index: number) => {
    setFlippedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const getCardClassName = (index: number): string => {
    if (index === currentActiveCard) return 'active';
    if (index < currentActiveCard) return 'left';
    return 'right';
  };

  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css?family=Lato:300,500,700&display=swap');

        * {
          box-sizing: border-box;
        }

        body {
          background-color: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
          overflow: hidden;
          font-family: 'Lato', sans-serif;
        }

        .container {
          background-color: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
          overflow: hidden;
          font-family: 'Lato', sans-serif;
          position: relative;
          width: 100%;
        }

        h1 {
          position: relative;
          font-weight: 500;
        }

        .header-button {
          position: absolute;
          right: 0;
          transform: translate(120%, -50%);
          z-index: 2;
        }

        .btn {
          cursor: pointer;
          background-color: #fff;
          border: 1px solid #aaa;
          border-radius: 3px;
          font-size: 14px;
          margin-top: 20px;
          padding: 10px 15px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .btn:hover {
          background-color: #f5f5f5;
        }

        .btn-small {
          font-size: 12px;
          padding: 5px 10px;
        }

        .btn-ghost {
          border: 0;
          background-color: transparent;
        }

        .btn-ghost:hover {
          background-color: rgba(0, 0, 0, 0.05);
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

        .card.right {
          transform: translateX(50%) rotateY(-10deg);
        }

        .inner-card {
          box-shadow: 0 1px 10px rgba(0, 0, 0, 0.3);
          border-radius: 4px;
          height: 100%;
          width: 100%;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.4s ease;
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
          padding: 20px;
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
          content: '↻  Flip';
          position: absolute;
          top: 10px;
          right: 10px;
          font-weight: bold;
          font-size: 16px;
          color: #ddd;
        }

        .navigation {
          display: flex;
          margin: 20px 0;
          align-items: center;
        }

        .navigation .nav-button {
          border: none;
          background-color: transparent;
          cursor: pointer;
          font-size: 16px;
          padding: 8px;
          border-radius: 4px;
          transition: background-color 0.2s;
        }

        .navigation .nav-button:hover {
          background-color: #f0f0f0;
        }

        .navigation .nav-button:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .navigation p {
          margin: 0 25px;
        }

        .add-container {
          opacity: 0;
          z-index: -1;
          background-color: #f0f0f0;
          border-top: 2px solid #eee;
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
        }

        .add-container.show {
          opacity: 1;
          z-index: 20;
        }

        .add-container h1 {
          margin: 10px 0;
        }

        .form-group {
          width: 100%;
          max-width: 500px;
          padding: 0 20px;
        }

        .form-group label {
          display: block;
          margin: 20px 0 10px;
          font-weight: 500;
        }

        .form-group textarea {
          border: 1px solid #aaa;
          border-radius: 3px;
          font-size: 16px;
          padding: 12px;
          width: 100%;
          min-height: 100px;
          font-family: 'Lato', sans-serif;
          resize: vertical;
        }

        .form-group textarea:focus {
          outline: none;
          border-color: #666;
        }

        .empty-state {
          text-align: center;
          color: #999;
          font-size: 1.2em;
        }
      `}</style>

      <div className="container">
        <button onClick={handleClearCards} className="clear btn">
          <Trash2 size={14} /> Clear Cards
        </button>

        <h1>
          Memory Cards
          <button onClick={() => setShowAddContainer(true)} className="btn btn-small header-button">
            <Plus size={14} /> Add New Card
          </button>
        </h1>

        <div className="cards">
          {cards.length === 0 ? (
            <div className="empty-state">
              <p>No cards yet. Add your first card!</p>
            </div>
          ) : (
            cards.map((card, index) => (
              <div
                key={index}
                className={`card ${getCardClassName(index)} ${
                  flippedCards.has(index) ? 'show-answer' : ''
                }`}
                onClick={() => index === currentActiveCard && toggleFlip(index)}
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
            ))
          )}
        </div>

        {cards.length > 0 && (
          <div className="navigation">
            <button
              onClick={handlePrev}
              className="nav-button"
              disabled={currentActiveCard === 0}
            >
              <ArrowLeft size={20} />
            </button>

            <p>
              {currentActiveCard + 1}/{cards.length}
            </p>

            <button
              onClick={handleNext}
              className="nav-button"
              disabled={currentActiveCard === cards.length - 1}
            >
              <ArrowRight size={20} />
            </button>
          </div>
        )}

        <div className={`add-container ${showAddContainer ? 'show' : ''}`}>
          <h1>
            Add New Card
            <button
              onClick={() => setShowAddContainer(false)}
              className="btn btn-small btn-ghost header-button"
            >
              <X size={14} />
            </button>
          </h1>

          <div className="form-group">
            <label htmlFor="question">Question</label>
            <textarea
              id="question"
              placeholder="Enter question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="answer">Answer</label>
            <textarea
              id="answer"
              placeholder="Enter Answer..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          </div>

          <button onClick={handleAddCard} className="btn">
            <Plus size={14} /> Add Card
          </button>
        </div>
      </div>
    </>
  );
}