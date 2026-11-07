import React from 'react';
import { QuestionItem } from '../types';

interface BacteriaCardProps {
  question: QuestionItem;
  status?: 'normal' | 'blocked' | 'passed';
  progress: number; // 0 (top) to 1 (bottom)
}

export const BacteriaCard: React.FC<BacteriaCardProps> = ({
  question,
  status = 'normal',
  progress,
}) => {
  const isClose = progress > 0.75;

  return (
    <div
      className={`relative mx-auto flex flex-col items-center transition-transform duration-100 ${
        status === 'blocked'
          ? 'scale-110 opacity-40 filter blur-xs'
          : status === 'passed'
          ? 'scale-90 opacity-60'
          : 'scale-100'
      }`}
      style={{
        width: 'min(94%, 580px)',
      }}
    >
      {/* Cartoon Germ Body & Face */}
      <div className="relative mb-2 flex items-center justify-center">
        {/* Glow halo */}
        <div
          className={`absolute -inset-4 rounded-full blur-md opacity-60 transition-colors ${
            isClose ? 'bg-rose-400 animate-pulse' : 'bg-emerald-300'
          }`}
        />

        {/* Squishy Germ Creature */}
        <div
          className={`relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center shadow-lg transition-transform ${
            isClose
              ? 'bg-gradient-to-br from-rose-500 via-rose-600 to-red-600 animate-bounce'
              : 'bg-gradient-to-br from-teal-400 via-emerald-500 to-green-600 animate-squish'
          }`}
        >
          {/* Eyes & Mouth */}
          <div className="flex flex-col items-center justify-center select-none">
            <div className="flex items-center gap-3">
              {/* Left Eye */}
              <div className="w-5 h-6 bg-white rounded-full flex items-center justify-center relative shadow-inner">
                <div
                  className={`w-2.5 h-2.5 bg-slate-900 rounded-full ${
                    isClose ? 'animate-ping' : ''
                  }`}
                />
                <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-white rounded-full opacity-80" />
              </div>
              {/* Right Eye */}
              <div className="w-5 h-6 bg-white rounded-full flex items-center justify-center relative shadow-inner">
                <div
                  className={`w-2.5 h-2.5 bg-slate-900 rounded-full ${
                    isClose ? 'animate-ping' : ''
                  }`}
                />
                <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-white rounded-full opacity-80" />
              </div>
            </div>

            {/* Mouth */}
            <div
              className={`mt-1.5 transition-all ${
                isClose
                  ? 'w-6 h-3 bg-red-950 rounded-full'
                  : 'w-4 h-2 bg-emerald-950 rounded-b-full'
              }`}
            />
          </div>

          {/* Floating Emoji Badge */}
          <span className="absolute -top-3 -right-2 text-2xl sm:text-3xl filter drop-shadow">
            {question.emoji}
          </span>
        </div>
      </div>

      {/* Main Question Plate (Large, TV-readable for classroom back row) */}
      <div className="relative z-20 w-full bg-white/95 backdrop-blur-md rounded-2xl border-3 border-amber-300 shadow-xl p-4 sm:p-5 text-center transition-all">
        {/* Type indicator (Disease Name vs Situation) */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <span
            className={`text-xs sm:text-sm font-bold px-3 py-0.5 rounded-full ${
              question.isScenario
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-indigo-100 text-indigo-900 border border-indigo-300'
            }`}
          >
            {question.isScenario ? '⚠️ 일상 상황' : '🦠 감염병 이름'}
          </span>
          <span className="text-xs sm:text-sm font-medium text-slate-500">
            어떤 경로로 전파될까요?
          </span>
        </div>

        {/* Disease / Scenario Title */}
        <h2 className="font-game text-2xl sm:text-3xl md:text-4xl text-slate-900 font-extrabold tracking-tight leading-snug sm:leading-tight break-keep">
          {question.title}
        </h2>
      </div>
    </div>
  );
};
