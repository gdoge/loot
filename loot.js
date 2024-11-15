document.addEventListener("DOMContentLoaded", () => {
    const present = document.querySelector(".present");
    const retryButton = document.querySelector(".retry");
    const surpriseImage = document.querySelector(".surprise-image");
    let clickCount = 0;
    present.addEventListener("click", openPresent);
    retryButton.addEventListener("click", retry);

    function openPresent() {
        if (clickCount < 10) {
            // Add shake animation
            present.classList.add("shake");
            setTimeout(() => present.classList.remove("shake"), 500);
            clickCount++;
        }

        if (clickCount === 10) {
            surpriseImage.src = './pictures/' + generateRandomNumber() + '.jpg';
            // Open the box
            present.classList.add("open");
            // Show the surprise image
            setTimeout(() => {
                surpriseImage.classList.add("show");
            }, 500);
        }
    }

    function retry() {
        clickCount = 0;
        present.classList.remove("open");
        surpriseImage.classList.remove("show");
    }

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


    function createTable() {
        const rowCount = parseInt(document.getElementById("rowCount").value, 10);
        const tbody = document.getElementById("dynamicTable").querySelector("tbody");
        tbody.innerHTML = ""; // Clear previous rows

        for (let i = 1; i <= rowCount; i++) {
            const row = document.createElement("tr");
            const cell1 = document.createElement("td");
            const cell2 = document.createElement("td");

            cell1.textContent = `Row ${i} Col 1`;
            cell2.textContent = `Row ${i} Col 2`;

            row.appendChild(cell1);
            row.appendChild(cell2);
            tbody.appendChild(row);
        }
    }

});
