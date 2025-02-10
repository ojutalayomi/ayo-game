async function animateSeed(currentPit, board, setCurrentRoom) {
  setCurrentRoom(currentPit);
  board[currentPit]++;
  await new Promise(resolve => setTimeout(resolve, 200)); // 200ms delay per seed
}

export class AyoGame {
  constructor() {
    this.board = Array(12).fill(4)
    this.scores = [0, 0];
    this.currentPlayer = 1;
    this.gameOver = false;
    this.currentRoom = null;
    // console.log(this.board)
  }

  getNextPit(current) {
    if (current === 0) return 6;
    if (current === 11) return 5;
    if (current <= 5) return current - 1;
    if (current >= 6) return current + 1;
    return current;  // Should never reach here
  }

  isInOpponentRow(pit, currentPlayer) {
    return currentPlayer === 0 ? pit >= 6 : pit <= 5;
  }

  async makeMove(pit) {
    if (this.gameOver) return false;
    // console.log(pit,'','23')
        
    // Validate move
    const validPits = this.currentPlayer === 0 ? 
        pit >= 0 && pit <= 5 : pit >= 6 && pit <= 11;
    if (!validPits || this.board[pit] === 0) return false;

    // Collect seeds
    const seeds = this.board[pit];
    this.board[pit] = 0;
    let currentPit = pit;
    const sownPits = [];

    // Sow seeds with animation
    for (let i = 0; i < seeds; i++) {
        currentPit = this.getNextPit(currentPit);
        await animateSeed(currentPit, this.board, (pit) => {
          this.currentRoom = pit;
        });
        sownPits.push(currentPit);
    }

    // Capture seeds
    for (let i = sownPits.length - 1; i >= 0; i--) {
        const p = sownPits[i];
        if (this.isInOpponentRow(p, this.currentPlayer) && 
            (this.board[p] === 2 || this.board[p] === 4)) {
            this.scores[this.currentPlayer] += this.board[p];
            this.board[p] = 0;
        } else {
            break;
        }
    }

    // Switch players
    this.currentPlayer ^= 1;

    // Check game over
    const pitsToCheck = this.currentPlayer === 0 ? 
        [0, 1, 2, 3, 4, 5] : [6, 7, 8, 9, 10, 11];
    if (!pitsToCheck.some(p => this.board[p] > 0)) {
        this.gameOver = true;
        const opponent = this.currentPlayer ^ 1;
        this.scores[opponent] += this.board.reduce((a, b) => a + b, 0);
        this.board.fill(0);
    }

    return true;
  }

  getState() {
    return {
      board: this.board,
      scores: this.scores,
      currentPlayer: this.currentPlayer,
      gameOver: this.gameOver,
      currentRoom: this.currentRoom
    };
  }
}