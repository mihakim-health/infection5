import React from 'react';
import { ROUTE_CONFIG, RAW_QUESTION_BANK } from '../data/questions';
import { X, BookOpen, ShieldCheck } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface LearningGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LearningGuideModal: React.FC<LearningGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/50 backdrop-blur-xs select-none">
      <div className="w-full max-w-2xl bg-white rounded-3xl border-4 border-amber-300 shadow-2xl p-5 sm:p-7 relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            <h2 className="font-game text-xl sm:text-2xl font-black text-slate-900">
              5학년 보건: 감염병 전파 경로 도감
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            aria-label="닫기"
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content body */}
        <div className="overflow-y-auto py-4 space-y-4 pr-1">
          {(['digestive', 'respiratory', 'skin'] as const).map((key) => {
            const config = ROUTE_CONFIG[key];
            const items = RAW_QUESTION_BANK.filter((q) => q.category === key);

            return (
              <div
                key={key}
                className="p-4 rounded-2xl border-2 border-slate-200 bg-slate-50"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{config.icon}</span>
                    <div>
                      <h3 className="font-game text-xl font-black text-slate-900">
                        {config.name} 전파
                      </h3>
                      <p className="text-xs text-slate-600 font-medium">
                        {config.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Prevention Rule Banner */}
                <div className="my-2.5 p-2.5 rounded-xl bg-amber-100/70 border border-amber-300 flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-950">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>예방 수칙: {config.prevention}</span>
                </div>

                {/* Items in this category */}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {items.map((it) => (
                    <span
                      key={it.id}
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs"
                    >
                      {it.emoji} {it.title}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm cursor-pointer transition-colors"
          >
            확인 및 게임으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};
