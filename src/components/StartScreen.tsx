import React, { useState } from 'react';
import { GameSpeed, ScoreDoc } from '../types';
import { ROUTE_CONFIG } from '../data/questions';
import { Play, Sparkles, BookOpen, Clock, Heart, Award, Shield, User as UserIcon, Trophy } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { Leaderboard } from './Leaderboard';

interface StartScreenProps {
  onStart: (nickname: string) => void;
  speed: GameSpeed;
  onChangeSpeed: (speed: GameSpeed) => void;
  onOpenGuide: () => void;
  scores: ScoreDoc[];
  classCode: string;
  initialNickname?: string;
  onViewLeaderboard: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  onStart,
  speed,
  onChangeSpeed,
  onOpenGuide,
  scores,
  classCode,
  initialNickname = '',
  onViewLeaderboard,
}) => {
  const [nickname, setNickname] = useState(initialNickname);
  const [errorMsg, setErrorMsg] = useState('');

  // Korean / English 2~8 chars validation
  const validateNickname = (name: string): boolean => {
    const regex = /^[가-힣a-zA-Z]{2,8}$/;
    return regex.test(name.trim());
  };

  const handleStartClick = () => {
    const trimmed = nickname.trim();
    if (!trimmed) {
      setErrorMsg('닉네임을 입력해주세요. (한글 또는 영문 2~8자)');
      return;
    }
    if (!validateNickname(trimmed)) {
      setErrorMsg('한글 또는 영문 2~8자로 입력해주세요. (공백, 숫자, 특수문자 불가)');
      return;
    }

    setErrorMsg('');
    soundManager.playClick();
    onStart(trimmed);
  };

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
        <p className="text-slate-600 text-sm sm:text-base font-medium max-w-lg mx-auto mb-5 break-keep">
          화면 위에서 내려오는 세균을 확인하고 알맞은 방어문으로 막아내세요!
        </p>

        {/* Nickname Input Section (Zero PII, Anonymous Only) */}
        <div className="mb-5 p-4 rounded-2xl bg-amber-50/80 border-2 border-amber-200 text-left">
          <label htmlFor="student-nickname" className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
            <span className="flex items-center gap-1.5">
              <UserIcon className="w-4 h-4 text-amber-600" />
              학생 닉네임 입력 (한글·영문 2~8자)
            </span>
            <span className="text-[11px] text-slate-500 font-normal">
              {nickname.length}/8자
            </span>
          </label>

          <div className="flex gap-2">
            <input
              id="student-nickname"
              type="text"
              value={nickname}
              maxLength={8}
              placeholder="예: 보건대장, 지킴이, Hero"
              onChange={(e) => {
                setNickname(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleStartClick();
                }
              }}
              className="flex-1 px-4 py-2.5 rounded-xl border-2 border-amber-300 bg-white text-slate-900 font-bold text-base focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all placeholder:text-slate-400"
            />
          </div>

          {errorMsg ? (
            <p className="mt-1.5 text-xs font-bold text-rose-600 flex items-center gap-1">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </p>
          ) : (
            <p className="mt-1.5 text-[11px] sm:text-xs text-amber-800 flex items-center gap-1 font-medium">
              <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>안심 보호: 익명 로그인으로 동작하며, 이름·이메일 등 개인정보를 전혀 수집하지 않습니다.</span>
            </p>
          )}
        </div>

        {/* Large Prominent "🏆 실시간 리더보드 보기" Button as requested */}
        <div className="mb-5">
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onViewLeaderboard();
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-game text-lg sm:text-xl font-black shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2.5 border-2 border-amber-300"
          >
            <Trophy className="w-6 h-6 fill-yellow-200" />
            <span>🏆 실시간 리더보드 보기</span>
          </button>
        </div>

        {/* Real-time Class Leaderboard (TOP 10 + My Record) */}
        <div className="mb-5">
          <Leaderboard
            scores={scores}
            currentNickname={nickname.trim()}
            classCode={classCode}
          />
        </div>

        {/* 3 Routes Quick Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5 text-left">
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
        <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-3.5 mb-5 text-xs sm:text-sm text-sky-950 flex flex-wrap items-center justify-around gap-2 text-center">
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
        <div className="mb-5 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs sm:text-sm">
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
            onClick={handleStartClick}
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
