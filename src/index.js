import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
 
function Square(props){
  return (
    <button 
      className="square" 
      onClick={props.onClick}> 
      <span className={"front " + ((props.highlighted.includes(props.id)) ? 'highlighted' : '')}>
        {props.value}
      </span>
    </button>
  );
}  
class Board extends React.Component {
  renderSquare(i) {
    return <Square 
      value={this.props.squares[i]} 
      id={i} 
      key={i} 
      highlighted={this.props.highlighted} 
      onClick={()=>this.props.onClick(i)}  
    />;
  }

  render() {
    // let j = 1;
    // const boardSquares = this.props.squares.map((i, v) => (
    //   this.renderSquare(v)
    //   +
    //   ((j%3==0) ? '</div><div className="board-row">' : '')
    // ))
    //   console.log(boardSquares);
      // boardSquares.push(this.renderSquare(v) + ((j%3==0) ? '</div><div className="board-row">' : ''));
      // j++;
    let thisObj = this;
    let j = 0;
    return (
      <div>
        {/* <div className="board-row">
          {boardSquares}
        </div> */}
        <div className="board-row">
          {this.props.squares.map(function(name, index){
            return thisObj.renderSquare(index);
          })}
          {/* {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)} */}
          {/* {(j%3==0) ? `</div><div className="board-row">` : ``} */}
        </div>
        {/* <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div> */}
      </div>
    );
  }
}
  
class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      xIsNext: true,
      stepNumber: 0
    };
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    let winner = calculateWinner(current.squares);
    let highlighted = winner || [];
    winner = (winner!=null) ? current.squares[winner[0]] : winner;

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button className={move===this.state.stepNumber ? 'bold' : ''} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let movesLeft = current.squares.filter((v)=>v==null).length;
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else if (movesLeft === 0) {
      status = 'Draw';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game-container">
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              highlighted={highlighted}
              onClick={(i) => this.handleClick(i)}
            />
            <div className="game-info">
              <div className='board-row'>
                <div>{status}</div>
                <ol>{moves}</ol>
              </div>
            </div>
          </div>
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
      // return squares[a];
      return lines[i];
    }
  }
  return null;
}
  