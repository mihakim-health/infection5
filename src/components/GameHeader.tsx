import React from 'react';
import { Volume2, VolumeX, BookOpen, RotateCcw } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface GameHeaderProps {
  score: number;
  lives: number;
  maxLives: number;
  currentIndex: number;
  totalQuestions: number;
  combo: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenGuide: () => void;
  onRestart: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  score,
  lives,
  maxLives,
  currentIndex,
  totalQuestions,
  combo,
  isMuted,
  onToggleMute,
  onOpenGuide,
  onRestart,
}) => {
  return (
    <header className="w-full bg-white/90 backdrop-blur-md border-b-2 border-amber-200 shadow-sm px-3 sm:px-6 py-2.5 sm:py-3 select-none">
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2 sm:gap-4">
        {/* Left: Title & Round Info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl">🛡️</span>
            <div>
              <h1 className="font-game text-lg sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                감염병 분류 디펜스
              </h1>
              <div className="text-[11px] sm:text-xs text-amber-800 font-bold mt-0.5">
                초등 5학년 보건 교과
              </div>
            </div>
          </div>

          {/* Wave counter */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-100 border border-amber-300 text-amber-950 font-bold text-xs sm:text-sm">
            <span>침투 세균:</span>
            <span className="text-emerald-700 font-black font-game text-base">
              {currentIndex + 1}
            </span>
            <span className="text-slate-400">/</span>
            <span>{totalQuestions}</span>
          </div>
        </div>

        {/* Center: Lives (Hearts) & Combo */}
        <div className="flex items-center gap-4">
          {/* Hearts */}
          <div className="flex items-center gap-1 bg-rose-50 border border-rose-200 px-3 py-1 rounded-xl">
            <span className="text-xs font-bold text-rose-800 mr-1 hidden xs:inline">
              생명:
            </span>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: maxLives }).map((_, i) => (
                <span
                  key={i}
                  className={`text-xl sm:text-2xl transition-transform ${
                    i < lives ? 'scale-100 filter drop-shadow-xs' : 'opacity-25 grayscale scale-90'
                  }`}
                  role="img"
                  aria-label={i < lives ? '남은 생명' : '잃은 생명'}
                >
                  ❤️
                </span>
              ))}
            </div>
          </div>

          {/* Combo badge */}
          {combo > 1 && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-500 text-white font-game font-black text-sm sm:text-base animate-pulse shadow-sm">
              <span>🔥</span>
              <span>{combo} COMBO!</span>
            </div>
          )}

          {/* Score counter (Large & Clear) */}
          <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-300 px-3.5 py-1 rounded-xl">
            <span className="text-xs font-bold text-emerald-800 hidden xs:inline">
              점수:
            </span>
            <span className="font-game text-xl sm:text-2xl font-black text-emerald-700 tabular-nums">
              {score.toLocaleString()}점
            </span>
          </div>
        </div>

        {/* Right: Quick Tools (Sound Mute, Guide, Restart) */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onOpenGuide}
            title="학습 도감 열기"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span className="hidden md:inline">도감</span>
          </button>

          <button
            type="button"
            onClick={onToggleMute}
            title={isMuted ? '소리 켜기' : '소리 끄기'}
            aria-label={isMuted ? '소리 켜기' : '소리 끄기'}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-rose-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-600" />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onRestart();
            }}
            title="처음부터 다시하기"
            aria-label="처음부터 다시하기"
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>
    </header>
  );
};
