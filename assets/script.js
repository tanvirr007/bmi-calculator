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
    const formSection = document.querySelector(".calculator-form");
    const headerEl = document.querySelector("header");

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
        if (weight <= 0 || weight > 500 || feet < 0 || inches < 0 || feet > 8 || (feet === 8 && inches > 11)) {
            showError("Please enter valid positive values. Max weight: 500kg. Max height: 8'11\".");
            return;
        }

        const totalInches = (feet * 12) + inches;
        const heightInMeters = totalInches * 0.0254;
        const bmi = weight / (heightInMeters * heightInMeters);

        displayResult(bmi, weight, feet, inches);
    };

    const getCategory = (bmi) => {
        if (bmi < 18.5) return { label: "Underweight", class: "underweight", icon: "⚠️", color: "#f59e0b" };
        if (bmi < 25) return { label: "Normal Weight", class: "normal", icon: "✅", color: "#10b981" };
        if (bmi < 30) return { label: "Overweight", class: "overweight", icon: "⚡", color: "#f97316" };
        if (bmi < 35) return { label: "Obese Class I", class: "obese1", icon: "🔴", color: "#ef4444" };
        if (bmi < 40) return { label: "Obese Class II", class: "obese2", icon: "🔴", color: "#dc2626" };
        return { label: "Obese Class III", class: "obese3", icon: "🔴", color: "#b91c1c" };
    };

    const getHealthTip = (bmi) => {
        if (bmi < 18.5) return "Consider a nutrient-rich diet with more calories. Consult a nutritionist for a healthy weight gain plan.";
        if (bmi < 25) return "Great job! Maintain your healthy lifestyle with balanced nutrition and regular exercise.";
        if (bmi < 30) return "Small changes like daily walks and mindful eating can make a big difference. You're on the right track!";
        return "Consult a healthcare professional for a personalized plan. Every step towards health counts!";
    };

    const getNormalRange = (feet, inches) => {
        const totalInches = (feet * 12) + inches;
        const heightM = totalInches * 0.0254;
        const minWeight = (18.5 * heightM * heightM).toFixed(1);
        const maxWeight = (24.9 * heightM * heightM).toFixed(1);
        return { min: minWeight, max: maxWeight };
    };

    const getGaugePosition = (bmi) => {
        const minBMI = 10;
        const maxBMI = 45;
        const clamped = Math.max(minBMI, Math.min(maxBMI, bmi));
        return ((clamped - minBMI) / (maxBMI - minBMI)) * 100;
    };

    const animateCounter = (element, target) => {
        const duration = 800;
        const start = performance.now();
        const step = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            element.textContent = (target * eased).toFixed(1);
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };

    const displayResult = (bmi, weight, feet, inches) => {
        const category = getCategory(bmi);
        const tip = getHealthTip(bmi);
        const normalRange = getNormalRange(feet, inches);
        const gaugePos = getGaugePosition(bmi);
        const heightCm = ((feet * 12) + inches) * 2.54;

        resultBox.className = "";
        resultBox.classList.add("visible", category.class);

        resultBox.innerHTML = `
            <div class="result-header">
                <div class="result-input-cards">
                    <div class="info-chip">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22V2"/><path d="M2 12h5"/><path d="M17 12h5"/><path d="M2 7h3"/><path d="M19 7h3"/><path d="M2 17h3"/><path d="M19 17h3"/></svg>
                        <span>${feet}'${inches}" <small>(${heightCm.toFixed(0)}cm)</small></span>
                    </div>
                    <div class="info-chip">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>
                        <span>${weight} kg</span>
                    </div>
                </div>
            </div>

            <div class="bmi-score-section">
                <div class="bmi-value-wrap">
                    <span class="bmi-value" data-target="${bmi.toFixed(1)}">0.0</span>
                </div>
                <span class="bmi-label">${category.icon} ${category.label}</span>
            </div>

            <div class="bmi-gauge">
                <div class="gauge-bar">
                    <div class="gauge-segment seg-under" title="Underweight < 18.5"></div>
                    <div class="gauge-segment seg-normal" title="Normal 18.5 – 24.9"></div>
                    <div class="gauge-segment seg-over" title="Overweight 25 – 29.9"></div>
                    <div class="gauge-segment seg-obese" title="Obese 30+"></div>
                    <div class="gauge-pointer" style="left: ${gaugePos}%">
                        <div class="pointer-dot"></div>
                    </div>
                </div>
                <div class="gauge-labels">
                    <span>18.5</span>
                    <span>25</span>
                    <span>30</span>
                </div>
            </div>

            <div class="result-details">
                <div class="detail-row">
                    <span class="detail-label">Healthy Range</span>
                    <span class="detail-value">${normalRange.min} – ${normalRange.max} kg</span>
                </div>
            </div>

            <div class="health-tip">
                <div class="tip-icon">💡</div>
                <p>${tip}</p>
            </div>
        `;

        // Hide the form inputs and show result-only view
        showResultView();

        // Animate the counter
        const valueEl = resultBox.querySelector('.bmi-value');
        if (valueEl) animateCounter(valueEl, bmi);

        // Animate the gauge pointer
        requestAnimationFrame(() => {
            const pointer = resultBox.querySelector('.gauge-pointer');
            if (pointer) pointer.classList.add('animated');
        });
    };

    const showResultView = () => {
        document.body.classList.add('result-mode');
        resetBtn.textContent = 'Main Menu';
        resetBtn.classList.remove('btn-outline');
        resetBtn.classList.add('btn-primary');
    };

    const showFormView = () => {
        document.body.classList.remove('result-mode');
        resetBtn.textContent = 'Reset';
        resetBtn.classList.remove('btn-primary');
        resetBtn.classList.add('btn-outline');
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
        showFormView();
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

    // Real-time input clamping
    const clampInput = (input, max) => {
        input.addEventListener("input", () => {
            const val = parseFloat(input.value);
            if (val > max) input.value = max;
            if (val < 0) input.value = 0;
        });
    };

    clampInput(weightInput, 500);
    clampInput(feetInput, 8);
    clampInput(inchesInput, 11);
});
