import React, { useRef, useEffect, useCallback, useReducer } from "react";

import { useFrame, Canvas } from "./core";

import type { CanvasCircleElement, CanvasRectElement } from "./core";

const rows = 5;
const cols = 10;
const brickWidth = 60;
const brickHeight = 20;
const brickPadding = 10;
const offsetTop = 50;
const offsetLeft = 35;

interface BrickType {
  x: number;
  y: number;
  width: number;
  height: number;
  destroyed: boolean;
}

interface BrickProps {
  brick: BrickType;
}

const Brick: React.FC<BrickProps> = ({ brick }) => {
  return <canvasRect x={brick.x} y={brick.y} width={brick.width} height={brick.height} fillStyle="#FAFAFA" lineWidth={2} />;
};

interface PaddleProps {
  x: number;
  y: number;
}

const Paddle = React.forwardRef<CanvasRectElement, PaddleProps>(({ x, y }, ref) => {
  return <canvasRect ref={ref} x={x} y={y} width={100} height={20} fillStyle="white" />;
});

interface BallProps {
  x: number;
  y: number;
}

const Ball = React.forwardRef<CanvasCircleElement, BallProps>(({ x, y }, ref) => {
  return <canvasCircle ref={ref} x={x} y={y} radius={10} fillStyle="#FAFAFA" />;
});

interface ScoreProps {
  score: number;
}

const Score: React.FC<ScoreProps> = ({ score }) => {
  return <canvasText x={10} y={30} text={`Score: ${score}`} color="white" font="20px Arial" />;
};

const pixelSize = 5;
const heartColor = "red";
const heartShape = [
  [0, 1, 1, 0, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 0, 1, 0, 0, 0],
];
interface PixelatedHeartProps {
  x: number;
  y: number;
}
const PixelatedHeart: React.FC<PixelatedHeartProps> = ({ x, y }) => {
  return (
    <canvasRect x={x} y={y} width={pixelSize} height={pixelSize}>
      {heartShape.map((row, rowIndex) =>
        row.map(
          (pixel, columnIndex) =>
            pixel === 1 && (
              <canvasRect
                key={`${rowIndex}-${columnIndex}`}
                x={columnIndex * pixelSize}
                y={rowIndex * pixelSize}
                width={pixelSize}
                height={pixelSize}
                color={heartColor}
              />
            )
        )
      )}
    </canvasRect>
  );
};

interface LivesProps {
  lives: number;
}
const Lives: React.FC<LivesProps> = ({ lives }) => {
  return (
    <canvasRect x={window.innerWidth - 50} y={30}>
      {Array.from({ length: lives }).map((_, i) => (
        <PixelatedHeart key={i} x={-i * 50} y={0} />
      ))}
    </canvasRect>
  );
};

interface GameOverScreenProps {
  gameWon: boolean;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ gameWon }) => {
  return (
    <>
      <canvasRect x={0} y={0} width={window.innerWidth} height={window.innerHeight} fillStyle="rgba(0, 0, 0, 0.7)" />
      <canvasText x={window.innerWidth / 2} y={window.innerHeight / 2 - 30} text={gameWon ? "You win!" : "Game over"} color="white" font="40px Arial" />
    </>
  );
};

interface GameState {
  bricks: BrickType[];
  score: number;
  lives: number;
  gameOver: boolean;
  gameWon: boolean;
}

type GameAction =
  | { type: "INITIALIZE_BRICKS"; payload: BrickType[] }
  | { type: "HIT_BRICK"; payload: { index: number; x: number; y: number } }
  | { type: "LOSE_LIFE" }
  | { type: "RESET_GAME"; payload: BrickType[] }
  | { type: "SET_GAME_WON" };

const initialState: GameState = {
  bricks: [],
  score: 0,
  lives: 3,
  gameOver: false,
  gameWon: false,
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case "INITIALIZE_BRICKS":
      return { ...state, bricks: action.payload };
    case "HIT_BRICK": {
      const updatedBricks = state.bricks.map((brick, index) => (index === action.payload.index ? { ...brick, destroyed: true } : brick));
      const gameWon = updatedBricks.every((brick) => brick.destroyed);
      return {
        ...state,
        bricks: updatedBricks,
        score: state.score + 10,
        gameWon,
      };
    }
    case "LOSE_LIFE": {
      const lives = state.lives - 1;
      return {
        ...state,
        lives,
        gameOver: lives <= 0,
      };
    }
    case "RESET_GAME":
      return {
        ...state,
        bricks: action.payload,
        score: 0,
        lives: 3,
        gameOver: false,
        gameWon: false,
      };
    case "SET_GAME_WON":
      return {
        ...state,
        gameWon: true,
      };
    default:
      return state;
  }
};

