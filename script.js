// Get a reference to the canvas element and its drawing context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const cellSize = 6;
const rows = canvas.height / cellSize;
const cols = canvas.width / cellSize;
// store the interval ID when game is running
let gameInterval;

// Initialize a 2D array representing the game board
// Each cell can be 0(dead) or 1(alive)
function initializeGrid() {
    return new Array(rows).fill(null).map(() => new Array(cols).fill(0));
}
let grid = initializeGrid();

// Add click event listener to the canvas
canvas.addEventListener('click', (e) => {
    const x = Math.floor(e.offsetX / cellSize);
    const y = Math.floor(e.offsetY / cellSize);
    // current state of clicked cell
    if (x >= 0 && x < cols && y >= 0 && y < rows) {
        grid[y][x] = grid[y][x] ? 0 : 1;
        drawGrid();
    }
});

// Add event listeners to buttons
let animationId;
document.getElementById('startBtn').addEventListener('click', () => {
    function animate() {
        updateGame();
        animationId = requestAnimationFrame(animate);
    }
    animate();
    console.log('start');
});
document.getElementById('stopBtn').addEventListener('click', () => {
    cancelAnimationFrame(animationId);
    console.log('end');
});
document.getElementById('clearBtn').addEventListener('click', () => {
    grid = initializeGrid();
    drawGrid();
    console.log('clear');
});

// Drawing grid
// Draw a filled rectangle at the cells position
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (grid[y][x]) {
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
        }
    }
}

// Update game based on rules of the game
