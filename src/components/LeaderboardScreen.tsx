import React from 'react';
import { ScoreDoc } from '../types';
import { Leaderboard } from './Leaderboard';
import { ArrowLeft, Trophy, Sparkles, Radio, Users } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface LeaderboardScreenProps {
  scores: ScoreDoc[];
  currentNickname: string;
  classCode: string;
  onBackToGame: () => void;
}

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({
  scores,
  currentNickname,
  classCode,
  onBackToGame,
}) => {
  const displayClass = classCode === 'all' ? '전체 학급' : `${classCode}반`;

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-3 sm:p-6 bg-gradient-to-b from-amber-50 via-sky-50 to-emerald-50 select-none">
      <div className="w-full max-w-2xl bg-white/95 backdrop-blur-md rounded-3xl border-4 border-amber-300 shadow-2xl p-5 sm:p-8 relative">
        {/* Top Navigation Row: Back Button & Live Badge */}
        <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-amber-200">
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onBackToGame();
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-game text-sm sm:text-base font-bold shadow-md transition-all transform hover:-translate-x-0.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 stroke-[3]" />
            <span>← 게임으로 돌아가기</span>
          </button>

          {/* Real-time Indicator Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold">
            <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span className="hidden xs:inline">실시간 연동 중</span>
            <span className="xs:hidden">실시간</span>
          </div>
        </div>

        {/* Title Lockup */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md mb-2">
            <Trophy className="w-8 h-8 fill-yellow-200" />
          </div>
          <h2 className="font-game text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            🏆 {displayClass} 실시간 명예의 전당
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            새로고침 없이 친구들의 점수가 실시간으로 반영됩니다!
          </p>

          {/* Class query tip */}
          {classCode === 'all' && (
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-50 border border-sky-200 text-sky-900 text-[11px] font-medium">
              <Users className="w-3 h-3 text-sky-600" />
              <span>주소 뒤에 <b>?class=5-1</b> 처럼 붙이면 우리 반만의 랭킹을 볼 수 있어요.</span>
            </div>
          )}
        </div>

        {/* Main Real-time Leaderboard Card */}
        <div className="mb-6">
          <Leaderboard
            scores={scores}
            currentNickname={currentNickname}
            classCode={classCode}
          />
        </div>

        {/* Bottom Big CTA to Back */}
        <div className="flex items-center justify-center pt-2">
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onBackToGame();
            }}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-game text-lg sm:text-xl font-black shadow-lg shadow-emerald-500/25 transition-transform transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-yellow-200" />
            <span>디펜스 게임으로 돌아가기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
