'use client';

import { useState, useEffect } from 'react';

export default function NewYearCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [loading, setLoading] = useState(true);
  const [targetYear, setTargetYear] = useState(new Date().getFullYear() + 1);

  useEffect(() => {
    // Show spinner for 1 second
    const loadingTimer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    // Update countdown every second
    const updateCountdown = () => {
      const currentTime = new Date();
      const newYearTime = new Date(`January 01 ${targetYear} 00:00:00`);
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

    // Initial update
    updateCountdown();

    // Set interval for updates
    const countdownInterval = setInterval(updateCountdown, 1000);

    return () => {
      clearTimeout(loadingTimer);
      clearInterval(countdownInterval);
    };
  }, [targetYear]);

  const formatNumber = (num: number): string => {
    return num < 10 ? `0${num}` : num.toString();
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css?family=Lato&display=swap');

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

        .loading {
          width: 50px;
          height: 50px;
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

      <div className="year">{targetYear}</div>

      <h1>New Year Countdown</h1>

      {loading ? (
        <img
          src="data:image/gif;base64,R0lGODlhIAAgAPUAAP///wAAAJmZmTMzMwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAIAAgAAAG/0CAcEgUDAgFA4BiwSQexKh0eEAkrldAZbvlOD5TqYKALWu5XIwnPFwwymY0GsRgAxrwuJwbCi8aAHlYZ3sVdwtRCm8JgVgODwoQAAIXGRpojQwKRGSDCRESYRsGHYZlBFR5AJt2a3kHQlZlERN2QxMRcAiTeaG2QxJ5RnAOv1EOcEdwUMZDD3BIcKzNq3BJcJLUABBwStrNBtjf3GUGBdLfCtadWMzUz6cDxN/IZQMCvdTBcAIAsli0jOHSJeSAqmlhNr0awo7RJ19TJORqdAXVEEVZyjyKtE3Bg3oZE2iK8oeiKkFZGiCaggelSTiA2LhxiZLBSjZjBL2siNBOFQ84LxHA+mYEiRJzBO7ZCQIAIfkECQoAAAAsAAAAACAAIAAABv9AgHBIFAwIBQPAUCAMBMSodHhAJK5XAPaKOEynCsIWqx0nCIrvcMEwZ90JxkINaMATZXfju9jf82YAIQxRCm14Ww4PChAAEAoPDlsAFRUgHkRiZAkREmoSEXiVlRgfQgeBaXRpo6MOQlZbERN0Qx4drRUcAAJmnrVDBrkVDwNjr8BDGxq5Z2MPyUQZuRgFY6rRABe5FgZjjdm8uRTh2d5b4NkQY0zX5QpjTc/lD2NOx+WSW0++2RJmUGJhmZVsQqgtCE6lqpXGjBchmt50+hQKEAEiht5gUcTIESR9GhlgE9IH0BiTkxrMmWIHDkose9SwcQlHDsOIk9ygiVbl5JgNJEeiWCVwy8qVAEH84LyJEiVROCAMAQAh+QQJCgAAACwAAAAAIAAgAAAG/0CAcEgUDAgFA0BhGBIFQtHhAJK4XvmCYDs4RqiZZYEZkh0bE4sGAmkGlFNfBcIMaMATZXfjdwCPu3BZCm14Ww4PChAAEAoPDlsAFRUgHkRiZAkREmkSEW8bHx5HHwVjjQKJCoBag3IuqhQYA6QABN8oqk41JRAsuo5g1AoHvivaVhcMuRUamaZnOQYNuRafnmA5HMy9v3QhGJtuYH6+1NXBd3pke57e3V48c4JtQukKY0zT3+p1b3+RYkzX8OVqZABTKC9SbOyK9UjRMiemWEEaMOCR4d4QAMC1RVHnRgWPfBz5ZEAl2JV+cFLBySJBCy9EY1aJseOSxTKAKJIJQqICA/PTlBUWrggCACH5BAkKAAAALAAAAAAgACAAAAb/QIBwSBQMCAUDQGEYEgVC0eEAkrheuYJgOzhGqJllgRmSHRsTiwYCaQaUU18FwgxowBNld+N3AI+7cFkKbXhbDg8KEAAQCg8OWwAVFSAeRGJkCRESaRIRbxsfHkcfBWONAokKgFqDci6qFBgDpAAE3yiqTjUlECy6jmDUCge+K9pWFwy5FRqZpmc5Bg25Fp+eYDkczL2/dCEYm25gfr7U1cF3emR7nt7dXjxzgm1C6QpjTNPf6nVvf5FiTNfw5WpkAFMoL1Js7Ir1SNEyJ6ZYQRow4JHh3hAAwLVFUedGBY98HPlkQCXYlX5wUsHJIkELL0RjVomx45LFMoAokglCogID89OUFQIAC1cCADs="
          alt="Loading..."
          className="loading"
        />
      ) : (
        <div className="countdown">
          <div className="time">
            <h2>{timeLeft.days}</h2>
            <small>days</small>
          </div>
          <div className="time">
            <h2>{formatNumber(timeLeft.hours)}</h2>
            <small>hours</small>
          </div>
          <div className="time">
            <h2>{formatNumber(timeLeft.minutes)}</h2>
            <small>minutes</small>
          </div>
          <div className="time">
            <h2>{formatNumber(timeLeft.seconds)}</h2>
            <small>seconds</small>
          </div>
        </div>
      )}
    </>
  );
}