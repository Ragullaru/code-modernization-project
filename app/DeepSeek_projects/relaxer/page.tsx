'use client';

import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';

export default function Relaxer() {
  const [text, setText] = useState<string>('Breathe In!');
  const [animationClass, setAnimationClass] = useState<string>('grow');
  const containerRef = useRef<HTMLDivElement>(null);
  
  const totalTime = 7500;
  const breatheTime = (totalTime / 5) * 2;
  const holdTime = totalTime / 5;

  useEffect(() => {
    const breathAnimation = () => {
      setText('Breathe In!');
      setAnimationClass('grow');

      setTimeout(() => {
        setText('Hold');

        setTimeout(() => {
          setText('Breathe Out!');
          setAnimationClass('shrink');
        }, holdTime);
      }, breatheTime);
    };

    breathAnimation();
    const intervalId = setInterval(breathAnimation, totalTime);

    return () => clearInterval(intervalId);
  }, [breatheTime, holdTime, totalTime]);

  return (
    <>
      <Head>
        <title>Relaxer</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://fonts.googleapis.com/css?family=Montserrat&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="app">
        <h1>Relaxer</h1>

        <div
          ref={containerRef}
          className={`container ${animationClass}`}
          id="container"
        >
          <div className="circle"></div>

          <p id="text">{text}</p>

          <div className="pointer-container">
            <span className="pointer"></span>
          </div>

          <div className="gradient-circle"></div>
        </div>

        <style jsx global>{`
          * {
            box-sizing: border-box;
          }

          body {
            background: #224941 url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80') no-repeat center center/cover;
            color: #fff;
            font-family: 'Montserrat', sans-serif;
            min-height: 100vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 0;
          }

          .app {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            min-height: 100vh;
          }

          h1 {
            margin-top: 2rem;
            font-size: 2.5rem;
            text-align: center;
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

          #text {
            font-size: 1.5rem;
            font-weight: bold;
            z-index: 1;
            text-align: center;
          }
        `}</style>
      </div>
    </>
  );
}