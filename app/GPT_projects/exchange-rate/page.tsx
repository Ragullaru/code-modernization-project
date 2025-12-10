"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

const CURRENCIES = [
  "AED",
  "ARS",
  "AUD",
  "BGN",
  "BRL",
  "BSD",
  "CAD",
  "CHF",
  "CLP",
  "CNY",
  "COP",
  "CZK",
  "DKK",
  "DOP",
  "EGP",
  "EUR",
  "FJD",
  "GBP",
  "GTQ",
  "HKD",
  "HRK",
  "HUF",
  "IDR",
  "ILS",
  "INR",
  "ISK",
  "JPY",
  "KRW",
  "KZT",
  "MXN",
  "MYR",
  "NOK",
  "NZD",
  "PAB",
  "PEN",
  "PHP",
  "PKR",
  "PLN",
  "PYG",
  "RON",
  "RUB",
  "SAR",
  "SEK",
  "SGD",
  "THB",
  "TRY",
  "TWD",
  "UAH",
  "USD",
  "UYU",
  "VND",
  "ZAR",
] as const;

type CurrencyCode = (typeof CURRENCIES)[number];

type RatesResponse = {
  rates: Record<string, number>;
  base_code: string;
  time_last_update_unix: number;
};

const fetchRates = async (): Promise<RatesResponse> => {
  const res = await fetch("https://open.exchangerate-api.com/v6/latest");
  if (!res.ok) {
    throw new Error("Failed to fetch exchange rates");
  }
  return res.json();
};

const ExchangeRateCalculatorPage: React.FC = () => {
  const [currencyOne, setCurrencyOne] = useState<CurrencyCode>("USD");
  const [currencyTwo, setCurrencyTwo] = useState<CurrencyCode>("EUR");
  const [amountOne, setAmountOne] = useState<string>("1");
  const [amountTwo, setAmountTwo] = useState<string>("");
  const [rate, setRate] = useState<number | null>(null);
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Load all rates once when the component mounts
  useEffect(() => {
    const loadRates = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchRates();
        setRates(data.rates);
        setLastUpdated(new Date(data.time_last_update_unix * 1000));
      } catch (err) {
        console.error(err);
        setError("Could not load exchange rates. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadRates();
  }, []);

  // Recalculate whenever input or currency selection changes
  useEffect(() => {
    if (!rates) return;

    const rateOne = rates[currencyOne];
    const rateTwo = rates[currencyTwo];

    if (!rateOne || !rateTwo) return;

    const newRate = rateTwo / rateOne;
    setRate(newRate);

    const baseAmount = parseFloat(amountOne || "0");
    if (Number.isNaN(baseAmount)) {
      setAmountTwo("");
    } else {
      setAmountTwo((baseAmount * newRate).toFixed(2));
    }
  }, [rates, currencyOne, currencyTwo, amountOne]);

  const handleSwap = () => {
    setCurrencyOne(currencyTwo);
    setCurrencyTwo(currencyOne);
  };

  const handleAmountOneChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setAmountOne(event.target.value);
  };

  return (
    <main className="page-root">
      <Image
        src="/money.png"
        alt="Money icon"
        className="money-img"
        width={150}
        height={150}
        priority
      />
      <h1>Exchange Rate Calculator</h1>
      <p>Choose the currency and the amounts to get the exchange rate</p>

      <div className="container">
        <div className="currency">
          <select
            id="currency-one"
            value={currencyOne}
            onChange={(e) => setCurrencyOne(e.target.value as CurrencyCode)}
          >
            {CURRENCIES.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
          <input
            type="number"
            id="amount-one"
            placeholder="0"
            value={amountOne}
            onChange={handleAmountOneChange}
            min="0"
            step="0.01"
          />
        </div>

        <div className="swap-rate-container">
          <button className="btn" id="swap" onClick={handleSwap}>
            Swap
          </button>
          <div className="rate" id="rate">
            {isLoading && "Loading rates..."}
            {!isLoading && error && <span>{error}</span>}
            {!isLoading && !error && rate !== null && (
              <span>
                1 {currencyOne} = {rate.toFixed(4)} {currencyTwo}
              </span>
            )}
          </div>
        </div>

        <div className="currency">
          <select
            id="currency-two"
            value={currencyTwo}
            onChange={(e) => setCurrencyTwo(e.target.value as CurrencyCode)}
          >
            {CURRENCIES.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
          <input
            type="number"
            id="amount-two"
            placeholder="0"
            value={amountTwo}
            readOnly
          />
        </div>
      </div>

      {lastUpdated && !error && (
        <p className="last-updated">
          Rates last updated: {lastUpdated.toLocaleString()}
        </p>
      )}

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
          margin: 0;
          padding: 20px;
          color: #222;
        }

        .page-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        h1 {
          color: var(--primary-color);
          margin-bottom: 0.25rem;
        }

        p {
          margin-top: 0.25rem;
          margin-bottom: 0.75rem;
        }

        .btn {
          color: #fff;
          background: var(--primary-color);
          cursor: pointer;
          border-radius: 5px;
          font-size: 12px;
          padding: 5px 12px;
          border: none;
          transition: opacity 0.15s ease-in-out, transform 0.1s ease-in-out;
        }

        .btn:hover {
          opacity: 0.9;
        }

        .btn:active {
          transform: scale(0.97);
        }

        .money-img {
          width: 150px;
          height: auto;
          margin-bottom: 0.5rem;
        }

        .container {
          background: #fff;
          padding: 20px 30px;
          border-radius: 10px;
          box-shadow:
            0 4px 12px rgba(0, 0, 0, 0.08),
            0 1px 3px rgba(0, 0, 0, 0.05);
          max-width: 500px;
          width: 100%;
        }

        .currency {
          padding: 40px 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .currency select {
          padding: 10px 20px 10px 10px;
          -moz-appearance: none;
          -webkit-appearance: none;
          appearance: none;
          border: 1px solid #dedede;
          font-size: 16px;
          background: transparent;
          background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%20000002%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
          background-position: right 10px top 50%, 0, 0;
          background-size: 12px auto, 100%;
          background-repeat: no-repeat;
          border-radius: 4px;
        }

        .currency input {
          border: 0;
          background: transparent;
          font-size: 30px;
          text-align: right;
          flex: 1;
          padding-right: 4px;
        }

        .currency input:read-only {
          cursor: default;
        }

        .swap-rate-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .rate {
          color: var(--primary-color);
          font-size: 14px;
          padding: 0 10px;
          min-height: 1.2em;
          text-align: right;
          flex: 1;
        }

        select:focus,
        input:focus,
        button:focus {
          outline: 2px solid var(--primary-color);
          outline-offset: 2px;
        }

        .last-updated {
          margin-top: 8px;
          font-size: 12px;
          color: #555;
        }

        @media (max-width: 600px) {
          .container {
            padding: 20px;
          }

          .currency {
            flex-direction: column;
            align-items: stretch;
          }

          .currency input {
            width: 100%;
            text-align: left;
            font-size: 24px;
          }

          .swap-rate-container {
            flex-direction: row;
          }
        }
      `}</style>
    </main>
  );
};

export default ExchangeRateCalculatorPage;
