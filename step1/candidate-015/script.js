const symbols = [
    { emoji: '🤖', name: 'Bot', value: 20 },
    { emoji: '🧠', name: 'Brain', value: 50 },
    { emoji: '🚀', name: 'Rocket', value: 100 },
    { emoji: '📉', name: 'GPU Crash', value: 0 },
    { emoji: '💸', name: 'Tokens', value: 200 }
];

let balance = 1000;
const COST_PER_SPIN = 10;
let isSpinning = false;

const slotElements = [
    document.getElementById('slot1'),
    document.getElementById('slot2'),
    document.getElementById('slot3')
];
const balanceElement = document.getElementById('balance');
const spinButton = document.getElementById('spin-button');
const messageBoard = document.getElementById('message-board');

function updateBalance(newBalance) {
    balance = newBalance;
    balanceElement.textContent = balance;
}

function getRandomSymbol() {
    const randomIndex = Math.floor(Math.random() * symbols.length);
    return symbols[randomIndex];
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function spin() {
    if (isSpinning) return;
    if (balance < COST_PER_SPIN) {
        messageBoard.textContent = "Error 402: Payment Required. Out of context tokens!";
        messageBoard.className = "message-board lose";
        return;
    }

    isSpinning = true;
    spinButton.disabled = true;
    updateBalance(balance - COST_PER_SPIN);
   
    messageBoard.textContent = "Generating response... (Spinning)";
    messageBoard.className = "message-board";

    // Start spinning animation
    slotElements.forEach(slot => {
        slot.classList.add('spinning');
    });

    const results = [];
   
    // Stop slots one by one
    for (let i = 0; i < slotElements.length; i++) {
        // Spin duration increases for each slot
        await sleep(500 + (i * 500));
       
        slotElements[i].classList.remove('spinning');
        const symbol = getRandomSymbol();
        results.push(symbol);
       
        // Fast UI update simulating the blur stop
        let shuffleCount = 10;
        const interval = setInterval(() => {
            slotElements[i].textContent = getRandomSymbol().emoji;
            shuffleCount--;
            if (shuffleCount <= 0) {
                clearInterval(interval);
                slotElements[i].textContent = symbol.emoji;
            }
        }, 30);
       
        // Wait for shuffle to finish
        await sleep(350);
    }

    checkWin(results);
    isSpinning = false;
    spinButton.disabled = false;
}

function checkWin(results) {
    const [s1, s2, s3] = results;
   
    if (s1.emoji === s2.emoji && s2.emoji === s3.emoji) {
        // Jackpot
        if (s1.emoji === '📉') {
             messageBoard.textContent = "Catastrophic Hallucination! GPU melted. You lose 100 tokens.";
             messageBoard.className = "message-board lose";
             updateBalance(Math.max(0, balance - 100));
        } else {
            const winAmount = s1.value * 10;
            messageBoard.textContent = `AGI Achieved! You won ${winAmount} tokens!`;
            messageBoard.className = "message-board win";
            updateBalance(balance + winAmount);
        }
    } else if (s1.emoji === s2.emoji || s2.emoji === s3.emoji || s1.emoji === s3.emoji) {
        // Partial match
        if (s1.emoji === '📉' && s2.emoji === '📉' || s2.emoji === '📉' && s3.emoji === '📉' || s1.emoji === '📉' && s3.emoji === '📉') {
             messageBoard.textContent = "Minor alignment issue. Loss of context.";
             messageBoard.className = "message-board lose";
        } else {
            const winAmount = 20; // flat payout for two of a kind
            messageBoard.textContent = `Partial Match Found! +${winAmount} tokens.`;
            messageBoard.className = "message-board win";
            updateBalance(balance + winAmount);
        }
    } else {
        // No match
        messageBoard.textContent = "Model generated garbage. Try another prompt.";
        messageBoard.className = "message-board lose";
    }
}

spinButton.addEventListener('click', spin);
