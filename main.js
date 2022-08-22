const digits = document.querySelectorAll('.digit');
const operators = document.querySelectorAll('.operator');
const currentScreen = document.querySelector('.currentScreen');
const topScreen = document.querySelector('.topScreen');
const equals = document.querySelector('.equals');
const operatorsArray = ["+","-","×","÷"]
const dot = document.querySelector('.dot');
const clear = document.querySelector('.clear');
const del = document.querySelector('.del');

let n1Array = ['0'];
let n2Array = ['0'];
let n3Array = ['0'];
let waitingForNumber = false;
let WaitingForN1 = false;
let WaitingForN2 = false;
let WaitingForN3 = false;
let NumberClicked = false;
let answer;
let n1;

add = (num1, num2) => (num1 + num2);
subtract = (num1, num2) => (num1 - num2);
multiply = (num1, num2) => (num1 * num2);
divide = (num1, num2) => (num1 / num2);
operate = (operator, num1, num2) => operator(num1,num2);



function DisplayDigit(digitObject) {
    digitValue = digitObject.textContent;
    currentScreen.append(digitValue);
}

function preventMultipleDot(nArray,buttonClicked) {

    if (nArray.length == 0 && buttonClicked.textContent == '.') {
        n1Array.unshift("0");
    }

    if (nArray.includes('.') && buttonClicked.textContent == '.') {
        return true
    }

}

function n1digitClicked(event) {

    [n1active, n2active, n3active] = [true, false, false];
    
    buttonClicked = this;
    if (preventMultipleDot(n1Array,buttonClicked)) return;
 
    n1Array.push(this.textContent);
    DisplayDigit(this);
    WaitingForN1 = true;
    waitingForNumber = false;
    NumberClicked = true;
}

function n2digitClicked(event) {

    [n1active, n2active, n3active] = [false, true, false];

    buttonClicked = this;
    if (preventMultipleDot(n2Array,buttonClicked)) return;
    
    n2Array.push(this.textContent);
    DisplayDigit(this);
    WaitingForN2 = true;
    waitingForNumber = false;
    console.log("n2active");
}

function n3digitClicked(event) {

    [n1active, n2active, n3active] = [false, false, true];
    
    buttonClicked = this;
    if (preventMultipleDot(n3Array,buttonClicked)) return;

    if (currentScreen.textContent.split('') != n3Array && (currentScreen.textContent[0] != ' ') && !operatorsArray.find(el => currentScreen.textContent.includes(el))) {
        n3Array = currentScreen.textContent.split('')
        n3Array.push(this.textContent);
    }

    else {
        n3Array.push(this.textContent);
    }
    
    DisplayDigit(this);
    WaitingForN3 = true;
    waitingForNumber = false;

}

function DisplayOperator(operatorObject) {
    if (operatorObject.textContent == '=') return;
    currentScreen.append(` ${operatorObject.textContent} `);       
}

function changeOperator() {
    lastOperator = currentScreen.textContent.charAt(currentScreen.textContent.length - 2); //the last char is " " and 2nd to last char is operator. This is basically current operator
    currentText = currentScreen.textContent;
    
    if (operatorsArray.includes(lastOperator)) {
        currentText = currentText.slice(0,-2);
        currentScreen.textContent = currentText;  
    }
}

function ConvertMathOperatorToText(operator) {
    switch (operator) {
        case "+":
            return "add";
            break;

        case "-":
            return "subtract"
            break;
        
        case "÷":
            return "divide";
            break;
        
        case "×":
            return "multiply";
            break;

        case "=":
            return "equals";
            break;
    
    }
}

function computeN1withN2(n1,n2) {
    if (Array.isArray(n1) && Array.isArray(n2)) {
        n1Array.unshift('0');
        n2Array.unshift('0');
        n1 = +n1Array.join("");
        n2 = +n2Array.join("");
    }
    
    if (operatorBeforeN2 == 'equals') return 

    answer = operate(window[operatorBeforeN2],n1,n2);

    if (!Number.isFinite(answer)) {
        alert("Can't divide by zero!");
        location.reload();
        return;
    }

    return answer;
}

function operatorClicked(event) {
    
    n1active = n2active = n3active = false;
    if (!NumberClicked) return

    if (waitingForNumber) {
        if (this.textContent == '=') return;
        changeOperator();
        DisplayOperator(this);
        operatorBeforeN2 = ConvertMathOperatorToText(this.textContent);
        waitingForNumber = true;
        return;
    }

    if (!WaitingForN2) {

        if (this.textContent == '=') return;

        digits.forEach((digit) => digit.removeEventListener('click', n1digitClicked));
        digits.forEach((digit) => digit.addEventListener('click', n2digitClicked)); 
        operatorBeforeN2 = ConvertMathOperatorToText(this.textContent);     
    }

    if (WaitingForN1 && WaitingForN2 && !WaitingForN3) {
        console.log("branch2")
        answer = computeN1withN2(n1Array,n2Array);
        digits.forEach((digit) => digit.removeEventListener('click', n2digitClicked)); 
        digits.forEach((digit) => digit.addEventListener('click', n3digitClicked)); 
        operatorBeforeN2 = ConvertMathOperatorToText(this.textContent);
    }

    if (WaitingForN1 && WaitingForN2 && WaitingForN3) {
        console.log("branch3");
       
        if (typeof answer == 'undefined') {
            n1Array = n2Array;
            
        } else {
            n1Array = [`${answer}`];
        }
            
        n2Array = n3Array;  
        answer = computeN1withN2(n1Array,n2Array);
        operatorBeforeN2 = ConvertMathOperatorToText(this.textContent);
        n3Array = [];
    }

    waitingForNumber = true;

    if (typeof answer !== 'undefined') {
        topScreen.textContent = +answer.toFixed(3);
        equals.classList.remove('appended');
        currentScreen.textContent = '';
    }

    DisplayOperator(this);
    
}

function appendEquals() {
    
    if (!equals.classList.contains('appended')) {
        topScreen.textContent = "= " + topScreen.textContent;
        equals.classList.add('appended');
    }
   
    return;
}



function deleteClicked() {
    let foundTrue;
    activeObj = {n1active, n2active, n3active}
    
    for (key in activeObj) {
        if (activeObj[key] === true) {
            foundTrue = key;
        } 
    }

    currentText = currentScreen.textContent;

    switch (foundTrue) {
        case 'n1active':
            console.log(`n1array length = ${n1Array.length}`)
            if (!(n1Array.length <= 1)) {
                n1Array.pop(); 
                currentText = currentText.slice(0,-1);
                currentScreen.textContent = currentText; 
            }
            break;

        case 'n2active':
            console.log(`n1array length = ${n1Array.length}`)
            if (!(n2Array.length <= 1)) {
                n2Array.pop();
                currentText = currentText.slice(0,-1);
                currentScreen.textContent = currentText; 
            } 
            break;

        case 'n3active':
            console.log(`n1array length = ${n1Array.length}`)
            if (!(n3Array.length <= 0)) {
                n3Array.pop(); 
                currentText = currentText.slice(0,-1);
                currentScreen.textContent = currentText; 
            }
            break;

        default:
            break;
    }

}


function pair () {
    digits.forEach((digit) => digit.addEventListener('click', n1digitClicked));
    operators.forEach((operator) => operator.addEventListener('click', operatorClicked))
    equals.addEventListener('click', appendEquals);
    clear.addEventListener('click', () => location.reload())
    del.addEventListener('click', deleteClicked)
}

function initiate() {
    pair();
}

initiate();