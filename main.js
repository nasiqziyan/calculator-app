const digits = document.querySelectorAll('.digit');
const operators = document.querySelectorAll('.operator');
const currentScreen = document.querySelector('.currentScreen');
const topScreen = document.querySelector('.topScreen');
const equals = document.querySelector('.equals');
const operatorsArray = ["+","-","×","÷"]
const dot = document.querySelector('.dot');
const clear = document.querySelector('.clear');

add = (num1, num2) => (num1 + num2);
subtract = (num1, num2) => (num1 - num2);
multiply = (num1, num2) => (num1 * num2);
divide = (num1, num2) => (num1 / num2);
operate = (operator, num1, num2) => operator(num1,num2);

power = (num1, num2) => (Math.pow(num1,num2));



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

function initVariables() {
    n1Array = ['0'];
    n2Array = ['0'];
    n3Array = ['0'];
    waitingForNumber = false;
    WaitingForN1 = false;
    WaitingForN2 = false;
    WaitingForN3 = false;
    NumberClicked = false;
    n1;
}



function DisplayDigit(digitObject) {
    digitValue = digitObject.textContent;
    // console.log(digitValue);
    currentScreen.append(digitValue);
}

function n1digitClicked(event) {

    

    if (n1Array.length == 0 && this.textContent == '.') {
        n1Array.unshift("0");
        console.log("dotclicked!")
    }

    // console.log(`includes dot? ${n3Array.includes('.')}`)

    if (n1Array.includes('.') && this.textContent == '.') {
        return
    }
    
    n1Array.push(this.textContent);
    DisplayDigit(this);
    WaitingForN1 = true;
    waitingForNumber = false;
    NumberClicked = true;
    console.log("n1active");
}

function n2digitClicked(event) {

    

    if (n2Array.length == 0 && this.textContent == '.') {
        n2Array.unshift("0");
        console.log("dotclicked!")
    }

    // console.log(`includes dot? ${n3Array.includes('.')}`)

    if (n2Array.includes('.') && this.textContent == '.') {
        return
    }
    
    n2Array.push(this.textContent);
    DisplayDigit(this);
    WaitingForN2 = true;
    waitingForNumber = false;
    console.log("n2active");
}

function n3digitClicked(event) {
    if (n3Array.length == 0 && this.textContent == '.') {
        n3Array.unshift("0");
        console.log("dotclicked!")
    }
    
    // console.log(`includes dot? ${n3Array.includes('.')}`)
    
    if (n3Array.includes('.') && this.textContent == '.') {
        return
    }

    if (currentScreen.textContent.split('') != n3Array && (currentScreen.textContent[0] != ' ') && !currentScreen.textContent.includes("+") 
                                                                                                && !currentScreen.textContent.includes("-")
                                                                                                && !currentScreen.textContent.includes("÷")
                                                                                                && !currentScreen.textContent.includes("×")) {
        n3Array = currentScreen.textContent.split('')
        n3Array.push(this.textContent);
    }

    else {
        n3Array.push(this.textContent);
    }
    
    DisplayDigit(this);
    WaitingForN3 = true;
    waitingForNumber = false;
    console.log("n3active");
}

function DisplayOperator(operatorObject) {
    // if (operatorObject.textContent == '=') {
    //     if (!equals.classList.contains('active')) {
    //         console.log("changing topscreen");
    //         topScreen.textContent = operatorObject.textContent + ' ' + topScreen.textContent;
    //         equals.classList.add('active');
        
    //     } else return;

        
    // }

    // else currentScreen.append(` ${operatorObject.textContent} `);
    
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
    
    if (operatorBeforeN2 == 'equals') {
        return
    }
    console.log(`n1: ${n1}, current operator: ${operatorBeforeN2}, n2: ${n2}`);
    // console.log(`current operator: ${operatorBeforeN2}`);
    // console.log(`n2: ${n2}`);
    answer = operate(window[operatorBeforeN2],n1,n2);

    if (!Number.isFinite(answer)) {
        alert("Can't divide by zero!");
        location.reload();
        return;
    }

    console.log(`answer: ${answer}`);
    return answer;
}

function operatorClicked(event) {
    
    if (!NumberClicked) return

    // console.log(this.textContent)

    if (waitingForNumber) {
        console.log("inlimbo");
        if (this.textContent == '=') return;
        changeOperator();
        DisplayOperator(this);
        operatorBeforeN2 = ConvertMathOperatorToText(this.textContent);
        waitingForNumber = true;
        return;
    }

    // if (waitingForNumber && this.textContent == '=') return;

    if (!WaitingForN2) {
        console.log("branch1");
        if (this.textContent == '=') return;

        digits.forEach((digit) => digit.removeEventListener('click', n1digitClicked));
        digits.forEach((digit) => digit.addEventListener('click', n2digitClicked)); 
        operatorBeforeN2 = ConvertMathOperatorToText(this.textContent);
        // console.log(`operator before n2 B1: ${operatorBeforeN2}`)
        
    }

    if (WaitingForN1 && WaitingForN2 && !WaitingForN3) {
        console.log("branch2")
        answer = computeN1withN2(n1Array,n2Array);
        digits.forEach((digit) => digit.removeEventListener('click', n2digitClicked)); 
        digits.forEach((digit) => digit.addEventListener('click', n3digitClicked)); 
        operatorBeforeN2 = ConvertMathOperatorToText(this.textContent);
        // console.log(`operator before n2: B2 ${operatorBeforeN2}`)
        
    }

    if (WaitingForN1 && WaitingForN2 && WaitingForN3) {
        console.log("branch3");

        // if (currentScreen.textContent.includes("+"))
        // n3Array = currentScreen.textContent.split().slice(0,-3);
       
        if (typeof answer == 'undefined') {
            n1Array = n2Array;
            
        } else {
            n1Array = [`${answer}`];
        }
        

            
        
        n2Array = n3Array;
        
        // console.log(`this operator: ${this.textContent}`);
        answer = computeN1withN2(n1Array,n2Array);
        operatorBeforeN2 = ConvertMathOperatorToText(this.textContent);

        // if (n3Array == n2Array)
        n3Array = [];
        // console.log(`operator before n2 B3: ${operatorBeforeN2}`)
        

        
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


function pair () {
    digits.forEach((digit) => digit.addEventListener('click', n1digitClicked));
    operators.forEach((operator) => operator.addEventListener('click', operatorClicked))
    equals.addEventListener('click', appendEquals);
    clear.addEventListener('click', () => location.reload())
}

function initiate() {
    initVariables();
    pair();
}



initiate();