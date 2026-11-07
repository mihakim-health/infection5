import React from 'react';
import { GameSpeed } from '../types';
import { ROUTE_CONFIG } from '../data/questions';
import { Play, Sparkles, BookOpen, Clock, Heart, Award } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface StartScreenProps {
  onStart: () => void;
  speed: GameSpeed;
  onChangeSpeed: (speed: GameSpeed) => void;
  onOpenGuide: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  onStart,
  speed,
  onChangeSpeed,
  onOpenGuide,
}) => {
  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-amber-50 via-sky-50 to-emerald-50 select-none">
      <div className="w-full max-w-2xl bg-white/95 backdrop-blur-md rounded-3xl border-4 border-amber-300 shadow-2xl p-6 sm:p-8 text-center relative overflow-hidden">
        {/* Floating background decorative icons */}
        <div className="absolute top-2 left-3 text-4xl opacity-20 pointer-events-none">🦠</div>
        <div className="absolute top-4 right-4 text-4xl opacity-20 pointer-events-none">🛡️</div>
        <div className="absolute bottom-3 left-4 text-4xl opacity-20 pointer-events-none">🧼</div>
        <div className="absolute bottom-2 right-4 text-4xl opacity-20 pointer-events-none">😷</div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-extrabold text-xs sm:text-sm mb-3">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>초등 5학년 보건 학습 게임</span>
        </div>

        {/* Title */}
        <h1 className="font-game text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-2">
          감염병 전파 경로 분류 디펜스
        </h1>
        <p className="text-slate-600 text-sm sm:text-base font-medium max-w-lg mx-auto mb-6 break-keep">
          화면 위에서 내려오는 세균을 확인하고 알맞은 방어문으로 막아내세요!
        </p>

        {/* 3 Routes Quick Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 text-left">
          {(['digestive', 'respiratory', 'skin'] as const).map((key) => {
            const item = ROUTE_CONFIG[key];
            return (
              <div
                key={key}
                className="p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="font-game text-lg font-bold text-slate-900">
                      {item.name}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium break-keep">
                    {item.description}
                  </p>
                </div>
                <div className="mt-2 text-[11px] font-bold text-amber-800 bg-amber-50 p-1.5 rounded-lg border border-amber-200">
                  💡 {item.prevention}
                </div>
              </div>
            );
          })}
        </div>

        {/* Rules Highlight strip */}
        <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-4 mb-6 text-xs sm:text-sm text-sky-950 flex flex-wrap items-center justify-around gap-2 text-center">
          <div className="flex items-center gap-1.5 font-bold">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>생명 3개</span>
          </div>
          <span className="text-sky-300">|</span>
          <div className="flex items-center gap-1.5 font-bold">
            <Award className="w-4 h-4 text-amber-500" />
            <span>15마리 방어 시 클리어</span>
          </div>
          <span className="text-sky-300">|</span>
          <div className="flex items-center gap-1.5 font-bold">
            <span>🔥</span>
            <span>연속 정답 콤보 보너스</span>
          </div>
          <span className="text-sky-300">|</span>
          <div className="flex items-center gap-1.5 font-bold">
            <span>📖</span>
            <span>정답 및 예방 수칙 2초 확인</span>
          </div>
        </div>

        {/* Speed Adjustment for Classroom */}
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs sm:text-sm">
          <span className="font-bold text-slate-600 flex items-center gap-1">
            <Clock className="w-4 h-4 text-indigo-500" />
            세균 하강 속도:
          </span>
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            {(
              [
                { id: 'slow', label: '느리게 (교실 토의 15초)' },
                { id: 'normal', label: '보통 (10초)' },
                { id: 'fast', label: '빠르게 (7초)' },
              ] as const
            ).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  onChangeSpeed(s.id);
                }}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  speed === s.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onStart();
            }}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-game text-xl sm:text-2xl font-black shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-3"
          >
            <Play className="w-6 h-6 fill-white" />
            <span>디펜스 시작하기!</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onOpenGuide();
            }}
            className="w-full sm:w-auto px-5 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-base transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <span>학습 도감 보기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
