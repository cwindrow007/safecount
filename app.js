/**
 * JS file which holds all logic for index.html
 */



/** Validation function which prevents non-numeric input* */
function validateNumberInput(input){

        if(input.id === "manualCash"){
                //Allows numbers and a single decimal point
                input.value = input.value.replace(/[^0-9.]/g, '');
                if((input.value.match(/\./g) || []).length > 1){
                        input.value = input.value.substring(0, input.value.lastIndexOf("."));
                }
        } else {
                //Default case for integer-only fields
                input.value = input.value.replace(/[^0-9]/g, '');
        }
}
/** Prevents typing letters or negative numbers in field */
document.querySelectorAll('input[type="number"]').forEach(input => {
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

const money = n => n.toLocaleString(undefined,{style:"currency",currency:"USD"});

async function loadStampPrice() {
    try {
        // If your Pages site is at root; if it's under /repo-name, use that prefix.
        const res = await fetch('/stamp-price.json', { cache: 'no-store' });
        if (!res.ok) throw new Error('fetch failed');
        const data = await res.json();
        if (Number.isFinite(data.price)) {
            fields.stamps.pricePerStamp = data.price;
            localStorage.setItem('stampPrice', String(data.price));
            const el = document.getElementById('stampPrice');
            if (el) el.textContent = money(data.price);
            return;
        }
    } catch (_) {
        // fallback to last good value if present
        const saved = parseFloat(localStorage.getItem('stampPrice'));
        if (Number.isFinite(saved)) {
            fields.stamps.pricePerStamp = saved;
            const el = document.getElementById('stampPrice');
            if (el) el.textContent = money(saved);
            return;
        }
    }
    // last-resort default if nothing else available
    if (!fields.stamps.pricePerStamp) fields.stamps.pricePerStamp = 0.00;
}



/** Populate all Fields */
document.addEventListener("DOMContentLoaded", async () => {

    await loadStampPrice();


    // Populate Banded Cash
    ["bandedCash"].forEach(field => populateSelect(field, fields[field]));

    // Populate Coins Section
    const coinContainer = document.getElementById("coinFields");

    Object.entries(fields.coins).forEach(([coinType, { ids, labels, max }]) => {
            //Header for each coin type
            const section = document.createElement("div");
            section.classList.add("p-3", "bg-gray-100", "rounded-lg");

            const title = document.createElement("h3");
            title.classList.add("font-semibold", "text-lg", "mb-2", "text-gray-700");
            title.textContent = coinType.charAt(0).toUpperCase() + coinType.slice(1);

            section.appendChild(title);

            ids.forEach((id, index) => {
                    const fullId = `${coinType}-${id}`;
                    const div = document.createElement("div");
                    div.classList.add("w-full", "p-1");

                    div.innerHTML = `
                    <label class="block text-gray-700">${labels[index]}:</label>
                    <select id="${fullId}" class="w-full p-2 border rounded"></select>
                    `;

                    section.appendChild(div);
                    coinContainer.appendChild(section);
                    populateSelect(fullId, {start: 0, end: max[index], step:1});
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
const getFloat = id => parseFloat (document.getElementById(id)?.value) || 0;

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
    const singlesFivesTotal = getInt("singles") + getInt("fives");
    const manualCash = getFloat("manualCash") || 0;
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

    //Scroll to the bottom of the page to focus on the results
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
      
}

document.getElementById("calculateButton").addEventListener("click", calculateSafe);
