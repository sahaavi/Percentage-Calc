const STORAGE_KEYS = {
    history: "percentageCalc.history",
    stats: "percentageCalc.stats"
};

const CALCULATORS = {
    "percent-of": {
        formSelector: '[data-calculator="percent-of"]',
        compute(values) {
            const percent = parseNumber(values.get("percent"));
            const value = parseNumber(values.get("value"));

            if (!isFiniteNumber(percent) || !isFiniteNumber(value)) {
                return errorResult("Please enter a percentage and a value.");
            }

            const result = (percent / 100) * value;
            return successResult({
                title: `${formatSmartNumber(percent)}% of ${formatSmartNumber(value)} = ${formatSmartNumber(result)}`,
                result: formatSmartNumber(result),
                formula: `${formatSmartNumber(percent)} / 100 x ${formatSmartNumber(value)} = ${formatSmartNumber(result)}`
            });
        }
    },
    "what-percent": {
        formSelector: '[data-calculator="what-percent"]',
        compute(values) {
            const part = parseNumber(values.get("part"));
            const whole = parseNumber(values.get("whole"));

            if (!isFiniteNumber(part) || !isFiniteNumber(whole)) {
                return errorResult("Please enter both numbers.");
            }

            if (whole === 0) {
                return errorResult("The whole value cannot be 0.");
            }

            const result = (part / whole) * 100;
            return successResult({
                title: `${formatSmartNumber(part)} is ${formatSmartNumber(result)}% of ${formatSmartNumber(whole)}`,
                result: `${formatSmartNumber(result)}%`,
                formula: `${formatSmartNumber(part)} / ${formatSmartNumber(whole)} x 100 = ${formatSmartNumber(result)}%`
            });
        }
    },
    change: {
        formSelector: '[data-calculator="change"]',
        compute(values) {
            const oldValue = parseNumber(values.get("oldValue"));
            const newValue = parseNumber(values.get("newValue"));

            if (!isFiniteNumber(oldValue) || !isFiniteNumber(newValue)) {
                return errorResult("Please enter the original value and the new value.");
            }

            if (oldValue === 0) {
                return errorResult("The original value cannot be 0.");
            }

            const difference = newValue - oldValue;
            const percentChange = (difference / oldValue) * 100;
            const direction = percentChange >= 0 ? "increase" : "decrease";

            return successResult({
                title: `${formatSmartNumber(Math.abs(percentChange))}% ${direction}`,
                result: `${formatSmartNumber(Math.abs(percentChange))}% ${direction}`,
                formula: `Difference: ${formatSmartNumber(difference)}. (${formatSmartNumber(newValue)} - ${formatSmartNumber(oldValue)}) / ${formatSmartNumber(oldValue)} x 100 = ${formatSmartNumber(percentChange)}%`
            });
        }
    },
    "apply-change": {
        formSelector: '[data-calculator="apply-change"]',
        compute(values) {
            const baseValue = parseNumber(values.get("baseValue"));
            const changePercent = parseNumber(values.get("changePercent"));

            if (!isFiniteNumber(baseValue) || !isFiniteNumber(changePercent)) {
                return errorResult("Please enter a starting value and a percentage change.");
            }

            const finalValue = baseValue * (1 + changePercent / 100);
            const difference = finalValue - baseValue;
            const verb = changePercent >= 0 ? "increased" : "decreased";

            return successResult({
                title: `${formatSmartNumber(baseValue)} ${verb} by ${formatSmartNumber(Math.abs(changePercent))}% = ${formatSmartNumber(finalValue)}`,
                result: formatSmartNumber(finalValue),
                formula: `Difference: ${formatSmartNumber(difference)}. ${formatSmartNumber(baseValue)} x (1 + ${formatSmartNumber(changePercent)} / 100) = ${formatSmartNumber(finalValue)}`
            });
        }
    },
    discount: {
        formSelector: '[data-calculator="discount"]',
        compute(values) {
            const price = parseNumber(values.get("price"));
            const discountPercent = parseNumber(values.get("discountPercent"));

            if (!isFiniteNumber(price) || !isFiniteNumber(discountPercent)) {
                return errorResult("Please enter the original price and discount percent.");
            }

            if (price < 0) {
                return errorResult("Original price cannot be negative.");
            }

            const savings = price * (discountPercent / 100);
            const salePrice = price - savings;

            return successResult({
                title: `${formatSmartCurrency(price)} with ${formatSmartNumber(discountPercent)}% off = ${formatSmartCurrency(salePrice)}`,
                result: `${formatSmartCurrency(salePrice)} sale price`,
                formula: `You save ${formatSmartCurrency(savings)}. ${formatSmartCurrency(price)} - (${formatSmartCurrency(price)} x ${formatSmartNumber(discountPercent)} / 100) = ${formatSmartCurrency(salePrice)}`
            });
        }
    }
};

