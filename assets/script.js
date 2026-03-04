/**
 * BMI Calculator - Premium Logic
 * Refactored for modern ES6, accessibility, and theme persistence.
 */

document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const weightInput = document.getElementById("weight");
    const feetInput = document.getElementById("feet");
    const inchesInput = document.getElementById("inches");
    const calculateBtn = document.getElementById("calculateBtn");
    const resetBtn = document.getElementById("resetButton");
    const resultBox = document.getElementById("result");
    const themeToggle = document.getElementById("toggleDarkMode");

    // Initialize Theme
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }

    // --- Helper Functions ---

    const updateThemeIcon = () => {
        const isDark = document.body.classList.contains("dark-mode");
        themeToggle.innerHTML = isDark
            ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 3v1"/><path d="M12 20v1"/><path d="M3 12h1"/><path d="M20 12h1"/><path d="m18.364 5.636-.707.707"/><path d="m6.343 17.657-.707.707"/><path d="m5.636 5.636.707.707"/><path d="m17.657 17.657.707.707"/></svg>`
            : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
    };

    // Initial icon state
    updateThemeIcon();

    const calculateBMI = () => {
        const weightStr = weightInput.value.trim();
        const feetStr = feetInput.value.trim();
        const inchesStr = inchesInput.value.trim();

        // 1. Check for empty values first
        if (!weightStr || !feetStr || !inchesStr) {
            showError("Please provide all values.");
            return;
        }

        const weight = parseFloat(weightStr);
        const feet = parseInt(feetStr);
        const inches = parseInt(inchesStr);

        // 2. Validate range and positivity
        if (weight <= 0 || feet < 0 || inches < 0 || feet > 8 || (feet === 8 && inches > 11)) {
            showError("Please enter valid positive values. Max height: 8'11\".");
            return;
        }

        const totalInches = (feet * 12) + inches;
        const heightInMeters = totalInches * 0.0254;
        const bmi = weight / (heightInMeters * heightInMeters);

        displayResult(bmi, weight, feet, inches);
    };

    const getCategory = (bmi) => {
        if (bmi < 18.5) return { label: "Underweight", class: "underweight" };
        if (bmi < 25) return { label: "Normal Weight", class: "normal" };
        if (bmi < 30) return { label: "Overweight", class: "overweight" };
        if (bmi < 35) return { label: "Obese Class 1", class: "obese1" };
        if (bmi < 40) return { label: "Obese Class 2", class: "obese2" };
        return { label: "Obese Class 3", class: "obese3" };
    };

    const displayResult = (bmi, weight, feet, inches) => {
        const category = getCategory(bmi);

        resultBox.className = ""; // Clear existing classes
        resultBox.classList.add("visible", category.class);

        resultBox.innerHTML = `
            <div class="result-summary">
                <span>Weight: <strong>${weight}kg</strong></span>
                <span class="divider">|</span>
                <span>Height: <strong>${feet}'${inches}"</strong></span>
            </div>
            <div class="bmi-main">
                <span class="bmi-value">${bmi.toFixed(1)}</span>
                <span class="bmi-category">${category.label}</span>
            </div>
        `;
    };

    const showError = (message) => {
        resultBox.className = "";
        resultBox.classList.add("visible", "error");
        resultBox.textContent = message;

        // Auto-hide error after 3 seconds
        setTimeout(() => {
            if (resultBox.classList.contains("error")) {
                hideResult();
            }
        }, 3000);
    };

    const hideResult = () => {
        resultBox.classList.remove("visible");
        setTimeout(() => {
            if (!resultBox.classList.contains("visible")) {
                resultBox.className = "";
                resultBox.innerHTML = "";
            }
        }, 300);
    };

    const resetForm = () => {
        weightInput.value = "";
        feetInput.value = "";
        inchesInput.value = "";
        hideResult();
        weightInput.focus();
    };

    const toggleTheme = () => {
        document.body.classList.toggle("dark-mode");
        const isDark = document.body.classList.contains("dark-mode");
        localStorage.setItem("theme", isDark ? "dark" : "light");
        updateThemeIcon();
    };

    // --- Event Listeners ---

    calculateBtn.addEventListener("click", calculateBMI);
    resetBtn.addEventListener("click", resetForm);
    themeToggle.addEventListener("click", toggleTheme);

    // Keyboard support - Enter to calculate
    [weightInput, feetInput, inchesInput].forEach(input => {
        input.addEventListener("keypress", (e) => {
            if (e.key === "Enter") calculateBMI();
        });
    });
});
