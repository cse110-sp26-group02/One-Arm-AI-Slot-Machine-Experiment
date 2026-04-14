let tokens = 100;

function spin() {
    if (tokens <= 0) {
        alert("Minigame: Guess the number to get tokens!");
        tokens = 50;
    } else {
        tokens -= 10;
        document.getElementById('token-count').innerText = tokens;
        // Logic for spinning reels
    }
}
