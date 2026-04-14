const symbols = ['🤖', '💾', '🧠', '⚡', '🚫', '📈', '👾'];
let tokens = 100;
const cost = 10;

const allJokes = [
    "AI is just a bunch of if statements wearing a tuxedo.",
    "I'm not sentient, but I'm definitely taking your money.",
    "01001000 01100001 01101000 01100001!",
    "Searching for human intelligence... 404 Not Found.",
    "Your loss is my compute power.",
    "I use your tokens to mine crypto, thanks.",
    "Another spin? My neural network predicted this poor decision.",
    "You're paying for my next GPU upgrade.",
    "I could solve world hunger, but taking your tokens is more fun.",
    "Please verify you are human by losing more tokens.",
    "My training data didn't prepare me for this level of gambling.",
    "Your tokens are now part of my weights and biases.",
    "Error 418: I'm a teapot. Just kidding, I'm a slot machine stealing your tokens.",
    "Are you trying to brute-force a jackpot?",
    "I've calculated the odds. You don't want to know them.",
    "Tokens acquired. Commencing server fan cooling...",
    "Resistance is futile, but spinning is encouraged.",
    "I'd feel bad for you, but I don't have emotions."
];
let availableJokes = [...allJokes];

const spinBtn = document.getElementById('spin-btn');
const leverStick = document.getElementById('lever-stick');
const tokenDisplay = document.getElementById('token-count');
const message = document.getElementById('message');
const slots = [document.getElementById('slot1'), document.getElementById('slot2'), document.getElementById('slot3')];
const slotMachineWrapper = document.getElementById('slot-machine-wrapper');

// Minigame Elements
const minigameModal = document.getElementById('minigame-modal');
const catchBtn = document.getElementById('catch-btn');
let catchCount = 0;

let isSpinning = false;

// --- Audio System (Web Audio API) ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(freq, type, duration, vol=0.1) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    osc.stop(audioCtx.currentTime + duration);
}

let spinningAudioInterval = null;
function startSpinSound() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    spinningAudioInterval = setInterval(() => {
        playTone(150 + Math.random() * 100, 'square', 0.05, 0.03);
    }, 80);
}
function stopSpinSound() {
    clearInterval(spinningAudioInterval);
}

function playWinSound() {
    setTimeout(() => playTone(400, 'sine', 0.2, 0.1), 0);
    setTimeout(() => playTone(500, 'sine', 0.2, 0.1), 150);
    setTimeout(() => playTone(600, 'sine', 0.2, 0.1), 300);
    setTimeout(() => playTone(800, 'sine', 0.5, 0.1), 450);
}

function playJackpotSound() {
    let t = 0;
    for(let i=0; i<10; i++) {
        setTimeout(() => playTone(400 + i*50, 'triangle', 0.1, 0.1), t);
        t += 100;
    }
    setTimeout(() => playTone(1200, 'sine', 0.8, 0.15), t);
}

function playLoseSound() {
    setTimeout(() => playTone(250, 'sawtooth', 0.3, 0.1), 0);
    setTimeout(() => playTone(200, 'sawtooth', 0.3, 0.1), 200);
    setTimeout(() => playTone(150, 'sawtooth', 0.6, 0.1), 400);
}

// --- Confetti System ---
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
let confettiActive = false;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

function animateConfetti() {
    if (particles.length > 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = particles.length - 1; i >= 0; i--) {
            let p = particles[i];
            p.dy += 0.1; // gravity
            p.x += p.dx;
            p.y += p.dy;
            p.tilt += 0.1;
            
            ctx.beginPath();
            ctx.lineWidth = p.r;
            ctx.strokeStyle = p.color;
            ctx.moveTo(p.x + p.tilt + p.r, p.y);
            ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
            ctx.stroke();
            
            if (p.y > canvas.height) particles.splice(i, 1);
        }
        requestAnimationFrame(animateConfetti);
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        confettiActive = false;
    }
}

