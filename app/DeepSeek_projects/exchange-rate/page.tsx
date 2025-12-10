'use client';

import { useState, useEffect, useCallback } from 'react';

// Currency data from original HTML
const CURRENCIES = [
  'AED', 'ARS', 'AUD', 'BGN', 'BRL', 'BSD', 'CAD', 'CHF', 'CLP', 'CNY',
  'COP', 'CZK', 'DKK', 'DOP', 'EGP', 'EUR', 'FJD', 'GBP', 'GTQ', 'HKD',
  'HRK', 'HUF', 'IDR', 'ILS', 'INR', 'ISK', 'JPY', 'KRW', 'KZT', 'MXN',
  'MYR', 'NOK', 'NZD', 'PAB', 'PEN', 'PHP', 'PKR', 'PLN', 'PYG', 'RON',
  'RUB', 'SAR', 'SEK', 'SGD', 'THB', 'TRY', 'TWD', 'UAH', 'USD', 'UYU',
  'VND', 'ZAR'
];

interface ExchangeRates {
  rates: Record<string, number>;
}

export default function ExchangeRateCalculator() {
  const [currencyOne, setCurrencyOne] = useState<string>('USD');
  const [currencyTwo, setCurrencyTwo] = useState<string>('EUR');
  const [amountOne, setAmountOne] = useState<string>('1');
  const [amountTwo, setAmountTwo] = useState<string>('');
  const [rate, setRate] = useState<string>('');
  const [ratesData, setRatesData] = useState<ExchangeRates | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch exchange rates on initial load
  useEffect(() => {
    const fetchRates = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://open.exchangerate-api.com/v6/latest');
        const data = await response.json();
        setRatesData(data);
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  // Calculate exchange rate and amount
  const calculate = useCallback(() => {
    if (!ratesData) return;

    const rateValue = ratesData.rates[currencyTwo] / ratesData.rates[currencyOne];
    const calculatedAmount = (parseFloat(amountOne) * rateValue).toFixed(2);
    
    setRate(`1 ${currencyOne} = ${rateValue.toFixed(4)} ${currencyTwo}`);
    setAmountTwo(calculatedAmount);
  }, [ratesData, currencyOne, currencyTwo, amountOne]);

  // Recalculate when dependencies change
  useEffect(() => {
    if (ratesData) {
      calculate();
    }
  }, [ratesData, currencyOne, currencyTwo, amountOne, calculate]);

  const handleAmountOneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string or valid numbers
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmountOne(value);
    }
  };

  const handleAmountTwoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmountTwo(value);
      if (ratesData && value !== '') {
        const reverseRate = ratesData.rates[currencyOne] / ratesData.rates[currencyTwo];
        const calculatedAmount = (parseFloat(value) * reverseRate).toFixed(2);
        setAmountOne(calculatedAmount);
      }
    }
  };

  const handleSwap = () => {
    setCurrencyOne(currencyTwo);
    setCurrencyTwo(currencyOne);
    // Swap amounts as well
    setAmountOne(amountTwo);
    setAmountTwo(amountOne);
  };

  return (
    <div style={styles.container}>
      <img 
        src="/img/money.png" 
        alt="Money" 
        style={styles.moneyImg}
      />
      <h1 style={styles.title}>Exchange Rate Calculator</h1>
      <p style={styles.description}>
        Choose the currency and the amounts to get the exchange rate
      </p>

      <div style={styles.calculatorContainer}>
        {/* First Currency */}
        <div style={styles.currencyRow}>
          <select
            value={currencyOne}
            onChange={(e) => setCurrencyOne(e.target.value)}
            style={styles.select}
            disabled={loading}
          >
            {CURRENCIES.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={amountOne}
            onChange={handleAmountOneChange}
            placeholder="0"
            style={styles.input}
            disabled={loading}
          />
        </div>

        {/* Swap Button and Rate Display */}
        <div style={styles.swapRateContainer}>
          <button
            onClick={handleSwap}
            style={styles.swapButton}
            disabled={loading}
          >
            Swap
          </button>
          <div style={styles.rate}>
            {loading ? 'Loading rates...' : rate}
          </div>
        </div>

        {/* Second Currency */}
        <div style={styles.currencyRow}>
          <select
            value={currencyTwo}
            onChange={(e) => setCurrencyTwo(e.target.value)}
            style={styles.select}
            disabled={loading}
          >
            {CURRENCIES.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={amountTwo}
            onChange={handleAmountTwoChange}
            placeholder="0"
            style={styles.input}
            disabled={loading}
          />
        </div>
      </div>

      <style jsx global>{`
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
          height: 100vh;
          margin: 0;
          padding: 20px;
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
    </div>
  );
}

// Inline styles matching original CSS
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
  },
  moneyImg: {
    width: '150px',
    marginBottom: '20px',
  },
  title: {
    color: '#5fbaa7',
    margin: '10px 0',
  },
  description: {
    textAlign: 'center' as const,
    marginBottom: '30px',
  },
  calculatorContainer: {
    width: '100%',
  },
  currencyRow: {
    padding: '40px 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  select: {
    padding: '10px 20px 10px 10px',
    appearance: 'none' as const,
    border: '1px solid #dedede',
    fontSize: '16px',
    background: 'transparent',
    backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23000002%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')`,
    backgroundPosition: 'right 10px top 50%, 0, 0',
    backgroundSize: '12px auto, 100%',
    backgroundRepeat: 'no-repeat',
    cursor: 'pointer',
  },
  input: {
    border: '0',
    background: 'transparent',
    fontSize: '30px',
    textAlign: 'right' as const,
    width: '200px',
  },
  swapRateContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  swapButton: {
    color: '#fff',
    background: '#5fbaa7',
    cursor: 'pointer',
    borderRadius: '5px',
    fontSize: '12px',
    padding: '5px 12px',
    border: 'none',
  },
  rate: {
    color: '#5fbaa7',
    fontSize: '14px',
    padding: '0 10px',
  },
};