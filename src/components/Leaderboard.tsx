import React, { useMemo } from 'react';
import { ScoreDoc, LeaderboardRankItem } from '../types';
import { Trophy, Medal, Award, Flame, User as UserIcon } from 'lucide-react';

interface LeaderboardProps {
  scores: ScoreDoc[];
  currentNickname: string;
  classCode: string;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  scores,
  currentNickname,
  classCode,
}) => {
  // Deduplicate by nickname taking the maximum score for each nickname
  // Requirement: "같은 닉네임은 최고 점수 하나만 순위에 보여줘"
  const { top10, myRankItem, myBestScore } = useMemo(() => {
    const bestByNickname = new Map<string, number>();

    scores.forEach((entry) => {
      if (!entry.nickname) return;
      const existing = bestByNickname.get(entry.nickname);
      if (existing === undefined || entry.score > existing) {
        bestByNickname.set(entry.nickname, entry.score);
      }
    });

    // Sort descending by score
    const rankedList: { nickname: string; score: number }[] = Array.from(bestByNickname.entries())
      .map(([nickname, score]) => ({ nickname, score }))
      .sort((a, b) => b.score - a.score);

    const fullRanked: LeaderboardRankItem[] = rankedList.map((item, idx) => ({
      rank: idx + 1,
      nickname: item.nickname,
      score: item.score,
      isMe: Boolean(currentNickname && item.nickname.trim() === currentNickname.trim()),
    }));

    const top10 = fullRanked.slice(0, 10);
    const myRankItem = currentNickname ? fullRanked.find((item) => item.isMe) || null : null;
    const myBestScore = myRankItem ? myRankItem.score : 0;

    return { top10, myRankItem, myBestScore };
  }, [scores, currentNickname]);

  const displayClass = classCode === 'all' ? '전체 학급' : `${classCode}반`;

  return (
    <div className="w-full bg-white/95 backdrop-blur-md rounded-2xl border-2 border-amber-300 shadow-md p-4 sm:p-5 select-none text-left">
      {/* Header with Title and "내 최고 기록" */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-amber-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
            <Trophy className="w-5 h-5 fill-amber-500" />
          </div>
          <div>
            <h3 className="font-game text-base sm:text-lg font-black text-slate-900 flex items-center gap-1.5">
              <span>{displayClass} 실시간 랭킹 (TOP 10)</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">
              1인 1최고점수 반영
            </span>
          </div>
        </div>

        {/* Prominent "내 최고 기록" (Always displayed next to TOP 10) */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs self-start sm:self-auto">
          <Flame className="w-4 h-4 text-yellow-200 fill-yellow-200" />
          <span className="text-xs font-bold">내 최고 기록:</span>
          <span className="font-game text-sm sm:text-base font-black tabular-nums">
            {myBestScore > 0 ? `${myBestScore.toLocaleString()}점` : '기록 없음'}
          </span>
        </div>
      </div>

      {/* TOP 10 List */}
      {top10.length === 0 ? (
        <div className="py-6 text-center text-slate-400 text-xs sm:text-sm font-medium">
          아직 등록된 점수가 없습니다. 첫 번째 영웅이 되어보세요!
        </div>
      ) : (
        <div className="space-y-1.5">
          {top10.map((entry) => {
            const is1st = entry.rank === 1;
            const is2nd = entry.rank === 2;
            const is3rd = entry.rank === 3;

            // Medal style for Gold, Silver, Bronze
            let rankBadgeStyle = 'bg-slate-100 text-slate-600 border-slate-200';
            let rowStyle = 'bg-slate-50/70 border-slate-200';

            if (is1st) {
              rankBadgeStyle = 'bg-yellow-400 text-yellow-950 font-black shadow-xs';
              rowStyle = 'bg-amber-50/90 border-amber-300 ring-1 ring-amber-200';
            } else if (is2nd) {
              rankBadgeStyle = 'bg-slate-300 text-slate-800 font-black shadow-xs';
              rowStyle = 'bg-slate-100/90 border-slate-300';
            } else if (is3rd) {
              rankBadgeStyle = 'bg-amber-600 text-white font-black shadow-xs';
              rowStyle = 'bg-orange-50/70 border-amber-300';
            }

            if (entry.isMe) {
              rowStyle += ' ring-2 ring-emerald-400 bg-emerald-50/90';
            }

            return (
              <div
                key={entry.nickname}
                className={`flex items-center justify-between px-3 py-1.5 rounded-xl border text-xs sm:text-sm transition-all ${rowStyle}`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Rank badge */}
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0 ${rankBadgeStyle}`}
                  >
                    {is1st ? '🥇' : is2nd ? '🥈' : is3rd ? '🥉' : entry.rank}
                  </div>

                  {/* Nickname */}
                  <span
                    className={`truncate font-bold ${
                      entry.isMe ? 'text-emerald-800 font-black' : 'text-slate-800'
                    }`}
                  >
                    {entry.nickname}
                    {entry.isMe && (
                      <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-md bg-emerald-200 text-emerald-900 font-black">
                        나
                      </span>
                    )}
                  </span>
                </div>

                {/* Score */}
                <div className="flex items-center gap-1 shrink-0 font-game font-black text-slate-900 text-sm sm:text-base tabular-nums">
                  <span>{entry.score.toLocaleString()}</span>
                  <span className="text-[11px] text-slate-500 font-normal">점</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Requirement: "내가 10위 밖이면 목록 아래에 '나: 17위 / 340점' 한 줄만 내 화면에 따로 보여줘" */}
      {myRankItem && myRankItem.rank > 10 && (
        <div className="mt-3 pt-2.5 border-t border-dashed border-amber-300">
          <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-emerald-100/90 border-2 border-emerald-400 text-xs sm:text-sm shadow-xs font-bold text-emerald-950">
            <div className="flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-emerald-700" />
              <span>
                나 ({currentNickname}): <span className="font-extrabold font-game text-base text-emerald-800">{myRankItem.rank}위</span>
              </span>
            </div>
            <div className="font-game font-black text-base tabular-nums">
              {myRankItem.score.toLocaleString()}점
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
