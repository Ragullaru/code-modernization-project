'use client';

import { useState, useEffect } from 'react';

type User = {
  name: string;
  money: number;
};

export default function DomArrayMethods() {
  const [data, setData] = useState<User[]>([]);
  const [showTotalWealth, setShowTotalWealth] = useState(false);

  // Fetch random user and add money
  const getRandomUser = async () => {
    try {
      const res = await fetch('https://randomuser.me/api');
      const result = await res.json();
      const user = result.results[0];

      const newUser: User = {
        name: `${user.name.first} ${user.name.last}`,
        money: Math.floor(Math.random() * 1000000),
      };

      setData(prev => [...prev, newUser]);
    } catch (error) {
      console.error('Error fetching random user:', error);
    }
  };

  // Double everyone's money
  const doubleMoney = () => {
    setData(prev => prev.map(user => ({
      ...user,
      money: user.money * 2,
    })));
    setShowTotalWealth(false);
  };

  // Sort users by richest
  const sortByRichest = () => {
    setData(prev => [...prev].sort((a, b) => b.money - a.money));
    setShowTotalWealth(false);
  };

  // Filter only millionaires
  const showMillionaires = () => {
    setData(prev => prev.filter(user => user.money > 1000000));
    setShowTotalWealth(false);
  };

  // Calculate the total wealth
  const calculateWealth = () => {
    setShowTotalWealth(true);
  };

  // Format number as money
  const formatMoney = (number: number) => {
    return '$' + number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  };

  // Initialize with 3 random users
  useEffect(() => {
    const initializeUsers = async () => {
      await Promise.all([
        getRandomUser(),
        getRandomUser(),
        getRandomUser(),
      ]);
    };
    initializeUsers();
  }, []);

  // Calculate total wealth
  const totalWealth = data.reduce((acc, user) => acc + user.money, 0);

  return (
    <div style={{
      background: '#f4f4f4',
      fontFamily: 'Arial, Helvetica, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      margin: 0,
    }}>
      <h1>DOM Array Methods</h1>

      <div style={{
        display: 'flex',
        padding: '20px',
        margin: '0 auto',
        maxWidth: '100%',
        width: '800px',
      }}>
        <aside style={{
          padding: '10px 20px',
          width: '250px',
          borderRight: '1px solid #111',
        }}>
          <button
            onClick={getRandomUser}
            style={{
              cursor: 'pointer',
              backgroundColor: '#fff',
              border: 'solid 1px #111',
              borderRadius: '5px',
              display: 'block',
              width: '100%',
              padding: '10px',
              marginBottom: '20px',
              fontWeight: 'bold',
              fontSize: '14px',
            }}
          >
            Add User 👱‍♂️
          </button>
          <button
            onClick={doubleMoney}
            style={{
              cursor: 'pointer',
              backgroundColor: '#fff',
              border: 'solid 1px #111',
              borderRadius: '5px',
              display: 'block',
              width: '100%',
              padding: '10px',
              marginBottom: '20px',
              fontWeight: 'bold',
              fontSize: '14px',
            }}
          >
            Double Money 💰
          </button>
          <button
            onClick={showMillionaires}
            style={{
              cursor: 'pointer',
              backgroundColor: '#fff',
              border: 'solid 1px #111',
              borderRadius: '5px',
              display: 'block',
              width: '100%',
              padding: '10px',
              marginBottom: '20px',
              fontWeight: 'bold',
              fontSize: '14px',
            }}
          >
            Show Only Millionaires 💵
          </button>
          <button
            onClick={sortByRichest}
            style={{
              cursor: 'pointer',
              backgroundColor: '#fff',
              border: 'solid 1px #111',
              borderRadius: '5px',
              display: 'block',
              width: '100%',
              padding: '10px',
              marginBottom: '20px',
              fontWeight: 'bold',
              fontSize: '14px',
            }}
          >
            Sort by Richest ↓
          </button>
          <button
            onClick={calculateWealth}
            style={{
              cursor: 'pointer',
              backgroundColor: '#fff',
              border: 'solid 1px #111',
              borderRadius: '5px',
              display: 'block',
              width: '100%',
              padding: '10px',
              marginBottom: '20px',
              fontWeight: 'bold',
              fontSize: '14px',
            }}
          >
            Calculate entire Wealth 🧮
          </button>
        </aside>

        <main style={{
          flex: 1,
          padding: '10px 20px',
        }}>
          <h2 style={{
            borderBottom: '1px solid #111',
            paddingBottom: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            fontWeight: 300,
            margin: '0 0 20px',
          }}>
            <strong>Person</strong> Wealth
          </h2>

          {data.map((item, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '20px',
                marginBottom: '10px',
              }}
            >
              <strong>{item.name}</strong> {formatMoney(item.money)}
            </div>
          ))}

          {showTotalWealth && (
            <div style={{
              backgroundColor: '#fff',
              borderBottom: '1px solid #111',
              padding: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: 300,
              margin: '20px 0 0',
            }}>
              <h3>Total Wealth: <strong>{formatMoney(totalWealth)}</strong></h3>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}