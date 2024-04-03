import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
      return (
        <button className="square" onClick={props.onClick}>
          {props.value}
        </button>
      );
  }
  
  class Board extends React.Component {

    renderSquare(i) {
      return (
      <Square 
      value={this.props.squares[i]} //rendering properties that are being put int it
      onClick={ () => this.props.onClick(i)}// calling inside a method that is being called by it
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
    
    constructor(props) {
      super(props);
      this.state = {
          history: [{
              squares: Array(9).fill(null),
          }],
          stepNumber: 0, //tracking step number for what state (or move it is at) in array
          xIsNext: true,
      };
  }

  jumpTo(step) {
    this.setState({
        history: this.state.history.slice(0, step + 1), // Reset history up to the specified step
        stepNumber: step, 
        xIsNext: (step % 2) === 0,// step % 2 if it is equal to 0, if it is 'o' turn there will not be a remainder
    });
}


  handleClick(i) {
    const history = this.state.history;
    const current = history[history.length - 1];//current configuration of board with moves being in the array
    const squares = current.squares.slice();//making copy of squares array

    if (calculateWinner(squares) || squares[i]) {
        return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
        history: history.concat([{//adding a history
            squares: squares,
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,//getting updated
    });
}


render() {
  const history = this.state.history.slice(0, this.state.stepNumber + 1);//update history to include those moves, replay game from that point
  const current = history[this.state.stepNumber];
  const winner = calculateWinner(current.squares);

  const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to game start';
      return (
          <li key={move}>
               <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
      );
  });
   let status;
  if (winner) {
      status = 'Winner: ' + winner;
  } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
  }
  return (
      <div className="game">
          <div className="game-board">
              <Board
                  squares={current.squares}
                  onClick={(i) => this.handleClick(i)}
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
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
          return squares[a];
      }
  }
  return null;
}

