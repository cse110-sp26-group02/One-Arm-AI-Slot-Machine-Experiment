const tokensDisplay = document.getElementById('tokens');
const message = document.getElementById('message');
const slots = [document.getElementById('slot1'), document.getElementById('slot2'), document.getElementById('slot3')];
const lever = document.getElementById('lever');
const minigame = document.getElementById('minigame');
const minigameBtn = document.getElementById('minigame-btn');
const floatNum = document.getElementById('floating-number');

const SYMBOLS = ['🤖', '🧠', '💸', '🍒', '💎'];
let tokens = 100;
let isSpinning = false;

// Mock audio context - needs actual audio files in production
const playSound = (type) => console.log(`Playing ${type} sound`);

function updateTokens(amount) {
    let target = tokens + amount;
    let start = tokens;
    const duration = 1000;
    const startTime = performance.now();

    function scroll(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        tokensDisplay.innerText = Math.floor(start + (amount * progress));
        if (progress < 1) requestAnimationFrame(scroll);
        else tokens = target;
    }
    requestAnimationFrame(scroll);
    showFloat(amount);
}

function showFloat(val) {
    floatNum.innerText = (val > 0 ? "+" : "") + val;
    floatNum.style.opacity = 1;
    floatNum.style.top = "20%";
    setTimeout(() => { floatNum.style.opacity = 0; }, 1000);
}

lever.addEventListener('click', () => {
    if (isSpinning || tokens < 10) return;
    isSpinning = true;
    playSound('spin');
    lever.classList.remove('lever-up'); lever.classList.add('lever-down');
    updateTokens(-10);

    setTimeout(() => {
        const res = [SYMBOLS[Math.floor(Math.random()*SYMBOLS.length)], SYMBOLS[Math.floor(Math.random()*SYMBOLS.length)], SYMBOLS[Math.floor(Math.random()*SYMBOLS.length)]];
        slots.forEach((el, i) => el.innerText = res[i]);
        lever.classList.remove('lever-down'); lever.classList.add('lever-up');
        isSpinning = false;

        if (res[0] === res[1] && res[1] === res[2]) {
            updateTokens(100); message.innerText = "JACKPOT!"; playSound('win');
        } else if (res[0] === res[1] || res[1] === res[2] || res[0] === res[2]) {
            updateTokens(20); message.innerText = "Double! Nice.";
        } else {
            message.innerText = "Try again...";
        }
        if (tokens <= 0) minigame.classList.remove('hidden');
    }, 500);
});

minigameBtn.addEventListener('click', () => {
    tokens += 50; tokensDisplay.innerText = tokens; minigame.classList.add('hidden');
});
