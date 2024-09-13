const gameBoard = document.getElementById('game-board');
const dog = document.getElementById('dog');
const gameSize = 600;
const cellSize = 40;
let dogPosition = { x: 0, y: 0 };
let walls = [];
let apples = [];

document.addEventListener('keydown', handleMovement);

function initGame() {
    // Create walls
    createWalls();

    // Place random apples
    placeApples();

    // Initial dog position
    updateDogPosition();
}

function createWalls() {
    const wallCoords = [
        { x: 100, y: 100, width: 100, height: 20 },
        { x: 300, y: 200, width: 20, height: 200 }
        // Add more walls as needed
    ];

    wallCoords.forEach(coord => {
        const wall = document.createElement('div');
        wall.classList.add('wall');
        wall.style.left = coord.x + 'px';
        wall.style.top = coord.y + 'px';
        wall.style.width = coord.width + 'px';
        wall.style.height = coord.height + 'px';
        gameBoard.appendChild(wall);
        walls.push(wall);
    });
}

function placeApples() {
    for (let i = 0; i < 3; i++) { // Randomly place 3 apples initially
        createApple();
    }

    // Add more apples during the game at random intervals
    setInterval(createApple, 5000); // Every 5 seconds
}

function createApple() {
    const apple = document.createElement('img');
    apple.src = 'apple.webp';
    apple.classList.add('apple');
    apple.style.left = Math.random() * (gameSize - cellSize) + 'px';
    apple.style.top = Math.random() * (gameSize - cellSize) + 'px';
    gameBoard.appendChild(apple);
    apples.push(apple);
}

function handleMovement(event) {
    let nextX = dogPosition.x;
    let nextY = dogPosition.y;

    if (event.key === 'ArrowUp') nextY -= cellSize;
    if (event.key === 'ArrowDown') nextY += cellSize;
    if (event.key === 'ArrowLeft') nextX -= cellSize;
    if (event.key === 'ArrowRight') nextX += cellSize;

    if (!checkWallCollision(nextX, nextY)) {
        dogPosition.x = nextX;
        dogPosition.y = nextY;
        updateDogPosition();
        checkAppleCollision();
    }
}

function updateDogPosition() {
    dog.style.transform = `translate(${dogPosition.x}px, ${dogPosition.y}px)`;
}

function checkWallCollision(x, y) {
    for (let wall of walls) {
        const rect = wall.getBoundingClientRect();
        const nextRect = { x: x, y: y, width: cellSize, height: cellSize };

        if (nextRect.x < rect.right &&
            nextRect.x + nextRect.width > rect.left &&
            nextRect.y < rect.bottom &&
            nextRect.y + nextRect.height > rect.top) {
            return true;
        }
    }
    return false;
}

function checkAppleCollision() {
    apples = apples.filter(apple => {
        const appleRect = apple.getBoundingClientRect();
        const dogRect = dog.getBoundingClientRect();

        if (dogRect.x < appleRect.right &&
            dogRect.x + dogRect.width > appleRect.left &&
            dogRect.y < appleRect.bottom &&
            dogRect.y + dogRect.height > appleRect.top) {

            // Smoothly hide the apple
            apple.classList.add('smooth-hide');
            setTimeout(() => apple.remove(), 300); // Remove after animation
            return false; // Remove apple from the list
        }
        return true;
    });
}

// Initialize the game
initGame();
