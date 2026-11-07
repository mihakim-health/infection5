import React, { useEffect } from 'react';
import { PlayHistoryItem, ScoreDoc } from '../types';
import { ROUTE_CONFIG } from '../data/questions';
import { RotateCcw, Trophy, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/audio';
import { Leaderboard } from './Leaderboard';

interface GameOverModalProps {
  isVictory: boolean;
  score: number;
  maxCombo: number;
  history: PlayHistoryItem[];
  onRestart: () => void;
  nickname?: string;
  scores: ScoreDoc[];
  classCode: string;
  onViewLeaderboard: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isVictory,
  score,
  maxCombo,
  history,
  onRestart,
  nickname,
  scores,
  classCode,
  onViewLeaderboard,
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
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-3xl mb-2.5 shadow-lg bg-gradient-to-br from-amber-400 to-orange-500 text-white">
            {isVictory ? (
              <Trophy className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.5]" />
            ) : (
              <span className="text-4xl sm:text-5xl">🛡️</span>
            )}
          </div>

          <h2 className="font-game text-2xl sm:text-4xl font-black text-slate-900 mb-1.5">
            {isVictory ? '🎉 감염병 완벽 방어 성공!' : '방어선이 뚫렸어요!'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            {isVictory
              ? '15마리의 세균을 모두 막아 우리 교실을 안전하게 지켰습니다!'
              : '세균이 침투했습니다. 감염병 전파 경로를 복습하고 다시 도전해보세요!'}
          </p>
        </div>

        {/* Final Score Section (Giant typography as requested) */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-2xl p-4 sm:p-5 text-white text-center shadow-lg mb-5">
          <div className="text-xs sm:text-sm font-bold opacity-90 mb-1 flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-yellow-200" />
            <span>{nickname ? `${nickname} 학생의 ` : ''}최종 점수 (FINAL SCORE)</span>
            <Sparkles className="w-4 h-4 text-yellow-200" />
          </div>
          <div className="font-game text-4xl sm:text-6xl font-black tracking-tight drop-shadow-md">
            {score.toLocaleString()}
            <span className="text-2xl sm:text-3xl ml-1 font-bold">점</span>
          </div>

          {/* Quick Stats Pill Strip */}
          <div className="mt-2.5 flex items-center justify-center gap-4 text-xs sm:text-sm font-semibold opacity-95 pt-2 border-t border-white/20">
            <span>방어 성공: <b>{correctCount} / {history.length}</b></span>
            <span>·</span>
            <span>최대 콤보: <b>{maxCombo}연속</b></span>
          </div>
        </div>

        {/* Real-time Class Leaderboard (TOP 10 + My Record) */}
        <div className="mb-5">
          <Leaderboard
            scores={scores}
            currentNickname={nickname || ''}
            classCode={classCode}
          />
        </div>

        {/* Question Review List for Classroom Discussion */}
        <div className="mb-5">
          <h3 className="text-xs sm:text-sm font-bold text-slate-800 mb-2 flex items-center gap-1.5">
            <span>📋</span>
            <span>전체 문제 학습 복습 ({history.length}문제)</span>
          </h3>

          <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1 border border-slate-200 rounded-2xl p-2 bg-slate-50">
            {history.map((item, idx) => {
              const config = ROUTE_CONFIG[item.question.category];
              return (
                <div
                  key={idx}
                  className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs"
                >
                  <div className="flex items-start gap-1.5">
                    {item.isCorrect ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-bold text-slate-900 text-xs sm:text-sm">
                        {idx + 1}. {item.question.title}
                      </div>
                      <div className="text-[11px] text-amber-900 font-medium">
                        예방: {item.question.preventionTip}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5 self-end sm:self-center">
                    <span className="px-2 py-0.5 rounded-md font-bold bg-slate-100 text-slate-800 border border-slate-200 text-[11px]">
                      정답: {config.name} {config.icon}
                    </span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded-md text-[11px] ${
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

        {/* Action Buttons: Play Again & View Leaderboard */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onRestart();
            }}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-game text-xl sm:text-2xl font-black shadow-xl shadow-emerald-500/30 transition-transform transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-3"
          >
            <RotateCcw className="w-6 h-6 stroke-[2.5]" />
            <span>다시하기 (새로운 15문제)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onViewLeaderboard();
            }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-game text-lg sm:text-xl font-bold shadow-lg shadow-orange-500/25 transition-transform transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2"
          >
            <Trophy className="w-5 h-5 fill-yellow-200" />
            <span>리더보드 보기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
