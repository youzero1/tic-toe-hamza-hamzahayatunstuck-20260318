'use client';

import { useState, useEffect, useCallback } from 'react';
import Board from '@/components/Board';
import ScoreBoard from '@/components/ScoreBoard';
import GameHistory from '@/components/GameHistory';

export type Player = 'X' | 'O';
export type CellValue = Player | null;
export type BoardState = CellValue[];

export interface GameRecord {
  id: number;
  winner: string;
  board: string;
  createdAt: string;
}

export interface ScoreData {
  X: number;
  O: number;
  draw: number;
}

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function checkWinner(board: BoardState): { winner: Player | 'draw' | null; line: number[] | null } {
  for (const combo of WINNING_COMBINATIONS) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] as Player, line: combo };
    }
  }
  if (board.every((cell) => cell !== null)) {
    return { winner: 'draw', line: null };
  }
  return { winner: null, line: null };
}

export default function Home() {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [scores, setScores] = useState<ScoreData>({ X: 0, O: 0, draw: 0 });
  const [history, setHistory] = useState<GameRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [savedGame, setSavedGame] = useState(false);

  const fetchHistory = useCallback(async () => {
    try {
      setHistoryLoading(true);
      const res = await fetch('/api/games');
      if (res.ok) {
        const data: GameRecord[] = await res.json();
        setHistory(data);
        const newScores: ScoreData = { X: 0, O: 0, draw: 0 };
        data.forEach((g) => {
          if (g.winner === 'X') newScores.X++;
          else if (g.winner === 'O') newScores.O++;
          else if (g.winner === 'draw') newScores.draw++;
        });
        setScores(newScores);
      }
    } catch (e) {
      console.error('Failed to fetch history', e);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const saveGame = useCallback(
    async (winnerVal: string, finalBoard: BoardState) => {
      if (savedGame) return;
      setSavedGame(true);
      try {
        const res = await fetch('/api/games', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            winner: winnerVal,
            board: JSON.stringify(finalBoard),
          }),
        });
        if (res.ok) {
          fetchHistory();
        }
      } catch (e) {
        console.error('Failed to save game', e);
        setSavedGame(false);
      }
    },
    [savedGame, fetchHistory]
  );

  const handleCellClick = useCallback(
    (index: number) => {
      if (gameOver || board[index] !== null) return;

      const newBoard = [...board];
      newBoard[index] = currentPlayer;
      setBoard(newBoard);

      const result = checkWinner(newBoard);
      if (result.winner) {
        setWinner(result.winner);
        setWinningLine(result.line);
        setGameOver(true);
        saveGame(result.winner, newBoard);
      } else {
        setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
      }
    },
    [board, currentPlayer, gameOver, saveGame]
  );

  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setGameOver(false);
    setWinner(null);
    setWinningLine(null);
    setSavedGame(false);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold text-slate-800 tracking-tight mb-2">
            Tic-Tac-Toe
          </h1>
          <p className="text-slate-500 text-lg">Challenge a friend to the classic game!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Scoreboard */}
          <div className="lg:col-span-1">
            <ScoreBoard scores={scores} />
          </div>

          {/* Center: Game */}
          <div className="lg:col-span-1 flex flex-col items-center">
            {/* Status Banner */}
            <div className="mb-6 w-full">
              {!gameOver ? (
                <div className="bg-white rounded-2xl shadow-md px-6 py-4 text-center border border-slate-200">
                  <p className="text-slate-500 text-sm font-medium uppercase tracking-widest mb-1">Current Turn</p>
                  <p
                    className={`text-4xl font-extrabold ${
                      currentPlayer === 'X' ? 'text-blue-500' : 'text-red-500'
                    }`}
                  >
                    Player {currentPlayer}
                  </p>
                </div>
              ) : (
                <div
                  className={`rounded-2xl shadow-md px-6 py-4 text-center ${
                    winner === 'draw'
                      ? 'bg-yellow-50 border border-yellow-300'
                      : winner === 'X'
                      ? 'bg-blue-50 border border-blue-300'
                      : 'bg-red-50 border border-red-300'
                  }`}
                >
                  <p className="text-slate-500 text-sm font-medium uppercase tracking-widest mb-1">Game Over</p>
                  {winner === 'draw' ? (
                    <p className="text-4xl font-extrabold text-yellow-600">It&apos;s a Draw!</p>
                  ) : (
                    <p
                      className={`text-4xl font-extrabold ${
                        winner === 'X' ? 'text-blue-500' : 'text-red-500'
                      }`}
                    >
                      Player {winner} Wins! 🎉
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Board */}
            <Board
              board={board}
              winningLine={winningLine}
              onCellClick={handleCellClick}
              gameOver={gameOver}
            />

            {/* Reset Button */}
            <button
              onClick={resetGame}
              className="mt-6 px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 text-lg"
            >
              New Game
            </button>
          </div>

          {/* Right: History */}
          <div className="lg:col-span-1">
            <GameHistory history={history} loading={historyLoading} />
          </div>
        </div>
      </div>
    </main>
  );
}
