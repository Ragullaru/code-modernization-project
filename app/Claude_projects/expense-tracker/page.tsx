'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface Transaction {
  id: number;
  text: string;
  amount: number;
}

export default function ExpenseTracker() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');

  // Load transactions from localStorage on mount
  useEffect(() => {
    const localStorageTransactions = localStorage.getItem('transactions');
    if (localStorageTransactions) {
      try {
        const parsed = JSON.parse(localStorageTransactions);
        setTransactions(parsed);
      } catch (error) {
        console.error('Error parsing localStorage:', error);
      }
    }
  }, []);

  // Update localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Generate random ID
  const generateID = useCallback(() => {
    return Math.floor(Math.random() * 100000000);
  }, []);

  // Calculate values
  const amounts = transactions.map(transaction => transaction.amount);
  const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => acc + item, 0)
    .toFixed(2);
  const expense = (
    amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) * -1
  ).toFixed(2);

  // Add transaction
  const addTransaction = (e: React.FormEvent) => {
    e.preventDefault();

    if (text.trim() === '' || amount.trim() === '') {
      alert('Please add a text and amount');
      return;
    }

    const transaction: Transaction = {
      id: generateID(),
      text: text,
      amount: +amount
    };

    setTransactions([...transactions, transaction]);
    setText('');
    setAmount('');
  };

  // Remove transaction
  const removeTransaction = (id: number) => {
    setTransactions(transactions.filter(transaction => transaction.id !== id));
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css?family=Lato&display=swap');

        :root {
          --box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
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
          font-family: 'Lato', sans-serif;
          font-size: 18px;
        }

        h1 {
          letter-spacing: 1px;
          margin: 0;
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

        label {
          display: inline-block;
          margin: 10px 0;
        }

        input[type='text'],
        input[type='number'] {
          border: 1px solid #dedede;
          border-radius: 2px;
          display: block;
          font-size: 16px;
          padding: 10px;
          width: 100%;
        }
      `}</style>

      <style jsx>{`
        h2 {
          margin: 0;
          padding: 20px 0 0;
        }

        .container {
          margin: 30px auto;
          width: 400px;
          max-width: 90vw;
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
          margin-bottom: 20px;
        }
      `}</style>

      <h2>Expense Tracker</h2>

      <div className="container">
        <h4>Your Balance</h4>
        <h1 id="balance">${total}</h1>

        <div className="inc-exp-container">
          <div>
            <h4>Income</h4>
            <p className="money plus">${income}</p>
          </div>
          <div>
            <h4>Expense</h4>
            <p className="money minus">${expense}</p>
          </div>
        </div>

        <h3>History</h3>
        <ul className="list">
          {transactions.map((transaction) => {
            const sign = transaction.amount < 0 ? '-' : '+';
            return (
              <li
                key={transaction.id}
                className={transaction.amount < 0 ? 'minus' : 'plus'}
              >
                {transaction.text}{' '}
                <span>
                  {sign}${Math.abs(transaction.amount)}
                </span>
                <button
                  className="delete-btn"
                  onClick={() => removeTransaction(transaction.id)}
                >
                  x
                </button>
              </li>
            );
          })}
        </ul>

        <h3>Add new transaction</h3>
        <form onSubmit={addTransaction}>
          <div className="form-control">
            <label htmlFor="text">Text</label>
            <input
              type="text"
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text..."
            />
          </div>
          <div className="form-control">
            <label htmlFor="amount">
              Amount <br />
              (negative - expense, positive - income)
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount..."
            />
          </div>
          <button className="btn">Add transaction</button>
        </form>
      </div>
    </>
  );
}