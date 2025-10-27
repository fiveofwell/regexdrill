let regexAnswer = [];
let inputText = [];
let statementText = [];

const radioButton = document.querySelectorAll('input[name="level"]');
const guessSubmit = document.querySelector(".guessSubmit");
guessSubmit.addEventListener("click", applyRegex);

const inputField = document.getElementById("input");
const outputField = document.getElementById("output");
const regexInput = document.getElementById("regex");

const statement = document.getElementById("statement");

// JSONの読み込み
async function loadLevels(){
    try {
        const response = await fetch("levels.json");
        if (!response.ok) throw new Error("levels.jsonの読み込みに失敗しました");
        const data = await response.json();

        regexAnswer = data.regexAnswer;
        inputText = data.inputText
        statementText = data.statementText;

        initiation();
        
        console.log("Loaded");
    } catch (err) {
        alert("レベルデータの読み込みに失敗しました！");
        console.error(err);
    }
}

function getSelectedLevel() {
    const checked = document.querySelector('input[name="level"]:checked');
    return checked ? Number(checked.value) : null;
}

function getSelectedMode(){
    const checked = document.querySelector('input[name="mode"]:checked');
    return checked ? checked.value : "partial";
}

window.addEventListener("DOMContentLoaded", loadLevels);

function initiation() {
    const firstRadio = document.querySelector('input[name="level"][value="0"]');
    if (firstRadio) firstRadio.checked = true;

    inputField.value = inputText[0];
    statement.textContent = statementText[0];
}

radioButton.forEach(radio => {
    radio.addEventListener("change", () => {
        inputField.value = "";
        outputField.value = "";

        const selectedLevel = getSelectedLevel();
        if (selectedLevel !== 0) {
            inputField.setAttribute("disabled", true);
            inputField.style.opacity = 1;
        } else {
            inputField.removeAttribute("disabled");
        }

        inputField.value = inputText[selectedLevel];
        statement.textContent = statementText[selectedLevel];
        outputField.style.backgroundColor = '#FFFFFF'

        console.log(selectedLevel);
    });
});

function applyRegex() {
    try {
        const inputText = inputField.value;
        const lines = inputText.split(/\r?\n/);

        const mode = getSelectedMode();
        let pattern = regexInput.value;
        if (mode === "full") {
            if (!pattern.startsWith("^")) pattern = "^" + pattern;
            if (!pattern.endsWith("$")) pattern = pattern + "$";
        }

        const regex = new RegExp(pattern, "m");
        const result = lines.filter(line => regex.test(line));
        if(result.length === 0) {
            outputField.value = "(一致なし)";
        } else {
            outputField.value = result.join("\n");
        }

        if (getSelectedLevel() !== 0) {
            judge();
        }
    } catch (err) {
        alert("無効な正規表現です！");
    }
}

function judge() {
    const selectedLevel = getSelectedLevel();
    let regex = "";

    regex = regexAnswer[selectedLevel]

    const correctRegex = new RegExp(regex)
    const inputText = inputField.value;
    const lines = inputText.split(/\r?\n/);
    const result = lines.filter(line => correctRegex.test(line)).join("\n");

    if (outputField.value === result) {
        // 正解
        outputField.style.backgroundColor = '#DDFFDD'
    } else {
        outputField.style.backgroundColor = '#FFDDDD'
    }
}