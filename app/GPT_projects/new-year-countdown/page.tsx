"use client";

import React, { useEffect, useState } from "react";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const NewYearCountdownPage: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Compute current and target year like the original script
  const currentYear = new Date().getFullYear();
  const targetYear = currentYear + 1;

  useEffect(() => {
    // Same target date logic as original: January 01 next year, midnight
    const newYearTime = new Date(`January 01 ${targetYear} 00:00:00`);

    const updateCountdown = () => {
      const currentTime = new Date();
      const diff = newYearTime.getTime() - currentTime.getTime();

      const d = Math.floor(diff / 1000 / 60 / 60 / 24);
      const h = Math.floor(diff / 1000 / 60 / 60) % 24;
      const m = Math.floor(diff / 1000 / 60) % 60;
      const s = Math.floor(diff / 1000) % 60;

      setTimeLeft({
        days: d,
        hours: h,
        minutes: m,
        seconds: s,
      });
    };

    // Initial call then every second
    updateCountdown();
    const intervalId = setInterval(updateCountdown, 1000);

    return () => clearInterval(intervalId);
  }, [targetYear]);

  // Show spinner for 1 second before showing countdown (like original setTimeout)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  // Helper to pad hours/minutes/seconds with leading zero
  const formatTwoDigits = (value: number): string =>
    value < 10 ? `0${value}` : String(value);

  return (
    <>
      <div className="page-root">
        <div id="year" className="year">
          {targetYear}
        </div>

        <h1>New Year Countdown</h1>

        <div
          id="countdown"
          className={`countdown ${isLoading ? "" : "show-countdown"}`}
        >
          <div className="time">
            <h2 id="days">{timeLeft.days}</h2>
            <small>days</small>
          </div>
          <div className="time">
            <h2 id="hours">{formatTwoDigits(timeLeft.hours)}</h2>
            <small>hours</small>
          </div>
          <div className="time">
            <h2 id="minutes">{formatTwoDigits(timeLeft.minutes)}</h2>
            <small>minutes</small>
          </div>
          <div className="time">
            <h2 id="seconds">{formatTwoDigits(timeLeft.seconds)}</h2>
            <small>seconds</small>
          </div>
        </div>

        {/* CSS spinner replacement for the original GIF loader */}
        <div
          id="loading"
          className={`loading ${isLoading ? "show-loading" : ""}`}
        >
          <div className="spinner" />
        </div>
      </div>

      {/* Global styles, adapted from style.css */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css?family=Lato&display=swap");

        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          height: 100%;
        }

        body {
          background-image: url("https://images.unsplash.com/photo-1467810563316-b5476525c0f9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1349&q=80");
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center center;
          color: #fff;
          font-family: "Lato", sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          overflow: hidden;
          position: relative;
        }

        /* Dark overlay */
        body::after {
          content: "";
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          pointer-events: none;
        }

        body * {
          z-index: 1;
        }

        .page-root {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          position: relative;
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
          display: none; /* hidden until loaded */
          transform: scale(2);
        }

        .countdown.show-countdown {
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
        }

        /* Loading spinner container */
        .loading {
          display: none;
          margin-top: 20px;
        }

        .loading.show-loading {
          display: block;
        }

        /* Simple CSS spinner to replace spinner.gif */
        .spinner {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top-color: #fff;
          animation: spin 0.8s linear infinite;
          margin: 0 auto;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
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
    </>
  );
};

export default NewYearCountdownPage;
