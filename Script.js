const CHAR_SETS = {
    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lower: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+{}[]:;<>,.?/~"
};

const lengthSlider = document.getElementById("lengthSlider");
const lengthValueSpan = document.getElementById("lengthValue");
const passwordBox = document.getElementById("passwordBox");
const checkBoxes = [
    document.getElementById('includeUpper'),
    document.getElementById('includeLower'),
    document.getElementById('includeNumbers'),
    document.getElementById('includeSymbols')
];
const generateButton = document.querySelector('.generate-btn');
const strengthLabel = document.getElementById('strengthLabel');
const strengthFill = document.getElementById('strengthFill');

function updateLengthValue() {
    lengthValueSpan.textContent = lengthSlider.value;
    checkMinimumOptions();
}

function checkMinimumOptions() {
    const isAnyChecked = checkBoxes.some(cb => cb.checked);
    generateButton.disabled = !isAnyChecked;
    if (!isAnyChecked) {
        passwordBox.value = "Select options above!";
        updateStrength(0, 0);
    }
}

function updateStrength(length, selectedTypes) {
    let level = 0;
    let label = "Too Short";

    if (selectedTypes > 0) {
        if (length < 10) { level = 1; label = "Weak"; }
        else if (length < 14) { level = 2; label = "Moderate"; }
        else if (length < 18) { level = 3; label = "Strong"; }
        else { level = 4; label = "Excellent"; }
    }
    
    if (selectedTypes < 2 && level > 1) level = 1;
    if (selectedTypes < 3 && level > 2) level = 2;

    strengthFill.className = `strength-fill strength-${level}`;
    strengthLabel.className = `level-${level}`;
    strengthLabel.textContent = label;
}

function generatePassword() {
    const length = parseInt(lengthSlider.value);
    let availableChars = "";
    let requiredChars = [];
    let password = "";
    let selectedTypes = 0;

    if (document.getElementById('includeUpper').checked) {
        availableChars += CHAR_SETS.upper;
        requiredChars.push(CHAR_SETS.upper);
        selectedTypes++;
    }
    if (document.getElementById('includeLower').checked) {
        availableChars += CHAR_SETS.lower;
        requiredChars.push(CHAR_SETS.lower);
        selectedTypes++;
    }
    if (document.getElementById('includeNumbers').checked) {
        availableChars += CHAR_SETS.numbers;
        requiredChars.push(CHAR_SETS.numbers);
        selectedTypes++;
    }
    if (document.getElementById('includeSymbols').checked) {
        availableChars += CHAR_SETS.symbols;
        requiredChars.push(CHAR_SETS.symbols);
        selectedTypes++;
    }

    if (availableChars.length === 0) {
        passwordBox.value = "Select options above!";
        updateStrength(0, 0);
        return;
    }

    for (let i = 0; i < requiredChars.length; i++) {
        const charSet = requiredChars[i];
        const requiredChar = charSet[Math.floor(Math.random() * charSet.length)];
        password += requiredChar;
    }

    for (let i = password.length; i < length; i++) {
        password += availableChars[Math.floor(Math.random() * availableChars.length)];
    }

    password = password.split('').sort(() => Math.random() - 0.5).join('');

    passwordBox.value = password;
    updateStrength(length, selectedTypes);
}

function copyPassword() {
    if (passwordBox.value === "Click Generate!" || passwordBox.value === "Select options above!" || passwordBox.value.length === 0) return;

    passwordBox.select();
    passwordBox.setSelectionRange(0, 99999);

    navigator.clipboard.writeText(passwordBox.value).then(() => {
        const msg = document.getElementById("copy-message");
        msg.classList.add("show");
        setTimeout(() => { msg.classList.remove("show"); }, 1500);
    }).catch(err => {
        console.error('Could not copy text: ', err);
        document.execCommand("copy");
    });
}

document.addEventListener('DOMContentLoaded', () => {
    lengthSlider.addEventListener('input', updateLengthValue);
    checkBoxes.forEach(cb => cb.addEventListener('change', checkMinimumOptions));
    updateLengthValue();
    generatePassword();
});
