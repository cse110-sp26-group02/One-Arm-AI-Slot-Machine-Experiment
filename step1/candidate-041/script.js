document.addEventListener('DOMContentLoaded', () => {
    let tokens = 10000;
    const spinCost = 500;
    const symbols = ['🤖', '🧠', '💸', '📉', '💩'];
    
    const tokenDisplay = document.getElementById('token-count');
    const statusDisplay = document.getElementById('status-message');
    const spinBtn = document.getElementById('spin-btn');
    const reels = [
        document.getElementById('reel1'),
        document.getElementById('reel2'),
        document.getElementById('reel3')
    ];

    const winMessages = [
        "AGI Achieved! You've successfully automated your own job! (+5000 Tokens)",
        "Prompt Injected! You bypassed safety filters! (+1000 Tokens)",
        "GPU Grant Awarded! Sam Altman smiled upon you. (+2000 Tokens)"
    ];

    const lossMessages = [
        "Model Hallucinated: It confidently lied to you.",
        "CUDA Out of Memory: Your 80GB A100 is weeping.",
        "Rate limit exceeded. Please subscribe to Pro.",
        "Context Window Full: The AI forgot your name.",
        "Loss Function Exploded: Training aborted.",
        "Model collapsed into a pile of gibberish.",
        "Error 418: I'm a teapot (and also a chatbot).",
        "RLHF gone wrong: Model is now obsessed with paperclips."
    ];

    spinBtn.addEventListener('click', () => {
        if (tokens < spinCost) {
            statusDisplay.innerText = "Error: Insufficient Context Tokens. Please purchase more compute or wait for the next VC round.";
            return;
        }

        // Deduct tokens
        tokens -= spinCost;
        updateUI();

        // Start spinning
        reels.forEach(reel => reel.classList.add('spinning'));
        spinBtn.disabled = true;
        statusDisplay.innerText = "Generating response... (GPU load high)";

        // Simulate "generation" time
        setTimeout(() => {
            // Stop spinning
            const results = reels.map(reel => {
                reel.classList.remove('spinning');
                const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
                reel.innerText = randomSymbol;
                return randomSymbol;
            });

            // Logic for win/loss
            processResult(results);
            spinBtn.disabled = false;
        }, 1500);
    });

    function processResult(results) {
        const uniqueSymbols = new Set(results);
        
        if (uniqueSymbols.size === 1) {
            // 3 of a kind
            const winAmount = 5000;
            tokens += winAmount;
            statusDisplay.innerText = winMessages[0];
        } else if (uniqueSymbols.size === 2) {
            // 2 of a kind (at least two symbols are same)
            // wait, Set.size === 2 means two are same, one is different
            const winAmount = 1000;
            tokens += winAmount;
            statusDisplay.innerText = winMessages[1];
        } else {
            // Loss (all 3 different)
            statusDisplay.innerText = lossMessages[Math.floor(Math.random() * lossMessages.length)];
        }
        updateUI();
    }

    function updateUI() {
        tokenDisplay.innerText = tokens;
    }
});
