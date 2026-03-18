'use client';

import { useEffect, useState } from 'react';
import type { CellValue } from '@/app/page';

interface CellProps {
  value: CellValue;
  index: number;
  isWinning: boolean;
  onClick: (index: number) => void;
  gameOver: boolean;
}

export default function Cell({ value, index, isWinning, onClick, gameOver }: CellProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (value) {
      setAnimated(false);
      const t = setTimeout(() => setAnimated(true), 10);
      return () => clearTimeout(t);
    } else {
      setAnimated(false);
    }
  }, [value]);

  const isClickable = !gameOver && !value;

  return (
    <button
      onClick={() => onClick(index)}
      disabled={!isClickable}
      className={[
        'w-24 h-24 md:w-28 md:h-28 rounded-xl text-5xl font-black flex items-center justify-center transition-all duration-150',
        isWinning ? 'winner-cell bg-yellow-100 border-2 border-yellow-400 shadow-lg' : 'bg-slate-50 border-2 border-slate-200',
        isClickable ? 'hover:bg-slate-100 hover:border-slate-400 hover:scale-105 cursor-pointer' : 'cursor-default',
        value === 'X' ? 'text-blue-500' : value === 'O' ? 'text-red-500' : '',
        animated ? 'cell-pop' : '',
      ].join(' ')}
      aria-label={value ? `Cell ${index + 1}: ${value}` : `Cell ${index + 1}: empty`}
    >
      {value}
    </button>
  );
}