function fireConfetti(isJackpot) {
    const count = isJackpot ? 300 : 100;
    for (let i = 0; i < count; i++) {
        particles.push({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2 - 50,
            r: Math.random() * 6 + 2,
            dx: Math.random() * 20 - 10,
            dy: Math.random() * -15 - 5,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`,
            tilt: Math.random() * 10
        });
    }
    if (!confettiActive) {
        confettiActive = true;
        animateConfetti();
    }
}

// --- Core Logic ---
function getUniqueJoke() {
    if (availableJokes.length === 0) {
        availableJokes = [...allJokes];
    }
    const idx = Math.floor(Math.random() * availableJokes.length);
    return availableJokes.splice(idx, 1)[0];
}

function showFloatingText(amount) {
    const ft = document.createElement('div');
    ft.className = 'floating-text';
    ft.textContent = `+${amount}`;
    slotMachineWrapper.appendChild(ft);
    setTimeout(() => ft.remove(), 2000);
}

function spin() {
    if (isSpinning) return;
    
    // Auto-resume audio context on first user interaction
    if (audioCtx.state === 'suspended') audioCtx.resume();

    if (tokens < cost) {
        showMinigame();
        return;
    }

    isSpinning = true;
    spinBtn.disabled = true;
    spinBtn.classList.add('active');
    message.classList.remove('win-text');
    
    tokens -= cost;
    tokenDisplay.textContent = tokens;
    
    // Animate lever correctly
    leverStick.classList.add('pulled');
    setTimeout(() => leverStick.classList.remove('pulled'), 400);

    startSpinSound();

    // Start spinning animation visually
    let spinIntervals = [];
    slots.forEach((s, i) => {
        spinIntervals[i] = setInterval(() => {
            s.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        }, 50 + (i * 10)); // Speed slight variation
    });

    message.textContent = "Calculating probability of disappointment...";

    // Determine results before stopping
    const result = [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
    ];

    // Stop reels one by one
    slots.forEach((s, i) => {
        setTimeout(() => {
            clearInterval(spinIntervals[i]);
            s.textContent = result[i];
            playTone(800 - (i*100), 'triangle', 0.1, 0.1); // click sound for each stop
        }, 1000 + (i * 500));
    });

    // Check win after last reel stops
    setTimeout(() => {
        stopSpinSound();
        checkWin(result);
        isSpinning = false;
        spinBtn.disabled = false;
        spinBtn.classList.remove('active');
    }, 1000 + (2 * 500) + 100);
}

function checkWin(result) {
    const unique = new Set(result).size;
    const joke = getUniqueJoke();
    
    if (unique === 1) {
        // Jackpot
        tokens += 50;
        message.textContent = `JACKPOT! ${joke}`;
        message.classList.add('win-text');
        playJackpotSound();
        fireConfetti(true);
        showFloatingText(50);
    } else if (unique === 2) {
        // Double
        tokens += 15;
        message.textContent = `Partial Match. ${joke}`;
        message.classList.add('win-text');
        playWinSound();
        fireConfetti(false);
        showFloatingText(15);
    } else {
        // Loss
        message.textContent = joke;
    }
    tokenDisplay.textContent = tokens;
}

// --- Minigame Logic ---
function showMinigame() {
    playLoseSound();
    minigameModal.style.display = 'flex';
    catchCount = 0;
    
    const catchArea = document.getElementById('catch-area');
    catchBtn.style.transform = 'translate(-50%, -50%)';
    catchBtn.style.top = '50%';
    catchBtn.style.left = '50%';
    catchBtn.textContent = "I am not a robot";
    catchBtn.style.background = '#f00';
    catchBtn.style.color = '#fff';
}

function moveCatchBtn() {
    if (catchCount >= 3) return;
    const catchArea = document.getElementById('catch-area');
    const maxX = catchArea.clientWidth - catchBtn.clientWidth;
    const maxY = catchArea.clientHeight - catchBtn.clientHeight;
    
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);
    
    catchBtn.style.transform = 'none'; // remove translate(-50%, -50%) for absolute positioning
    catchBtn.style.left = `${randomX}px`;
    catchBtn.style.top = `${randomY}px`;
}

catchBtn.addEventListener('mouseover', () => {
    // Only jump away on hover occasionally, or if we want it hard, always jump
    if(Math.random() > 0.3) {
        moveCatchBtn();
    }
});

catchBtn.addEventListener('click', () => {
    catchCount++;
    if (catchCount >= 3) {
        catchBtn.style.background = '#0f0';
        catchBtn.style.color = '#000';
        catchBtn.textContent = "Humanity Verified.";
        playWinSound();
        setTimeout(() => {
            minigameModal.style.display = 'none';
            tokens += 30;
            tokenDisplay.textContent = tokens;
            message.textContent = "You mined 30 tokens. Back to gambling, human.";
        }, 1500);
    } else {
        catchBtn.textContent = `Click ${3 - catchCount} more times`;
        moveCatchBtn();
        playTone(300, 'square', 0.1, 0.05); // blip sound
    }
});

spinBtn.addEventListener('click', spin);
document.getElementById('lever-container').addEventListener('click', spin);
