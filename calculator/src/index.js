import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const Input = (props) => <div class="input">{props.in != "" ? props.in : "\0"}</div>;

const Display = (props) => 
  <div class="display">{props.out != "" ? props.out : "\0"}</div>;

const Number = (props) => 
  <div id={props.id} class="number" onClick={props.onClick}>
    {props.value}
  </div>;

const Operator = (props) => 
  <div id={props.id} class="operator" onClick={props.onClick}>
    {props.symbol}
  </div>;

const Point = (props) => <div class="point" onClick={props.onClick}>.</div>;

const Equals = (props) => <div class="equals" onClick={props.onClick}>=</div>;

class Calculator extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      input: "",
      operators: [],
      operands: [],
      results: [],
      solved: false
    };
    this.nums = {
      7: "seven", 8: "eight", 9: "nine",
      4: "four", 5: "five", 6: "six",
      1: "one", 2: "two", 3: "three",
      0: "zero"
    };
    this.symbols = {
      back: "\u21E6",
      divide: "\u00F7",
      multiply: "\u00D7",
      subtract: "-",
      add: "+"
    };
    this.makeDigits = this.makeDigits.bind(this);
    this.makeOperators = this.makeOperators.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.calculate = this.calculate.bind(this);
    this.splitNum = this.splitNum.bind(this);
  }
  
//   componentWillMount() {
//     document.addEventListener("keydown", this.handleClick());
//   }
  
//   componentWillUnmount() {
//     document.removeEventListener("keydown", this.handleClick());
//   }
  
  makeDigits() {
    const nums = this.nums;
    const keys = Object.keys(nums);
    var results = [];
    for (var i = 0; i < keys.length; i++) {
      results.push({
        key: keys[i],
        num: nums[i]
      });
    }
    return results;
  }
  
  makeOperators() {
    const symbols = this.symbols;
    const keys = Object.keys(symbols);
    var operators = [];
    for (var i = 0; i < keys.length; i++) {
      var symbol = symbols[keys[i]];
      operators.push({
        key: keys[i],
        symbol: symbols[keys[i]]
      });
    }
    return operators;
  }
  
  handleClick(e) {
    var input = "";
    var operators = this.state.operators;
    var operands = this.state.operands;
    var results = this.state.results;
    var solved = this.state.solved;
    var operatorSymbols = Object.values(this.symbols);
    
    // If input is an operator excluding "=" and "back" and an operand has already been entered...
    if (Object.keys(this.symbols).includes(e) && e != "back" && operands.length > 0) {
      
      // If an operator was not the last character entered...
      if (!operatorSymbols.includes(this.state.input.charAt(this.state.input.length - 1))) {
        // input = this.symbols[e];
        this.setState({input : this.state.input.concat(this.symbols[e])});
        operators.unshift(e);
      } 
    } 
    else if (e == "=" && this.state.input != "" && operators != []) {
      
      if (operands.length >= 2 && 
          !operatorSymbols.includes(this.state.input.charAt(this.state.input.length - 1))) {
        var splitResult = this.splitNum(results[0]);
        this.setState({input: results[0]});
        // input = "";
        operands = []
        operators = [];
        operands.unshift(splitResult);
        solved = true;
      }
    }
    else if (e == "back" && this.state.input.length > 0) {
      
      var input = this.state.input;
      
      // If the last character entered was an operator...
      if (Object.values(this.symbols).includes(this.state.input.charAt(this.state.input.length - 1))) {
        operators.shift();
        input = input.slice(0, this.state.input.length - 1);
      }
      else {
        if (operands[0].length == 1) {
          operands.shift();
          results.shift();
        } else if (operands.length > 2) { // if length is 2 or more, there is already a result
          operands[0].shift();
          results.shift();
          // var result = this.calculate(results[0], operands[0][0], operators[0]); // here
          // results.unshift(result);
        } else {
          operands[0].shift();
          results.shift();
        }
        input = input.slice(0, input.length - 1);
      }
      this.setState({input: input});
    }
    // If input is a digit or a decimal point...
    else if (e.match(/[0-9.]/)) {

      // If first input either at beginning...
      if (operands.length == 0) {
        // input = e;
        this.setState({input: e});
        var arr = [];
        arr.unshift(e);
        operands.unshift(arr);
      } 
      // If it's a second decimal point within the same operand, ignore.
      else if (e == "." && operands[0][0].includes(".")) {
        return;
      } 
      // If the last character entered was an operator...
      else if (Object.values(this.symbols).includes(this.state.input.charAt(this.state.input.length - 1))) {
        // input = e;
        this.setState({input: this.state.input.concat(e)});
        var arr = [];
        arr.unshift(e);
        operands.unshift(arr);
        var result = operands.length <= 2 ? this.calculate(operands[1][0], operands[0][0], operators[0]) : 
          this.calculate(results[0], operands[0][0], operators[0]);
        results.unshift(result);
        solved = false;
      }
      // If it's a digit or decimal with no other preconditions...
      else {
        // input = e;
        this.setState({input: this.state.input.concat(e)});
        var newOperand = operands[0][0].concat("", e);
        operands[0].unshift(newOperand);
        // var result = operands.length <= 2 ? this.calculate(operands[1][0], operands[0][0], operators[0]) : 
        //   this.calculate(results[0], operands[0][0], operators[0]);
        // results.unshift(result);
        if (operands.length <= 2) {
          var result = this.calculate(operands[1][0], operands[0][0], operators[0]);
          results.unshift(result);
        } else {
          
          var result = this.calculate(results[0], operands[0][0], operators[0]);
          results.unshift(result);
        }
        solved = false;
      }
    }
    this.setState({
      operators: operators,
      operands: operands,
      results: results, 
      solved: solved
    });
    console.log(operands);
    console.log(results);
  }
  
