'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

const BREAKOUT = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [showRules, setShowRules] = useState(false);
  
  // Game constants
  const BRICK_ROW_COUNT = 9;
  const BRICK_COLUMN_COUNT = 5;
  const DELAY = 500;
  
  // Game state refs (to persist between renders)
  const ballRef = useRef({
    x: 400,
    y: 300,
    size: 10,
    speed: 4,
    dx: 4,
    dy: -4,
    visible: true
  });
  
  const paddleRef = useRef({
    x: 360,
    y: 580,
    w: 80,
    h: 10,
    speed: 8,
    dx: 0,
    visible: true
  });
  
  const brickInfoRef = useRef({
    w: 70,
    h: 20,
    padding: 10,
    offsetX: 45,
    offsetY: 60,
    visible: true
  });
  
  const bricksRef = useRef<Array<Array<{
    x: number;
    y: number;
    w: number;
    h: number;
    padding: number;
    offsetX: number;
    offsetY: number;
    visible: boolean;
  }>>>([]);
  
  // Initialize bricks
  useEffect(() => {
    const bricks: typeof bricksRef.current = [];
    for (let i = 0; i < BRICK_ROW_COUNT; i++) {
      bricks[i] = [];
      for (let j = 0; j < BRICK_COLUMN_COUNT; j++) {
        const x = i * (brickInfoRef.current.w + brickInfoRef.current.padding) + brickInfoRef.current.offsetX;
        const y = j * (brickInfoRef.current.h + brickInfoRef.current.padding) + brickInfoRef.current.offsetY;
        bricks[i][j] = { ...brickInfoRef.current, x, y, visible: true };
      }
    }
    bricksRef.current = bricks;
  }, []);
  
  // Draw functions
  const drawBall = useCallback((ctx: CanvasRenderingContext2D) => {
    const ball = ballRef.current;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = ball.visible ? '#0095dd' : 'transparent';
    ctx.fill();
    ctx.closePath();
  }, []);
  
  const drawPaddle = useCallback((ctx: CanvasRenderingContext2D) => {
    const paddle = paddleRef.current;
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
    ctx.fillStyle = paddle.visible ? '#0095dd' : 'transparent';
    ctx.fill();
    ctx.closePath();
  }, []);
  
  const drawScore = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 700, 30);
  }, [score]);
  
  const drawBricks = useCallback((ctx: CanvasRenderingContext2D) => {
    bricksRef.current.forEach(column => {
      column.forEach(brick => {
        ctx.beginPath();
        ctx.rect(brick.x, brick.y, brick.w, brick.h);
        ctx.fillStyle = brick.visible ? '#0095dd' : 'transparent';
        ctx.fill();
        ctx.closePath();
      });
    });
  }, []);
  
  // Game logic
  const movePaddle = useCallback(() => {
    const paddle = paddleRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    paddle.x += paddle.dx;
    
    // Wall detection
    if (paddle.x + paddle.w > canvas.width) {
      paddle.x = canvas.width - paddle.w;
    }
    
    if (paddle.x < 0) {
      paddle.x = 0;
    }
  }, []);
  
  const moveBall = useCallback(() => {
    const ball = ballRef.current;
    const paddle = paddleRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    // Wall collision (right/left)
    if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
      ball.dx *= -1;
    }
    
    // Wall collision (top/bottom)
    if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
      ball.dy *= -1;
    }
    
    // Paddle collision
    if (
      ball.x - ball.size > paddle.x &&
      ball.x + ball.size < paddle.x + paddle.w &&
      ball.y + ball.size > paddle.y
    ) {
      ball.dy = -ball.speed;
    }
    
    // Brick collision
    let brickHit = false;
    bricksRef.current.forEach(column => {
      column.forEach(brick => {
        if (brick.visible) {
          if (
            ball.x - ball.size > brick.x &&
            ball.x + ball.size < brick.x + brick.w &&
            ball.y + ball.size > brick.y &&
            ball.y - ball.size < brick.y + brick.h
          ) {
            ball.dy *= -1;
            brick.visible = false;
            brickHit = true;
          }
        }
      });
    });
    
    if (brickHit) {
      setScore(prev => prev + 1);
    }
    
    // Hit bottom wall - Lose
    if (ball.y + ball.size > canvas.height) {
      showAllBricks();
      setScore(0);
    }
  }, []);
  
  const showAllBricks = useCallback(() => {
    bricksRef.current.forEach(column => {
      column.forEach(brick => {
        brick.visible = true;
      });
    });
  }, []);
  
  const increaseScore = useCallback(() => {
    setScore(prev => {
      const newScore = prev + 1;
      
      if (newScore % (BRICK_ROW_COUNT * BRICK_COLUMN_COUNT) === 0) {
        ballRef.current.visible = false;
        paddleRef.current.visible = false;
        
        setTimeout(() => {
          showAllBricks();
          setScore(0);
          paddleRef.current.x = 360;
          paddleRef.current.y = 580;
          ballRef.current.x = 400;
          ballRef.current.y = 300;
          ballRef.current.visible = true;
          paddleRef.current.visible = true;
        }, DELAY);
      }
      
      return newScore;
    });
  }, [showAllBricks]);
  
  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    
    const update = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update game state
      movePaddle();
      moveBall();
      
      // Draw everything
      drawBall(ctx);
      drawPaddle(ctx);
      drawScore(ctx);
      drawBricks(ctx);
      
      animationFrameId = requestAnimationFrame(update);
    };
    
    update();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [drawBall, drawPaddle, drawScore, drawBricks, movePaddle, moveBall]);
  
  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const paddle = paddleRef.current;
      
      if (e.key === 'Right' || e.key === 'ArrowRight') {
        paddle.dx = paddle.speed;
      } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.dx = -paddle.speed;
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      const paddle = paddleRef.current;
      
      if (
        e.key === 'Right' ||
        e.key === 'ArrowRight' ||
        e.key === 'Left' ||
        e.key === 'ArrowLeft'
      ) {
        paddle.dx = 0;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Breakout!</h1>
      
      <button 
        className="btn rules-btn" 
        onClick={() => setShowRules(true)}
        style={styles.rulesBtn}
      >
        Show Rules
      </button>
      
      <div 
        className={`rules ${showRules ? 'show' : ''}`}
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
          className="btn" 
          onClick={() => setShowRules(false)}
          style={styles.closeBtn}
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
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
  },
  title: {
    fontSize: '45px',
    color: '#fff',
    margin: '20px 0',
  },
  rulesBtn: {
    position: 'absolute' as const,
    top: '30px',
    left: '30px',
  },
  rules: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    background: '#333',
    color: '#fff',
    minHeight: '100vh',
    width: '400px',
    padding: '20px',
    lineHeight: 1.5,
    transition: 'transform 1s ease-in-out',
  },
  closeBtn: {
    marginTop: '20px',
  },
  canvas: {
    background: '#f0f0f0',
    display: 'block' as const,
    borderRadius: '5px',
  },
};

export default BREAKOUT;