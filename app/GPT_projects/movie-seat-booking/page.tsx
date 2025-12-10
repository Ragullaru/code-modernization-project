"use client";

import React, { useEffect, useMemo, useState } from "react";

type Movie = {
  title: string;
  price: number;
};

const MOVIES: Movie[] = [
  { title: "Avengers: Endgame", price: 10 },
  { title: "Joker", price: 12 },
  { title: "Toy Story 4", price: 8 },
  { title: "The Lion King", price: 9 },
];

const ROW_COUNT = 6;
const COL_COUNT = 8;

// Indices of occupied seats in row-major order, matching the original layout
// Row 0: ........
// Row 1: ...XX...
// Row 2: ......XX
// Row 3: ........
// Row 4: ...XX...
// Row 5: ....XXX.
const OCCUPIED_SEAT_IDS = [11, 12, 22, 23, 35, 36, 44, 45, 46];

const STORAGE_KEYS = {
  SELECTED_SEATS: "selectedSeats",
  SELECTED_MOVIE_INDEX: "selectedMovieIndex",
  SELECTED_MOVIE_PRICE: "selectedMoviePrice",
};

type Seat = {
  id: number;
  row: number;
  col: number;
  occupied: boolean;
};

const buildSeats = (): Seat[] => {
  const totalSeats = ROW_COUNT * COL_COUNT;
  const occupiedSet = new Set<number>(OCCUPIED_SEAT_IDS);

  return Array.from({ length: totalSeats }, (_, id) => ({
    id,
    row: Math.floor(id / COL_COUNT),
    col: id % COL_COUNT,
    occupied: occupiedSet.has(id),
  }));
};

const ALL_SEATS: Seat[] = buildSeats();
const AVAILABLE_SEAT_IDS: number[] = ALL_SEATS.filter((s) => !s.occupied).map(
  (s) => s.id,
);

const getAvailableIndexForSeatId = (seatId: number): number =>
  AVAILABLE_SEAT_IDS.indexOf(seatId);

const getSeatIdFromAvailableIndex = (index: number): number | undefined =>
  AVAILABLE_SEAT_IDS[index];

export default function MovieSeatBooking() {
  const [selectedMovieIndex, setSelectedMovieIndex] = useState(0);
  const [selectedSeatIds, setSelectedSeatIds] = useState<number[]>([]);

  const ticketPrice = useMemo(
    () => MOVIES[selectedMovieIndex]?.price ?? 0,
    [selectedMovieIndex],
  );

  const selectedSeatCount = selectedSeatIds.length;
  const totalPrice = selectedSeatCount * ticketPrice;

  // Hydrate from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const storedMovieIndex = window.localStorage.getItem(
        STORAGE_KEYS.SELECTED_MOVIE_INDEX,
      );
      if (storedMovieIndex !== null) {
        const idx = Number(storedMovieIndex);
        if (!Number.isNaN(idx) && idx >= 0 && idx < MOVIES.length) {
          setSelectedMovieIndex(idx);
        }
      }

      const storedSeats = window.localStorage.getItem(
        STORAGE_KEYS.SELECTED_SEATS,
      );
      if (storedSeats) {
        const indices: unknown = JSON.parse(storedSeats);
        if (Array.isArray(indices)) {
          const ids: number[] = [];
          indices.forEach((index) => {
            if (typeof index === "number") {
              const seatId = getSeatIdFromAvailableIndex(index);
              if (typeof seatId === "number") {
                ids.push(seatId);
              }
            }
          });
          if (ids.length > 0) {
            setSelectedSeatIds(ids);
          }
        }
      }
    } catch (err) {
      // If anything goes wrong with parsing, just start fresh
      console.error("Failed to read booking state from localStorage", err);
    }
  }, []);

  // Persist to localStorage whenever selection changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const selectedSeatIndices = selectedSeatIds
        .map((seatId) => getAvailableIndexForSeatId(seatId))
        .filter((idx) => idx >= 0);

      window.localStorage.setItem(
        STORAGE_KEYS.SELECTED_SEATS,
        JSON.stringify(selectedSeatIndices),
      );
      window.localStorage.setItem(
        STORAGE_KEYS.SELECTED_MOVIE_INDEX,
        String(selectedMovieIndex),
      );
      window.localStorage.setItem(
        STORAGE_KEYS.SELECTED_MOVIE_PRICE,
        String(ticketPrice),
      );
    } catch (err) {
      console.error("Failed to persist booking state to localStorage", err);
    }
  }, [selectedSeatIds, selectedMovieIndex, ticketPrice]);

  const handleSeatClick = (seat: Seat) => {
    if (seat.occupied) return;

    setSelectedSeatIds((prev) =>
      prev.includes(seat.id)
        ? prev.filter((id) => id !== seat.id)
        : [...prev, seat.id],
    );
  };

  const handleMovieChange: React.ChangeEventHandler<HTMLSelectElement> = (
    event,
  ) => {
    const newIndex = Number(event.target.value);
    if (!Number.isNaN(newIndex)) {
      setSelectedMovieIndex(newIndex);
    }
  };

  const rows = useMemo(() => {
    const grouped: Seat[][] = Array.from({ length: ROW_COUNT }, () => []);
    ALL_SEATS.forEach((seat) => {
      grouped[seat.row].push(seat);
    });
    return grouped;
  }, []);

  return (
    <>
      <div className="movie-container">
        <label htmlFor="movie">Pick a movie:</label>
        <select
          id="movie"
          value={selectedMovieIndex}
          onChange={handleMovieChange}
        >
          {MOVIES.map((movie, index) => (
            <option key={movie.title} value={index}>
              {movie.title} (${movie.price})
            </option>
          ))}
        </select>
      </div>

      <ul className="showcase">
        <li>
          <div className="seat" />
          <small>N/A</small>
        </li>
        <li>
          <div className="seat selected" />
          <small>Selected</small>
        </li>
        <li>
          <div className="seat occupied" />
          <small>Occupied</small>
        </li>
      </ul>

      <div className="container">
        <div className="screen" />

        {rows.map((rowSeats, rowIndex) => (
          <div className="row" key={rowIndex}>
            {rowSeats.map((seat) => {
              const isSelected = selectedSeatIds.includes(seat.id);
              const classNames = [
                "seat",
                seat.occupied && "occupied",
                isSelected && "selected",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <div
                  key={seat.id}
                  className={classNames}
                  onClick={() => handleSeatClick(seat)}
                />
              );
            })}
          </div>
        ))}
      </div>

      <p className="text">
        You have selected <span id="count">{selectedSeatCount}</span> seats for
        a price of $<span id="total">{totalPrice}</span>
      </p>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css?family=Lato&display=swap");

        * {
          box-sizing: border-box;
        }

        body {
          background-color: #242333;
          color: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          font-family: "Lato", sans-serif;
          margin: 0;
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
    </>
  );
}
