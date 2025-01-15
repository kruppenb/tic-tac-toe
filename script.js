class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.scores = { X: 0, O: 0, Draw: 0 };
        this.gameActive = true;

        // DOM elements
        this.cells = document.querySelectorAll('.cell');
        this.statusElement = document.getElementById('status');
        this.newGameButton = document.getElementById('new-game');
        this.playerScoreElement = document.getElementById('player-score');
        this.computerScoreElement = document.getElementById('computer-score');
        this.drawsElement = document.getElementById('draws');
        this.coinTossElement = document.getElementById('coin-toss');
        this.coinElement = this.coinTossElement.querySelector('.coin');
        this.coinMessageElement = document.getElementById('coin-message');

        // Event listeners
        this.cells.forEach(cell => {
            cell.addEventListener('click', () => this.handleCellClick(cell));
        });
        this.newGameButton.addEventListener('click', () => this.resetGame());

        // Start first game with coin toss
        this.performCoinToss();
    }

    updateStatus() {
        if (!this.gameActive) {
            this.statusElement.textContent = 'Game Over!';
            return;
        }
        
        const isPlayerTurn = this.currentPlayer === 'X';
        this.statusElement.textContent = isPlayerTurn ? 'Your Turn!' : 'Computer Thinking...';
    }

    handleCellClick(cell) {
        const index = cell.dataset.index;
        
        if (this.board[index] || !this.gameActive || this.currentPlayer === 'O') {
            return;
        }

        this.makeMove(index, 'X');
        
        if (this.gameActive) {
            this.currentPlayer = 'O';
            this.updateStatus();
            setTimeout(() => this.makeComputerMove(), 500);
        }
    }

    makeMove(index, player) {
        this.board[index] = player;
        this.cells[index].textContent = player;
        this.cells[index].classList.add(player.toLowerCase());

        const winningCombination = this.checkWinner();
        if (winningCombination) {
            this.handleWin(winningCombination);
        } else if (this.board.every(cell => cell)) {
            this.handleDraw();
        }
    }

    makeComputerMove() {
        // 85% chance of optimal move, 15% chance of random move
        const move = Math.random() < 0.85 ? this.getBestMove() : this.getRandomMove();
        this.makeMove(move, 'O');
        
        if (this.gameActive) {
            this.currentPlayer = 'X';
            this.updateStatus();
        }
    }

    getBestMove() {
        let bestScore = -Infinity;
        let bestMove = 0;

        for (let i = 0; i < 9; i++) {
            if (!this.board[i]) {
                this.board[i] = 'O';
                const score = this.minimax(0, false);
                this.board[i] = '';
                
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }

        return bestMove;
    }

    getRandomMove() {
        const emptyCells = this.board
            .map((cell, index) => cell ? null : index)
            .filter(index => index !== null);
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    minimax(depth, isMaximizing) {
        const winner = this.checkWinner();
        if (winner) {
            return winner.includes('O') ? 1 : -1;
        }
        if (this.board.every(cell => cell)) {
            return 0;
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (!this.board[i]) {
                    this.board[i] = 'O';
                    bestScore = Math.max(bestScore, this.minimax(depth + 1, false));
                    this.board[i] = '';
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (!this.board[i]) {
                    this.board[i] = 'X';
                    bestScore = Math.min(bestScore, this.minimax(depth + 1, true));
                    this.board[i] = '';
                }
            }
            return bestScore;
        }
    }

    checkWinner() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (this.board[a] && 
                this.board[a] === this.board[b] && 
                this.board[a] === this.board[c]) {
                return pattern;
            }
        }
        return null;
    }

    handleWin(combination) {
        this.gameActive = false;
        combination.forEach(index => {
            this.cells[index].classList.add('win');
        });

        const winner = this.board[combination[0]];
        this.scores[winner]++;
        this.updateScores();
        
        this.statusElement.textContent = winner === 'X' 
            ? 'You win!' 
            : 'Computer wins!';
    }

    handleDraw() {
        this.gameActive = false;
        this.scores.Draw++;
        this.updateScores();
        this.statusElement.textContent = "It's a draw!";
    }

    updateScores() {
        this.playerScoreElement.textContent = this.scores.X;
        this.computerScoreElement.textContent = this.scores.O;
        this.drawsElement.textContent = this.scores.Draw;
    }

    performCoinToss() {
        // Reset coin state
        this.coinElement.classList.remove('flipping');
        this.coinMessageElement.classList.remove('show');
        
        // Force reflow to restart animation
        void this.coinElement.offsetWidth;
        
        // Show overlay
        this.coinTossElement.classList.add('active');
        
        // Determine who goes first
        this.currentPlayer = Math.random() < 0.5 ? 'X' : 'O';
        
        // Start coin flip
        requestAnimationFrame(() => {
            this.coinElement.classList.add('flipping');
            
            // Show result message after flip
            setTimeout(() => {
                this.coinMessageElement.textContent = this.currentPlayer === 'X' 
                    ? 'You go first!' 
                    : 'Computer goes first!';
                this.coinMessageElement.classList.add('show');
            }, 2000);

            // Hide overlay and start game
            setTimeout(() => {
                this.coinTossElement.classList.remove('active');
                this.coinElement.classList.remove('flipping');
                this.updateStatus();
                
                if (this.currentPlayer === 'O') {
                    this.makeComputerMove();
                }
            }, 4000);
        });
    }

    resetGame() {
        this.board = Array(9).fill('');
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.className = 'cell';
        });
        this.gameActive = true;
        this.performCoinToss();
    }
}

// Start the game
new TicTacToe();
