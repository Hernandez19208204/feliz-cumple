const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");

function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
setCanvasSize();

const opts = {
    strings: ["FELIZ", "CUMPLEAÑOS", "ANA", "OwO"],
    charSize: 40,
    charSpacing: 45,
    lineHeight: 50,
    fireworkSpawnTime: 80,
    balloonSpawnTime: 50,
    gravity: 0.1,
    upFlow: -0.05,
};

let letters = [];
let fireworks = [];
let balloons = [];
let fireworkTimer = 0;
let balloonTimer = 0;
const hw = () => canvas.width / 2;
const hh = () => canvas.height / 2;

function Letter(char, x, y) {
    this.char = char;
    this.x = x;
    this.y = y;
    this.dx = -ctx.measureText(char).width / 2;
    this.dy = opts.charSize / 2;
    this.color = "hsl(" + Math.random() * 360 + ",80%,50%)";
}

function Firework(x, y) {
    this.x = x;
    this.y = y;
    this.shards = [];
    const shardCount = 15 + Math.random() * 10;
    for (let i = 0; i < shardCount; i++) {
        const angle = (Math.PI * 2 * i) / shardCount;
        const speed = 2 + Math.random() * 3;
        this.shards.push({
            x: 0,
            y: 0,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            alpha: 1,
            color: "hsl(" + Math.random() * 360 + ",80%,50%)",
        });
    }
}

function Balloon(x, y) {
    this.x = x;
    this.y = y;
    this.vx = Math.random() * 0.5 - 0.25;
    this.vy = -(Math.random() * 1 + 0.5);
    this.color = "hsl(" + Math.random() * 360 + ",80%,50%)";
    this.size = 10 + Math.random() * 20;
}

function initLetters() {
    letters = [];
    for (let i = 0; i < opts.strings.length; i++) {
        const text = opts.strings[i];
        const y = hh() - (opts.strings.length * opts.lineHeight) / 2 + i * opts.lineHeight;
        for (let j = 0; j < text.length; j++) {
            const x = hw() - (text.length * opts.charSpacing) / 2 + j * opts.charSpacing;
            letters.push(new Letter(text[j], x, y));
        }
    }
}

function drawLetters() {
    letters.forEach(letter => {
        ctx.font = `${opts.charSize}px Verdana`;
        ctx.fillStyle = letter.color;
        ctx.fillText(letter.char, letter.x + letter.dx, letter.y + letter.dy);
    });
}

function drawFireworks() {
    fireworks.forEach((firework, index) => {
        firework.shards.forEach(shard => {
            shard.x += shard.vx;
            shard.y += shard.vy;
            shard.vy += opts.gravity;
            shard.alpha -= 0.02;

            ctx.fillStyle = `rgba(${shard.color.match(/\d+/g)}, ${shard.alpha})`;
            ctx.beginPath();
            ctx.arc(firework.x + shard.x, firework.y + shard.y, 2, 0, Math.PI * 2);
            ctx.fill();
        });

        firework.shards = firework.shards.filter(shard => shard.alpha > 0);
        if (firework.shards.length === 0) fireworks.splice(index, 1);
    });
}

function drawBalloons() {
    balloons.forEach((balloon, index) => {
        balloon.x += balloon.vx;
        balloon.y += balloon.vy;

        ctx.fillStyle = balloon.color;
        ctx.beginPath();
        ctx.arc(balloon.x, balloon.y, balloon.size, 0, Math.PI * 2);
        ctx.fill();

        if (balloon.y + balloon.size < 0 || balloon.x < 0 || balloon.x > canvas.width) {
            balloons.splice(index, 1);
        }
    });
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawLetters();
    drawFireworks();
    drawBalloons();

    fireworkTimer++;
    if (fireworkTimer >= opts.fireworkSpawnTime) {
        fireworks.push(new Firework(Math.random() * canvas.width, Math.random() * hh()));
        fireworkTimer = 0;
    }

    balloonTimer++;
    if (balloonTimer >= opts.balloonSpawnTime) {
        balloons.push(new Balloon(Math.random() * canvas.width, canvas.height));
        balloonTimer = 0;
    }

    requestAnimationFrame(animate);
}

initLetters();
animate();

window.addEventListener("resize", () => {
    setCanvasSize();
    initLetters();
});
