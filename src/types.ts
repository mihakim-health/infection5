export type RouteType = 'digestive' | 'respiratory' | 'skin';

export interface QuestionItem {
  id: string;
  category: RouteType;
  title: string; // The disease name or scenario
  isScenario: boolean; // whether it's a real-life scenario or disease name
  emoji: string;
  preventionTip: string;
}

export interface PlayHistoryItem {
  question: QuestionItem;
  userChoice: RouteType | 'timeout' | null;
  isCorrect: boolean;
  earnedScore: number;
}

export type GameStatus = 'READY' | 'PLAYING' | 'RESOLVING' | 'GAME_OVER' | 'VICTORY';

export type GameSpeed = 'slow' | 'normal' | 'fast';

export interface ScoreDoc {
  id?: string;
  nickname: string;
  score: number;
  classCode: string;
  createdAt?: unknown;
}

export interface LeaderboardRankItem {
  rank: number;
  nickname: string;
  score: number;
  isMe: boolean;
}
