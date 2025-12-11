'use client';

import { useEffect, useState } from 'react';

interface Movie {
  title: string;
  price: number;
}

const movies: Movie[] = [
  { title: 'Avengers: Endgame', price: 10 },
  { title: 'Joker', price: 12 },
  { title: 'Toy Story 4', price: 8 },
  { title: 'The Lion King', price: 9 },
];

// Initial seat layout: 6 rows, 8 seats each
// Occupied seats are marked with their row and seat indices
const initialOccupiedSeats = [
  { row: 1, seat: 3 },
  { row: 1, seat: 4 },
  { row: 2, seat: 6 },
  { row: 2, seat: 7 },
  { row: 4, seat: 3 },
  { row: 4, seat: 4 },
  { row: 5, seat: 4 },
  { row: 5, seat: 5 },
  { row: 5, seat: 6 },
];

const ROWS = 6;
const SEATS_PER_ROW = 8;

export default function MovieSeatBooking() {
  const [selectedMovieIndex, setSelectedMovieIndex] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedSeats = localStorage.getItem('selectedSeats');
    const savedMovieIndex = localStorage.getItem('selectedMovieIndex');
    const savedMoviePrice = localStorage.getItem('selectedMoviePrice');

    if (savedSeats) {
      try {
        const parsedSeats = JSON.parse(savedSeats);
        setSelectedSeats(parsedSeats);
      } catch (e) {
        console.error('Error parsing saved seats:', e);
      }
    }

    if (savedMovieIndex) {
      const index = parseInt(savedMovieIndex, 10);
      if (!isNaN(index) && index >= 0 && index < movies.length) {
        setSelectedMovieIndex(index);
      }
    }
  }, []);

  // Save to localStorage whenever selection changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('selectedSeats', JSON.stringify(selectedSeats));
      localStorage.setItem('selectedMovieIndex', selectedMovieIndex.toString());
      localStorage.setItem('selectedMoviePrice', movies[selectedMovieIndex].price.toString());
    }
  }, [selectedSeats, selectedMovieIndex, mounted]);

  const handleMovieChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMovieIndex(parseInt(e.target.value, 10));
  };

  const handleSeatClick = (seatIndex: number, isOccupied: boolean) => {
    if (isOccupied) return;

    setSelectedSeats(prev => {
      if (prev.includes(seatIndex)) {
        return prev.filter(index => index !== seatIndex);
      } else {
        return [...prev, seatIndex];
      }
    });
  };

  const isSeatOccupied = (row: number, seat: number): boolean => {
    return initialOccupiedSeats.some(
      occupied => occupied.row === row && occupied.seat === seat
    );
  };

  const getSeatIndex = (row: number, seat: number): number => {
    return row * SEATS_PER_ROW + seat;
  };

  const totalSeats = selectedSeats.length;
  const totalPrice = totalSeats * movies[selectedMovieIndex].price;

  return (
    <div className="page-container">
      <div className="movie-container">
        <label>Pick a movie:</label>
        <select id="movie" value={selectedMovieIndex} onChange={handleMovieChange}>
          {movies.map((movie, index) => (
            <option key={index} value={index}>
              {movie.title} (${movie.price})
            </option>
          ))}
        </select>
      </div>

      <ul className="showcase">
        <li>
          <div className="seat"></div>
          <small>N/A</small>
        </li>
        <li>
          <div className="seat selected"></div>
          <small>Selected</small>
        </li>
        <li>
          <div className="seat occupied"></div>
          <small>Occupied</small>
        </li>
      </ul>

      <div className="container">
        <div className="screen"></div>

        {Array.from({ length: ROWS }).map((_, rowIndex) => (
          <div key={rowIndex} className="row">
            {Array.from({ length: SEATS_PER_ROW }).map((_, seatIndex) => {
              const isOccupied = isSeatOccupied(rowIndex, seatIndex);
              const globalSeatIndex = getSeatIndex(rowIndex, seatIndex);
              const isSelected = selectedSeats.includes(globalSeatIndex);

              return (
                <div
                  key={seatIndex}
                  className={`seat ${isOccupied ? 'occupied' : ''} ${
                    isSelected ? 'selected' : ''
                  }`}
                  onClick={() => handleSeatClick(globalSeatIndex, isOccupied)}
                ></div>
              );
            })}
          </div>
        ))}
      </div>

      <p className="text">
        You have selected <span id="count">{totalSeats}</span> seats for a price of $
        <span id="total">{totalPrice}</span>
      </p>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css?family=Lato&display=swap');

        * {
          box-sizing: border-box;
        }

        .page-container {
          background-color: #242333;
          color: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          font-family: 'Lato', sans-serif;
          margin: 0;
          padding: 20px;
        }

        .movie-container {
          margin: 20px 0;
        }

        .movie-container select {
          background-color: #fff;
          border: 0;
          border-radius: 5px;
          font-size: 14px;
          margin-left: 10px;
          padding: 5px 15px 5px 15px;
          -moz-appearance: none;
          -webkit-appearance: none;
          appearance: none;
        }

        .container {
          perspective: 1000px;
          margin-bottom: 30px;
        }

        .seat {
          background-color: #444451;
          height: 12px;
          width: 15px;
          margin: 3px;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
        }

        .seat.selected {
          background-color: #6feaf6;
        }

        .seat.occupied {
          background-color: #fff;
        }

        .seat:nth-of-type(2) {
          margin-right: 18px;
        }

        .seat:nth-last-of-type(2) {
          margin-left: 18px;
        }

        .seat:not(.occupied):hover {
          cursor: pointer;
          transform: scale(1.2);
        }

        .showcase .seat:not(.occupied):hover {
          cursor: default;
          transform: scale(1);
        }

        .showcase {
          background: rgba(0, 0, 0, 0.1);
          padding: 5px 10px;
          border-radius: 5px;
          color: #777;
          list-style-type: none;
          display: flex;
          justify-content: space-between;
        }

        .showcase li {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 10px;
        }

        .showcase li small {
          margin-left: 2px;
        }

        .row {
          display: flex;
        }

        .screen {
          background-color: #fff;
          height: 70px;
          width: 100%;
          margin: 15px 0;
          transform: rotateX(-45deg);
          box-shadow: 0 3px 10px rgba(255, 255, 255, 0.7);
        }

        p.text {
          margin: 5px 0;
        }

        p.text span {
          color: #6feaf6;
        }
      `}</style>
    </div>
  );
}