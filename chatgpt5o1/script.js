const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const TILE_SIZE = 40;
const ROWS = canvas.height / TILE_SIZE;
const COLS = canvas.width / TILE_SIZE;

// Load Images
const dogImg = new Image();
dogImg.src = 'dog.webp';

const appleImg = new Image();
appleImg.src = 'apple.webp';

// Game Variables
let dog = {
    x: TILE_SIZE,
    y: TILE_SIZE,
    dx: 0,
    dy: 0,
    speed: 2,
    width: TILE_SIZE - 10,
    height: TILE_SIZE - 10
};

let apples = [];
let walls = [];
let currentDirection = { dx: 0, dy: 0 };

// Initialize Walls (Simple Grid Example)
function createWalls() {
    // Example walls: You can customize the wall layout
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            // Create a border around the canvas
            if (i === 0 || j === 0 || i === ROWS -1 || j === COLS -1) {
                walls.push({x: j * TILE_SIZE, y: i * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE});
            }
            // Add some internal walls
            if ((i === 5 || i === 10) && j > 2 && j < COLS -3) {
                walls.push({x: j * TILE_SIZE, y: i * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE});
            }
        }
    }
}

// Handle Keyboard Input
const keys = {};

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
        currentDirection = { dx: 0, dy: -dog.speed };
    } else if (e.key === 'ArrowDown') {
        currentDirection = { dx: 0, dy: dog.speed };
    } else if (e.key === 'ArrowLeft') {
        currentDirection = { dx: -dog.speed, dy: 0 };
    } else if (e.key === 'ArrowRight') {
        currentDirection = { dx: dog.speed, dy: 0 };
    }
});

document.addEventListener('keyup', (e) => {
    // Optionally handle key releases if needed
});

// Collision Detection
function isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Place Apples Randomly
function placeApples(count) {
    apples = [];
    for (let i = 0; i < count; i++) {
        let position = getRandomPosition();
        // Ensure apples don't spawn on walls
        if (!walls.some(wall => isColliding(position, wall))) {
            apples.push({
                x: position.x,
                y: position.y,
                width: TILE_SIZE - 10,
                height: TILE_SIZE - 10,
                visible: true,
                opacity: 1
            });
        }
    }
}

function getRandomPosition() {
    const j = Math.floor(Math.random() * (COLS -2)) +1;
    const i = Math.floor(Math.random() * (ROWS -2)) +1;
    return {x: j * TILE_SIZE + 5, y: i * TILE_SIZE + 5};
}

// Smooth Movement using requestAnimationFrame
let lastTime = 0;

function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    update(deltaTime);
    draw();

    requestAnimationFrame(gameLoop);
}

function update(deltaTime) {
    // Calculate New Position based on currentDirection
    let newX = dog.x + currentDirection.dx;
    let newY = dog.y + currentDirection.dy;

    // Create a rectangle for the new position
    let newRect = {
        x: newX,
        y: newY,
        width: dog.width,
        height: dog.height
    };

    // Check Collision with Walls
    let collision = walls.some(wall => isColliding(newRect, wall));

    if (!collision) {
        dog.x = newX;
        dog.y = newY;
    } else {
        // Stop movement if collision with wall
        currentDirection = { dx: 0, dy: 0 };
    }

    // Check Collision with Apples
    apples.forEach((apple, index) => {
        if (apple.visible && isColliding(dog, apple)) {
            // Start disappearance animation
            apples[index].visible = false;
            // Optional: Add score or other game mechanics here
        }
    });

    // Fade out apples that are not visible
    apples.forEach((apple, index) => {
        if (!apple.visible && apple.opacity > 0) {
            apples[index].opacity -= 0.02; // Adjust fade speed as needed
            if (apples[index].opacity < 0) {
                apples[index].opacity = 0;
            }
        }
    });

    // Randomly add apples intermittently
    if (Math.random() < 0.001) { // Adjust probability as needed
        let position = getRandomPosition();
        if (!walls.some(wall => isColliding(position, wall)) &&
            !apples.some(apple => isColliding(position, apple))) {
            apples.push({
                x: position.x,
                y: position.y,
                width: TILE_SIZE - 10,
                height: TILE_SIZE - 10,
                visible: true,
                opacity: 1
            });
        }
    }
}

function draw() {
    // Clear Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Walls
    ctx.fillStyle = '#000000'; // Black walls
    walls.forEach(wall => {
        ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
    });

    // Draw Apples
    apples.forEach((apple, index) => {
        if (apple.opacity > 0) {
            ctx.globalAlpha = apple.opacity;
            ctx.drawImage(appleImg, apple.x, apple.y, apple.width, apple.height);
            ctx.globalAlpha = 1.0;
        }
    });

    // Draw Dog
    ctx.drawImage(dogImg, dog.x, dog.y, dog.width, dog.height);
}

// Initialize Game
createWalls();
placeApples(5); // Initial number of apples
requestAnimationFrame(gameLoop);
