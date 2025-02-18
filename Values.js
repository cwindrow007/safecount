/**
 * JS file which holds all logic/values for index.html
 */

/** Data Structure for fields */
const fields = {
        bandedCash: { start: 0, end: 20, step: 1 },
        coins: {
                quarters: {
                        ids: ["box500", "tray100", "rolls"],
                        labels: ["Box ($500)", "Tray ($100)", "Rolls"],
                        values: [500, 100, 10],
                        max: [10, 10, 9]
                },
                dimes: {
                        ids: ["box250", "tray100", "rolls"],
                        labels: ["Box ($250)", "Tray ($100)", "Rolls"],
                        values: [250, 100, 5],
                        max: [10, 10, 19]
                },
                nickels: {
                        ids: ["box100", "tray20", "rolls"],
                        labels: ["Box ($100)", "Tray ($20)", "Rolls"],
                        values: [100, 20, 2],
                        max: [10, 10, 9]
                },
                pennies: {
                        ids: ["box25", "tray10", "rolls"],
                        labels: ["Box ($25)", "Tray ($10)", "Rolls"],
                        values: [25, 10, 0.5],
                        max: [10, 10, 19]
                }
        },
        stamps: {
                ids: ["stampsFullBook", "stampsQuarterBook"],
                labels: ["Full Book (100 Stamps)", "Quarter Book (25 stamps)"],
                values: [100, 25],
                pricePerStamp: 14.60,
                max:[10,10]
        },
        lottery: {
                ids: ["lottery200", "lottery300", "lottery500", "lottery600", "lottery1000"],
                labels: ["Lottery Book ($200)", "Lottery Book  ($300)", "Lottery Book  ($500)", "Lottery Book  ($600)", "Lottery Book  ($1000)"],
                values: [200, 300, 500, 600, 1000],
                max: [20, 20, 20, 20, 20]
        }
};

/** Validation function which prevents non-numeric input* */
function validateNumberInput(input){
        input.value = Math.max(0, input.value.replace(/[^0-9]/g, ''));
}
/** Prevents typing typing letters or negative numbers in field */
document.querySelectorAll('input[type="number"]') .forEach(input => {
        input.addEventListener('keydown', function(e) {
                if(e.key ==="e"|| e.key ==="-" || e.key === "+"){
                        e.preventDefault()
                }
        });
})

/** Utility function to populate select dropdowns */
function populateSelect(id, { start, end, step }) {
        const select = document.getElementById(id);
        for (let i = start; i <= end; i += step) {
                select.appendChild(new Option(i, i));
        }
}




/** Populate all Fields */
document.addEventListener("DOMContentLoaded", () => {
        // Populate Banded Cash
        ["bandedCash"].forEach(field => populateSelect(field, fields[field]));

        // Populate Coins Section
        const coinContainer = document.getElementById("coinFields");
        Object.entries(fields.coins).forEach(([coinType, { ids, labels, max }]) => {
                ids.forEach((id, index) => {
                        const fullId = `${coinType}-${id}`;
                        const div = document.createElement("div");
                        div.classList.add("w-full", "p-2");
                        div.innerHTML = `
                <label class="block text-gray-700">${coinType.charAt(0).toUpperCase() + coinType.slice(1)} - ${labels[index]}:</label>
                <select id="${fullId}" class="w-full p-2 border rounded"></select>
            `;
                        coinContainer.appendChild(div);
                        populateSelect(fullId, { start: 0, end: max[index], step: 1 });
                });
        });


        const stampsContainer = document.getElementById("stampFields");
        fields.stamps.ids.forEach((id, index) => {
                const div = document.createElement("div");
                div.classList.add("w-full", "p-2");
                div.innerHTML = `
                <label class="block text-gray-700">${fields.stamps.labels[index]}:</label>
                <select id="${id}" class="w-full p-2 border rounded"></select>`;

                stampsContainer.appendChild(div);
                populateSelect(id, { start: 0, end: fields.stamps.max[index], step: 1 });
        });

        const lotteryContainer = document.getElementById("lotteryFields");
        fields.lottery.ids.forEach((id, index) => {
                const div = document.createElement("div");
                div.classList.add("w-full", "p-2");
                div.innerHTML = `
                <label class="block text-gray-700">${fields.lottery.labels[index]}:</label>
                <select id="${id}" class="w-full p-2 border rounded"></select>`;
                lotteryContainer.appendChild(div);
                populateSelect(id, { start: 0, end: fields.lottery.max[index], step: 1 });
        });
});

/** Helper function to get integer input values */
const getInt = id => parseInt(document.getElementById(id)?.value) || 0;

/** Calculation logic */
function calculateSafe() {

        //Calculate Coin Total
        let coinsTotal = 0;
        Object.entries(fields.coins).forEach(([coinType, { ids, values }]) => {
                ids.forEach((id, index) => {
                        const fullId = `${coinType}-${id}`; // Ensure correct ID format
                        const inputValue = getInt(fullId);
                        coinsTotal += inputValue * values[index]; // Multiply correctly
                       });
        });

        //Calculate Stamps Total
        let totalStamps = 0;
        fields.stamps.ids.forEach((id, index) => {
                const inputValue = getInt(id);
                totalStamps += inputValue * fields.stamps.values[index];
        });
        const stampsTotal = totalStamps * fields.stamps.pricePerStamp;


        //Calculate Lottery Total
        let lotteryTotal = 0;
        fields.lottery.ids.forEach((id, index) => {
                const inputValue = getInt(id);
                lotteryTotal += inputValue * fields.lottery.values[index];

        });

        //Lottery Random
        lotteryTotal += getInt("lotteryRandom")


        //Calculate Total
        const bandedCash = getInt("bandedCash") * 1000;
        const singlesFivesTotal = (getInt("singles") * 100) + (getInt("fives") * 500);
        const manualCash = getInt("manualCash") || 0;
        const grandTotal = bandedCash + coinsTotal + singlesFivesTotal + manualCash + lotteryTotal + stampsTotal;

        const results = {
                resultBandedCash: `Banded Cash: $${bandedCash.toFixed(2)}`,
                resultCoins: `Coins Total: $${coinsTotal.toFixed(2)}`,
                resultSinglesFives: `Singles & Fives Total: $${singlesFivesTotal.toFixed(2)}`,
                resultManualCash: `Manual Cash: $${manualCash.toFixed(2)}`,
                resultStamps: `Stamps Total: $${stampsTotal.toFixed(2)}`,
                resultLottery: `Lottery Total: $${lotteryTotal.toFixed(2)}`,
                resultGrandTotal: `Grand Total: $${grandTotal.toFixed(2)}`,
        };

        Object.entries(results).forEach(([id, text]) => (document.getElementById(id).textContent = text));
        document.getElementById("results").classList.remove("hidden");
}

document.getElementById("calculateButton").addEventListener("click", calculateSafe);
