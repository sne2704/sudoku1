import React, { useState, useEffect } from "react";
import "./index.css"; // Ensure Tailwind is set up

const PUZZLES = [
  [
    [5, 3, null, null, 7, null, null, null, null],
    [6, null, null, 1, 9, 5, null, null, null],
    [null, 9, 8, null, null, null, null, 6, null],
    [8, null, null, null, 6, null, null, null, 3],
    [4, null, null, 8, null, 3, null, null, 1],
    [7, null, null, null, 2, null, null, null, 6],
    [null, 6, null, null, null, null, 2, 8, null],
    [null, null, null, 4, 1, 9, null, null, 5],
    [null, null, null, null, 8, null, null, 7, 9],
  ],
  [
    [null, null, null, 2, 6, null, 7, null, 1],
    [6, 8, null, null, 7, null, null, 9, null],
    [1, 9, null, null, null, 4, 5, null, null],
    [8, 2, null, 1, null, null, null, 4, null],
    [null, null, 4, 6, null, 2, 9, null, null],
    [null, 5, null, null, null, 3, null, 2, 8],
    [null, null, 9, 3, null, null, null, 7, 4],
    [null, 4, null, null, 5, null, null, 3, 6],
    [7, null, 3, null, 1, 8, null, null, null],
  ],
  [
    [null, null, null, null, null, 7, null, 9, null],
    [1, null, null, null, null, null, null, null, 2],
    [null, null, null, 4, null, null, null, null, null],
    [null, null, null, null, 5, null, 4, null, 7],
    [null, null, 8, null, null, null, 3, null, null],
    [null, null, 1, null, 9, null, null, null, null],
    [3, null, null, null, null, null, 2, null, null],
    [null, 4, null, null, null, null, null, null, null],
    [null, null, 7, null, 6, null, null, null, null],
  ],
  [
    [2, null, null, 3, null, null, null, null, null],
    [8, null, 4, null, 6, 2, null, null, 3],
    [null, 1, 3, 8, null, null, 2, null, null],
    [null, null, null, null, 2, null, 3, 9, null],
    [5, null, 7, null, null, null, 6, null, 1],
    [null, 3, 2, null, 9, null, null, null, null],
    [null, null, 1, null, null, 6, 5, 2, null],
    [7, null, null, 9, 1, null, 4, null, 8],
    [null, null, null, null, null, 8, null, null, 7],
  ],
  [
    [null, 6, null, 1, null, 4, null, 5, null],
    [null, null, 8, 3, null, 5, 6, null, null],
    [2, null, null, null, null, null, null, null, 1],
    [8, null, null, 4, null, 7, null, null, 6],
    [null, null, 6, null, null, null, 3, null, null],
    [7, null, null, 9, null, 1, null, null, 4],
    [5, null, null, null, null, null, null, null, 2],
    [null, null, 7, 2, null, 6, 9, null, null],
    [null, 4, null, 5, null, 8, null, 7, null],
  ],
];

  // Add more puzzles if needed

function isValid(board, row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num || board[i][col] === num) return false;
    const boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
    const boxCol = 3 * Math.floor(col / 3) + (i % 3);
    if (board[boxRow][boxCol] === num) return false;
  }
  return true;
}

function App() {
  const [originalBoard, setOriginalBoard] = useState([]);
  const [board, setBoard] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const randomPuzzle = PUZZLES[Math.floor(Math.random() * PUZZLES.length)];
    setOriginalBoard(randomPuzzle);
    setBoard(JSON.parse(JSON.stringify(randomPuzzle)));
    setMessage("");
  }, []);

  const handleChange = (row, col, value) => {
    const newBoard = board.map((r) => [...r]);
    const num = parseInt(value);
    if (!isNaN(num) && num >= 1 && num <= 9) {
      newBoard[row][col] = num;
    } else if (value === "") {
      newBoard[row][col] = null;
    }
    setBoard(newBoard);
  };

  const checkSolution = () => {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const val = board[r][c];
        if (
          val == null ||
          !isValid(
            board.map((row, i) => row.map((cell, j) => (i === r && j === c ? null : cell))),
            r,
            c,
            val
          )
        ) {
          setMessage("❌ Incorrect Solution!");
          return;
        }
      }
    }
    setMessage("✅ Correct Solution!");
  };

  const reset = () => {
    setBoard(JSON.parse(JSON.stringify(originalBoard)));
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">🧩 Sudoku</h1>
      <div className="grid grid-cols-9 gap-1 border border-white">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isFixed = originalBoard[rowIndex][colIndex] != null;
            return (
              <input
                key={`${rowIndex}-${colIndex}`}
                className={`w-10 h-10 text-center rounded-sm ${
                  isFixed
                    ? "bg-gray-700 text-white font-bold"
                    : "bg-gray-100 text-black"
                }`}
                value={cell ?? ""}
                onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
                disabled={isFixed}
              />
            );
          })
        )}
      </div>
      <div className="flex space-x-4 mt-4">
        <button
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
          onClick={checkSolution}
        >
          Check
        </button>
        <button
          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded"
          onClick={reset}
        >
          Reset
        </button>
      </div>
      {message && <p className="mt-3 text-xl">{message}</p>}
    </div>
  );
}

export default App;