const PRESETS = {
    discount: {
        cardId: "discount-card",
        values: {
            "discount-price": "80",
            "discount-percent": "25"
        }
    },
    tip: {
        cardId: "percent-of-card",
        values: {
            "percent-of-percent": "18",
            "percent-of-value": "45"
        }
    },
    tax: {
        cardId: "apply-change-card",
        values: {
            "apply-base": "120",
            "apply-percent": "8.5"
        }
    },
    raise: {
        cardId: "apply-change-card",
        values: {
            "apply-base": "65000",
            "apply-percent": "5"
        }
    },
    markup: {
        cardId: "apply-change-card",
        values: {
            "apply-base": "40",
            "apply-percent": "30"
        }
    },
    change: {
        cardId: "change-card",
        values: {
            "change-old": "120",
            "change-new": "150"
        }
    }
};

let latestResults = new Map();

document.addEventListener("DOMContentLoaded", () => {
    initializeCalculators();
    initializePresets();
    initializeHistory();
});

function initializeCalculators() {
    Object.entries(CALCULATORS).forEach(([id, calculator]) => {
        const form = document.querySelector(calculator.formSelector);
        if (!form) return;

        form.addEventListener("submit", (event) => {
            event.preventDefault();
            const values = new FormData(form);
            const calculation = calculator.compute(values);
            renderResult(id, calculation);

            if (calculation.ok) {
                saveHistory({
                    calculatorId: id,
                    title: calculation.title,
                    result: calculation.result,
                    formula: calculation.formula,
                    timestamp: Date.now()
                });
                incrementStat("calculations");
            }
        });

        form.querySelectorAll("[data-action]").forEach((button) => {
            button.addEventListener("click", () => handleResultAction(id, button.dataset.action));
        });
    });
}

function initializePresets() {
    document.querySelectorAll("[data-preset]").forEach((button) => {
        button.addEventListener("click", () => {
            const preset = PRESETS[button.dataset.preset];
            if (!preset) return;

            Object.entries(preset.values).forEach(([inputId, value]) => {
                const input = document.getElementById(inputId);
                if (input) input.value = value;
            });

            const card = document.getElementById(preset.cardId);
            const form = card ? card.querySelector("form") : null;
            if (form) {
                card.scrollIntoView({ behavior: "smooth", block: "center" });
                window.setTimeout(() => {
                    const firstInput = form.querySelector("input");
                    if (firstInput) firstInput.focus();
                    form.requestSubmit();
                }, 220);
            }
        });
    });
}

function initializeHistory() {
    renderHistory();
    renderStats();

    const clearButton = document.getElementById("clear-history");
    if (clearButton) {
        clearButton.addEventListener("click", () => {
            localStorage.removeItem(STORAGE_KEYS.history);
            renderHistory();
        });
    }
}

function renderResult(id, calculation) {
    const panel = document.querySelector(`[data-result-for="${id}"]`);
    if (!panel) return;

    const output = panel.querySelector("output");
    const formula = panel.querySelector(".result-formula");
    const actions = panel.querySelector(".result-actions");

    panel.classList.toggle("is-complete", calculation.ok);
    panel.classList.toggle("is-error", !calculation.ok);

    if (output) output.value = calculation.result;
    if (formula) formula.textContent = calculation.formula || "";
    if (actions) actions.hidden = !calculation.ok;

    if (calculation.ok) {
        latestResults.set(id, calculation);
    } else {
        latestResults.delete(id);
    }
}

