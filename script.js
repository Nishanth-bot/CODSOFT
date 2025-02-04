let display = document.querySelector(".display-text");
let number = "";
let nums = [];
let operators = [];

const AddToDisplay = (num) => {
  if (!display.innerHTML.includes(".") || num !== ".") {
    if (display.innerHTML == "0") {
      display.innerHTML = `${num}`;
      number += num.toString();
    } else {
      display.innerHTML += `${num}`;
      number += `${num}`;
    }
  }
};

const AllClear = () => {
  number = "";
  nums = [];
  operators = [];
  display.innerHTML = "0";
};

const Delete = () => {
  display.innerHTML = display.innerHTML.substring(
    0,
    display.innerHTML.length - 1
  );
};

// + – × ÷

const Evaluator = () => {
  const expression = display.innerHTML;

  let operators = {
    "+": { precedence: 1, associativity: "L" },
    "-": { precedence: 1, associativity: "L" },
    "×": { precedence: 2, associativity: "L" },
    "÷": { precedence: 2, associativity: "L" },
    "%": { precedence: 2, associativity: "L" },
    "^": { precedence: 3, associativity: "R" },
  };

  let tokens = expression.match(/-?\d+(\.\d+)?|\+|\-|\×|\÷|\^|\%|\(|\)/g);
  let outputQueue = [];
  let operatorStack = [];

  tokens.forEach((token) => {
    if (!isNaN(token)) {
      outputQueue.push(parseFloat(token));
    } else if (token in operators) {
      while (
        operatorStack.length &&
        operators[operatorStack[operatorStack.length - 1]] &&
        (operators[token].precedence <
          operators[operatorStack[operatorStack.length - 1]].precedence ||
          (operators[token].precedence ===
            operators[operatorStack[operatorStack.length - 1]].precedence &&
            operators[token].associativity === "L"))
      ) {
        outputQueue.push(operatorStack.pop());
      }
      operatorStack.push(token);
    } else if (token === "(") {
      operatorStack.push(token);
    } else if (token === ")") {
      while (
        operatorStack.length &&
        operatorStack[operatorStack.length - 1] !== "("
      ) {
        outputQueue.push(operatorStack.pop());
      }
      if (operatorStack.length === 0) {
        throw new Error("Mismatched parentheses");
      }
      operatorStack.pop();
    }
  });

  while (operatorStack.length) {
    outputQueue.push(operatorStack.pop());
  }

  let evalStack = [];
  outputQueue.forEach((el) => {
    if (!isNaN(el)) {
      evalStack.push(el);
    } else {
      let n2 = evalStack.pop();
      let n1 = evalStack.pop();

      let result;
      switch (el) {
        case "+":
          result = n1 + n2;
          break;
        case "-":
          result = n1 - n2;
          break;
        case "×":
          result = n1 * n2;
          break;
        case "÷":
          result = n1 / n2;
          break;
        case "%":
          if (isNaN(n1)) {
            result = n2 / 100;
          } else {
            result = (n1 * n2) / 100;
          }
          break;
        case "^":
          result = Math.pow(n1, n2);
          break;
        default:
          throw new Error("Invalid operator");
      }

      evalStack.push(parseFloat(result.toFixed(3)));
    }
  });

  console.log("Output Queue:", outputQueue);
  console.log("Operator Stack:", operatorStack);
  console.log("Final Result:", evalStack[0]);

  display.innerHTML = evalStack[0];
};
