'use client';

import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';

export default function NewYearCountdown() {
  const [days, setDays] = useState('00');
  const [hours, setHours] = useState('00');
  const [minutes, setMinutes] = useState('00');
  const [seconds, setSeconds] = useState('00');
  const [nextYear, setNextYear] = useState<number>(0);
  const [showCountdown, setShowCountdown] = useState(false);
  const [showSpinner, setShowSpinner] = useState(true);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const newYearTimeRef = useRef<Date | null>(null);

  // Initialize next year and new year time
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    setNextYear(nextYear);
    newYearTimeRef.current = new Date(`January 01 ${nextYear} 00:00:00`);
  }, []);

  // Update countdown function
  const updateCountdown = () => {
    if (!newYearTimeRef.current) return;

    const currentTime = new Date();
    const diff = newYearTimeRef.current.getTime() - currentTime.getTime();

    if (diff <= 0) {
      // New year has arrived, reload the page to get new year
      window.location.reload();
      return;
    }

    const d = Math.floor(diff / 1000 / 60 / 60 / 24);
    const h = Math.floor(diff / 1000 / 60 / 60) % 24;
    const m = Math.floor(diff / 1000 / 60) % 60;
    const s = Math.floor(diff / 1000) % 60;

    setDays(d.toString());
    setHours(h < 10 ? '0' + h : h.toString());
    setMinutes(m < 10 ? '0' + m : m.toString());
    setSeconds(s < 10 ? '0' + s : s.toString());
  };

  // Set up countdown interval and spinner timeout
  useEffect(() => {
    // Show spinner for 1 second, then show countdown
    const spinnerTimeout = setTimeout(() => {
      setShowSpinner(false);
      setShowCountdown(true);
      updateCountdown(); // Initial update
    }, 1000);

    // Set up countdown interval
    intervalRef.current = setInterval(updateCountdown, 1000);

    // Cleanup
    return () => {
      clearTimeout(spinnerTimeout);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <>
      <Head>
        <title>New Year Countdown</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <link
          href="https://fonts.googleapis.com/css?family=Lato&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="container">
        <div className="year">{nextYear}</div>

        <h1>New Year Countdown</h1>

        <div className={`countdown ${showCountdown ? 'show' : 'hide'}`}>
          <div className="time">
            <h2 id="days">{days}</h2>
            <small>days</small>
          </div>
          <div className="time">
            <h2 id="hours">{hours}</h2>
            <small>hours</small>
          </div>
          <div className="time">
            <h2 id="minutes">{minutes}</h2>
            <small>minutes</small>
          </div>
          <div className="time">
            <h2 id="seconds">{seconds}</h2>
            <small>seconds</small>
          </div>
        </div>

        {showSpinner && (
          <img
            src="https://cdnjs.cloudflare.com/ajax/libs/galleriffic/2.0.1/css/loader.gif"
            alt="Loading..."
            className="loading"
          />
        )}

        <style jsx global>{`
          * {
            box-sizing: border-box;
          }

          body {
            background-image: url('https://images.unsplash.com/photo-1467810563316-b5476525c0f9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1349&q=80');
            background-repeat: no-repeat;
            background-size: cover;
            background-position: center center;
            height: 100vh;
            color: #fff;
            font-family: 'Lato', sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            margin: 0;
            overflow: hidden;
          }

          /* Add a dark overlay */
          body::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
          }

          body * {
            z-index: 1;
          }

          .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            width: 100%;
            height: 100%;
          }

          h1 {
            font-size: 60px;
            margin: -80px 0 40px;
          }

          .year {
            font-size: 200px;
            z-index: -1;
            opacity: 0.2;
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
          }

          .countdown {
            display: flex;
            transform: scale(2);
          }

          .countdown.hide {
            display: none;
          }

          .countdown.show {
            display: flex;
          }

          .time {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin: 15px;
          }

          .time h2 {
            margin: 0 0 5px;
            font-size: 24px;
          }

          .loading {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }

          @media (max-width: 500px) {
            h1 {
              font-size: 45px;
            }

            .time {
              margin: 5px;
            }

            .time h2 {
              font-size: 12px;
              margin: 0;
            }

            .time small {
              font-size: 10px;
            }
          }
        `}</style>
      </div>
    </>
  );
}