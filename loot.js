document.addEventListener("DOMContentLoaded", () => {
    const dbUrl = "https://67370f08aafa2ef2223279d5.mockapi.io/gifts";

    const probabilities = [
        0.11615089841820023,
        0.102671792635802,
        0.0907569131759495,
        0.08022473434787024,
        0.07091479619529288,
        0.06268525985531583,
        0.055410746613543733,
        0.04898042773304348,
        0.043296335955262166,
        0.03827187294826933,
        0.03383048996298376,
        0.02990452159690554,
        0.026434154897498757,
        0.023366518099298548,
        0.020654875111460795,
        0.018257913483603266,
        0.01613911500194812,
        0.014266199326665998,
        0.012610632194119589,
        0.01114719069136476,
        0.00985357897977488,
        0.008710088613257066,
        0.0076992982759370625,
        0.0068058083647533,
        0.006016006373270246,
        0.005317859502284141,
        0.004700731337600159,
        0.004155219802028444,
        0.003673013912763614,
        0.0032467671618163704,
        0.0028699855904214637,
        0.0025369288522121294,
        0.0022425227578376826,
        0.00198228196862315,
        0.0017522416614926004,
        0.0015488971240569516,
        0.0013691503595847053,
        0.0012102628883711463,
        0.0010698140264249413,
        0.0009456640058391722,
        0.0008359213749779089,
        0.000738914181813319,
        0.0006531645013854035,
        0.0005773659193048563,
        0.000510363628255489,
        0.0004511368342622507,
        0.0003987832046806453,
        0.0003525051209693969,
        0.00031159752680446837,
        0.000275437186397898,
        0.0002434731893696869,
        0.0002152185575124645,
        0.00019024282557623094,
        0.0001681654830398728,
        0.0001486501769534641,
        0.00013139958753043823,
        0.00011615089841820026
    ]
    const labels = [
        "Socken",
        "Teddybär",
        "RAM 16GB",
        "NVIDIA RTX 4080",
        "Captain America Schild",
        "Kiwi Plüschtier",
        "Portal Gun Orange",
        "Pokémon Rote Edition",
        "RAM 32GB",
        "Krokodil Plüschtier",
        "Vampir-Oktopus Plüschtier",
        "Stoffpuppe",
        "Cooles Captain America Schild",
        "Todesstern",
        "Tux Plüschtier",
        "PSX",
        "NVIDIA RTX 4090",
        "Fluffiges Kiwi Plüschtier",
        "Ninja-Waffen",
        "Bessere PSX",
        "Warme Socken",
        "Süßes Krokodil Plüschtier",
        "Süßes Kiwi Plüschtier",
        "Fluffiger Teddybär",
        "Tux Plüschtier mit großen Füßen",
        "Game Boy",
        "Schicke Socken",
        "Ninja-Stern",
        "Lokomotive",
        "Lokomotive mit Anhänger",
        "Teddybär mit Todesstern",
        "RAM 64GB",
        "Ratte Plüschtier",
        "Portal Gun Blau",
        "Teddybär mit Geschenk",
        "Seltener Teddybär",
        "ALF Game Boy Spiel",
        "Seltener Kiwi",
        "Holz-Lokomotive",
        "Weihnachtliche Stoffpuppe",
        "Fuchs Plüschtier",
        "Common Mystery Box",
        "Rare Mystery Box",
        "Epic Mystery Box",
        "PSX mit Controller",
        "Ratte",
        "Süßes Weihnachtliches Krokodil Plüschtier",
        "Elegante Socken",
        "Legendary Mystery Box",
        "Blau und Orange Portal Gun",
        "Seltenes Vampir-Oktopus Plüschtier",
        "Scrimblo",
        "Echter Todesstern",
        "Fluffige Ratte",
    ]

    const present = document.querySelector(".present");
    const retryButton = document.querySelector(".retry");
    const toggleTableButton = document.querySelector(".toggle-table");
    const surpriseImage = document.querySelector(".surprise-image");
    let clickCount = 0;
    let clickAmount = 10;
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
            createTable()
            return;
        }

        await fetch(dbUrl + "/" + foundId, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ opened: foundObject.opened + 1, imageId: id }),
        })
        createTable();
    }

    function openPresent() {
        if (clickCount < clickAmount) {
            // Add shake animation
            present.classList.add("shake");
            setTimeout(() => present.classList.remove("shake"), 500);
            clickCount++;
        }

        if (clickCount === clickAmount) {
            clickCount++;
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
        clickAmount = (clickAmount  - 1) === 0 ? 1 : clickAmount  - 1;
        present.classList.remove("open");
        surpriseImage.classList.remove("show");
    }

    function generateRandomNumber() {
        const totalProbability = probabilities.reduce(
            (sum, prob) => sum + prob,
            0
        );
        const normalizedProbabilities = probabilities.map(
            (prob) => prob / totalProbability
        );

        const random = Math.random();

        let cumulativeProbability = 0;
        for (let i = 0; i < probabilities.length; i++) {
            cumulativeProbability += normalizedProbabilities[i];
            if (random < cumulativeProbability) {
                return i;
            }
        }
    }

    async function createTable() {
        const statistics = await fetchStatistics();
        statistics.sort((a, b) => probabilities[a.imageId-1] < probabilities[b.imageId-1], 0)
        const tbody = document.querySelector(".statistics-table").querySelector("tbody");
        tbody.innerHTML = ""; // Clear previous rows

        for (const statistic of statistics) {
            const row = document.createElement("tr");
            const cell1 = document.createElement("td");
            const cell2 = document.createElement("td");
            const cell3 = document.createElement("td");

            cell1.textContent = labels[statistic.imageId-1];
            cell2.textContent = statistic.opened;
            cell3.textContent = (probabilities[statistic.imageId-1] * 100).toFixed(3) + '%';

            row.appendChild(cell1);
            row.appendChild(cell2);
            row.appendChild(cell3);
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


