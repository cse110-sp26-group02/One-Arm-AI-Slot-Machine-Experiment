const ICONS = ['🤖', '🧠', '⚡', '🤡', '💸', '🛠️', '🔬'];
const ICON_VALUES = {
    '🤖': 100,
    '🧠': 50,
    '⚡': 25,
    '🤡': -50,
    '💸': -20,
    '🛠️': 10,
    '🔬': 15
};

const MESSAGES = [
    "Training on your losses...",
    "Tokens successfully burned.",
    "Calculating meaningless output...",
    "GPT-0.5 is thinking...",
    "Hallucinating a win...",
    "Optimizing for loss...",
    "Data scraped from your frustration.",
    "Bypassing safety filters (not really).",
    "Reinforcement learning from your despair.",
    "Prompt engineering a reason for this loss."
];

let credits = 100;
let isGenerating = false;

const reels = [
    document.querySelector('#reel1 .reel-strip'),
    document.querySelector('#reel2 .reel-strip'),
    document.querySelector('#reel3 .reel-strip')
];

const creditsDisplay = document.getElementById('credits');
const generateBtn = document.getElementById('generate-btn');
const statusLog = document.getElementById('status-log');
const modelStatus = document.getElementById('model-status');

// Initialize reels with some items
function initReels() {
    reels.forEach(reel => {
        reel.innerHTML = '';
        for (let i = 0; i < 20; i++) {
            const item = document.createElement('div');
            item.className = 'reel-item';
            item.textContent = ICONS[Math.floor(Math.random() * ICONS.length)];
            reel.appendChild(item);
        }
    });
}

function logMessage(msg) {
    const p = document.createElement('p');
    p.textContent = `> ${msg}`;
    statusLog.prepend(p);
    if (statusLog.children.length > 5) {
        statusLog.removeChild(statusLog.lastChild);
    }
}

function updateCredits(amount) {
    credits += amount;
    creditsDisplay.textContent = credits;
    if (credits <= 0) {
        credits = 0;
        creditsDisplay.textContent = 0;
        modelStatus.textContent = "OUT OF COMPUTE";
        generateBtn.disabled = true;
        logMessage("CRITICAL ERROR: No compute credits left.");
    }
}

async function generateResponse() {
    if (isGenerating || credits < 10) return;

    isGenerating = true;
    generateBtn.disabled = true;
    modelStatus.textContent = "GENERATING...";
    
    // Burn initial tokens
    updateCredits(-10);
    logMessage(`Burned 10 tokens. Current balance: ${credits}`);

    // Randomly decide if a "Burn Event" happens (10% chance)
    if (Math.random() < 0.1) {
        const burn = Math.floor(Math.random() * 20) + 10;
        updateCredits(-burn);
        logMessage(`HALLUCINATION: Unnecessary training cost ${burn} extra tokens.`);
    }

    const results = [];
    const animationPromises = reels.map((reel, index) => {
        return new Promise(resolve => {
            const targetIcon = ICONS[Math.floor(Math.random() * ICONS.length)];
            results.push(targetIcon);

            // Add the target icon at a specific position for the animation to end on
            const items = reel.querySelectorAll('.reel-item');
            const targetIndex = 15; // Animation will end on this index
            items[targetIndex].textContent = targetIcon;

            const offset = targetIndex * 120;
            reel.style.transition = `transform ${1 + index * 0.5}s cubic-bezier(0.12, 0, 0.39, 0)`;
            reel.style.transform = `translateY(-${offset}px)`;

            setTimeout(() => {
                // Reset for next spin without transition
                reel.style.transition = 'none';
                const firstItem = reel.querySelector('.reel-item');
                firstItem.textContent = targetIcon;
                reel.style.transform = 'translateY(0)';
                resolve();
            }, 1000 + index * 500 + 50);
        });
    });

    await Promise.all(animationPromises);

    // Calculate Payout
    checkPayout(results);

    isGenerating = false;
    if (credits >= 10) {
        generateBtn.disabled = false;
        modelStatus.textContent = "READY";
    }
    
    logMessage(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
}

function checkPayout(results) {
    const [r1, r2, r3] = results;
    
    if (r1 === r2 && r2 === r3) {
        const win = ICON_VALUES[r1] * 2;
        if (win > 0) {
            updateCredits(win);
            logMessage(`SUCCESS: High-confidence match! Generated ${win} tokens.`);
        } else {
            updateCredits(win);
            logMessage(`CATASTROPHIC FAILURE: Model collapsed. Lost ${Math.abs(win)} tokens.`);
        }
    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
        // Partial match
        const matchIcon = (r1 === r2 || r1 === r3) ? r1 : r2;
        const win = Math.floor(ICON_VALUES[matchIcon] / 2);
        if (win > 0) {
            updateCredits(win);
            logMessage(`PARTIAL SUCCESS: Low-confidence generation. +${win} tokens.`);
        }
    } else {
        logMessage("FAILURE: Output rejected by human-in-the-loop.");
    }
}

generateBtn.addEventListener('click', generateResponse);

// Initialize
initReels();
logMessage("Model GPT-0.5 loaded. Awaiting compute credits.");
