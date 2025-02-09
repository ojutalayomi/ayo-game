import { useState } from "react";
import SeedsLayout from "./SeedsLayout";
import { AyoGame } from "./GameLogic";
import "./GameBoard.css";

const GameBoard = () => {
  const [game, setGame] = useState(new AyoGame());
  const gameState = game.getState();

  const handleMove = async (pitIndex) => {
    const newGame = new AyoGame();
    Object.assign(newGame, JSON.parse(JSON.stringify(game)));

    if (await newGame.makeMove(pitIndex)) {
      setGame(newGame);
    }
  };

  const resetGame = () => {
    setGame(new AyoGame());
  };

  const winner =
  gameState.scores[0] > gameState.scores[1]
    ? 1
    : gameState.scores[0] < gameState.scores[1]
    ? 2
    : 0;

  const row = [[0,1,2,3,4,5],[6,7,8,9,10,11]]

  return (
    <div className="ayo-container">
      <div className="game-header">
        {/* <h1 className="game-title">Ayo Game</h1> */}
      </div>

      <div className="score-display">
        <div>Player 1: {gameState.scores[0]} seeds</div>
        <div>Player 2: {gameState.scores[1]} seeds</div>
      </div>

      <div className="game-board ">
        <div className="board-flex flex-col">
          <b>1</b>
          <b>2</b>
        </div>

        <div className="board-grid">
          {gameState.board && gameState.board.map((seeds, index) => {
            // console.log(seeds,39)
            const highlightWinner = winner > 0 && row[winner-1].includes(index)
            const currentRow = row[gameState.currentPlayer].includes(index)
            return (
            <button
              key={`p2-${index}`}
              className={`pit ${highlightWinner ? "green" : currentRow ? "active" :  ""}`}
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
          `Current Player: ${gameState.currentPlayer + 1}`}
        {gameState.gameOver &&
          (() => {
            return winner === 0
              ? "Game Over - It's a tie!"
              : `Game Over - Player ${winner} wins!`;
          })()}
      </div>

      {gameState.gameOver && (
        <button className="play-again" onClick={resetGame}>
          Play Again
        </button>
      )}
    </div>
  );
};

export default GameBoard;
