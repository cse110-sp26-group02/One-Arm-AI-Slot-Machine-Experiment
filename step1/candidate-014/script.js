const symbols = [
    { emoji: '✨', value: 'AGI', weight: 1 },
    { emoji: '🖥️', value: 'GPU', weight: 3 },
    { emoji: '🧠', value: 'Brain', weight: 5 },
    { emoji: '🦜', value: 'Parrot', weight: 8 },
    { emoji: '🌶️', value: 'Spicy', weight: 10 },
    { emoji: '🗑️', value: 'Garbage', weight: 12 }
];

// Create weighted array for random selection
let weightedSymbols = [];
symbols.forEach(s => {
    for (let i = 0; i < s.weight; i++) {
        weightedSymbols.push(s);
    }
});

let balance = 1000;
const costPerSpin = 100;
let isSpinning = false;

const balanceEl = document.getElementById('balance');
const spinBtn = document.getElementById('spin-btn');
const messageEl = document.getElementById('message-display');
const reels = [
    document.querySelector('#reel1 .symbol'),
    document.querySelector('#reel2 .symbol'),
    document.querySelector('#reel3 .symbol')
];
const containerEl = document.querySelector('.container');

// Audio context for procedural sound (web audio API)
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function playTone(freq, type, duration, vol) {
    if (!audioCtx) return;
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
       
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
       
        gain.gain.setValueAtTime(vol, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
       
        osc.connect(gain);
        gain.connect(audioCtx.destination);
       
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch(e) {
        // Ignore audio errors
    }
}

function getRandomSymbol() {
    const randomIndex = Math.floor(Math.random() * weightedSymbols.length);
    return weightedSymbols[randomIndex];
}

function updateBalance() {
    // Adding formatting
    balanceEl.textContent = `${balance.toLocaleString()} Tokens`;
    if (balance < costPerSpin) {
        spinBtn.disabled = true;
        spinBtn.querySelector('.btn-text').textContent = 'Rate Limited';
        messageEl.textContent = '429 Too Many Requests. Context window depleted!';
        messageEl.className = 'message-area lose-msg';
    }
}

function spinReel(reelEl, duration, delay) {
    return new Promise(resolve => {
        setTimeout(() => {
            let elapsed = 0;
            const intervalTime = 50;
            const totalIterations = duration / intervalTime;
            let currentIteration = 0;
           
            const spinInterval = setInterval(() => {
                const randomSym = getRandomSymbol();
                reelEl.textContent = randomSym.emoji;
               
                // Play ticking sound
                if (currentIteration % 2 === 0) playTone(800, 'sine', 0.05, 0.02);
               
                currentIteration++;
                if (currentIteration >= totalIterations) {
                    clearInterval(spinInterval);
                    const finalSym = getRandomSymbol();
                    reelEl.textContent = finalSym.emoji;
                    // Stopping sound
                    playTone(500, 'square', 0.1, 0.05);
                    resolve(finalSym);
                }
            }, intervalTime);
        }, delay);
    });
}

function calculateWin(results) {
    const counts = {};
    results.forEach(r => {
        counts[r.value] = (counts[r.value] || 0) + 1;
    });
   
    let winAmount = 0;
    let message = '';
    let isWin = false;

    if (counts['AGI'] === 3) { winAmount = 10000; message = "✨ SUPERINTELLIGENCE ACHIEVED! +10,000"; isWin = true; }
    else if (counts['GPU'] === 3) { winAmount = 5000; message = "🖥️ H100 Cluster Secured! +5,000"; isWin = true; }
    else if (counts['Brain'] === 3) { winAmount = 1000; message = "🧠 Galaxy Brain Response! +1,000"; isWin = true; }
    else if (counts['Parrot'] === 3) { winAmount = 500; message = "🦜 Perfect Stochastic Parrot! +500"; isWin = true; }
    else if (counts['Spicy'] === 3) { winAmount = 300; message = "🌶️ Spicy Autocomplete! +300"; isWin = true; }
    else if (counts['Garbage'] === 3) { winAmount = 0; message = "🗑️ Hallucinated garbage. 0 Tokens."; isWin = false; }
    else if (Object.values(counts).includes(2)) {
        winAmount = 50;
        message = "Partial pattern match detected. +50 Tokens.";
        isWin = true;
    } else {
        message = "Context window exhausted without useful output. -100 Tokens.";
        isWin = false;
    }

    return { winAmount, message, isWin };
}

spinBtn.addEventListener('click', async () => {
    if (isSpinning || balance < costPerSpin) return;
   
    initAudio();
    isSpinning = true;
    spinBtn.disabled = true;
   
    balance -= costPerSpin;
    updateBalance();
   
    messageEl.textContent = 'Generating tokens...';
    messageEl.className = 'message-area';
    containerEl.classList.remove('shake');
   
    // Play spin start sound
    playTone(300, 'sawtooth', 0.5, 0.05);

    // Staggered spin durations
    const spinPromises = [
        spinReel(reels[0], 1000, 0),
        spinReel(reels[1], 1500, 200),
        spinReel(reels[2], 2000, 400)
    ];

    const results = await Promise.all(spinPromises);
   
    const { winAmount, message, isWin } = calculateWin(results);
   
    balance += winAmount;
    updateBalance();
   
    messageEl.textContent = message;
   
    if (isWin && winAmount > 0) {
        messageEl.className = 'message-area win-msg';
        // Play win sound (arpeggio)
        setTimeout(() => playTone(523.25, 'sine', 0.1, 0.1), 0);
        setTimeout(() => playTone(659.25, 'sine', 0.1, 0.1), 100);
        setTimeout(() => playTone(783.99, 'sine', 0.1, 0.1), 200);
        setTimeout(() => playTone(1046.50, 'sine', 0.3, 0.1), 300);
       
        if (winAmount >= 1000) {
            // Jackpot sound
            setTimeout(() => playTone(1318.51, 'sine', 0.4, 0.1), 400);
            setTimeout(() => playTone(1567.98, 'sine', 0.5, 0.1), 500);
        }
    } else {
        messageEl.className = 'message-area lose-msg';
        // Play lose sound
        playTone(200, 'sawtooth', 0.3, 0.1);
        void containerEl.offsetWidth; // trigger reflow
        containerEl.classList.add('shake');
    }

    isSpinning = false;
    if (balance >= costPerSpin) {
        spinBtn.disabled = false;
    }
});

// Init
updateBalance();
