import React from 'react';
import { QuestionItem, RouteType } from '../types';
import { BacteriaCard } from './BacteriaCard';
import { DefenseDoors } from './DefenseDoors';
import { ShieldAlert, Sparkles } from 'lucide-react';

interface DefenseStageProps {
  currentQuestion: QuestionItem;
  progress: number; // 0 to 1
  onSelectRoute: (route: RouteType) => void;
  isResolving: boolean;
  selectedRoute: RouteType | null;
  correctRoute: RouteType | null;
}

export const DefenseStage: React.FC<DefenseStageProps> = ({
  currentQuestion,
  progress,
  onSelectRoute,
  isResolving,
  selectedRoute,
  correctRoute,
}) => {
  // Translate progress (0 to 1) into top percentage (e.g. 2% to 62%)
  const topPercent = 4 + progress * 58;

  return (
    <div className="relative w-full flex-1 flex flex-col justify-between overflow-hidden bg-gradient-to-b from-sky-100 via-amber-50 to-emerald-50 select-none">
      {/* Background Decorative Atmosphere */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-6 left-10 text-4xl opacity-50">☁️</div>
        <div className="absolute top-16 right-16 text-3xl opacity-50">☁️</div>
        <div className="absolute top-32 left-1/4 text-2xl opacity-40">🫧</div>
        <div className="absolute top-48 right-1/3 text-2xl opacity-40">🫧</div>
      </div>

      {/* Top Warning & Timer Track */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 pt-3 flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700">
          <span className="flex items-center gap-1.5 text-amber-900">
            <ShieldAlert className="w-4 h-4 text-amber-600 animate-bounce" />
            세균 침투 주의! 알맞은 방어문을 선택하세요
          </span>
          <span className="text-slate-500 font-mono">
            침투 진행도: {Math.round(progress * 100)}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden shadow-inner">
          <div
            className={`h-full transition-all duration-75 rounded-full ${
              progress > 0.75
                ? 'bg-rose-500 animate-pulse'
                : progress > 0.45
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(100, progress * 100)}%` }}
          />
        </div>
      </div>

      {/* Active Sky Arena where bacteria descends */}
      <div className="relative flex-1 w-full max-w-4xl mx-auto my-2 min-h-[300px] sm:min-h-[360px]">
        {/* Defense Barrier Line (Danger line) */}
        <div className="absolute bottom-4 inset-x-2 sm:inset-x-6 border-b-2 border-dashed border-rose-400 flex items-center justify-between px-2 text-[11px] sm:text-xs font-bold text-rose-600 bg-rose-50/50 py-1 rounded-md">
          <span className="flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
            신체 방어선 (이 선을 넘어가면 침투 위험!)
          </span>
          <span className="text-rose-500 font-game">DEFENSE LINE</span>
        </div>

        {/* Descending Germ Character */}
        <div
          className="absolute inset-x-0 pointer-events-none"
          style={{ top: `${topPercent}%` }}
        >
          <BacteriaCard
            question={currentQuestion}
            progress={progress}
            status={
              isResolving
                ? selectedRoute === correctRoute
                  ? 'blocked'
                  : 'passed'
                : 'normal'
            }
          />
        </div>

        {/* Shield Burst Effect when blocked */}
        {isResolving && selectedRoute === correctRoute && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <div className="p-6 rounded-full bg-emerald-400/30 border-4 border-emerald-400 animate-ping" />
            <div className="absolute flex items-center gap-2 px-6 py-2 rounded-2xl bg-emerald-500 text-white font-game text-2xl font-black shadow-xl animate-bounce">
              <Sparkles className="w-6 h-6 text-yellow-300" />
              <span>방어선 차단 성공!</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Defense Doors Container */}
      <div className="relative z-20 pb-4 pt-1 bg-white/70 backdrop-blur-md border-t-2 border-amber-200">
        <DefenseDoors
          onSelectRoute={onSelectRoute}
          disabled={isResolving}
          selectedRoute={selectedRoute}
          correctRoute={correctRoute}
        />
      </div>
    </div>
  );
};
