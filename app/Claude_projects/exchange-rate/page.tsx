"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const CURRENCIES = [
  "AED", "ARS", "AUD", "BGN", "BRL", "BSD", "CAD", "CHF", "CLP", "CNY",
  "COP", "CZK", "DKK", "DOP", "EGP", "EUR", "FJD", "GBP", "GTQ", "HKD",
  "HRK", "HUF", "IDR", "ILS", "INR", "ISK", "JPY", "KRW", "KZT", "MXN",
  "MYR", "NOK", "NZD", "PAB", "PEN", "PHP", "PKR", "PLN", "PYG", "RON",
  "RUB", "SAR", "SEK", "SGD", "THB", "TRY", "TWD", "UAH", "USD", "UYU",
  "VND", "ZAR"
];

interface ExchangeRates {
  [key: string]: number;
}

export default function ExchangeRatePage() {
  const [currencyOne, setCurrencyOne] = useState("USD");
  const [currencyTwo, setCurrencyTwo] = useState("EUR");
  const [amountOne, setAmountOne] = useState("1");
  const [amountTwo, setAmountTwo] = useState("0");
  const [exchangeRate, setExchangeRate] = useState("");
  const [rates, setRates] = useState<ExchangeRates | null>(null);

  const fetchRates = async () => {
    try {
      const response = await fetch("https://open.exchangerate-api.com/v6/latest");
      const data = await response.json();
      setRates(data.rates);
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
    }
  };

  const calculate = () => {
    if (!rates) return;

    const rate = rates[currencyTwo] / rates[currencyOne];
    setExchangeRate(`1 ${currencyOne} = ${rate.toFixed(4)} ${currencyTwo}`);
    setAmountTwo((parseFloat(amountOne || "0") * rate).toFixed(2));
  };

  useEffect(() => {
    fetchRates();
  }, []);

  useEffect(() => {
    if (rates) {
      calculate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currencyOne, currencyTwo, amountOne, rates]);

  const handleSwap = () => {
    setCurrencyOne(currencyTwo);
    setCurrencyTwo(currencyOne);
  };

  return (
    <>
      <style jsx global>{`
        :root {
          --primary-color: #5fbaa7;
        }

        * {
          box-sizing: border-box;
        }

        body {
          background-color: #f4f4f4;
          font-family: Arial, Helvetica, sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
          padding: 20px;
        }

        h1 {
          color: var(--primary-color);
          margin: 20px 0 10px;
        }

        p {
          text-align: center;
          margin: 0 0 20px;
        }

        .money-img {
          width: 150px;
          height: auto;
        }

        .container {
          max-width: 600px;
          width: 100%;
        }

        .currency {
          padding: 40px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .currency select {
          padding: 10px 20px 10px 10px;
          -moz-appearance: none;
          -webkit-appearance: none;
          appearance: none;
          border: 1px solid #dedede;
          font-size: 16px;
          background: transparent;
          background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%20000002%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E');
          background-position: right 10px top 50%, 0, 0;
          background-size: 12px auto, 100%;
          background-repeat: no-repeat;
          cursor: pointer;
        }

        .currency input {
          border: 0;
          background: transparent;
          font-size: 30px;
          text-align: right;
          flex: 1;
          min-width: 0;
        }

        .swap-rate-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .btn {
          color: #fff;
          background: var(--primary-color);
          cursor: pointer;
          border-radius: 5px;
          font-size: 12px;
          padding: 5px 12px;
          border: none;
        }

        .btn:hover {
          opacity: 0.9;
        }

        .rate {
          color: var(--primary-color);
          font-size: 14px;
          padding: 0 10px;
        }

        select:focus,
        input:focus,
        button:focus {
          outline: 0;
        }

        @media (max-width: 600px) {
          .currency input {
            width: 200px;
          }
        }
      `}</style>

      <Image
        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 24 24' fill='none' stroke='%235fbaa7' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='12' y1='1' x2='12' y2='23'%3E%3C/line%3E%3Cpath d='M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'%3E%3C/path%3E%3C/svg%3E"
        alt="Money icon"
        className="money-img"
        width={150}
        height={150}
      />
      <h1>Exchange Rate Calculator</h1>
      <p>Choose the currency and the amounts to get the exchange rate</p>

      <div className="container">
        <div className="currency">
          <select
            value={currencyOne}
            onChange={(e) => setCurrencyOne(e.target.value)}
          >
            {CURRENCIES.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="0"
            value={amountOne}
            onChange={(e) => setAmountOne(e.target.value)}
          />
        </div>

        <div className="swap-rate-container">
          <button className="btn" onClick={handleSwap}>
            Swap
          </button>
          <div className="rate">{exchangeRate}</div>
        </div>

        <div className="currency">
          <select
            value={currencyTwo}
            onChange={(e) => setCurrencyTwo(e.target.value)}
          >
            {CURRENCIES.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="0"
            value={amountTwo}
            readOnly
          />
        </div>
      </div>
    </>
  );
}