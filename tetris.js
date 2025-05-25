class Tetromino {
    constructor(type) {
        this.type = type;
        this.x = 3;
        this.y = 0;
        this.rotation = 0;
        this.shapes = this.getShapes();
        this.color = this.getColor();
    }

    get shape() {
        return this.shapes[this.rotation];
    }

    getShapes() {
        const shapes = {
            'I': [
                [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]],
                [[0,0,1,0], [0,0,1,0], [0,0,1,0], [0,0,1,0]],
                [[0,0,0,0], [0,0,0,0], [1,1,1,1], [0,0,0,0]],
                [[0,1,0,0], [0,1,0,0], [0,1,0,0], [0,1,0,0]]
            ],
            'O': [
                [[1,1], [1,1]],
                [[1,1], [1,1]],
                [[1,1], [1,1]],
                [[1,1], [1,1]]
            ],
            'T': [
                [[0,1,0], [1,1,1], [0,0,0]],
                [[0,1,0], [0,1,1], [0,1,0]],
                [[0,0,0], [1,1,1], [0,1,0]],
                [[0,1,0], [1,1,0], [0,1,0]]
            ],
            'S': [
                [[0,1,1], [1,1,0], [0,0,0]],
                [[0,1,0], [0,1,1], [0,0,1]],
                [[0,0,0], [0,1,1], [1,1,0]],
                [[1,0,0], [1,1,0], [0,1,0]]
            ],
            'Z': [
                [[1,1,0], [0,1,1], [0,0,0]],
                [[0,0,1], [0,1,1], [0,1,0]],
                [[0,0,0], [1,1,0], [0,1,1]],
                [[0,1,0], [1,1,0], [1,0,0]]
            ],
            'J': [
                [[1,0,0], [1,1,1], [0,0,0]],
                [[0,1,1], [0,1,0], [0,1,0]],
                [[0,0,0], [1,1,1], [0,0,1]],
                [[0,1,0], [0,1,0], [1,1,0]]
            ],
            'L': [
                [[0,0,1], [1,1,1], [0,0,0]],
                [[0,1,0], [0,1,0], [0,1,1]],
                [[0,0,0], [1,1,1], [1,0,0]],
                [[1,1,0], [0,1,0], [0,1,0]]
            ]
        };
        return shapes[this.type] || shapes['I'];
    }

    getColor() {
        const colors = {
            'I': '#00f5ff',
            'O': '#ffff00',
            'T': '#800080',
            'S': '#00ff00',
            'Z': '#ff0000',
            'J': '#0000ff',
            'L': '#ff8000'
        };
        return colors[this.type] || '#888888';
    }

    rotate() {
        this.rotation = (this.rotation + 1) % 4;
    }

    moveLeft() {
        this.x--;
    }

    moveRight() {
        this.x++;
    }

    moveDown() {
        this.y++;
    }
}

