const currentOperand = document.querySelector("#current-operand");
const previousOperand = document.querySelector("#previous-operand");
const keypad = document.querySelector(".keypad");

let current = "0";
let previous = "";
let operation = null;
let shouldResetScreen = false;

function render() {
  currentOperand.textContent = current;
  previousOperand.textContent = previous && operation ? `${previous} ${operation}` : "";
}

function inputDigit(digit) {
  if (current === "Error" || shouldResetScreen) {
    current = digit;
    shouldResetScreen = false;
    return;
  }
  if (current.replace("-", "").replace(".", "").length >= 12) return;
  current = current === "0" ? digit : current + digit;
}

function inputDecimal() {
  if (current === "Error" || shouldResetScreen) {
    current = "0.";
    shouldResetScreen = false;
  } else if (!current.includes(".")) {
    current += ".";
  }
}

function chooseOperation(nextOperation) {
  if (current === "Error") return;
  if (operation && !shouldResetScreen) calculate();
  previous = current;
  operation = nextOperation;
  shouldResetScreen = true;
}

function calculate() {
  if (!operation || !previous || current === "Error") return;
  const left = Number(previous);
  const right = Number(current);
  let result;

  switch (operation) {
    case "+": result = left + right; break;
    case "−": result = left - right; break;
    case "×": result = left * right; break;
    case "÷": result = right === 0 ? NaN : left / right; break;
    default: return;
  }

  current = Number.isFinite(result)
    ? String(Number(result.toPrecision(11)))
    : "Error";
  previous = "";
  operation = null;
  shouldResetScreen = true;
}

function clearCalculator() {
  current = "0";
  previous = "";
  operation = null;
  shouldResetScreen = false;
}

function deleteDigit() {
  if (current === "Error" || shouldResetScreen) {
    current = "0";
    shouldResetScreen = false;
    return;
  }
  current = current.length > 1 ? current.slice(0, -1) : "0";
}

keypad.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  switch (button.dataset.action) {
    case "digit": inputDigit(button.dataset.value); break;
    case "decimal": inputDecimal(); break;
    case "operator": chooseOperation(button.dataset.value); break;
    case "equals": calculate(); break;
    case "clear": clearCalculator(); break;
    case "delete": deleteDigit(); break;
  }
  render();
});

document.addEventListener("keydown", (event) => {
  if (/^\d$/.test(event.key)) inputDigit(event.key);
  else if (event.key === ".") inputDecimal();
  else if (event.key === "+") chooseOperation("+");
  else if (event.key === "-") chooseOperation("−");
  else if (event.key === "*") chooseOperation("×");
  else if (event.key === "/") {
    event.preventDefault();
    chooseOperation("÷");
  } else if (event.key === "Enter" || event.key === "=") calculate();
  else if (event.key === "Backspace") deleteDigit();
  else if (event.key === "Escape") clearCalculator();
  else return;

  render();
});

render();
