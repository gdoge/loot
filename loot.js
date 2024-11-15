document.addEventListener("DOMContentLoaded", () => {
    const dbUrl = "https://67370f08aafa2ef2223279d5.mockapi.io/gifts";

    const present = document.querySelector(".present");
    const retryButton = document.querySelector(".retry");
    const toggleTableButton = document.querySelector(".toggle-table");
    const surpriseImage = document.querySelector(".surprise-image");
    let clickCount = 0;
    present.addEventListener("click", openPresent);
    retryButton.addEventListener("click", retry);
    toggleTableButton.addEventListener("click", toggleTable);
    createTable();

    async function fetchStatistics() {
        const response = await fetch(dbUrl);
        if (!response.ok) {
            console.error("Error fetching Data")
            return;
        }

        return await response.json();
    }

    async function createOrUpdateArray(id) {
        const statistics = await fetchStatistics()
        const foundObject = statistics.find(data => data.imageId === id)
        const foundId = foundObject ? foundObject.id : null;

        if (!foundId) {
            await fetch(dbUrl, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ opened: 1, imageId: id }),
            })
            return;
        }

        await fetch(dbUrl + "/" + foundId, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ opened: foundObject.opened + 1, imageId: id }),
        })
    }

    function openPresent() {
        if (clickCount < 10) {
            // Add shake animation
            present.classList.add("shake");
            setTimeout(() => present.classList.remove("shake"), 500);
            clickCount++;
        }

        if (clickCount === 1) {
            const selectedPresent = generateRandomNumber()
            surpriseImage.src = './pictures/' + selectedPresent + '.jpg';

            createOrUpdateArray(selectedPresent + 1);

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


    async function createTable() {
        const statistics = await fetchStatistics();
        const tbody = document.querySelector(".statistics-table").querySelector("tbody");
        tbody.innerHTML = ""; // Clear previous rows

        for (const statistic of statistics) {
            const row = document.createElement("tr");
            const cell1 = document.createElement("td");
            const cell2 = document.createElement("td");

            cell1.textContent = `ImageID: ${statistic.imageId}`;
            cell2.textContent = statistic.opened;

            row.appendChild(cell1);
            row.appendChild(cell2);
            tbody.appendChild(row);
        }
    }

    function toggleTable() {
        const tableContainer = document.querySelector('.table-container');
        const button = document.querySelector('.toggle-table');

        if (tableContainer.style.maxHeight) {
            // Collapse the table
            tableContainer.style.maxHeight = null;
            tableContainer.style.overflow = 'hidden';
            button.textContent = '⬇ Statistik aller Benutzer';
        } else {
            // Expand the table
            const tableHeight = tableContainer.scrollHeight; // Get natural height of content
            tableContainer.style.maxHeight = tableHeight + 'px';
            tableContainer.style.overflow = 'visible';
            button.textContent = '⬆ Statistik einklappen';
        }
    }
});
