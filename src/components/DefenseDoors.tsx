import React from 'react';
import { RouteType } from '../types';
import { ROUTE_CONFIG } from '../data/questions';

interface DefenseDoorsProps {
  onSelectRoute: (route: RouteType) => void;
  disabled?: boolean;
  selectedRoute?: RouteType | null;
  correctRoute?: RouteType | null;
}

export const DefenseDoors: React.FC<DefenseDoorsProps> = ({
  onSelectRoute,
  disabled = false,
  selectedRoute = null,
  correctRoute = null,
}) => {
  const routes: RouteType[] = ['digestive', 'respiratory', 'skin'];

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4">
      {/* Visual Instruction Banner */}
      <div className="flex items-center justify-between mb-2 px-1 text-slate-600 text-xs sm:text-sm font-semibold">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          방어할 문을 클릭하거나 숫자키 [1, 2, 3]을 누르세요!
        </span>
        <span className="hidden sm:inline text-slate-500">
          단축키: 1번 / 2번 / 3번
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-5">
        {routes.map((routeKey, index) => {
          const config = ROUTE_CONFIG[routeKey];
          const isSelected = selectedRoute === routeKey;
          const isTargetCorrect = correctRoute === routeKey;

          let borderStatusStyle = config.doorBorder;
          let bgStatusStyle = config.doorBg;

          if (selectedRoute !== null) {
            if (isTargetCorrect) {
              borderStatusStyle = 'border-green-500 ring-4 ring-green-400 bg-green-100 shadow-xl';
            } else if (isSelected && !isTargetCorrect) {
              borderStatusStyle = 'border-rose-500 ring-4 ring-rose-400 bg-rose-100 shadow-xl';
            } else {
              borderStatusStyle = 'border-slate-300 opacity-60';
            }
          }

          return (
            <button
              key={routeKey}
              type="button"
              disabled={disabled}
              onClick={() => onSelectRoute(routeKey)}
              aria-label={`${config.name} ${config.icon} 문`}
              className={`group relative flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl border-3 sm:border-4 p-2.5 sm:p-5 transition-all duration-150 select-none cursor-pointer active:scale-95 disabled:cursor-not-allowed ${borderStatusStyle} ${bgStatusStyle} ${
                !disabled ? 'hover:-translate-y-1 hover:shadow-lg' : ''
              }`}
            >
              {/* Keyboard shortcut badge */}
              <div className="absolute top-2 left-2 sm:top-2.5 sm:left-3 px-1.5 sm:px-2 py-0.5 rounded-md bg-white/90 border border-slate-300 text-[10px] sm:text-xs font-bold text-slate-700 shadow-xs">
                키: {index + 1}
              </div>

              {/* Defense Shield Badge Indicator */}
              <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl bg-white shadow-md flex items-center justify-center text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3 group-hover:scale-105 transition-transform border border-slate-100">
                <span role="img" aria-label={config.name}>
                  {config.icon}
                </span>
              </div>

              {/* Title and Icon Together (meets prompt: 색만으로 구분하지 말고 문마다 아이콘과 글자를 같이 넣어줘) */}
              <div className="flex items-center justify-center gap-1 sm:gap-2">
                <span className="text-lg sm:text-2xl md:text-3xl font-extrabold text-slate-900 font-game">
                  {config.name}
                </span>
                <span className="text-base sm:text-xl">
                  {config.icon}
                </span>
              </div>

              {/* Concise Description for classroom guidance */}
              <p className="mt-1 text-[11px] sm:text-xs text-slate-600 font-medium text-center line-clamp-1 hidden sm:block">
                {routeKey === 'digestive' && '음식물 · 물 · 손'}
                {routeKey === 'respiratory' && '비말 · 기침 · 공기'}
                {routeKey === 'skin' && '상처 · 직접접촉 · 수건'}
              </p>

              {/* Action Prompt */}
              <div className="mt-2 w-full py-1 sm:py-1.5 rounded-lg bg-white/80 border border-slate-200 text-center text-[10px] sm:text-xs font-bold text-slate-800 shadow-xs group-hover:bg-white transition-colors">
                방어하기 🛡️
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
