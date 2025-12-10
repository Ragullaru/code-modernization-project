'use client';

import { useState, useEffect, FormEvent } from 'react';

interface Transaction {
  id: number;
  text: string;
  amount: number;
}

export default function ExpenseTracker() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');

  // Load transactions from localStorage on initial render
  useEffect(() => {
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
  }, []);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Calculate totals
  const amounts = transactions.map(transaction => transaction.amount);
  const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => acc + item, 0)
    .toFixed(2);
  const expense = (
    amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) * -1
  ).toFixed(2);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (text.trim() === '' || amount.trim() === '') {
      alert('Please add a text and amount');
      return;
    }

    const newTransaction: Transaction = {
      id: generateID(),
      text,
      amount: +amount,
    };

    setTransactions([...transactions, newTransaction]);
    setText('');
    setAmount('');
  };

  const removeTransaction = (id: number) => {
    setTransactions(transactions.filter(transaction => transaction.id !== id));
  };

  const generateID = () => {
    return Math.floor(Math.random() * 100000000);
  };

  return (
    <div style={styles.container}>
      <h2>Expense Tracker</h2>

      <div style={styles.innerContainer}>
        <h4>Your Balance</h4>
        <h1 id="balance" style={styles.balance}>${total}</h1>

        <div style={styles.incExpContainer}>
          <div style={styles.incExpItem}>
            <h4>Income</h4>
            <p id="money-plus" style={{ ...styles.money, ...styles.plus }}>
              +${income}
            </p>
          </div>
          <div style={{ ...styles.incExpItem, borderRight: '1px solid #dedede' }}>
            <h4>Expense</h4>
            <p id="money-minus" style={{ ...styles.money, ...styles.minus }}>
              -${expense}
            </p>
          </div>
        </div>

        <h3 style={styles.historyHeader}>History</h3>
        <ul id="list" style={styles.list}>
          {transactions.map(transaction => {
            const sign = transaction.amount < 0 ? '-' : '+';
            const isMinus = transaction.amount < 0;
            
            return (
              <li
                key={transaction.id}
                style={{
                  ...styles.listItem,
                  borderRight: `5px solid ${isMinus ? '#c0392b' : '#2ecc71'}`,
                }}
                className={isMinus ? 'minus' : 'plus'}
              >
                {transaction.text}
                <span>
                  {sign}${Math.abs(transaction.amount)}
                </span>
                <button
                  className="delete-btn"
                  onClick={() => removeTransaction(transaction.id)}
                  style={styles.deleteBtn}
                >
                  x
                </button>
              </li>
            );
          })}
        </ul>

        <h3>Add new transaction</h3>
        <form id="form" onSubmit={handleSubmit}>
          <div style={styles.formControl}>
            <label htmlFor="text">Text</label>
            <input
              type="text"
              id="text"
              placeholder="Enter text..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={styles.input}
            />
          </div>
          <div style={styles.formControl}>
            <label htmlFor="amount">
              Amount <br />
              (negative - expense, positive - income)
            </label>
            <input
              type="number"
              id="amount"
              placeholder="Enter amount..."
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.btn}>
            Add transaction
          </button>
        </form>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css?family=Lato&display=swap');
        
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
        
        .delete-btn {
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .list li:hover .delete-btn {
          opacity: 1;
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
    width: '100%',
  },
  innerContainer: {
    margin: '30px auto',
    width: '400px',
  },
  balance: {
    letterSpacing: '1px',
    margin: 0,
  },
  incExpContainer: {
    backgroundColor: '#fff',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    margin: '20px 0',
  },
  incExpItem: {
    flex: 1,
    textAlign: 'center' as const,
  },
  money: {
    fontSize: '20px',
    letterSpacing: '1px',
    margin: '5px 0',
  },
  plus: {
    color: '#2ecc71',
  },
  minus: {
    color: '#c0392b',
  },
  historyHeader: {
    borderBottom: '1px solid #bbb',
    paddingBottom: '10px',
    margin: '40px 0 10px',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
    marginBottom: '40px',
  },
  listItem: {
    backgroundColor: '#fff',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    color: '#333',
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative' as const,
    padding: '10px',
    margin: '10px 0',
  },
  deleteBtn: {
    cursor: 'pointer',
    backgroundColor: '#e74c3c',
    border: 0,
    color: '#fff',
    fontSize: '20px',
    lineHeight: '20px',
    padding: '2px 5px',
    position: 'absolute' as const,
    top: '50%',
    left: 0,
    transform: 'translate(-100%, -50%)',
  },
  formControl: {
    marginBottom: '10px',
  },
  input: {
    border: '1px solid #dedede',
    borderRadius: '2px',
    display: 'block',
    fontSize: '16px',
    padding: '10px',
    width: '100%',
  },
  btn: {
    cursor: 'pointer',
    backgroundColor: '#9c88ff',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    color: '#fff',
    border: 0,
    display: 'block',
    fontSize: '16px',
    margin: '10px 0 30px',
    padding: '10px',
    width: '100%',
  },
};