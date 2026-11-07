import React, { useEffect } from 'react';
import { PlayHistoryItem } from '../types';
import { ROUTE_CONFIG } from '../data/questions';
import { RotateCcw, Trophy, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/audio';

interface GameOverModalProps {
  isVictory: boolean;
  score: number;
  maxCombo: number;
  history: PlayHistoryItem[];
  onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isVictory,
  score,
  maxCombo,
  history,
  onRestart,
}) => {
  const correctCount = history.filter((h) => h.isCorrect).length;

  useEffect(() => {
    if (isVictory) {
      soundManager.playVictory();
      // Launch colorful confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
          });
        }, 300);
      } catch {
        // ignore
      }
    } else {
      soundManager.playGameOver();
    }
  }, [isVictory]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm select-none">
      <div className="w-full max-w-2xl bg-white rounded-3xl border-4 border-amber-300 shadow-2xl p-6 sm:p-8 my-auto relative">
        {/* Victory / Defeat Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-3xl mb-3 shadow-lg bg-gradient-to-br from-amber-400 to-orange-500 text-white">
            {isVictory ? (
              <Trophy className="w-12 h-12 sm:w-14 sm:h-14 stroke-[2.5]" />
            ) : (
              <span className="text-5xl sm:text-6xl">🛡️</span>
            )}
          </div>

          <h2 className="font-game text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-2">
            {isVictory ? '🎉 감염병 완벽 방어 성공!' : '방어선이 뚫렸어요!'}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 font-medium">
            {isVictory
              ? '15마리의 세균을 모두 막아 우리 교실을 안전하게 지켰습니다!'
              : '세균이 침투했습니다. 감염병 전파 경로를 복습하고 다시 도전해보세요!'}
          </p>
        </div>

        {/* Final Score Section (Giant typography as requested) */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-2xl p-5 text-white text-center shadow-lg mb-6">
          <div className="text-xs sm:text-sm font-bold opacity-90 mb-1 flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-yellow-200" />
            <span>최종 점수 (FINAL SCORE)</span>
            <Sparkles className="w-4 h-4 text-yellow-200" />
          </div>
          <div className="font-game text-4xl sm:text-6xl font-black tracking-tight drop-shadow-md">
            {score.toLocaleString()}
            <span className="text-2xl sm:text-3xl ml-1 font-bold">점</span>
          </div>

          {/* Quick Stats Pill Strip */}
          <div className="mt-3 flex items-center justify-center gap-4 text-xs sm:text-sm font-semibold opacity-95 pt-2 border-t border-white/20">
            <span>방어 성공: <b>{correctCount} / {history.length}</b></span>
            <span>·</span>
            <span>최대 콤보: <b>{maxCombo}연속</b></span>
          </div>
        </div>

        {/* Question Review List for Classroom Discussion */}
        <div className="mb-6">
          <h3 className="text-sm sm:text-base font-bold text-slate-800 mb-2 flex items-center gap-1.5">
            <span>📋</span>
            <span>전체 문제 학습 복습 ({history.length}문제)</span>
          </h3>

          <div className="max-h-56 overflow-y-auto space-y-2 pr-1 border border-slate-200 rounded-2xl p-2.5 bg-slate-50">
            {history.map((item, idx) => {
              const config = ROUTE_CONFIG[item.question.category];
              return (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-start gap-2">
                    {item.isCorrect ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-bold text-slate-900 text-xs sm:text-sm">
                        {idx + 1}. {item.question.title}
                      </div>
                      <div className="text-[11px] text-amber-900 font-medium mt-0.5">
                        예방: {item.question.preventionTip}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5 self-end sm:self-center">
                    <span className="px-2 py-0.5 rounded-md font-bold bg-slate-100 text-slate-800 border border-slate-200">
                      정답: {config.name} {config.icon}
                    </span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded-md ${
                        item.isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {item.isCorrect ? `+${item.earnedScore}점` : '실패'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Play Again Button (Large & Primary) */}
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onRestart();
            }}
            className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-game text-xl sm:text-2xl font-black shadow-xl shadow-emerald-500/30 transition-transform transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-3"
          >
            <RotateCcw className="w-6 h-6 stroke-[2.5]" />
            <span>다시하기 (새로운 15문제)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
