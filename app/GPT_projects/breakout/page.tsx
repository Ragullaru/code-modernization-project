"use client";

import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";

const BreakoutPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showRules, setShowRules] = useState(false);

    useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const maybeCtx = canvas.getContext("2d");
    if (!maybeCtx) return;
    const context: CanvasRenderingContext2D = maybeCtx;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    let score = 0;

    const brickRowCount = 9;
    const brickColumnCount = 5;
    const delay = 500;

    const ball = {
        x: canvasWidth / 2,
        y: canvasHeight / 2,
        size: 10,
        speed: 4,
        dx: 4,
        dy: -4,
        visible: true,
    };

    const paddle = {
        x: canvasWidth / 2 - 40,
        y: canvasHeight - 20,
        w: 80,
        h: 10,
        speed: 8,
        dx: 0,
        visible: true,
    };

    const brickInfo = {
        w: 70,
        h: 20,
        padding: 10,
        offsetX: 45,
        offsetY: 60,
        visible: true,
    };

    const bricks: {
        x: number;
        y: number;
        w: number;
        h: number;
        padding: number;
        offsetX: number;
        offsetY: number;
        visible: boolean;
    }[][] = [];

    for (let i = 0; i < brickRowCount; i++) {
        bricks[i] = [];
        for (let j = 0; j < brickColumnCount; j++) {
        const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
        const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
        bricks[i][j] = { x, y, ...brickInfo };
        }
    }

    function drawBall() {
        context.beginPath();
        context.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
        context.fillStyle = ball.visible ? "#0095dd" : "transparent";
        context.fill();
        context.closePath();
    }

    function drawPaddle() {
        context.beginPath();
        context.rect(paddle.x, paddle.y, paddle.w, paddle.h);
        context.fillStyle = paddle.visible ? "#0095dd" : "transparent";
        context.fill();
        context.closePath();
    }

    function drawScore() {
        context.font = "20px Arial";
        context.fillStyle = "#000";
        context.fillText(`Score: ${score}`, canvasWidth - 120, 30);
    }

    function drawBricks() {
        bricks.forEach((column) => {
        column.forEach((brick) => {
            context.beginPath();
            context.rect(brick.x, brick.y, brick.w, brick.h);
            context.fillStyle = brick.visible ? "#0095dd" : "transparent";
            context.fill();
            context.closePath();
        });
        });
    }

    function movePaddle() {
        paddle.x += paddle.dx;

        if (paddle.x + paddle.w > canvasWidth) {
        paddle.x = canvasWidth - paddle.w;
        }

        if (paddle.x < 0) {
        paddle.x = 0;
        }
    }

    function showAllBricks() {
        bricks.forEach((column) => {
        column.forEach((brick) => {
            brick.visible = true;
        });
        });
    }

    function increaseScore() {
        score += 1;

        if (score % (brickRowCount * brickColumnCount) === 0) {
        ball.visible = false;
        paddle.visible = false;

        setTimeout(() => {
            showAllBricks();
            score = 0;
            paddle.x = canvasWidth / 2 - 40;
            paddle.y = canvasHeight - 20;
            ball.x = canvasWidth / 2;
            ball.y = canvasHeight / 2;
            ball.visible = true;
            paddle.visible = true;
        }, delay);
        }
    }

    function moveBall() {
        ball.x += ball.dx;
        ball.y += ball.dy;

        if (ball.x + ball.size > canvasWidth || ball.x - ball.size < 0) {
        ball.dx *= -1;
        }

        if (ball.y + ball.size > canvasHeight || ball.y - ball.size < 0) {
        ball.dy *= -1;
        }

        if (
        ball.x - ball.size > paddle.x &&
        ball.x + ball.size < paddle.x + paddle.w &&
        ball.y + ball.size > paddle.y
        ) {
        ball.dy = -ball.speed;
        }

        bricks.forEach((column) => {
        column.forEach((brick) => {
            if (brick.visible) {
            if (
                ball.x - ball.size > brick.x &&
                ball.x + ball.size < brick.x + brick.w &&
                ball.y + ball.size > brick.y &&
                ball.y - ball.size < brick.y + brick.h
            ) {
                ball.dy *= -1;
                brick.visible = false;
                increaseScore();
            }
            }
        });
        });

        if (ball.y + ball.size > canvasHeight) {
        showAllBricks();
        score = 0;
        }
    }

    function draw() {
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        drawBall();
        drawPaddle();
        drawScore();
        drawBricks();
    }

    let animationFrameId: number;

    function update() {
        movePaddle();
        moveBall();
        draw();
        animationFrameId = window.requestAnimationFrame(update);
    }

    update();

    function keyDown(e: KeyboardEvent) {
        if (e.key === "Right" || e.key === "ArrowRight") {
        paddle.dx = paddle.speed;
        } else if (e.key === "Left" || e.key === "ArrowLeft") {
        paddle.dx = -paddle.speed;
        }
    }

    function keyUp(e: KeyboardEvent) {
        if (
        e.key === "Right" ||
        e.key === "ArrowRight" ||
        e.key === "Left" ||
        e.key === "ArrowLeft"
        ) {
        paddle.dx = 0;
        }
    }

    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);

    return () => {
        window.cancelAnimationFrame(animationFrameId);
        window.removeEventListener("keydown", keyDown);
        window.removeEventListener("keyup", keyUp);
    };
    }, []);


  return (
    <>
      <Head>
        <title>Breakout!</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main>
        <h1>Breakout!</h1>
        <button
          id="rules-btn"
          className="btn rules-btn"
          onClick={() => setShowRules(true)}
        >
          Show Rules
        </button>

        <div id="rules" className={`rules ${showRules ? "show" : ""}`}>
          <h2>How To Play:</h2>
          <p>
            Use your right and left arrow keys to move the paddle to bounce the
            ball up and break the blocks.
          </p>
          <p>If you miss the ball, your score and the blocks will reset.</p>
          <button
            id="close-btn"
            className="btn"
            onClick={() => setShowRules(false)}
          >
            Close
          </button>
        </div>

        <canvas id="canvas" ref={canvasRef} width={800} height={600} />
      </main>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
          background-color: #0095dd;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: Arial, Helvetica, sans-serif;
          min-height: 100vh;
          margin: 0;
        }

        main {
          position: relative;
        }

        h1 {
          font-size: 45px;
          color: #fff;
          margin-bottom: 20px;
        }

        canvas {
          background: #f0f0f0;
          display: block;
          border-radius: 5px;
        }

        .btn {
          cursor: pointer;
          border: 0;
          padding: 10px 20px;
          background: #000;
          color: #fff;
          border-radius: 5px;
        }

        .btn:focus {
          outline: 0;
        }

        .btn:hover {
          background: #222;
        }

        .btn:active {
          transform: scale(0.98);
        }

        /* ⬇️ change this block */
        .rules-btn {
          position: fixed;  /* was absolute */
          top: 30px;
          left: 30px;
          z-index: 20;
        }

        .rules {
          position: fixed;
          top: 0;
          left: 0;
          background: #333;
          color: #fff;
          min-height: 100vh;
          width: 400px;
          padding: 20px;
          line-height: 1.5;
          transform: translateX(-400px);
          transition: transform 1s ease-in-out;
          z-index: 10;
        }

        .rules.show {
          transform: translateX(0);
        }
      `}</style>
    </>
  );
};

export default BreakoutPage;
