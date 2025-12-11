'use client';

import { useEffect, useRef, useState } from 'react';

export default function RelaxerPage() {
  const [text, setText] = useState('Breathe In!');
  const [containerClass, setContainerClass] = useState('grow');
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const totalTime = 7500;
    const breatheTime = (totalTime / 5) * 2;
    const holdTime = totalTime / 5;

    function breathAnimation() {
      setText('Breathe In!');
      setContainerClass('grow');

      setTimeout(() => {
        setText('Hold');

        setTimeout(() => {
          setText('Breathe Out!');
          setContainerClass('shrink');
        }, holdTime);
      }, breatheTime);
    }

    // Initial animation
    breathAnimation();

    // Set interval for continuous animation
    animationRef.current = setInterval(breathAnimation, totalTime);

    // Cleanup
    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css?family=Montserrat&display=swap');

        * {
          box-sizing: border-box;
        }

        body {
          background: #224941 url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080"><rect fill="%23224941" width="1920" height="1080"/></svg>') no-repeat center center/cover;
          color: #fff;
          font-family: 'Montserrat', sans-serif;
          min-height: 100vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 0;
        }

        html, body {
          height: 100%;
        }
      `}</style>

      <style jsx>{`
        h1 {
          margin-top: 2rem;
        }

        .container {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: auto;
          height: 300px;
          width: 300px;
          position: relative;
          transform: scale(1);
        }

        .circle {
          background-color: #010f1c;
          height: 100%;
          width: 100%;
          border-radius: 50%;
          position: absolute;
          top: 0;
          left: 0;
          z-index: -1;
        }

        .gradient-circle {
          background: conic-gradient(
            #55b7a4 0%,
            #4ca493 40%,
            #fff 40%,
            #fff 60%,
            #336d62 60%,
            #2a5b52 100%
          );
          height: 320px;
          width: 320px;
          z-index: -2;
          border-radius: 50%;
          position: absolute;
          top: -10px;
          left: -10px;
        }

        .pointer {
          background-color: #fff;
          border-radius: 50%;
          height: 20px;
          width: 20px;
          display: block;
        }

        .pointer-container {
          position: absolute;
          top: -40px;
          left: 140px;
          width: 20px;
          height: 190px;
          animation: rotate 7.5s linear forwards infinite;
          transform-origin: bottom center;
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        .container.grow {
          animation: grow 3s linear forwards;
        }

        @keyframes grow {
          from {
            transform: scale(1);
          }

          to {
            transform: scale(1.2);
          }
        }

        .container.shrink {
          animation: shrink 3s linear forwards;
        }

        @keyframes shrink {
          from {
            transform: scale(1.2);
          }

          to {
            transform: scale(1);
          }
        }

        p {
          margin: 0;
          z-index: 1;
          font-size: 1.2rem;
        }
      `}</style>

      <h1>Relaxer</h1>

      <div className={`container ${containerClass}`}>
        <div className="circle"></div>

        <p>{text}</p>

        <div className="pointer-container">
          <span className="pointer"></span>
        </div>

        <div className="gradient-circle"></div>
      </div>
    </>
  );
}