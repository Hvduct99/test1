const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


const backgroundImg = new Image();
backgroundImg.src = "ca-lon-nuot-ca-be.png";

const playerImg = new Image();
playerImg.src = "mouse.png";

const smallFishImg = new Image();
smallFishImg.src = "small-fish.png";

const bigFishImg = new Image();
bigFishImg.src = "big-fish.png";

let player = {
    x: canvas.width / 2,
    y: canvas.height - 100,
    width: 75,
    height: 75,
    speed: 5,
    score: 0
};
let smallFish = [];
const maxSmallFish = 10;
let bigFish = [];
const maxBigFish = 2;

let score = 0;
let gameOver = false;
let gameStarted = false;
const maxScore = 1000;
let reachedMaxScore = false;
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;

function createSmallFish() {
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        width: 50,
        height: 50,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2
    };
}
function createBigFish() {
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        width: 150,
        height: 150,
        speedX: (Math.random() - 0.5) * 3,
        speedY: (Math.random() - 0.5) * 3
    };
}
function initializeFish() {
    smallFish = [];
    bigFish = [];
    for (let i = 0; i < maxSmallFish; i++) {
        smallFish.push(createSmallFish());
    }
    for (let i = 0; i < maxBigFish; i++) {
        bigFish.push(createBigFish());
    }
}
initializeFish();
document.getElementById('startBtn').addEventListener('click', () => {
    if (!gameStarted) {
        gameStarted = true;
        gameOver = false;
        gameLoop();
    }
});

document.getElementById('stopBtn').addEventListener('click', () => {
    gameOver = true;
    gameStarted = false;
});

document.getElementById('restartBtn').addEventListener('click', () => {
    resetGame();
    gameStarted = true;
    gameOver = false;
    gameLoop();
});
canvas.addEventListener('mousemove', (event) => {
    if (gameStarted && !gameOver) {
        const rect = canvas.getBoundingClientRect();
        player.x = event.clientX - rect.left;
        player.y = event.clientY - rect.top;
    }
});
function resetGame() {
    player.x = canvas.width / 2;
    player.y = canvas.height - 100;
    player.width = 100;
    player.height = 100;
    score = 0;
    reachedMaxScore = false;
    initializeFish();
}
function update() {
    if (!gameStarted || gameOver) return;
    smallFish.forEach(fish => {
        fish.x += fish.speedX;
        fish.y += fish.speedY;
        if (fish.x < fish.width / 2 || fish.x > canvas.width - fish.width / 2) fish.speedX *= -1;
        if (fish.y < fish.height / 2 || fish.y > canvas.height - fish.height / 2) fish.speedY *= -1;
    });
    bigFish.forEach(fish => {
        fish.x += fish.speedX;
        fish.y += fish.speedY;
        if (fish.x < fish.width / 2 || fish.x > canvas.width - fish.width / 2) fish.speedX *= -1;
        if (fish.y < fish.height / 2 || fish.y > canvas.height - fish.height / 2) fish.speedY *= -1;
    });
    smallFish = smallFish.filter(fish => {
        const dx = player.x - fish.x;
        const dy = player.y - fish.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < (player.width + fish.width) / 2) {
            player.width += fish.width / 10;
            player.height += fish.height / 10;
            score += 1;
            if (score >= maxScore && !reachedMaxScore) {
                reachedMaxScore = true;
            }
            return false;
        }
        return true;
    });
    bigFish.forEach(fish => {
        const dx = player.x - fish.x;
        const dy = player.y - fish.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < (player.width + fish.width) / 2 && player.width < fish.width) {
            gameOver = true;
            gameStarted = false;
        }
    });
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }
    while (smallFish.length < maxSmallFish) {
        smallFish.push(createSmallFish());
    }
}
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (backgroundImg.complete) {
        ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    }
    if (playerImg.complete) {
        ctx.drawImage(playerImg, player.x - player.width / 2, player.y - player.height / 2, player.width, player.height);
    } else {
        ctx.fillStyle = 'red';
        ctx.fillRect(player.x - player.width / 2, player.y - player.height / 2, player.width, player.height);
    }
    smallFish.forEach(fish => {
        if (smallFishImg.complete) {
            ctx.drawImage(smallFishImg, fish.x - fish.width / 2, fish.y - fish.height / 2, fish.width, fish.height);
        } else {
            ctx.beginPath();
            ctx.arc(fish.x, fish.y, fish.width / 2, 0, Math.PI * 2);
            ctx.fillStyle = 'blue';
            ctx.fill();
            ctx.closePath();
        }
    });
    bigFish.forEach(fish => {
        if (bigFishImg.complete) {
            ctx.drawImage(bigFishImg, fish.x - fish.width / 2, fish.y - fish.height / 2, fish.width, fish.height);
        } else {
            ctx.beginPath();
            ctx.arc(fish.x, fish.y, fish.width / 2, 0, Math.PI * 2);
            ctx.fillStyle = 'orange';
            ctx.fill();
            ctx.closePath();
        }
    });
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Điểm: ${score} / ${maxScore}`, 10, 30);
    ctx.fillText(`Điểm cao nhất: ${highScore}`, 10, 60);
    if (reachedMaxScore && !gameOver) {
        ctx.fillStyle = 'green';
        ctx.font = '30px Arial';
        ctx.fillText('Bạn đã đạt điểm số cao nhất!', canvas.width / 2 - 200, 50);
    }
    if (!gameStarted && !gameOver) {
        ctx.fillStyle = 'black';
        ctx.font = '30px Arial';
        ctx.fillText('Nhấn "Bắt Đầu" để chơi!', canvas.width / 2 - 150, canvas.height / 2);
    }
    if (gameOver) {
        ctx.fillStyle = 'red';
        ctx.font = '50px Arial';
        ctx.fillText('Game Over!', canvas.width / 2 - 150, canvas.height / 2 - 25);
        ctx.font = '30px Arial';
        ctx.fillText(`Điểm cuối: ${score}`, canvas.width / 2 - 100, canvas.height / 2 + 25);
        if (reachedMaxScore) {
            ctx.fillStyle = 'green';
            ctx.fillText('Bạn đã đạt điểm cao nhất!', canvas.width / 2 - 200, canvas.height / 2 + 75);
        }
    }
}
function gameLoop() {
    if (!gameStarted) return;
    update();
    draw();
    requestAnimationFrame(gameLoop);
}
let imagesLoaded = 0;
const totalImages = 4;
function checkAllImagesLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        draw();
    }
}
backgroundImg.onload = checkAllImagesLoaded;
playerImg.onload = checkAllImagesLoaded;
smallFishImg.onload = checkAllImagesLoaded;
bigFishImg.onload = checkAllImagesLoaded;