// Get a reference to the canvas element and its drawing context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 800;
const cellSize = 10;
// Define the circle's parameters
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = Math.min(centerX, centerY);
const rows = canvas.height / cellSize;
const cols = canvas.width / cellSize;

// Initialize a 2D array representing the game board
// Each cell can be 0(dead) or 1(alive)
let grid = initializeGrid();

// Add click event listener to the canvas
canvas.addEventListener('click', handleCanvasClick);
canvas.addEventListener('touchstart', handleTouch, false);

// Add event listeners to buttons
let animationId;
let isAnimating = false;

document.getElementById('startBtn').addEventListener('click', startAnimation);
document.getElementById('stopBtn').addEventListener('click', stopAnimation);
document.getElementById('clearBtn').addEventListener('click', clearGrid);
document
    .getElementById('randomizeBtn')
    .addEventListener('click', randomizeGrid);

// Initialize the grid with dead cells
function initializeGrid() {
    return new Array(rows).fill(null).map(() => new Array(cols).fill(0));
}

// Handle click event on the canvas
function handleCanvasClick(event) {
    const { clickX, clickY } = getClickCoordinates(event);
    toggleCell(clickX, clickY);
}

// Handle touch event on the canvas
function handleTouch(event) {
    event.preventDefault();
    const { touchX, touchY } = getTouchCoordinates(event);
    toggleCell(touchX, touchY);
}

// Toggle the state of the clicked cell
function toggleCell(x, y) {
    const gridX = Math.floor(x / cellSize);
    const gridY = Math.floor(y / cellSize);
    if (gridX >= 0 && gridX < cols && gridY >= 0 && gridY < rows) {
        grid[gridY][gridX] = grid[gridY][gridX] ? 0 : 1;
        drawCell(gridX, gridY);
    }
}

// Get the click coordinates relative to the canvas
function getClickCoordinates(event) {
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    return { clickX, clickY };
}

// Get the touch coordinates relative to the canvas
function getTouchCoordinates(event) {
    const rect = canvas.getBoundingClientRect();
    const touchX = event.touches[0].clientX - rect.left;
    const touchY = event.touches[0].clientY - rect.top;
    return { touchX, touchY };
}

// Start animation
function startAnimation() {
    if (isAnimating || !hasAliveCells()) return;
    isAnimating = true;
    document.getElementById('startBtn').disabled = true;
    canvas.removeEventListener('click', handleCanvasClick);
    animate();
}

// Stop animation
function stopAnimation() {
    isAnimating = false;
    cancelAnimationFrame(animationId);
    canvas.addEventListener('click', handleCanvasClick);
    document.getElementById('startBtn').disabled = false;
}

// Clear the grid
function clearGrid() {
    stopAnimation();
    grid = initializeGrid();
    drawGrid();
}

// Randomize the grid with cells
function randomizeGrid() {
    if (isAnimating) return;
    grid = new Array(rows).fill(null).map(() => new Array(cols).fill(0));
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            grid[y][x] = Math.random() > 0.5 ? 1 : 0;
        }
    }
    drawGrid();
}

// Check if at least one cell is alive
function hasAliveCells() {
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (grid[y][x] == 1) {
                return true;
            }
        }
    }
    return false;
}

// Animation loop
function animate() {
    updateGame();
    drawGrid();
    if (isAnimating) {
        animationId = requestAnimationFrame(animate);
    }
}

// Update game based on rules of the game
function updateGame() {
    const gridCopy = grid.map((row) => [...row]);
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const neighbors = countNeighbors(y, x);
            if (grid[y][x] === 1 && (neighbors < 2 || neighbors > 3)) {
                gridCopy[y][x] = 0;
            } else if (grid[y][x] === 0 && neighbors === 3) {
                gridCopy[y][x] = 1;
            }
        }
    }
    grid = gridCopy;
}

// Drawing grid
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.clip();

    ctx.strokeStyle = '#4e4c60';
    ctx.lineWidth = 0.01;

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (grid[y][x]) {
                drawCell(x, y);
            }
        }
    }
}

// Draw a filled cell
function drawCell(x, y) {
    ctx.fillStyle = '#a6a6a6';
    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
}

// Determining the number of live neighbors for a cell
function countNeighbors(y, x) {
    let sum = 0;
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if (i === 0 && j === 0) continue;
            const col = (x + j + cols) % cols;
            const row = (y + i + rows) % rows;
            sum += grid[row][col];
        }
    }
    return sum;
}

// Initial drawing of the grid
drawGrid();
