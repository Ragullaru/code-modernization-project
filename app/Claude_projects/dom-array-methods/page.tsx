"use client";

import { useState, useEffect } from "react";

interface User {
  name: string;
  money: number;
}

export default function DomArrayMethodsPage() {
  const [data, setData] = useState<User[]>([]);
  const [totalWealth, setTotalWealth] = useState<number | null>(null);

  // Fetch random user and add money
  const getRandomUser = async () => {
    try {
      const res = await fetch("https://randomuser.me/api");
      const apiData = await res.json();
      const user = apiData.results[0];

      const newUser: User = {
        name: `${user.name.first} ${user.name.last}`,
        money: Math.floor(Math.random() * 1000000),
      };

      setData((prevData) => [...prevData, newUser]);
      setTotalWealth(null); // Reset total wealth when adding new user
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  // Initialize with 3 random users
  useEffect(() => {
    getRandomUser();
    getRandomUser();
    getRandomUser();
  }, []);

  // Double everyone's money
  const doubleMoney = () => {
    setData((prevData) =>
      prevData.map((user) => ({
        ...user,
        money: user.money * 2,
      }))
    );
    setTotalWealth(null);
  };

  // Sort users by richest
  const sortByRichest = () => {
    setData((prevData) => [...prevData].sort((a, b) => b.money - a.money));
  };

  // Filter only millionaires
  const showMillionaires = () => {
    setData((prevData) => prevData.filter((user) => user.money > 1000000));
    setTotalWealth(null);
  };

  // Calculate the total wealth
  const calculateWealth = () => {
    const wealth = data.reduce((acc, user) => acc + user.money, 0);
    setTotalWealth(wealth);
  };

  // Format number as money
  const formatMoney = (number: number): string => {
    return "$" + number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
  };

  return (
    <>
      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page-container {
          background: #f4f4f4;
          font-family: Arial, Helvetica, sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 100vh;
          margin: 0;
          padding: 0;
        }

        h1 {
          margin: 20px 0;
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

        button:hover {
          background-color: #f0f0f0;
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

      <div className="page-container">
        <h1>DOM Array Methods</h1>

        <div className="container">
          <aside>
            <button onClick={getRandomUser}>Add User 👱‍♂️</button>
            <button onClick={doubleMoney}>Double Money 💰</button>
            <button onClick={showMillionaires}>
              Show Only Millionaires 💵
            </button>
            <button onClick={sortByRichest}>Sort by Richest ↓</button>
            <button onClick={calculateWealth}>
              Calculate entire Wealth 🧮
            </button>
          </aside>

          <main>
            <h2>
              <strong>Person</strong> Wealth
            </h2>
            {data.map((item, index) => (
              <div key={index} className="person">
                <strong>{item.name}</strong> {formatMoney(item.money)}
              </div>
            ))}
            {totalWealth !== null && (
              <h3>
                Total Wealth: <strong>{formatMoney(totalWealth)}</strong>
              </h3>
            )}
          </main>
        </div>
      </div>
    </>
  );
}