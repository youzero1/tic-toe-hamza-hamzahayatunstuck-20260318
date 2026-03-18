'use client';

import Cell from './Cell';
import type { BoardState } from '@/app/page';

interface BoardProps {
  board: BoardState;
  winningLine: number[] | null;
  onCellClick: (index: number) => void;
  gameOver: boolean;
}

export default function Board({ board, winningLine, onCellClick, gameOver }: BoardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 border border-slate-200">
      <div className="grid grid-cols-3 gap-3">
        {board.map((cell, index) => (
          <Cell
            key={index}
            value={cell}
            index={index}
            isWinning={winningLine?.includes(index) ?? false}
            onClick={onCellClick}
            gameOver={gameOver}
          />
        ))}
      </div>
    </div>
  );
}
