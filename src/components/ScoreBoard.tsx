'use client';

import type { ScoreData } from '@/app/page';

interface ScoreBoardProps {
  scores: ScoreData;
}

export default function ScoreBoard({ scores }: ScoreBoardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">
      <h2 className="text-xl font-bold text-slate-700 mb-5 text-center uppercase tracking-widest">Scoreboard</h2>
      <div className="space-y-4">
        <ScoreItem label="Player X" value={scores.X} color="blue" />
        <ScoreItem label="Player O" value={scores.O} color="red" />
        <ScoreItem label="Draws" value={scores.draw} color="yellow" />
      </div>
    </div>
  );
}

function ScoreItem({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: 'blue' | 'red' | 'yellow';
}) {
  const colorMap = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    red: 'bg-red-50 border-red-200 text-red-600',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600',
  };

  const badgeMap = {
    blue: 'bg-blue-500 text-white',
    red: 'bg-red-500 text-white',
    yellow: 'bg-yellow-500 text-white',
  };

  return (
    <div
      className={`flex items-center justify-between rounded-xl border px-4 py-3 ${colorMap[color]}`}
    >
      <span className="font-semibold text-sm">{label}</span>
      <span
        className={`text-xl font-extrabold rounded-full w-10 h-10 flex items-center justify-center ${badgeMap[color]}`}
      >
        {value}
      </span>
    </div>
  );
}
