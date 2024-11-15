document.addEventListener("DOMContentLoaded", () => {
    const present = document.querySelector(".present");
    const surpriseImage = document.querySelector(".surprise-image");
    let clickCount = 0;

    function generateRandomNumber() {
        const max = 56;
        const min = 0;
        const rarestProbability = 0.001;

        // Scale a random number using an exponential distribution
        const x = Math.random(); // Random number between 0 and 1
        const weight = Math.log(1 / rarestProbability) / max;
        const scaled = Math.floor(min + (-Math.log(x) / weight));
        return Math.min(scaled, max);
    }

    present.addEventListener("click", () => {

        if (clickCount < 10) {
            // Add shake animation
            present.classList.add("shake");
            setTimeout(() => present.classList.remove("shake"), 500);

            clickCount++;
        }

        if (clickCount === 10) {
            surpriseImage.src = './pictures/'+ generateRandomNumber() + '.jpg';
            // Open the box
            present.classList.add("open");
            // Show the surprise image
            setTimeout(() => {
                surpriseImage.classList.add("show");
            }, 500);

            // present.classList.remove("open");
        }
    });
});
