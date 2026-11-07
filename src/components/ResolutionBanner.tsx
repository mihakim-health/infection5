import React, { useEffect, useState } from 'react';
import { QuestionItem, RouteType } from '../types';
import { ROUTE_CONFIG } from '../data/questions';

interface ResolutionBannerProps {
  question: QuestionItem;
  isCorrect: boolean;
  userChoice: RouteType | 'timeout' | null;
  comboCount: number;
  comboBonus: number;
}

export const ResolutionBanner: React.FC<ResolutionBannerProps> = ({
  question,
  isCorrect,
  userChoice,
  comboCount,
  comboBonus,
}) => {
  const [progress, setProgress] = useState(100);
  const correctConfig = ROUTE_CONFIG[question.category];

  useEffect(() => {
    const startTime = Date.now();
    const duration = 2000; // exact 2 seconds requirement
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (elapsed >= duration) {
        clearInterval(interval);
      }
    }, 25);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className={`w-full max-w-xl rounded-3xl p-6 sm:p-8 text-center shadow-2xl border-4 transition-transform duration-200 transform scale-100 ${
          isCorrect
            ? 'bg-gradient-to-b from-white via-emerald-50 to-emerald-100 border-emerald-500 shadow-emerald-500/20'
            : 'bg-gradient-to-b from-white via-rose-50 to-rose-100 border-rose-500 shadow-rose-500/20'
        }`}
      >
        {/* Result Header Badge */}
        <div className="flex items-center justify-center gap-2 mb-3">
          {isCorrect ? (
            <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-emerald-500 text-white font-extrabold text-lg sm:text-2xl shadow-md">
              <span>✨</span>
              <span>방어 성공! (+100점)</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-rose-500 text-white font-extrabold text-lg sm:text-2xl shadow-md">
              <span>⚠️</span>
              <span>
                {userChoice === 'timeout' ? '시간 초과! 침투 허용' : '방어 실패!'} (생명 -1)
              </span>
            </div>
          )}
        </div>

        {/* Combo notice if any */}
        {isCorrect && comboCount > 1 && (
          <div className="inline-block mb-3 px-3 py-1 rounded-full bg-amber-400 text-amber-950 font-black text-sm sm:text-base animate-bounce shadow-sm">
            🔥 {comboCount}연속 정답 콤보! 보너스 +{comboBonus}점!
          </div>
        )}

        {/* Problem Recapped */}
        <div className="text-slate-600 text-sm sm:text-base font-semibold mb-2">
          문제: <span className="text-slate-900 font-bold font-game text-lg sm:text-xl">"{question.title}"</span>
        </div>

        {/* Correct Route Box (Mandatory & Prominent) */}
        <div className="my-4 p-4 rounded-2xl bg-white/95 border-2 border-slate-200 shadow-inner flex flex-col items-center justify-center">
          <div className="text-xs sm:text-sm font-bold text-slate-500 mb-1">
            올바른 감염병 전파 경로
          </div>
          <div className="flex items-center gap-2">
            <span className="text-3xl sm:text-4xl">{correctConfig.icon}</span>
            <span className="text-2xl sm:text-3xl md:text-4xl font-black font-game text-slate-900">
              [{correctConfig.name} {correctConfig.icon}]
            </span>
          </div>
        </div>

        {/* Prevention Tip (Mandatory requirement: 예방 수칙 한 줄) */}
        <div className="my-3 p-3.5 sm:p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950">
          <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold text-amber-800 mb-1">
            <span>💡</span>
            <span>5학년 보건 예방 수칙</span>
          </div>
          <p className="text-base sm:text-xl font-bold font-game leading-relaxed break-keep">
            "{question.preventionTip}"
          </p>
        </div>

        {/* 2-second countdown meter */}
        <div className="mt-4 pt-2">
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-75 ease-linear rounded-full ${
                isCorrect ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-1.5 text-xs font-semibold text-slate-500">
            2초 후 다음 세균이 출현합니다...
          </div>
        </div>
      </div>
    </div>
  );
};
