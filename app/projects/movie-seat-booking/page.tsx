"use client";

import React, { JSX, useEffect, useMemo, useState } from "react";

type SeatState = "available" | "selected" | "occupied";

const MOVIES = [
  { title: "Avengers: Endgame", price: 10 },
  { title: "Joker", price: 12 },
  { title: "Toy Story 4", price: 8 },
  { title: "The Lion King", price: 9 },
];

const STORAGE_KEYS = {
  SELECTED_SEATS: "msb_selectedSeats",
  SELECTED_MOVIE_INDEX: "msb_selectedMovieIndex",
};

const ROWS = 6;
const COLS = 8;

/**
 * Initial occupied layout derived from the original project HTML.
 * The arrays list the column indices (0-based) that are occupied in each row.
 */
const INITIAL_OCCUPIED: number[][] = [
  [], // row 0
  [3, 4], // row 1
  [6, 7], // row 2
  [], // row 3
  [3, 4], // row 4
  [4, 5, 6], // row 5
];

function idxFromRowCol(row: number, col: number) {
  return row * COLS + col;
}

export default function MovieSeatBooking(): JSX.Element {
  // base layout (available / occupied), no browser APIs
  const initialSeatStates = useMemo<SeatState[]>(() => {
    const seats: SeatState[] = Array(ROWS * COLS).fill("available");
    for (let r = 0; r < INITIAL_OCCUPIED.length; r++) {
      for (const c of INITIAL_OCCUPIED[r]) {
        seats[idxFromRowCol(r, c)] = "occupied";
      }
    }
    return seats;
  }, []);

  // simple initial state for SSR; we will hydrate from localStorage in useEffect
  const [seatStates, setSeatStates] = useState<SeatState[]>(initialSeatStates);
  const [movieIndex, setMovieIndex] = useState<number>(0);

  // On mount, hydrate from localStorage (runs only in browser)
  useEffect(() => {
    if (typeof window === "undefined") return;

    // hydrate seats
    try {
      const rawSeats = window.localStorage.getItem(STORAGE_KEYS.SELECTED_SEATS);
      const selectedFlat: number[] = rawSeats ? JSON.parse(rawSeats) : [];
      const seats = [...initialSeatStates];
      for (const i of selectedFlat) {
        if (i >= 0 && i < seats.length && seats[i] !== "occupied") {
          seats[i] = "selected";
        }
      }
      setSeatStates(seats);
    } catch {
      // ignore parse errors
      setSeatStates(initialSeatStates);
    }

    // hydrate movie index
    try {
      const rawIdx = window.localStorage.getItem(
        STORAGE_KEYS.SELECTED_MOVIE_INDEX
      );
      const idx = rawIdx !== null ? Number(rawIdx) : 0;
      if (Number.isFinite(idx) && idx >= 0 && idx < MOVIES.length) {
        setMovieIndex(idx);
      }
    } catch {
      // ignore
    }
  }, [initialSeatStates]);

  // derived values
  const ticketPrice = MOVIES[movieIndex].price;
  const selectedCount = seatStates.filter((s) => s === "selected").length;
  const total = selectedCount * ticketPrice;

  // persist selected seats to localStorage whenever seatStates change
  useEffect(() => {
    if (typeof window === "undefined") return;
    const selectedIndices = seatStates
      .map((s, i) => (s === "selected" ? i : -1))
      .filter((i) => i !== -1);
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.SELECTED_SEATS,
        JSON.stringify(selectedIndices)
      );
    } catch {
      // ignore storage errors
    }
  }, [seatStates]);

  // persist movie index
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.SELECTED_MOVIE_INDEX,
        String(movieIndex)
      );
    } catch {
      // ignore
    }
  }, [movieIndex]);

  function toggleSeat(index: number) {
    setSeatStates((prev) => {
      const curr = prev[index];
      if (curr === "occupied") return prev; // no change
      const next = [...prev];
      next[index] = curr === "selected" ? "available" : "selected";
      return next;
    });
  }

  // Accessibility: keyboard toggling for seats
  function handleSeatKey(e: React.KeyboardEvent, index: number) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleSeat(index);
    }
  }

  function resetSelection() {
    setSeatStates((prev) =>
      prev.map((s) => (s === "selected" ? "available" : s))
    );
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(STORAGE_KEYS.SELECTED_SEATS);
      } catch {}
    }
  }

  return (
    <div className="msb-root" role="application" aria-label="Movie Seat Booking">
      <div className="msb-top">
        <label htmlFor="movieSelect" className="msb-label">
          Pick a movie:
        </label>
        <select
          id="movieSelect"
          className="msb-select"
          value={movieIndex}
          onChange={(e) => setMovieIndex(Number(e.target.value))}
          aria-label="Select movie"
        >
          {MOVIES.map((m, i) => (
            <option key={m.title} value={i}>
              {m.title} (${m.price})
            </option>
          ))}
        </select>
      </div>

      <ul className="msb-showcase" aria-hidden>
        <li>
          <div className="seat example" />
          <small>N/A</small>
        </li>
        <li>
          <div className="seat example selected" />
          <small>Selected</small>
        </li>
        <li>
          <div className="seat example occupied" />
          <small>Occupied</small>
        </li>
      </ul>

      <main className="msb-container">
        <div className="screen" aria-hidden>
          <span className="screen-label">SCREEN</span>
        </div>

        <div className="seat-grid" role="grid" aria-label="Seats">
          {Array.from({ length: ROWS }).map((_, row) => (
            <div key={row} className="row" role="row">
              {Array.from({ length: COLS }).map((_, col) => {
                const index = idxFromRowCol(row, col);
                const state = seatStates[index];
                const isOccupied = state === "occupied";
                const isSelected = state === "selected";
                return (
                  <button
                    key={col}
                    role="gridcell"
                    aria-label={`Row ${row + 1} Seat ${col + 1} ${
                      isOccupied ? "occupied" : isSelected ? "selected" : ""
                    }`}
                    title={`Row ${row + 1} Seat ${col + 1}`}
                    className={`seat ${isOccupied ? "occupied" : ""} ${
                      isSelected ? "selected" : ""
                    }`}
                    onClick={() => toggleSeat(index)}
                    onKeyDown={(e) => handleSeatKey(e, index)}
                    disabled={isOccupied}
                    tabIndex={isOccupied ? -1 : 0}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </main>

      <p className="msb-text">
        You have selected <span className="highlight">{selectedCount}</span>{" "}
        seats for a price of $<span className="highlight">{total}</span>
      </p>

      <div className="msb-footer">
        <button className="msb-reset" onClick={resetSelection} type="button">
          Reset selection
        </button>
      </div>

      <style>{`
        :root {
          --bg: #242333;
          --muted: #777;
          --accent: #6feaf6;
          --seat-bg: #444451;
          --white: #fff;
          --container-width: 520px;
        }
        * { box-sizing: border-box; }
        .msb-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: var(--bg);
          color: var(--white);
          font-family: 'Lato', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
          padding: 28px 16px;
        }
        .msb-top {
          margin: 12px 0 18px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .msb-label { font-size: 16px; }
        .msb-select {
          padding: 6px 12px;
          border-radius: 6px;
          border: none;
          font-size: 14px;
          background: #fff;
        }
        .msb-showcase {
          display: flex;
          gap: 18px;
          list-style: none;
          padding: 8px 12px;
          margin: 0 0 18px;
          border-radius: 8px;
          color: var(--muted);
          background: rgba(0,0,0,0.08);
        }
        .msb-showcase li {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .msb-container {
          width: 100%;
          max-width: var(--container-width);
          perspective: 1000px;
          margin-bottom: 18px;
        }
        .screen {
          width: 100%;
          height: 70px;
          margin: 6px 0 14px;
          background: #fff;
          transform: rotateX(-45deg);
          box-shadow: 0 3px 10px rgba(255,255,255,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
        }
        .screen-label {
          color: #222;
          font-weight: 700;
          letter-spacing: 2px;
        }
        .seat-grid { display: flex; flex-direction: column; gap: 6px; }
        .row { display: flex; justify-content: center; gap: 6px; }
        .seat {
          background: var(--seat-bg);
          height: 20px;
          width: 24px;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
          border: none;
          transition: transform 140ms ease;
          outline: none;
          display: inline-block;
        }
        .seat:hover { transform: scale(1.18); cursor: pointer; }
        .seat:active { transform: scale(1.05); }
        .seat.selected { background: var(--accent); }
        .seat.occupied {
          background: var(--white);
          cursor: default;
          transform: none;
        }
        .seat.example { width: 18px; height: 12px; border-radius: 4px; transform: none; }
        .msb-text {
          margin: 8px 0;
          font-size: 16px;
        }
        .highlight { color: var(--accent); font-weight: 700; }
        .msb-footer { margin-top: 8px; display: flex; gap: 8px; }
        .msb-reset {
          padding: 8px 12px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.12);
          color: var(--white);
          border-radius: 6px;
          cursor: pointer;
        }
        .msb-reset:hover { background: rgba(255,255,255,0.03); }
        @media (max-width: 520px) {
          .seat { width: 18px; height: 14px; }
          .msb-container { max-width: 360px; }
        }
      `}</style>
    </div>
  );
}
