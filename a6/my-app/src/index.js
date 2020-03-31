import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//https://reactjs.org/tutorial/tutorial.html#setup-option-2-local-development-environment
//adding time travel...
//https://reactjs.org/tutorial/tutorial.html#adding-time-travel

//pass props from parente -> children

//a function component, returns a button which will trigger
//a funciton of it's onClick prop (on the tag) when clicked
 function Square(props){
    return(
     <button className="square" onClick={props.onClick}>
         {props.value}
     </button>
    );
 }
  
  class Board extends React.Component {

    renderSquare(i) {
      //set the value prop to whatever 'i' value is passed
      //this is a way we can pass props from our Board component 
      //to our Square component
      return (
            <Square 
                value={this.props.squares[i]}
                onClick={()=>this.props.onClick(i)}
            />
      );
    }
  
    render() {  
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props){
      super(props);
      this.state={
        history:[{
          squares:Array(9).fill(null),
        }],
        stepNumber: 0,
        xIsNext:true,
      }
    }

    
    handleClick(i){
      //set history to hte array of objects in state
      const history = this.state.history.slice(0,this.state.stepNumber + 1);
      //set current to the last item in our history array
      const current = history[history.length-1];
      //create copy of the squares array with slice()
      const squares = current.squares.slice();
      //if somebody won, or the square is already full return
      if(calculateWinner(squares) || squares[i]){
          return;
      }
      //set the current squares value to x or o
      squares[i] = this.state.xIsNext ? 'X' : 'O';

      //set the state of our board flipping xIsNext
      //concatenate our history with the new 'moves'
      this.setState({
          history: history.concat([{
            squares: squares,
          }]),
          stepNumber: history.length,
          xIsNext: !this.state.xIsNext,
      })
    }

    jumpTo(step){
      this.setState({
        stepNumber: step, 
        xIsNext: (step%2) === 0,
      });
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      const moves = history.map((step,move) => {
        const desc = move ?
        'Go to move #' + move :
        'Go to game start';
        return(
          <li key={move}>
            <button onClick={()=>this.jumpTo(move)}>{desc}</button>
          </li>
        )
      })
      let status;
      if(winner){
        status='Winner: '+winner;
      }else{
        status='Next player: '+(this.state.xIsNext ? 'X' : 'O');
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares={current.squares}
              onClick={(i)=>this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      //if three of these squares all equal one another return their value
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
  