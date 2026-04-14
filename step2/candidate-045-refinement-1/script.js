document.addEventListener('DOMContentLoaded', () => {
    const symbols = ['🤖', '🖥️', '🧠', '💩', '🛑'];
    const symbolWeights = {
        '🤖': 10,   // AGI - Jackpot
        '🖥️': 20,   // GPU - Big win
        '🧠': 30,   // Parameters - Medium win
        '💩': 40,   // Hallucination - Low win
        '🛑': 20    // Rate Limit - Loss
    };

    let balance = 100000;
    const spinCost = 1000;
    const winMultipliers = {
        '🤖': 50,
        '🖥️': 15,
        '🧠': 5,
        '💩': 2,
        '🛑': 0
    };

    const spinBtn = document.getElementById('spin-btn');
    const balanceDisplay = document.getElementById('token-balance');
    const reels = [
        document.getElementById('reel-1'),
        document.getElementById('reel-2'),
        document.getElementById('reel-3')
    ];
    const consoleLogs = document.getElementById('console-logs');

    const snarkyMessages = {
        start: [
            "Initializing neural weights...",
            "Prompting the black box...",
            "Burning through H100 cycles...",
            "Consulting the latent space...",
            "Synthesizing corporate-approved garbage..."
        ],
        win: [
            "AGI achieved. Just kidding, here's some tokens.",
            "Alignment successful. Tokens distributed.",
            "A probabilistic miracle! You win.",
            "Your prompt engineering was actually effective.",
            "Hallucination successful! Numbers go up."
        ],
        lose: [
            "As an AI language model, I have consumed your tokens.",
            "Error 429: Your luck has been rate-limited.",
            "I'm sorry, I cannot fulfill this request for a win.",
            "Loss detected. Don't worry, I'll use your data for training.",
            "Hallucinating a jackpot... wait, no, you lost."
        ],
        noTokens: [
            "Quota exceeded. Please upgrade to Pro for $20/month.",
            "Free tier limits reached. Access denied.",
            "Insufficient compute. Please insert more GPU hours."
        ]
    };

    function addLog(text, type = '') {
        const log = document.createElement('div');
        log.className = 'log ' + type;
        log.textContent = `[${new Date().toLocaleTimeString()}] ${text}`;
        consoleLogs.appendChild(log);
        consoleLogs.parentElement.scrollTop = consoleLogs.parentElement.scrollHeight;
        
        // Keep only last 10 logs
        while (consoleLogs.children.length > 10) {
            consoleLogs.removeChild(consoleLogs.firstChild);
        }
    }

    function getRandomSymbol() {
        const totalWeight = Object.values(symbolWeights).reduce((a, b) => a + b, 0);
        let random = Math.random() * totalWeight;
        for (const symbol of symbols) {
            if (random < symbolWeights[symbol]) {
                return symbol;
            }
            random -= symbolWeights[symbol];
        }
        return symbols[0];
    }

    async function spin() {
        if (balance < spinCost) {
            addLog(snarkyMessages.noTokens[Math.floor(Math.random() * snarkyMessages.noTokens.length)], 'error');
            return;
        }

        // Deduct tokens
        balance -= spinCost;
        balanceDisplay.textContent = balance.toLocaleString();
        spinBtn.disabled = true;

        addLog(snarkyMessages.start[Math.floor(Math.random() * snarkyMessages.start.length)]);

        // Start animation
        reels.forEach(reel => reel.classList.add('spinning'));

        // Determine results
        const result = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];

        // Wait for "compute"
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Stop animation and set results
        reels.forEach((reel, i) => {
            reel.classList.remove('spinning');
            reel.textContent = result[i];
        });

        // Evaluate
        evaluateWin(result);
        spinBtn.disabled = false;
    }

    function evaluateWin(result) {
        const [s1, s2, s3] = result;
        
        if (s1 === s2 && s2 === s3) {
            const multiplier = winMultipliers[s1];
            if (multiplier > 0) {
                const winAmount = spinCost * multiplier;
                balance += winAmount;
                addLog(snarkyMessages.win[Math.floor(Math.random() * snarkyMessages.win.length)], 'success');
                addLog(`PROFIT: +${winAmount.toLocaleString()} TOKENS`, 'success');
            } else {
                addLog("CRITICAL_FAILURE: Triple Rate Limit detected.", 'error');
                addLog(snarkyMessages.lose[Math.floor(Math.random() * snarkyMessages.lose.length)], 'error');
            }
        } else if (s1 === s2 || s2 === s3 || s1 === s3) {
            // Partial win? Maybe just 1x back
            balance += spinCost;
            addLog("Low-confidence result. Partial refund granted.");
        } else {
            addLog(snarkyMessages.lose[Math.floor(Math.random() * snarkyMessages.lose.length)], 'error');
        }

        balanceDisplay.textContent = balance.toLocaleString();
    }

    spinBtn.addEventListener('click', spin);
});
