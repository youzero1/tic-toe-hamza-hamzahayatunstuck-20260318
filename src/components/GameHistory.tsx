'use client';

import type { GameRecord } from '@/app/page';

interface GameHistoryProps {
  history: GameRecord[];
  loading: boolean;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function MiniBoard({ boardJson }: { boardJson: string }) {
  let cells: (string | null)[] = Array(9).fill(null);
  try {
    cells = JSON.parse(boardJson);
  } catch {
    // ignore
  }
  return (
    <div className="grid grid-cols-3 gap-0.5 w-16 h-16">
      {cells.map((cell, i) => (
        <div
          key={i}
          className={`flex items-center justify-center text-xs font-bold rounded-sm ${
            cell === 'X'
              ? 'bg-blue-100 text-blue-600'
              : cell === 'O'
              ? 'bg-red-100 text-red-600'
              : 'bg-slate-100 text-slate-300'
          }`}
        >
          {cell || ''}
        </div>
      ))}
    </div>
  );
}

export default function GameHistory({ history, loading }: GameHistoryProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 flex flex-col h-full">
      <h2 className="text-xl font-bold text-slate-700 mb-5 text-center uppercase tracking-widest">Game History</h2>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
        </div>
      ) : history.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-400 text-center text-sm">No games played yet.<br />Start playing to see history!</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {history.map((game) => (
            <div
              key={game.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-300 transition-colors"
            >
              <MiniBoard boardJson={game.board} />
              <div className="flex-1 min-w-0">
                <p
                  className={`font-bold text-sm ${
                    game.winner === 'X'
                      ? 'text-blue-600'
                      : game.winner === 'O'
                      ? 'text-red-600'
                      : 'text-yellow-600'
                  }`}
                >
                  {game.winner === 'draw' ? 'Draw' : `Player ${game.winner} Won`}
                </p>
                <p className="text-slate-400 text-xs mt-0.5">{formatDate(game.createdAt)}</p>
              </div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ${
                  game.winner === 'X'
                    ? 'bg-blue-500 text-white'
                    : game.winner === 'O'
                    ? 'bg-red-500 text-white'
                    : 'bg-yellow-400 text-white'
                }`}
              >
                {game.winner === 'draw' ? '=' : game.winner}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
