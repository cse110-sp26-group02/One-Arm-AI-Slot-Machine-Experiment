const symbols = ['🤖', '🧠', '⚡', '📉', '💾'];
let tokens = 100;

const balanceEl = document.getElementById('balance');
const statusEl = document.getElementById('status');
const spinBtn = document.getElementById('spin-btn');
const slots = [document.getElementById('s1'), document.getElementById('s2'), document.getElementById('s3')];

spinBtn.addEventListener('click', () => {
    if (tokens < 10) {
        statusEl.innerText = "Error 402: Insufficient Compute. Go farm more data.";
        return;
    }
    
    tokens -= 10;
    balanceEl.innerText = tokens;
    statusEl.innerText = "Processing tokens...";
    
    const results = slots.map(() => symbols[Math.floor(Math.random() * symbols.length)]);
    
    setTimeout(() => {
        slots.forEach((s, i) => s.innerText = results[i]);
        
        if (results[0] === results[1] && results[1] === results[2]) {
            tokens += 50;
            statusEl.innerText = "Pattern recognized! Intelligence increased.";
        } else {
            statusEl.innerText = "Hallucination occurred. Try again.";
        }
        balanceEl.innerText = tokens;
    }, 500);
});
