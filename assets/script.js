function calculateBMI() {
    let weight = parseFloat(document.getElementById("weight").value);
    let feet = parseInt(document.getElementById("feet").value);
    let inches = parseInt(document.getElementById("inches").value);

    let resultBox = document.getElementById("result");

    if (isNaN(weight) || isNaN(feet) || isNaN(inches) || weight <= 0 || feet < 0 || inches < 0 || inches > 11) {
        resultBox.style.display = "block";
        resultBox.style.opacity = "0";
        resultBox.innerHTML = "Please fill in all fields with valid data";
        resultBox.classList.add("error");

        setTimeout(() => {
            resultBox.style.opacity = "1";
        }, 50);

        setTimeout(resetForm, 1500);
        return;
    }

    let totalInches = (feet * 12) + inches;
    let heightInMeters = totalInches * 0.0254;
    let bmi = weight / (heightInMeters * heightInMeters);

    let category = "";
    if (bmi < 18.5) {
        category = "Underweight";
        resultBox.className = "underweight";
    } else if (bmi >= 18.5 && bmi < 24.9) {
        category = "Normal weight";
        resultBox.className = "normal";
    } else if (bmi >= 25 && bmi < 29.9) {
        category = "Overweight";
        resultBox.className = "overweight";
    } else if (bmi >= 30 && bmi < 34.9) {
        category = "Obese Class 1 (Moderate obesity)";
        resultBox.className = "obese1";
    } else if (bmi >= 35 && bmi < 39.9) {
        category = "Obese Class 2 (Severe obesity)";
        resultBox.className = "obese2";
    } else {
        category = "Obese Class 3 (Very severe or morbidly obese)";
        resultBox.className = "obese3";
    }

    resultBox.style.display = "block";
    resultBox.style.opacity = "0";
    resultBox.innerHTML = `Your BMI: ${bmi.toFixed(2)}<br>Category: ${category}`;

    setTimeout(() => {
        resultBox.style.opacity = "1";
    }, 50);
}

function resetForm() {
    let resultBox = document.getElementById("result");

    resultBox.style.opacity = "0";
    setTimeout(() => {
        resultBox.style.display = "none";
        resultBox.className = "";
    }, 300);

    document.getElementById("weight").value = "";
    document.getElementById("feet").value = "";
    document.getElementById("inches").value = "";
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}
