import React from 'react';
import './App.css';

const quotes = [
  {
    quote: "A designer knows he has achieved perfection not when there is nothing left to add, but when there is nothing left to take away.",
    author: "Antoine de Saint"
  },
  {
    quote: "A flatterer is a friend who is your inferior, or pretends to be so.",
    author: "Aristotle"
  },
  {
    quote: "A penny saved is a penny earned",
    author: "Benjamin Franklin"
  },
  {
    quote: "All human actions have one or more of these seven causes: chance, nature, compulsion, habit, reason, passion, and desire.",
    author: "Aristotle"
  },
  {
    quote: "All paid jobs absorb and degrade the mind.",
    author: "Aristotle"
  },
  {
    quote: "An education is not how much you have committed to memory, or even how much you know. It is being able to differentiate between what you do know and what you do not know.",
    author: "Anatole France"
  },
  {
    quote: "An investment in knowledge always pays the best interest.",
    author: "Benjamin Franklin"
  },
  {
    quote: "Banking establishments are more dangerous than standing armies.",
    author: "Thomas Jefferson"
  }
];

const colors = ["coral", "darkslateblue", "goldenrod", "cadetblue", "darkolivegreen"];

class QuoteBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quote: quotes[0].quote,
      author: quotes[0].author,
      count: 0
    };
    this.getRandomQuote = this.getRandomQuote.bind(this);
    this.changeColor = this.changeColor.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  getRandomQuote() {
    var randNum = Math.floor(Math.random() * 8);
    var newQuote = quotes[randNum];
    if (newQuote.quote === this.state.quote) 
      this.getRandomQuote();
    else {
      this.setState({
        quote: newQuote.quote,
        author: newQuote.author
      });
    }
  }
  changeColor() {
    var count = this.state.count;
    this.state.count === colors.length - 1 ? count = 0 : count++;
    this.setState({count: count});
    document.documentElement.style
      .setProperty("--main-color", colors[count]);
  }
  handleClick() {
    this.getRandomQuote();
    this.changeColor();
  }
  render() {
    return (
      <div id="quote-box">
        <p id="text">"{this.state.quote}"</p>
        <p id="author">- {this.state.author}</p>
        <a id="tweet-quote" href="twitter.com/intent/tweet">
          Tweet quote</a>
        <button id="new-quote" type="button" 
          onClick={this.handleClick}>
          New quote</button>
      </div>
    );
  }
}

export default QuoteBox;
