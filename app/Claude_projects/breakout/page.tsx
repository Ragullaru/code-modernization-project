"use client";

import React, { useEffect, useRef, useState } from 'react';

export default function BreakoutGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showRules, setShowRules] = useState(false);
  const [score, setScore] = useState(0);
  
  // Game state refs to persist across renders
  const gameStateRef = useRef({
    score: 0,
    ball: {
      x: 400,
      y: 300,
      size: 10,
      speed: 4,
      dx: 4,
      dy: -4,
      visible: true
    },
    paddle: {
      x: 360,
      y: 580,
      w: 80,
      h: 10,
      speed: 8,
      dx: 0,
      visible: true
    },
    bricks: [] as Array<Array<{
      x: number;
      y: number;
      w: number;
      h: number;
      padding: number;
      offsetX: number;
      offsetY: number;
      visible: boolean;
    }>>,
    animationId: 0
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Type assertion to ensure TypeScript knows ctx is not null
    const context: CanvasRenderingContext2D = ctx;

    const canvasWidth = 800;
    const canvasHeight = 600;
    const brickRowCount = 9;
    const brickColumnCount = 5;
    const delay = 500;

    // Initialize game state
    const state = gameStateRef.current;
    state.score = 0;
    state.ball = {
      x: canvasWidth / 2,
      y: canvasHeight / 2,
      size: 10,
      speed: 4,
      dx: 4,
      dy: -4,
      visible: true
    };
    state.paddle = {
      x: canvasWidth / 2 - 40,
      y: canvasHeight - 20,
      w: 80,
      h: 10,
      speed: 8,
      dx: 0,
      visible: true
    };

    // Create brick props
    const brickInfo = {
      w: 70,
      h: 20,
      padding: 10,
      offsetX: 45,
      offsetY: 60,
      visible: true
    };

    // Create bricks
    state.bricks = [];
    for (let i = 0; i < brickRowCount; i++) {
      state.bricks[i] = [];
      for (let j = 0; j < brickColumnCount; j++) {
        const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
        const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
        state.bricks[i][j] = { x, y, ...brickInfo };
      }
    }

    // Draw ball on canvas
    function drawBall() {
      context.beginPath();
      context.arc(state.ball.x, state.ball.y, state.ball.size, 0, Math.PI * 2);
      context.fillStyle = state.ball.visible ? '#0095dd' : 'transparent';
      context.fill();
      context.closePath();
    }

    // Draw paddle on canvas
    function drawPaddle() {
      context.beginPath();
      context.rect(state.paddle.x, state.paddle.y, state.paddle.w, state.paddle.h);
      context.fillStyle = state.paddle.visible ? '#0095dd' : 'transparent';
      context.fill();
      context.closePath();
    }

    // Draw score on canvas
    function drawScore() {
      context.font = '20px Arial';
      context.fillStyle = '#000';
      context.fillText(`Score: ${state.score}`, canvasWidth - 100, 30);
    }

    // Draw bricks on canvas
    function drawBricks() {
      state.bricks.forEach(column => {
        column.forEach(brick => {
          context.beginPath();
          context.rect(brick.x, brick.y, brick.w, brick.h);
          context.fillStyle = brick.visible ? '#0095dd' : 'transparent';
          context.fill();
          context.closePath();
        });
      });
    }

    // Move paddle on canvas
    function movePaddle() {
      state.paddle.x += state.paddle.dx;

      // Wall detection
      if (state.paddle.x + state.paddle.w > canvasWidth) {
        state.paddle.x = canvasWidth - state.paddle.w;
      }

      if (state.paddle.x < 0) {
        state.paddle.x = 0;
      }
    }

    // Move ball on canvas
    function moveBall() {
      state.ball.x += state.ball.dx;
      state.ball.y += state.ball.dy;

      // Wall collision (right/left)
      if (state.ball.x + state.ball.size > canvasWidth || state.ball.x - state.ball.size < 0) {
        state.ball.dx *= -1;
      }

      // Wall collision (top/bottom)
      if (state.ball.y + state.ball.size > canvasHeight || state.ball.y - state.ball.size < 0) {
        state.ball.dy *= -1;
      }

      // Paddle collision
      if (
        state.ball.x - state.ball.size > state.paddle.x &&
        state.ball.x + state.ball.size < state.paddle.x + state.paddle.w &&
        state.ball.y + state.ball.size > state.paddle.y
      ) {
        state.ball.dy = -state.ball.speed;
      }

      // Brick collision
      state.bricks.forEach(column => {
        column.forEach(brick => {
          if (brick.visible) {
            if (
              state.ball.x - state.ball.size > brick.x &&
              state.ball.x + state.ball.size < brick.x + brick.w &&
              state.ball.y + state.ball.size > brick.y &&
              state.ball.y - state.ball.size < brick.y + brick.h
            ) {
              state.ball.dy *= -1;
              brick.visible = false;
              increaseScore();
            }
          }
        });
      });

      // Hit bottom wall - Lose
      if (state.ball.y + state.ball.size > canvasHeight) {
        showAllBricks();
        state.score = 0;
        setScore(0);
      }
    }

    // Increase score
    function increaseScore() {
      state.score++;
      setScore(state.score);

      if (state.score % (brickRowCount * brickColumnCount) === 0) {
        state.ball.visible = false;
        state.paddle.visible = false;

        // After 0.5 sec restart the game
        setTimeout(function () {
          showAllBricks();
          state.score = 0;
          setScore(0);
          state.paddle.x = canvasWidth / 2 - 40;
          state.paddle.y = canvasHeight - 20;
          state.ball.x = canvasWidth / 2;
          state.ball.y = canvasHeight / 2;
          state.ball.visible = true;
          state.paddle.visible = true;
        }, delay);
      }
    }

    // Make all bricks appear
    function showAllBricks() {
      state.bricks.forEach(column => {
        column.forEach(brick => (brick.visible = true));
      });
    }

    // Draw everything
    function draw() {
      // clear canvas
      context.clearRect(0, 0, canvasWidth, canvasHeight);

      drawBall();
      drawPaddle();
      drawScore();
      drawBricks();
    }

    // Update canvas drawing and animation
    function update() {
      movePaddle();
      moveBall();
      draw();
      state.animationId = requestAnimationFrame(update);
    }

    // Keydown event
    function keyDown(e: KeyboardEvent) {
      if (e.key === 'Right' || e.key === 'ArrowRight') {
        state.paddle.dx = state.paddle.speed;
      } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        state.paddle.dx = -state.paddle.speed;
      }
    }

    // Keyup event
    function keyUp(e: KeyboardEvent) {
      if (
        e.key === 'Right' ||
        e.key === 'ArrowRight' ||
        e.key === 'Left' ||
        e.key === 'ArrowLeft'
      ) {
        state.paddle.dx = 0;
      }
    }

    // Add event listeners
    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);

    // Start the game
    update();

    // Cleanup
    return () => {
      document.removeEventListener('keydown', keyDown);
      document.removeEventListener('keyup', keyUp);
      if (state.animationId) {
        cancelAnimationFrame(state.animationId);
      }
    };
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Breakout!</h1>
      <button
        style={styles.rulesBtn}
        onClick={() => setShowRules(true)}
      >
        Show Rules
      </button>
      <div
        style={{
          ...styles.rules,
          transform: showRules ? 'translateX(0)' : 'translateX(-400px)'
        }}
      >
        <h2>How To Play:</h2>
        <p>
          Use your right and left keys to move the paddle to bounce the ball up
          and break the blocks.
        </p>
        <p>If you miss the ball, your score and the blocks will reset.</p>
        <button
          style={styles.btn}
          onClick={() => setShowRules(false)}
        >
          Close
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={styles.canvas}
      />
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: '#0095dd',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Arial, Helvetica, sans-serif',
    minHeight: '100vh',
    margin: 0,
    position: 'relative',
  },
  title: {
    fontSize: '45px',
    color: '#fff',
  },
  canvas: {
    background: '#f0f0f0',
    display: 'block',
    borderRadius: '5px',
  },
  btn: {
    cursor: 'pointer',
    border: 0,
    padding: '10px 20px',
    background: '#000',
    color: '#fff',
    borderRadius: '5px',
  },
  rulesBtn: {
    cursor: 'pointer',
    border: 0,
    padding: '10px 20px',
    background: '#000',
    color: '#fff',
    borderRadius: '5px',
    position: 'absolute',
    top: '30px',
    left: '30px',
  },
  rules: {
    position: 'absolute',
    top: 0,
    left: 0,
    background: '#333',
    color: '#fff',
    minHeight: '100vh',
    width: '400px',
    padding: '20px',
    lineHeight: '1.5',
    transition: 'transform 1s ease-in-out',
    zIndex: 10,
  },
};