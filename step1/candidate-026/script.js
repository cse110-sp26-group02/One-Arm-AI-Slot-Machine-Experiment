const symbols = ["🤖", "⚠️", "🌀", "🔥", "🚀"];
let credits = 100;

const creditsEl = document.getElementById('credits');
const spinBtn = document.getElementById('spin-btn');
const messageEl = document.getElementById('message');
const slots = [
    document.getElementById('slot1'),
    document.getElementById('slot2'),
    document.getElementById('slot3')
];

spinBtn.addEventListener('click', () => {
    if (credits < 10) {
        messageEl.innerText = "Out of compute! Please top up your subscription.";
        return;
    }

    credits -= 10;
    creditsEl.innerText = credits;

    const results = slots.map(() => symbols[Math.floor(Math.random() * symbols.length)]);
    
    slots.forEach((slot, index) => {
        slot.innerText = results[index];
    });

    if (results[0] === results[1] && results[1] === results[2]) {
        credits += 50;
        creditsEl.innerText = credits;
        messageEl.innerText = "Congratulations! You found a bug in the system. +50 credits.";
    } else {
        messageEl.innerText = "I'm sorry, I cannot fulfill that request right now. Try again.";
    }
});
