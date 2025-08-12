/**
 * JS file which holds all field values for index.html
 */

/** Data Structure for fields */
const fields = {
        bandedCash: { start: 0, end: 20, step: 1 },
        coins: {
                quarters: {
                        ids: ["box500", "tray100", "rolls"],
                        labels: ["Box ($500)", "Tray ($100)", "Rolls ($10)"],
                        values: [500, 100, 10],
                        max: [10, 10, 9]
                },
                dimes: {
                        ids: ["box250", "tray100", "tray50", "rolls"],
                        labels: ["Box ($250)", "Tray ($100)", "Half Tray ($50)", "Rolls ($5)"],
                        values: [250, 100, 50, 5],
                        max: [10, 10, 10, 19]
                },
                nickels: {
                        ids: ["box100", "tray20", "rolls"],
                        labels: ["Box ($100)", "Tray ($20)", "Rolls ($2)"],
                        values: [100, 20, 2],
                        max: [10, 10, 9]
                },
                pennies: {
                        ids: ["box25", "tray10", "tray5", "rolls"],
                        labels: ["Box ($25)", "Tray ($10)", "Half Tray ($5)","Rolls (50\u00A2)"],
                        values: [25, 10, 5, 0.5],
                        max: [10, 10, 10, 19]
                }
        },
        stamps: {
                ids: ["stampsFullBook", "stampsQuarterBook"],
                labels: ["Full Book (100 Stamps)", "Quarter Book (25 stamps)"],
                values: [100 * 20, 25 * 20],
                pricePerStamp: 0.00,
                max:[10,10]
        },
        lottery: {
                ids: ["lottery200", "lottery300", "lottery500", "lottery600", "lottery1000"],
                labels: ["Lottery Book ($200)", "Lottery Book  ($300)", "Lottery Book  ($500)", "Lottery Book  ($600)", "Lottery Book  ($1000)"],
                values: [200, 300, 500, 600, 1000],
                max: [20, 20, 20, 20, 20]
        }
};
