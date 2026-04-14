document.addEventListener('DOMContentLoaded', () => {
    const symbols = ['🤖', '🖥️', '🧠', '💩', '🛑'];
    const symbolWeights = {'🤖': 10, '🖥️': 20, '🧠': 30, '💩': 40, '🛑': 20};
    
    let balance = 100000;
    const spinCost = 1000;
    const winMultipliers = {'🤖': 50, '🖥️': 15, '🧠': 5, '💩': 2, '🛑': 0};

    const balanceDisplay = document.getElementById('token-balance');
    const lever = document.getElementById('lever');
    const leverContainer = document.getElementById('lever-container');
    const reels = [document.getElementById('reel-1'), document.getElementById('reel-2'), document.getElementById('reel-3')];
    const container = document.querySelector('.terminal-container');

    const audio = {
        spin: new Audio('spin.mp3'),
        win: new Audio('win.mp3'),
        loss: new Audio('loss.mp3')
    };

    let isSpinning = false;
    let displayedBalance = balance;

    function createConfetti() {
        for (let i = 0; i < 50; i++) {
            const div = document.createElement('div');
            div.className = 'confetti';
            div.style.left = Math.random() * 100 + '%';
            div.style.backgroundColor = ['#ffd700', '#ff0000'][Math.floor(Math.random() * 2)];
            container.appendChild(div);
            setTimeout(() => div.remove(), 2000);
        }
    }

    function showScore(amount, x, y) {
        const div = document.createElement('div');
        div.className = 'score-indicator';
        div.textContent = (amount >= 0 ? '+' : '') + amount.toLocaleString();
        div.style.left = x + 'px';
        div.style.top = y + 'px';
        container.appendChild(div);
        setTimeout(() => div.remove(), 1000);
    }

    function updateBalanceDisplay(target) {
        const step = (target - displayedBalance) / 10;
        if (Math.abs(target - displayedBalance) < 1) {
            displayedBalance = target;
        } else {
            displayedBalance += step;
            requestAnimationFrame(() => updateBalanceDisplay(target));
        }
        balanceDisplay.textContent = Math.round(displayedBalance).toLocaleString();
    }

    function getRandomSymbol() {
        const totalWeight = Object.values(symbolWeights).reduce((a, b) => a + b, 0);
        let random = Math.random() * totalWeight;
        for (const symbol of symbols) {
            if (random < symbolWeights[symbol]) return symbol;
            random -= symbolWeights[symbol];
        }
        return symbols[0];
    }

    async function spin() {
        if (isSpinning) return;
        if (balance < spinCost) {
            audio.loss.play().catch(() => {});
            return;
        }
        
        isSpinning = true;
        balance -= spinCost;
        updateBalanceDisplay(balance);
        audio.spin.play().catch(() => {});

        lever.classList.add('pulled');
        reels.forEach(reel => reel.classList.add('spinning'));

        await new Promise(resolve => setTimeout(resolve, 1500));

        const result = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
        reels.forEach((reel, i) => {
            reel.classList.remove('spinning');
            reel.textContent = result[i];
        });

        evaluateWin(result);
        lever.classList.remove('pulled');
        isSpinning = false;
    }

    function evaluateWin(result) {
        const [s1, s2, s3] = result;
        if (s1 === s2 && s2 === s3) {
            const multiplier = winMultipliers[s1] || 0;
            const winAmount = spinCost * multiplier;
            if (winAmount > 0) {
                balance += winAmount;
                showScore(winAmount, 300, 200);
                audio.win.play().catch(() => {});
                if (multiplier >= 15) createConfetti();
            }
            updateBalanceDisplay(balance);
        } else if (s1 === s2 || s2 === s3 || s1 === s3) {
            balance += spinCost;
            updateBalanceDisplay(balance);
            showScore(spinCost, 300, 200);
        }
    }

    leverContainer.addEventListener('click', spin);
});
