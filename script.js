// Get a reference to the canvas element and its drawing context
const canvas = document.getElementById('gameCanvas');
canvas.addEventListener('click', handleCanvasClick);
const ctx = canvas.getContext('2d');
const cellSize = 10;
const rows = canvas.height / cellSize;
const cols = canvas.width / cellSize;

// Initialize a 2D array representing the game board
// Each cell can be 0(dead) or 1(alive)
function initializeGrid() {
    return new Array(rows).fill(null).map(() => new Array(cols).fill(0));
}
let grid = initializeGrid();
drawGrid();

// Add click event listener to the canvas
function handleCanvasClick(event) {
    const x = Math.floor(event.offsetX / cellSize);
    const y = Math.floor(event.offsetY / cellSize);
    // current state of clicked cell
    if (x >= 0 && x < cols && y >= 0 && y < rows) {
        grid[y][x] = grid[y][x] ? 0 : 1;
        drawGrid();
    }
}

// Add event listeners to buttons
let animationId;
let isAnimating = false;

document.getElementById('startBtn').addEventListener('click', () => {
    if (isAnimating) return;

    isAnimating = true;
    document.getElementById('startBtn').disabled = true;

    canvas.removeEventListener('click', handleCanvasClick);

    function animate() {
        setTimeout(() => {

            updateGame();
            drawGrid();
            if (isAnimating) {
                animationId = requestAnimationFrame(animate);
            }
        }, 100)
    }
    animate();
    console.log('start');
});

document.getElementById('stopBtn').addEventListener('click', () => {
    isAnimating = false;

    cancelAnimationFrame(animationId);

    canvas.addEventListener('click', handleCanvasClick);

    document.getElementById('startBtn').disabled = false;
    console.log('end');
});

document.getElementById('clearBtn').addEventListener('click', () => {
    isAnimating = false;

    cancelAnimationFrame(animationId);

    canvas.addEventListener('click', handleCanvasClick);

    document.getElementById('startBtn').disabled = false;

    grid = initializeGrid();
    drawGrid();
    console.log('clear');
});

// Drawing grid
// Draw a filled rectangle at the cells position
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // grid lines
    ctx.strokeStyle = '#4e4c60';
    ctx.lineWidth = 0.5;
    // vertical
    for (let x = 0; x <= cols; x++) {
        ctx.beginPath();
        ctx.moveTo(x * cellSize, 0);
        ctx.lineTo(x * cellSize, canvas.height);
        ctx.stroke();
    }
    // horizontal
    for (let y = 0; y <= rows; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * cellSize);
        ctx.lineTo(canvas.width, y * cellSize);
        ctx.stroke();
    }

    // cells
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (grid[y][x]) {
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
        }
    }
}

// Update game based on rules of the game
function updateGame() {
    // shallow copy of grid
    let gridCopy = grid.map((row) => row.slice());

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            let neighbors = countNeighbors(y, x);

            // Rule 1 and 3: Any live cell with fewer than two or more than three live neighbors dies.
            if (grid[y][x] === 1 && (neighbors < 2 || neighbors > 3)) {
                gridCopy[y][x] = 0;
            }
            // Rule 2: Any live cell with two or three live neighbors lives on.
            else if (grid[y][x] === 1 && (neighbors === 2 || neighbors === 3)) {
                gridCopy[y][x] = 1;
            }
            // Rule 4: Any dead cell with exactly three live neighbors becomes a live cell.
            else if (grid[y][x] === 0 && neighbors === 3) {
                gridCopy[y][x] = 1;
            }
        }
    }
    grid = gridCopy;
    drawGrid();
}

// Determining the number of the live neighbors each cells has
function countNeighbors(y, x) {
    let sum = 0;
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if (i === 0 && j === 0) continue;
            let col = (x + j + cols) % cols;
            let row = (y + i + rows) % rows;

            sum += grid[row][col];
        }
    }
    return sum;
}
