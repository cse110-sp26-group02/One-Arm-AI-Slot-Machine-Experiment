const symbols = ["🤖", "📈", "📉", "🔥", "⚡", "🧠"];
let tokens = 100;
const cost = 10;

const spinBtn = document.getElementById('spin-btn');
const balanceVal = document.getElementById('balance-val');
const status = document.getElementById('status');
const reels = [document.getElementById('r1'), document.getElementById('r2'), document.getElementById('r3')];

spinBtn.addEventListener('click', () => {
    if (tokens < cost) {
        status.innerText = "Out of compute cycles. Go get a real job.";
        return;
    }
    
    tokens -= cost;
    balanceVal.innerText = tokens;
    
    const outcome = [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
    ];
    
    reels.forEach((r, i) => r.innerText = outcome[i]);
    
    if (outcome[0] === outcome[1] && outcome[1] === outcome[2]) {
        tokens += 50;
        status.innerText = "Wow! You hallucinated a breakthrough!";
    } else {
        status.innerText = "More noise than signal. Try again.";
    }
    balanceVal.innerText = tokens;
});
