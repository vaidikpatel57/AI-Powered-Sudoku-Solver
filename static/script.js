function createBoard() {
    const board = document.getElementById('sudoku-board');
    board.innerHTML = ''; // Clear board if it exists

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let cell = document.createElement('input');
            cell.type = 'text';
            cell.maxLength = 1;
            cell.id = `cell-${i}-${j}`;
            cell.classList.add('sudoku-cell');

            // Restrict input to numbers 1-9
            cell.addEventListener('input', (e) => {
                let value = e.target.value;
                if (!/^[1-9]$/.test(value)) {
                    e.target.value = '';
                }
            });

            board.appendChild(cell);

            // Add row and column styling for 3x3 grid visibility
            if ((j + 1) % 3 === 0 && j !== 8) cell.style.marginRight = '5px';
            if ((i + 1) % 3 === 0 && i !== 8) cell.style.marginBottom = '5px';
        }
    }
}

function getBoardValues() {
    let grid = [];
    for (let i = 0; i < 9; i++) {
        let row = [];
        for (let j = 0; j < 9; j++) {
            let cellValue = document.getElementById(`cell-${i}-${j}`).value;
            row.push(cellValue ? parseInt(cellValue) : 0);
        }
        grid.push(row);
    }
    return grid;
}

function solveSudoku() {
    let sudoku = getBoardValues();

    // Check if all cells are empty
    let allEmpty = sudoku.every(row => row.every(cell => cell === 0));

    if (allEmpty) {
        alert('Please fill in at least one number before solving!');
        return;
    }

    fetch('/solve', {
        method: 'POST',
        body: JSON.stringify({ sudoku }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())
      .then(data => {
          if (data.solution) {
              populateBoard(data.solution);
          } else {
              alert('No solution found!');
          }
      });
}

function populateBoard(solution) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let cell = document.getElementById(`cell-${i}-${j}`);
            if (!cell.value) {  // Change color only for empty cells being solved
                cell.value = solution[i][j];
                cell.style.color = 'green';
            }
        }
    }
}

function startNewGame() {
    // Reset the board to empty cells
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let cell = document.getElementById(`cell-${i}-${j}`);
            cell.value = "";  // Clear value
            cell.style.color = "black";  // Reset color
            cell.style.backgroundColor = "white";  // Reset background color
            cell.readOnly = false;  // Allow user input again
        }
    }
    document.querySelector('.result').innerText = ""; // Clear result message
}

window.onload = createBoard;
