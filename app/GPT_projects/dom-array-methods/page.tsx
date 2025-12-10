"use client";

import React, { useEffect, useState } from "react";

type User = {
  name: string;
  money: number;
};

interface RandomUserApiResponse {
  results: {
    name: {
      first: string;
      last: string;
    };
  }[];
}

const formatMoney = (number: number): string => {
  return (
    "$" +
    number
      .toFixed(2)
      .replace(/\d(?=(\d{3})+\.)/g, "$&,")
  );
};

const DomArrayMethodsPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showTotal, setShowTotal] = useState(false);

  // Fetch random user and add with random money
  const addRandomUser = async () => {
    const res = await fetch("https://randomuser.me/api");
    const data = (await res.json()) as RandomUserApiResponse;
    const user = data.results[0];

    const newUser: User = {
      name: `${user.name.first} ${user.name.last}`,
      money: Math.floor(Math.random() * 1_000_000),
    };

    setUsers((prev) => [...prev, newUser]);
  };

  // Initial load - three users, as in original script
  useEffect(() => {
    const loadInitialUsers = async () => {
      await Promise.all([addRandomUser(), addRandomUser(), addRandomUser()]);
    };
    loadInitialUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Double all users money
  const handleDoubleMoney = () => {
    setUsers((prev) =>
      prev.map((user) => ({
        ...user,
        money: user.money * 2,
      }))
    );
  };

  // Sort users by richest
  const handleSortByRichest = () => {
    setUsers((prev) => [...prev].sort((a, b) => b.money - a.money));
  };

  // Filter only millionaires (strictly greater than 1,000,000 like original)
  const handleShowMillionaires = () => {
    setUsers((prev) => prev.filter((user) => user.money > 1_000_000));
  };

  // Calculate total wealth (displayed when button is pressed)
  const totalWealth = users.reduce((acc, user) => acc + user.money, 0);
  const handleCalculateWealth = () => {
    setShowTotal(true);
  };

  return (
    <>
      <h1>DOM Array Methods</h1>

      <div className="container">
        <aside>
          <button onClick={addRandomUser}>Add User 👱‍♂️</button>
          <button onClick={handleDoubleMoney}>Double Money 💰</button>
          <button onClick={handleShowMillionaires}>
            Show Only Millionaires 💵
          </button>
          <button onClick={handleSortByRichest}>Sort by Richest ↓</button>
          <button onClick={handleCalculateWealth}>
            Calculate entire Wealth 🧮
          </button>
        </aside>

        <main>
          <h2>
            <strong>Person</strong> Wealth
          </h2>

          {users.map((user, index) => (
            <div key={`${user.name}-${index}`} className="person">
              <strong>{user.name}</strong> {formatMoney(user.money)}
            </div>
          ))}

          {showTotal && (
            <h3>
              <span>Total Wealth:</span>
              <strong>{formatMoney(totalWealth)}</strong>
            </h3>
          )}
        </main>
      </div>

      {/* Global styles matching original style.css */}
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
          background: #f4f4f4;
          font-family: Arial, Helvetica, sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 100vh;
          margin: 0;
        }

        h1 {
          margin-top: 20px;
        }

        .container {
          display: flex;
          padding: 20px;
          margin: 0 auto;
          max-width: 100%;
          width: 800px;
        }

        aside {
          padding: 10px 20px;
          width: 250px;
          border-right: 1px solid #111;
        }

        button {
          cursor: pointer;
          background-color: #fff;
          border: solid 1px #111;
          border-radius: 5px;
          display: block;
          width: 100%;
          padding: 10px;
          margin-bottom: 20px;
          font-weight: bold;
          font-size: 14px;
        }

        button:focus {
          outline: none;
        }

        main {
          flex: 1;
          padding: 10px 20px;
        }

        h2 {
          border-bottom: 1px solid #111;
          padding-bottom: 10px;
          display: flex;
          justify-content: space-between;
          font-weight: 300;
          margin: 0 0 20px;
        }

        h3 {
          background-color: #fff;
          border-bottom: 1px solid #111;
          padding: 10px;
          display: flex;
          justify-content: space-between;
          font-weight: 300;
          margin: 20px 0 0;
        }

        .person {
          display: flex;
          justify-content: space-between;
          font-size: 20px;
          margin-bottom: 10px;
        }
      `}</style>
    </>
  );
};

export default DomArrayMethodsPage;
