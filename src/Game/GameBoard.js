import { useCallback, useEffect, useState } from "react";
import SeedsLayout from "./SeedsLayout";
import { AyoGame } from "./GameLogic";
import "./GameBoard.css";
import { sleep } from "../lib/utils";
import { Computer, UserRound } from "lucide-react"

const GameBoard = () => {
  const [game, setGame] = useState(new AyoGame());
  const gameState = game.getState();
  const [gameMode, setGameMode] = useState('')
  const [isModalOpen, toggleModal] = useState(true)

  

  const generateRandomNumber = () => Math.floor(Math.random() * 6);

  const handleMode = (mode) => {
    setGameMode(mode)
    toggleModal(false)
  }

  const handleMove = useCallback(async (pitIndex) => {
    const newGame = new AyoGame();
    Object.assign(newGame, JSON.parse(JSON.stringify(game)));

    const move = await newGame.makeMove(pitIndex)

    if (move) {
      setGame(newGame);
    }
    return move
  }, [game]);

  useEffect(() => {
    let isMounted = true; // To prevent state updates if the component unmounts
    if (gameMode !== 'computer') return
  
    const handleAIMove = async (delay = true) => {
      if (gameState.currentPlayer === 0 && !gameState.gameOver) {
        if (delay) await sleep(1000); // Delay for 1 second (optional, for realism)
        const randomMove = generateRandomNumber(); // Generate a random move for Player 0
        if (isMounted) {
          const moved = await handleMove(randomMove); // Execute the move
          if (!moved) handleAIMove(false)
        }
      }
    };
  
    handleAIMove();
  
    return () => {
      isMounted = false; // Cleanup to prevent state updates after unmount
    };
  }, [gameMode, gameState.currentPlayer, gameState.gameOver, handleMove]);

  const determineWinner = () => {
    // Check if the game is over
    const isGameOver = gameState.gameOver;
  
    if (!isGameOver) {
      return 4; // No winner yet, game is still in progress
    }
  
    // Compare scores to determine the winner
    if (gameState.scores[0] > gameState.scores[1]) {
      return 1; // Player 1 wins
    } else if (gameState.scores[0] < gameState.scores[1]) {
      return 2; // Player 2 wins
    } else {
      return 0; // It's a draw
    }
  };

  const resetGame = () => {
    setGame(new AyoGame());
    toggleModal(true)
  };

  const row = [[0,1,2,3,4,5],[6,7,8,9,10,11]]

  return (
    <>
    <div className="ayo-container">
      <div className="game-header">
        <h1 className="game-title">Mode: {gameMode.toUpperCase()}</h1>
      </div>

      <div className="score-display">
        <div>Player 1: {gameState.scores[0]} seeds</div>
        <div>Player 2: {gameState.scores[1]} seeds</div>
      </div>

      <div className="game-board">
        <div className="board-flex flex-col">
          <b>1</b>
          <b>2</b>
        </div>

        <div className="board-grid">
          {gameState.board && gameState.board.map((seeds, index) => {
            // console.log(seeds,39)
            const highlightWinner = (determineWinner() > 0 && determineWinner() <= 2) && row[determineWinner() - 1].includes(index)
            const currentRow = row[gameState.currentPlayer].includes(index)
            const currentRoom = gameState.currentRoom === index
            return (
            <button
              key={`p2-${index}`}
              className={`pit ${highlightWinner || currentRoom ? "green" : currentRow ? "active" :  ""}`}
              onClick={() => handleMove(index)}
              disabled={!row[gameState.currentPlayer].includes(index) || gameState.gameOver}
            >
              <SeedsLayout count={seeds} index={index}/>
            </button>
          )})}
        </div>
      </div>

      <div className="game-status">
        {!gameState.gameOver &&
          `Current Player: ${gameState.currentPlayer + 1}`}<br/>
        Total seeds left: {gameState.board.reduce((sum, seeds) => sum + seeds, 0)}<br/>  
        {gameState.gameOver &&
          (() => {
            return determineWinner() === 0
              ? "Game Over - It's a tie!"
              : `Game Over - Player ${determineWinner()} wins!`;
          })()}
      </div>

      <button className="play-again" onClick={resetGame}>
        Restart
      </button>

      {gameState.gameOver && (
        <button className="play-again" onClick={resetGame}>
          Play Again
        </button>
      )}
    </div>

    {isModalOpen && (
      <div className="modal flex flex-col">
        <div className="start-game modal-content">
          <div className="modal-header">Welcome</div>
          <div className="modal-body">
            Choose who you will like to play.
            <div className="row options">
              <div className="flex flex-col one" onClick={() => handleMode('computer')}>
                <Computer />
                Play with Computer
              </div>
              <div className="flex flex-col two" onClick={() => handleMode('friend')}>
                <UserRound />
                Play with Friend
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default GameBoard;
