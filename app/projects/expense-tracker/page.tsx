"use client";

import React, { useEffect, useState, FormEvent } from "react";
import Head from "next/head";

type Transaction = {
  id: number;
  text: string;
  amount: number;
};

const LOCAL_STORAGE_KEY = "transactions";

const ExpenseTrackerPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed: Transaction[] = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setTransactions(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load transactions from localStorage", e);
    }
  }, []);

  // Persist to localStorage whenever transactions change
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      window.localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify(transactions)
      );
    } catch (e) {
      console.error("Failed to save transactions to localStorage", e);
    }
  }, [transactions]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (text.trim() === "" || amount.trim() === "") {
      window.alert("Please add a text and amount");
      return;
    }

    const numericAmount = Number(amount);
    if (Number.isNaN(numericAmount) || numericAmount === 0) {
      window.alert("Please enter a non zero numeric amount");
      return;
    }

    const newTransaction: Transaction = {
      id: Math.floor(Math.random() * 100000000),
      text: text.trim(),
      amount: numericAmount,
    };

    setTransactions((prev) => [newTransaction, ...prev]);
    setText("");
    setAmount("");
  };

  const removeTransaction = (id: number) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const amounts = transactions.map((t) => t.amount);
  const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => acc + item, 0)
    .toFixed(2);
  const expense = (
    amounts
      .filter((item) => item < 0)
      .reduce((acc, item) => acc + item, 0) * -1
  ).toFixed(2);

  return (
    <>
      <Head>
        <title>Expense Tracker</title>
        <meta
          name="description"
          content="Track income and expenses with local storage persistence"
        />
        {/* Google font to match original styling */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Lato&display=swap"
        />
      </Head>

      <h2>Expense Tracker</h2>

      <div className="container">
        <h4>Your Balance</h4>
        <h1 id="balance">${total}</h1>

        <div className="inc-exp-container">
          <div>
            <h4>Income</h4>
            <p id="money-plus" className="money plus">
              +${income}
            </p>
          </div>
          <div>
            <h4>Expense</h4>
            <p id="money-minus" className="money minus">
              -${expense}
            </p>
          </div>
        </div>

        <h3>History</h3>
        <ul id="list" className="list">
          {transactions.map((transaction) => {
            const sign = transaction.amount < 0 ? "-" : "+";
            const typeClass =
              transaction.amount < 0 ? "minus" : "plus";

            return (
              <li key={transaction.id} className={typeClass}>
                {transaction.text}
                <span>
                  {sign}
                  {Math.abs(transaction.amount)}
                </span>
                <button
                  className="delete-btn"
                  onClick={() => removeTransaction(transaction.id)}
                  aria-label={`Delete transaction ${transaction.text}`}
                >
                  x
                </button>
              </li>
            );
          })}
        </ul>

        <h3>Add new transaction</h3>
        <form id="form" onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="text">Text</label>
            <input
              type="text"
              id="text"
              placeholder="Enter text..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <div className="form-control">
            <label htmlFor="amount">
              Amount <br />
              (negative expense, positive income)
            </label>
            <input
              type="number"
              id="amount"
              placeholder="Enter amount..."
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <button className="btn" type="submit">
            Add transaction
          </button>
        </form>
      </div>

      {/* Global styles ported from original style.css */}
      <style jsx global>{`
        :root {
          --box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12),
            0 1px 2px rgba(0, 0, 0, 0.24);
        }

        * {
          box-sizing: border-box;
        }

        body {
          background-color: #f7f7f7;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
          font-family: "Lato", sans-serif;
          font-size: 18px;
        }

        .container {
          margin: 30px auto;
          width: 400px;
        }

        h1 {
          letter-spacing: 1px;
          margin: 0;
        }

        h2 {
          margin-top: 20px;
        }

        h3 {
          border-bottom: 1px solid #bbb;
          padding-bottom: 10px;
          margin: 40px 0 10px;
        }

        h4 {
          margin: 0;
          text-transform: uppercase;
        }

        .inc-exp-container {
          background-color: #fff;
          box-shadow: var(--box-shadow);
          padding: 20px;
          display: flex;
          justify-content: space-between;
          margin: 20px 0;
        }

        .inc-exp-container > div {
          flex: 1;
          text-align: center;
        }

        .inc-exp-container > div:first-of-type {
          border-right: 1px solid #dedede;
        }

        .money {
          font-size: 20px;
          letter-spacing: 1px;
          margin: 5px 0;
        }

        .money.plus {
          color: #2ecc71;
        }

        .money.minus {
          color: #c0392b;
        }

        label {
          display: inline-block;
          margin: 10px 0;
        }

        input[type="text"],
        input[type="number"] {
          border: 1px solid #dedede;
          border-radius: 2px;
          display: block;
          font-size: 16px;
          padding: 10px;
          width: 100%;
        }

        .btn {
          cursor: pointer;
          background-color: #9c88ff;
          box-shadow: var(--box-shadow);
          color: #fff;
          border: 0;
          display: block;
          font-size: 16px;
          margin: 10px 0 30px;
          padding: 10px;
          width: 100%;
        }

        .btn:focus,
        .delete-btn:focus {
          outline: 0;
        }

        .list {
          list-style-type: none;
          padding: 0;
          margin-bottom: 40px;
        }

        .list li {
          background-color: #fff;
          box-shadow: var(--box-shadow);
          color: #333;
          display: flex;
          justify-content: space-between;
          position: relative;
          padding: 10px;
          margin: 10px 0;
        }

        .list li.plus {
          border-right: 5px solid #2ecc71;
        }

        .list li.minus {
          border-right: 5px solid #c0392b;
        }

        .delete-btn {
          cursor: pointer;
          background-color: #e74c3c;
          border: 0;
          color: #fff;
          font-size: 20px;
          line-height: 20px;
          padding: 2px 5px;
          position: absolute;
          top: 50%;
          left: 0;
          transform: translate(-100%, -50%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .list li:hover .delete-btn {
          opacity: 1;
        }

        .form-control {
          margin-bottom: 10px;
        }
      `}</style>
    </>
  );
};

export default ExpenseTrackerPage;
