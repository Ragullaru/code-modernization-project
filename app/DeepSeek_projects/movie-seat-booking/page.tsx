'use client';

import { useState, useEffect } from 'react';

type Movie = {
  name: string;
  price: number;
};

type SeatStatus = 'available' | 'selected' | 'occupied';

export default function MovieSeatBooking() {
  const movies: Movie[] = [
    { name: 'Avengers: Endgame', price: 10 },
    { name: 'Joker', price: 12 },
    { name: 'Toy Story 4', price: 8 },
    { name: 'The Lion King', price: 9 },
  ];

  const initialSeats: SeatStatus[][] = [
    ['available', 'available', 'available', 'available', 'available', 'available', 'available', 'available'],
    ['available', 'available', 'available', 'occupied', 'occupied', 'available', 'available', 'available'],
    ['available', 'available', 'available', 'available', 'available', 'available', 'occupied', 'occupied'],
    ['available', 'available', 'available', 'available', 'available', 'available', 'available', 'available'],
    ['available', 'available', 'available', 'occupied', 'occupied', 'available', 'available', 'available'],
    ['available', 'available', 'available', 'available', 'occupied', 'occupied', 'occupied', 'available'],
  ];

  const [selectedMovieIndex, setSelectedMovieIndex] = useState<number>(0);
  const [seats, setSeats] = useState<SeatStatus[][]>(initialSeats);
  const [selectedCount, setSelectedCount] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    const savedSelectedSeats = localStorage.getItem('selectedSeats');
    const savedMovieIndex = localStorage.getItem('selectedMovieIndex');

    if (savedSelectedSeats) {
      const parsedSeats: number[][] = JSON.parse(savedSelectedSeats);
      const updatedSeats = [...initialSeats];
      
      parsedSeats.forEach((rowIndices) => {
        if (rowIndices[0] >= 0 && rowIndices[0] < updatedSeats.length &&
            rowIndices[1] >= 0 && rowIndices[1] < updatedSeats[rowIndices[0]].length) {
          updatedSeats[rowIndices[0]][rowIndices[1]] = 'selected';
        }
      });
      
      setSeats(updatedSeats);
    }

    if (savedMovieIndex) {
      const index = parseInt(savedMovieIndex);
      if (index >= 0 && index < movies.length) {
        setSelectedMovieIndex(index);
      }
    }
  }, []);

  useEffect(() => {
    let count = 0;
    seats.forEach(row => {
      row.forEach(seat => {
        if (seat === 'selected') count++;
      });
    });
    
    setSelectedCount(count);
    setTotalPrice(count * movies[selectedMovieIndex].price);
    
    const selectedSeats: number[][] = [];
    seats.forEach((row, rowIndex) => {
      row.forEach((seat, seatIndex) => {
        if (seat === 'selected') {
          selectedSeats.push([rowIndex, seatIndex]);
        }
      });
    });
    
    localStorage.setItem('selectedSeats', JSON.stringify(selectedSeats));
    localStorage.setItem('selectedMovieIndex', selectedMovieIndex.toString());
    localStorage.setItem('selectedMoviePrice', movies[selectedMovieIndex].price.toString());
  }, [seats, selectedMovieIndex, movies]);

  const handleSeatClick = (rowIndex: number, seatIndex: number) => {
    if (seats[rowIndex][seatIndex] === 'occupied') return;
    
    const updatedSeats = [...seats];
    updatedSeats[rowIndex][seatIndex] = 
      updatedSeats[rowIndex][seatIndex] === 'selected' ? 'available' : 'selected';
    setSeats(updatedSeats);
  };

  const handleMovieChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMovieIndex(parseInt(event.target.value));
  };

  const getSeatClass = (status: SeatStatus) => {
    switch (status) {
      case 'selected': return 'seat selected';
      case 'occupied': return 'seat occupied';
      default: return 'seat';
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.movieContainer}>
        <label style={styles.label}>Pick a movie:</label>
        <select 
          id="movie" 
          style={styles.select}
          value={selectedMovieIndex}
          onChange={handleMovieChange}
        >
          {movies.map((movie, index) => (
            <option key={index} value={index}>
              {movie.name} (${movie.price})
            </option>
          ))}
        </select>
      </div>

      <ul style={styles.showcase}>
        <li style={styles.showcaseItem}>
          <div style={styles.seat}></div>
          <small style={styles.small}>N/A</small>
        </li>
        <li style={styles.showcaseItem}>
          <div style={{...styles.seat, backgroundColor: '#6feaf6'}}></div>
          <small style={styles.small}>Selected</small>
        </li>
        <li style={styles.showcaseItem}>
          <div style={{...styles.seat, backgroundColor: '#fff'}}></div>
          <small style={styles.small}>Occupied</small>
        </li>
      </ul>

      <div style={styles.theaterContainer}>
        <div style={styles.screen}></div>

        {seats.map((row, rowIndex) => (
          <div key={rowIndex} style={styles.row}>
            {row.map((seat, seatIndex) => (
              <div
                key={seatIndex}
                className={getSeatClass(seat)}
                style={{
                  ...styles.seat,
                  backgroundColor: seat === 'selected' ? '#6feaf6' : 
                                  seat === 'occupied' ? '#fff' : '#444451',
                  cursor: seat === 'occupied' ? 'default' : 'pointer',
                  transform: seat === 'occupied' ? 'scale(1)' : 
                            (seat === 'selected' ? 'scale(1.2)' : 'scale(1)'),
                  marginRight: seatIndex === 1 ? '18px' : '3px',
                  marginLeft: seatIndex === row.length - 2 ? '18px' : '3px',
                }}
                onClick={() => handleSeatClick(rowIndex, seatIndex)}
              />
            ))}
          </div>
        ))}
      </div>

      <p style={styles.text}>
        You have selected <span style={styles.highlight}>{selectedCount}</span> seats for a price of $
        <span style={styles.highlight}>{totalPrice}</span>
      </p>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css?family=Lato&display=swap');
        
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
          font-family: 'Lato', sans-serif;
          margin: 0;
        }
        
        .seat {
          background-color: #444451;
          height: 12px;
          width: 15px;
          margin: 3px;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
          transition: transform 0.2s;
        }
        
        .seat.selected {
          background-color: #6feaf6;
        }
        
        .seat.occupied {
          background-color: #fff;
        }
        
        .seat:not(.occupied):hover {
          cursor: pointer;
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px',
  },
  movieContainer: {
    margin: '20px 0',
  },
  label: {
    fontSize: '16px',
  },
  select: {
    backgroundColor: '#fff',
    border: '0',
    borderRadius: '5px',
    fontSize: '14px',
    marginLeft: '10px',
    padding: '5px 15px',
    appearance: 'none' as const,
    MozAppearance: 'none' as const,
    WebkitAppearance: 'none' as const,
  },
  theaterContainer: {
    perspective: '1000px',
    marginBottom: '30px',
  },
  screen: {
    backgroundColor: '#fff',
    height: '70px',
    width: '100%',
    margin: '15px 0',
    transform: 'rotateX(-45deg)',
    boxShadow: '0 3px 10px rgba(255, 255, 255, 0.7)',
  },
  row: {
    display: 'flex',
    justifyContent: 'center',
  },
  seat: {
    backgroundColor: '#444451',
    height: '12px',
    width: '15px',
    margin: '3px',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
    transition: 'transform 0.2s',
  },
  showcase: {
    background: 'rgba(0, 0, 0, 0.1)',
    padding: '5px 10px',
    borderRadius: '5px',
    color: '#777',
    listStyleType: 'none',
    display: 'flex',
    justifyContent: 'space-between',
    margin: '20px 0',
  },
  showcaseItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 10px',
  },
  small: {
    marginLeft: '2px',
  },
  text: {
    margin: '5px 0',
    fontSize: '18px',
  },
  highlight: {
    color: '#6feaf6',
    fontWeight: 'bold' as const,
  },
};