const useGameReducer = () => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const initializeBricks = useCallback(() => {
    const bricksArray: BrickType[] = [];
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        bricksArray.push({
          x: c * (brickWidth + brickPadding) + offsetLeft,
          y: r * (brickHeight + brickPadding) + offsetTop,
          width: brickWidth,
          height: brickHeight,
          destroyed: false,
        });
      }
    }
    dispatch({ type: "INITIALIZE_BRICKS", payload: bricksArray });
  }, [dispatch]);

  const hitBrick = useCallback(
    (index: number, x: number, y: number) => {
      dispatch({ type: "HIT_BRICK", payload: { index, x, y } });
    },
    [dispatch]
  );

  const loseLife = useCallback(() => {
    dispatch({ type: "LOSE_LIFE" });
  }, [dispatch]);

  const resetGame = useCallback(() => {
    const bricksArray: BrickType[] = [];
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        bricksArray.push({
          x: c * (brickWidth + brickPadding) + offsetLeft,
          y: r * (brickHeight + brickPadding) + offsetTop,
          width: brickWidth,
          height: brickHeight,
          destroyed: false,
        });
      }
    }
    dispatch({ type: "RESET_GAME", payload: bricksArray });
  }, [dispatch]);

  return {
    state,
    initializeBricks,
    hitBrick,
    loseLife,
    resetGame,
  };
};

const useGameLogic = () => {
  const paddleRef = useRef<CanvasRectElement | null>(null);
  const ballRef = useRef<CanvasCircleElement | null>(null);
  const ballVelocity = useRef({ dx: 4, dy: -4 });

  const {
    state: { bricks, score, lives, gameOver, gameWon },
    initializeBricks,
    hitBrick,
    loseLife,
  } = useGameReducer();

  const mouseXRef = useRef(window.innerWidth / 2);

  useEffect(() => {
    initializeBricks();
  }, [initializeBricks]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseXRef.current = e.clientX;
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  useFrame((delta, stop) => {
    if (gameOver || gameWon) return stop();

    if (paddleRef.current) {
      const paddleWidth = 100;
      paddleRef.current.x = mouseXRef.current - paddleWidth / 2;
    }

    if (ballRef.current) {
      const ball = ballRef.current;
      const ballRadius = 10;

      const adjustedDx = (ballVelocity.current.dx * delta) / 10;
      const adjustedDy = (ballVelocity.current.dy * delta) / 10;

      ball.x += adjustedDx;
      ball.y += adjustedDy;

      if (ball.x + ballRadius * 2 > window.innerWidth || ball.x < 0) {
        ballVelocity.current.dx = -ballVelocity.current.dx;
      }
      if (ball.y < 0) {
        ballVelocity.current.dy = -ballVelocity.current.dy;
      }

      if (
        paddleRef.current &&
        ball.y + ballRadius * 2 > paddleRef.current.y &&
        ball.x + ballRadius > paddleRef.current.x &&
        ball.x < paddleRef.current.x + 100
      ) {
        ballVelocity.current.dy = -Math.abs(ballVelocity.current.dy);
      }

      let hitBrickIndex = -1;
      for (let index = 0; index < bricks.length; index++) {
        const brick = bricks[index];
        if (
          !brick.destroyed &&
          ball.x + ballRadius * 2 > brick.x &&
          ball.x < brick.x + brick.width &&
          ball.y + ballRadius * 2 > brick.y &&
          ball.y < brick.y + brick.height
        ) {
          ballVelocity.current.dy = -ballVelocity.current.dy;
          hitBrickIndex = index;
          break;
        }
      }

      if (hitBrickIndex >= 0) {
        const hitBrickData = bricks[hitBrickIndex];
        hitBrick(hitBrickIndex, hitBrickData.x + hitBrickData.width / 2, hitBrickData.y + hitBrickData.height / 2);
      }

      if (ball.y + ballRadius * 2 > window.innerHeight) {
        if (lives > 1) {
          loseLife();
          ball.x = window.innerWidth / 2;
          ball.y = window.innerHeight - 60;
          ballVelocity.current.dy = -4;
        } else {
          loseLife();
        }
      }
    }
  });

  return {
    paddleRef,
    ballRef,
    score,
    lives,
    gameOver,
    gameWon,
    bricks,
  };
};

const BrickBreaker: React.FC = () => {
  const { paddleRef, ballRef, score, lives, gameOver, gameWon, bricks } = useGameLogic();

  return (
    <>
      <canvasRect x={0} y={0} width={window.innerWidth} height={window.innerHeight} fillStyle="#09090B" />

      {bricks.map((brick, index) => !brick.destroyed && <Brick key={index} brick={brick} />)}

      <Paddle ref={paddleRef} x={window.innerWidth / 2 - 50} y={window.innerHeight - 30} />

      <Ball ref={ballRef} x={window.innerWidth / 2} y={window.innerHeight - 60} />

      <Score score={score} />
      <Lives lives={lives} />

      {(gameOver || gameWon) && <GameOverScreen gameWon={gameWon} />}
    </>
  );
};

export const CanvasSimple: React.FC = () => {
  return (
    <Canvas>
      <BrickBreaker />
    </Canvas>
  );
};
