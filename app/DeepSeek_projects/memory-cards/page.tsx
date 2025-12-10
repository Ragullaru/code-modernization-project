'use client';

import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTrash, 
  faPlus, 
  faTimes, 
  faArrowLeft, 
  faArrowRight,
  faRedo
} from '@fortawesome/free-solid-svg-icons';

interface CardData {
  question: string;
  answer: string;
}

export default function MemoryCards() {
  // State for cards data
  const [cardsData, setCardsData] = useState<CardData[]>([]);
  // State for current active card index
  const [currentActiveCard, setCurrentActiveCard] = useState(0);
  // State for showing/hiding add card form
  const [showAddForm, setShowAddForm] = useState(false);
  // State for new card form
  const [newCard, setNewCard] = useState({ question: '', answer: '' });
  // State for flipped cards
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  // Ref for card container
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  // Load cards from localStorage on component mount
  useEffect(() => {
    const savedCards = localStorage.getItem('cards');
    if (savedCards) {
      try {
        setCardsData(JSON.parse(savedCards));
      } catch (error) {
        console.error('Error parsing saved cards:', error);
        setCardsData([]);
      }
    }
  }, []);

  // Save cards to localStorage whenever cardsData changes
  useEffect(() => {
    localStorage.setItem('cards', JSON.stringify(cardsData));
  }, [cardsData]);

  // Handle next card navigation
  const handleNextCard = () => {
    if (currentActiveCard < cardsData.length - 1) {
      setCurrentActiveCard(prev => prev + 1);
    }
  };

  // Handle previous card navigation
  const handlePrevCard = () => {
    if (currentActiveCard > 0) {
      setCurrentActiveCard(prev => prev - 1);
    }
  };

  // Toggle card flip
  const toggleCardFlip = (index: number) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  // Handle adding new card
  const handleAddCard = () => {
    if (newCard.question.trim() && newCard.answer.trim()) {
      const updatedCards = [...cardsData, { ...newCard }];
      setCardsData(updatedCards);
      setNewCard({ question: '', answer: '' });
      setShowAddForm(false);
      // Set the new card as active
      setCurrentActiveCard(updatedCards.length - 1);
    }
  };

  // Handle clearing all cards
  const handleClearCards = () => {
    if (confirm('Are you sure you want to clear all cards?')) {
      setCardsData([]);
      setCurrentActiveCard(0);
      setFlippedCards(new Set());
      localStorage.removeItem('cards');
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setNewCard(prev => ({ ...prev, [id]: value }));
  };

  // CSS styles
  const styles = `
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
      min-height: 100vh;
      margin: 0;
      font-family: 'Lato', sans-serif;
      padding: 20px;
    }

    .container {
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
    }

    h1 {
      position: relative;
      text-align: center;
      margin-bottom: 40px;
    }

    h1 button {
      position: absolute;
      right: 0;
      top: 50%;
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
      transition: all 0.3s ease;
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

    .clear {
      position: fixed;
      bottom: 30px;
      left: 30px;
      z-index: 100;
    }

    .cards-container {
      perspective: 1000px;
      position: relative;
      height: 300px;
      width: 500px;
      max-width: 100%;
      margin: 0 auto;
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
      transition: transform 0.6s ease;
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
      padding: 40px;
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
      content: '↻ Flip';
      font-family: 'Lato', sans-serif;
      position: absolute;
      top: 10px;
      right: 10px;
      font-weight: bold;
      font-size: 14px;
      color: #ddd;
    }

    .navigation {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 40px 0;
      gap: 20px;
    }

    .navigation .nav-button {
      border: none;
      background-color: transparent;
      cursor: pointer;
      font-size: 20px;
      padding: 10px;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.3s ease;
    }

    .navigation .nav-button:hover {
      background-color: #f5f5f5;
    }

    .navigation p {
      margin: 0;
      font-size: 18px;
      min-width: 80px;
      text-align: center;
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
      padding: 40px 20px;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      transition: opacity 0.3s ease;
      pointer-events: none;
    }

    .add-container.show {
      opacity: 1;
      z-index: 1000;
      pointer-events: all;
    }

    .add-container h1 {
      margin-bottom: 30px;
    }

    .form-group {
      margin-bottom: 20px;
      width: 100%;
      max-width: 500px;
    }

    .form-group label {
      display: block;
      margin: 10px 0;
      font-weight: bold;
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

    .no-cards {
      text-align: center;
      color: #666;
      font-size: 18px;
      margin-top: 60px;
    }

    @media (max-width: 600px) {
      .cards-container {
        height: 250px;
      }
      
      .clear {
        position: relative;
        bottom: auto;
        left: auto;
        margin: 20px auto;
        display: block;
      }
      
      h1 button {
        position: relative;
        transform: none;
        margin-top: 10px;
        display: block;
        margin-left: auto;
        margin-right: auto;
      }
      
      .add-container {
        padding: 20px;
      }
    }
  `;

  return (
    <>
      <style jsx global>{styles}</style>
      
      <div className="container">
        {/* Clear Cards Button */}
        <button className="clear btn" onClick={handleClearCards}>
          <FontAwesomeIcon icon={faTrash} /> Clear Cards
        </button>

        {/* Header */}
        <h1>
          Memory Cards
          <button 
            className="btn btn-small" 
            onClick={() => setShowAddForm(true)}
          >
            <FontAwesomeIcon icon={faPlus} /> Add New Card
          </button>
        </h1>

        {/* Cards Container */}
        <div className="cards-container" ref={cardsContainerRef}>
          {cardsData.length === 0 ? (
            <div className="no-cards">
              <p>No cards yet. Add your first card!</p>
            </div>
          ) : (
            cardsData.map((card, index) => (
              <div
                key={index}
                className={`card ${
                  index === currentActiveCard ? 'active' : 
                  index < currentActiveCard ? 'left' : ''
                } ${flippedCards.has(index) ? 'show-answer' : ''}`}
                onClick={() => toggleCardFlip(index)}
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

        {/* Navigation */}
        {cardsData.length > 0 && (
          <div className="navigation">
            <button 
              className="nav-button" 
              onClick={handlePrevCard}
              disabled={currentActiveCard === 0}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            
            <p id="current">
              {cardsData.length > 0 
                ? `${currentActiveCard + 1}/${cardsData.length}`
                : '0/0'
              }
            </p>
            
            <button 
              className="nav-button" 
              onClick={handleNextCard}
              disabled={currentActiveCard === cardsData.length - 1}
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        )}

        {/* Add Card Form Overlay */}
        <div className={`add-container ${showAddForm ? 'show' : ''}`}>
          <h1>
            Add New Card
            <button 
              className="btn btn-small btn-ghost"
              onClick={() => setShowAddForm(false)}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </h1>

          <div className="form-group">
            <label htmlFor="question">Question</label>
            <textarea
              id="question"
              placeholder="Enter question..."
              value={newCard.question}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="answer">Answer</label>
            <textarea
              id="answer"
              placeholder="Enter answer..."
              value={newCard.answer}
              onChange={handleInputChange}
            />
          </div>

          <button className="btn" onClick={handleAddCard}>
            <FontAwesomeIcon icon={faPlus} /> Add Card
          </button>
        </div>
      </div>
    </>
  );
}