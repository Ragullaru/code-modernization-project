"use client";

import Head from "next/head";
import { useEffect, useState } from "react";

const TOTAL_TIME = 7500;
const BREATHE_TIME = TOTAL_TIME * 0.8; // 6000
const HOLD_TIME = TOTAL_TIME * 0.2;    // 1500

const RelaxerPage = () => {
  const [phaseText, setPhaseText] = useState<string>("");

  // "", "grow", or "shrink"
  const [mode, setMode] = useState<"" | "grow" | "shrink">("grow");

  useEffect(() => {
    let breatheTimeout: number | undefined;
    let holdTimeout: number | undefined;
    let intervalId: number | undefined;

    const breathAnimation = () => {
      // Breathe in
      setPhaseText("Breathe In!");
      setMode("grow");

      // After half of breathe time, switch to Hold
      breatheTimeout = window.setTimeout(() => {
        setPhaseText("Hold");

        // After hold time, breathe out
        holdTimeout = window.setTimeout(() => {
          setPhaseText("Breathe Out!");
          setMode("shrink");
        }, HOLD_TIME);
      }, BREATHE_TIME / 2);
    };

    breathAnimation();
    intervalId = window.setInterval(breathAnimation, TOTAL_TIME);

    return () => {
      if (intervalId !== undefined) window.clearInterval(intervalId);
      if (breatheTimeout !== undefined) window.clearTimeout(breatheTimeout);
      if (holdTimeout !== undefined) window.clearTimeout(holdTimeout);
    };
  }, []);

  const containerClass =
    "relax-container" + (mode ? ` relax-${mode}` : "");

  return (
    <>
      <Head>
        <title>Relaxer</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Montserrat&display=swap"
        />
      </Head>

      <h1>Relaxer</h1>

      <div className={containerClass}>
        <div className="relax-circle" />
        <p className="relax-text">{phaseText}</p>

        <div className="relax-pointer-container">
          <span className="relax-pointer" />
        </div>

        <div className="relax-gradient-circle" />
      </div>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html,
        body,
        #__next {
          height: 100%;
        }

        body {
          background: #224941
            url("https://images.pexels.com/photos/261403/pexels-photo-261403.jpeg?auto=compress&cs=tinysrgb&w=1600")
            no-repeat center center / cover;
          font-family: "Montserrat", Arial, sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          min-height: 100vh;
          overflow: hidden;
          margin: 0;
        }

        h1 {
          margin: 50px 0 30px;
          font-size: 45px;
        }

        /* MAIN CIRCLE CONTAINER – now using unique class names */
        .relax-container {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 300px;
          width: 300px;
          margin: auto;
          position: relative;
          transform: scale(1);
          font-size: 22px;
          font-weight: 700;
        }

        .relax-circle {
          background-color: #010f1c;
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          z-index: -1;
          border-radius: 50%;
        }

        .relax-gradient-circle {
          width: 320px;
          height: 320px;
          border-radius: 50%;
          position: absolute;
          top: -10px;
          left: -10px;
          z-index: -2;
          background: conic-gradient(
            #55b7a4 0%,
            #4ca493 40%,
            #fff 40%,
            #fff 60%,
            #336d62 60%,
            #2a5b52 100%
          );
        }

        .relax-text {
          font-size: 24px;
          letter-spacing: 1px;
        }

        .relax-pointer-container {
          position: absolute;
          top: -40px;
          left: 140px;
          width: 20px;
          height: 190px;
          animation: relax-rotate 7.5s linear forwards infinite;
          transform-origin: bottom center;
        }

        .relax-pointer {
          background-color: #fff;
          border-radius: 50%;
          height: 20px;
          width: 20px;
          display: block;
        }

        @keyframes relax-rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .relax-grow {
          animation: relax-grow 3s linear forwards;
        }

        @keyframes relax-grow {
          from {
            transform: scale(1);
          }
          to {
            transform: scale(1.2);
          }
        }

        .relax-shrink {
          animation: relax-shrink 3s linear forwards;
        }

        @keyframes relax-shrink {
          from {
            transform: scale(1.2);
          }
          to {
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
};

export default RelaxerPage;