//   calculate(operand1, operand2, operator) {
//     operand1 = parseFloat(operand1);
//     operand2 = parseFloat(operand2);
//     var result = 0.0;
    
//     if (operand1 != "" && operand2 != "" && operator != "") {
      // switch (operator) {
      //   case "add":
      //     result = operand1 + operand2;
      //     break;
      //   case "subtract":
      //     result = operand1 - operand2;
      //     break;
      //   case "multiply":
      //     result = operand1 * operand2;
      //     break;
      //   case "divide":
      //     result = operand1 / operand2;
      // }
//     }
//     return result.toString().substring(0, 10); // limited to 10 characters
//   }
  
  calculate() {
    var operators = this.state.operators;
    var operands = this.state.operands;
    var result = Number.MIN_SAFE_INTEGER;
    
    // First pass to calculate any products or dividends
    for (var i = 0; i < operators.length; i++) {
      if (operators[i] == "multiply" || operators[i] == "divide") {
        var prodDiv = 0;
        switch (operators[i]) {
          case "multiply":
            prodDiv = operands[i] * operands[i + 1];
            break;
          case "divide":
            prodDiv = operands[i] / operands[i + 1];
        }
        operands.splice(i, 2, prodDiv);
      }
    }
    console.log(operators);
    console.log(operands);
    
    // Second pass to to complete the calculation.
    for (var i = 0; i < operators.length; i++) {
      var operand = result == Number.MIN_SAFE_INTEGER ? operand[i] : result;
      switch (operators[i]) {
        case "add":
          result = operand + operands[i + 1];
          break;
        case "subtract":
          result = operand - operands[i + 1];
      }
    }
    console.log(operators)
    console.log(operands);
    return result.toString();
  }
  
  // Splits a string into an array like so: "153" -> ["153", "15", "1"]
  splitNum(num) {
    var arr = [];
    for (let i = num.length; i > 0; i--) {
      var substr = num.substring(0, i);
      arr.push(substr);
    }
    return arr;
  }
  
  render() {
    var digits = this.makeDigits().map(d => {
      var style = {gridArea: d.id};
      return (
        <Number
          id={d.num} 
          value={d.key} 
          style={style} 
          onClick={() => this.handleClick(d.key)} />
      );
    });
    var operators = this.makeOperators().map(o => {
      return (
        <Operator
          id={o.key} 
          symbol={o.symbol}
          onClick={() => this.handleClick(o.key)} />
      );
    });
    return (
      <div class="calculator">
        <div class="input-display-container">
          <Input in={this.state.input} />
          <Display out={this.state.results.length > 0 && !this.state.solved ? this.state.results[0] : 0o0} />
        </div>
        {digits}
        <div class="operator-container">{operators}</div>
        <Point onClick={() => this.handleClick(".")} />
        <Equals onClick={() => this.handleClick("=")} />
        {/*<ul>
          <li>{this.state.input == "" ? "in" : this.state.input}</li>
          <li>{this.state.operators.length == 0 ? "operators" : this.state.operators.join()}</li>
          <li>{this.state.operands.length > 0 ? "operands" : this.state.operands.join()}</li>
          <li>{this.state.results.length == 0 ? "results" : this.state.results.join()}</li>
        </ul>*/}
      </div>
    );
  }
}

ReactDOM.render(<Calculator />, document.getElementById("root"));