class TetrisGame {
    constructor() {
        this.board = this.createBoard();
        this.currentTetromino = null;
        this.score = 0;
        this.gameOver = false;
        this.gameStarted = false;
        this.dropTime = 0;
        this.dropInterval = 1000;
        
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.startBtn = document.getElementById('startBtn');
        this.restartBtn = document.getElementById('restartBtn');
        
        this.initializeControls();
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    createBoard() {
        return Array(20).fill().map(() => Array(10).fill(0));
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        const maxWidth = Math.min(300, container.clientWidth - 40);
        const maxHeight = maxWidth * 2;
        
        this.canvas.width = maxWidth;
        this.canvas.height = maxHeight;
        this.blockSize = maxWidth / 10;
    }

    initializeControls() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.restartBtn.addEventListener('click', () => this.restartGame());
        
        document.addEventListener('keydown', (e) => {
            if (!this.gameStarted || this.gameOver) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.moveTetromino(-1, 0);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.moveTetromino(1, 0);
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.moveTetromino(0, 1);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.rotateTetromino();
                    break;
            }
        });
    }

    startGame() {
        this.gameStarted = true;
        this.gameOver = false;
        this.score = 0;
        this.board = this.createBoard();
        this.currentTetromino = this.generateTetromino();
        this.updateScore();
        
        this.startBtn.disabled = true;
        this.restartBtn.disabled = false;
        
        this.gameLoop();
    }

    restartGame() {
        this.gameStarted = false;
        this.startGame();
    }

    generateTetromino() {
        const types = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        return new Tetromino(randomType);
    }

    gameLoop() {
        if (!this.gameStarted) return;
        
        const now = Date.now();
        if (now - this.dropTime > this.dropInterval) {
            this.dropTetromino();
            this.dropTime = now;
        }
        
        this.draw();
        
        if (!this.gameOver) {
            requestAnimationFrame(() => this.gameLoop());
        } else {
            this.endGame();
        }
    }

    dropTetromino() {
        if (this.checkCollision(this.currentTetromino, 0, 1)) {
            this.placeTetromino();
            const linesCleared = this.clearLines();
            if (linesCleared > 0) {
                this.addScore(linesCleared);
            }
            this.currentTetromino = this.generateTetromino();
            
            if (this.checkGameOver()) {
                this.gameOver = true;
            }
        } else {
            this.currentTetromino.moveDown();
        }
    }

    moveTetromino(dx, dy) {
        if (!this.checkCollision(this.currentTetromino, dx, dy)) {
            this.currentTetromino.x += dx;
            this.currentTetromino.y += dy;
        }
    }

    rotateTetromino() {
        const originalRotation = this.currentTetromino.rotation;
        this.currentTetromino.rotate();
        
        if (this.checkCollision(this.currentTetromino, 0, 0)) {
            this.currentTetromino.rotation = originalRotation;
        }
    }

    checkCollision(tetromino, dx, dy) {
        const newX = tetromino.x + dx;
        const newY = tetromino.y + dy;
        
        for (let row = 0; row < tetromino.shape.length; row++) {
            for (let col = 0; col < tetromino.shape[row].length; col++) {
                if (tetromino.shape[row][col]) {
                    const boardX = newX + col;
                    const boardY = newY + row;
                    
                    if (boardX < 0 || boardX >= 10 || boardY >= 20) {
                        return true;
                    }
                    
                    if (boardY >= 0 && this.board[boardY][boardX]) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    placeTetromino() {
        for (let row = 0; row < this.currentTetromino.shape.length; row++) {
            for (let col = 0; col < this.currentTetromino.shape[row].length; col++) {
                if (this.currentTetromino.shape[row][col]) {
                    const boardX = this.currentTetromino.x + col;
                    const boardY = this.currentTetromino.y + row;
                    
                    if (boardY >= 0) {
                        this.board[boardY][boardX] = this.currentTetromino.color;
                    }
                }
            }
        }
    }

    clearLines() {
        let linesCleared = 0;
        
        for (let row = 19; row >= 0; row--) {
            if (this.board[row].every(cell => cell !== 0)) {
                this.board.splice(row, 1);
                this.board.unshift(Array(10).fill(0));
                linesCleared++;
                row++;
            }
        }
        
        return linesCleared;
    }

    addScore(lines) {
        const baseScore = 100;
        const multipliers = [0, 1, 3, 5, 8];
        this.score += baseScore * (multipliers[lines] || lines);
        this.updateScore();
    }

    updateScore() {
        this.scoreElement.textContent = this.score;
    }

    checkGameOver() {
        return this.board[0].some(cell => cell !== 0) || this.board[1].some(cell => cell !== 0);
    }

    endGame() {
        this.gameStarted = false;
        this.startBtn.disabled = false;
        this.restartBtn.disabled = false;
        
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = `${this.canvas.width / 10}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.fillText(`スコア: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 40);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawBoard();
        if (this.currentTetromino) {
            this.drawTetromino(this.currentTetromino);
        }
        this.drawGrid();
    }

    drawBoard() {
        for (let row = 0; row < this.board.length; row++) {
            for (let col = 0; col < this.board[row].length; col++) {
                if (this.board[row][col]) {
                    this.ctx.fillStyle = this.board[row][col];
                    this.ctx.fillRect(
                        col * this.blockSize,
                        row * this.blockSize,
                        this.blockSize,
                        this.blockSize
                    );
                    
                    this.ctx.strokeStyle = '#333';
                    this.ctx.lineWidth = 1;
                    this.ctx.strokeRect(
                        col * this.blockSize,
                        row * this.blockSize,
                        this.blockSize,
                        this.blockSize
                    );
                }
            }
        }
    }

    drawTetromino(tetromino) {
        this.ctx.fillStyle = tetromino.color;
        
        for (let row = 0; row < tetromino.shape.length; row++) {
            for (let col = 0; col < tetromino.shape[row].length; col++) {
                if (tetromino.shape[row][col]) {
                    this.ctx.fillRect(
                        (tetromino.x + col) * this.blockSize,
                        (tetromino.y + row) * this.blockSize,
                        this.blockSize,
                        this.blockSize
                    );
                    
                    this.ctx.strokeStyle = '#333';
                    this.ctx.lineWidth = 1;
                    this.ctx.strokeRect(
                        (tetromino.x + col) * this.blockSize,
                        (tetromino.y + row) * this.blockSize,
                        this.blockSize,
                        this.blockSize
                    );
                }
            }
        }
    }

    drawGrid() {
        this.ctx.strokeStyle = '#ddd';
        this.ctx.lineWidth = 0.5;
        
        for (let i = 0; i <= 10; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.blockSize, 0);
            this.ctx.lineTo(i * this.blockSize, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let i = 0; i <= 20; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.blockSize);
            this.ctx.lineTo(this.canvas.width, i * this.blockSize);
            this.ctx.stroke();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.tetrisGame = new TetrisGame();
});