async function handleResultAction(id, action) {
    const calculation = latestResults.get(id);
    if (!calculation) return;

    if (action === "copy-result") {
        await copyText(calculation.result);
        incrementStat("copies");
        return;
    }

    if (action === "copy-formula") {
        await copyText(`${calculation.title}\n${calculation.formula}`);
        incrementStat("copies");
        return;
    }

    if (action === "share") {
        const shareText = `${calculation.title}\n${calculation.formula}`;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Percentage Calculator",
                    text: shareText,
                    url: window.location.href
                });
                return;
            } catch (error) {
                if (error.name === "AbortError") return;
            }
        }
        await copyText(shareText);
        incrementStat("copies");
    }
}

async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
}

function saveHistory(item) {
    const history = getHistory();
    const nextHistory = [item, ...history].slice(0, 5);
    localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(nextHistory));
    renderHistory();
}

function getHistory() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.history)) || [];
    } catch (error) {
        return [];
    }
}

function renderHistory() {
    const list = document.getElementById("history-list");
    if (!list) return;

    const history = getHistory();
    list.innerHTML = "";

    if (!history.length) {
        const empty = document.createElement("li");
        empty.className = "empty-history";
        empty.textContent = "No recent calculations yet.";
        list.appendChild(empty);
        return;
    }

    history.forEach((item) => {
        const li = document.createElement("li");
        const button = document.createElement("button");
        const small = document.createElement("small");

        button.type = "button";
        button.textContent = item.title;
        button.addEventListener("click", async () => {
            await copyText(`${item.title}\n${item.formula}`);
            incrementStat("copies");
        });

        small.textContent = item.formula;
        li.append(button, small);
        list.appendChild(li);
    });
}

function incrementStat(key) {
    const today = new Date().toISOString().slice(0, 10);
    const stats = getStats();

    if (stats.date !== today) {
        stats.date = today;
        stats.calculations = 0;
        stats.copies = 0;
    }

    stats[key] = (stats[key] || 0) + 1;
    localStorage.setItem(STORAGE_KEYS.stats, JSON.stringify(stats));
    renderStats();
}

function getStats() {
    const today = new Date().toISOString().slice(0, 10);
    try {
        const stats = JSON.parse(localStorage.getItem(STORAGE_KEYS.stats)) || {};
        if (stats.date === today) return stats;
    } catch (error) {
        return { date: today, calculations: 0, copies: 0 };
    }
    return { date: today, calculations: 0, copies: 0 };
}

function renderStats() {
    const stats = getStats();
    const todayCount = document.getElementById("today-count");
    const copyCount = document.getElementById("copy-count");

    if (todayCount) {
        todayCount.textContent = `${stats.calculations || 0} calculation${stats.calculations === 1 ? "" : "s"} today`;
    }

    if (copyCount) {
        copyCount.textContent = `${stats.copies || 0} copied today`;
    }
}

function parseNumber(value) {
    if (value === null || value === "") return NaN;
    return Number(value);
}

function isFiniteNumber(value) {
    return Number.isFinite(value);
}

function successResult({ title, result, formula }) {
    return { ok: true, title, result, formula };
}

function errorResult(message) {
    return { ok: false, result: message, formula: "" };
}

function formatSmartNumber(number) {
    if (!Number.isFinite(number)) return "0";
    const abs = Math.abs(number);

    if (abs !== 0 && (abs < 0.000001 || abs >= 1000000000000)) {
        return number.toExponential(6).replace(/\.?0+e/, "e");
    }

    const maximumFractionDigits = abs < 1 ? 8 : 6;
    return new Intl.NumberFormat("en-US", {
        maximumFractionDigits,
        useGrouping: true
    }).format(Number(number.toFixed(maximumFractionDigits)));
}

function formatSmartCurrency(number) {
    if (!Number.isFinite(number)) return "$0";
    const abs = Math.abs(number);
    const maximumFractionDigits = abs < 1 ? 4 : 2;

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits
    }).format(Number(number.toFixed(maximumFractionDigits)));
}
