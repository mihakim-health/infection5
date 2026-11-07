import { QuestionItem, RouteType } from '../types';

export const ROUTE_CONFIG: Record<
  RouteType,
  {
    name: string;
    icon: string;
    description: string;
    prevention: string;
    badgeColor: string;
    doorBg: string;
    doorBorder: string;
    glowColor: string;
  }
> = {
  digestive: {
    name: '소화기계',
    icon: '🍽️',
    description: '입으로 음식이나 오염된 물을 섭취하여 전파',
    prevention: '손 씻기, 음식과 물은 깨끗하게',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    doorBg: 'bg-gradient-to-b from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200',
    doorBorder: 'border-emerald-500 shadow-emerald-200',
    glowColor: 'rgba(16, 185, 129, 0.4)',
  },
  respiratory: {
    name: '호흡기계',
    icon: '😷',
    description: '기침, 재채기, 공기 중 비말을 호흡하여 전파',
    prevention: '마스크 쓰기, 기침 예절, 2시간마다 10분 환기',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
    doorBg: 'bg-gradient-to-b from-sky-50 to-sky-100 hover:from-sky-100 hover:to-sky-200',
    doorBorder: 'border-sky-500 shadow-sky-200',
    glowColor: 'rgba(14, 165, 233, 0.4)',
  },
  skin: {
    name: '피부',
    icon: '🖐️',
    description: '상처나 피부의 직접 접촉, 공동 물건을 통해 전파',
    prevention: '감염 부위 접촉 피하기, 개인 물건 따로 쓰기, 상처는 바로 소독',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    doorBg: 'bg-gradient-to-b from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200',
    doorBorder: 'border-amber-500 shadow-amber-200',
    glowColor: 'rgba(245, 158, 11, 0.4)',
  },
};

export const RAW_QUESTION_BANK: QuestionItem[] = [
  // --- [소화기계 🍽️] ---
  {
    id: 'dig-1',
    category: 'digestive',
    title: '노로바이러스',
    isScenario: false,
    emoji: '🦪',
    preventionTip: '손 씻기, 음식과 물은 깨끗하게',
  },
  {
    id: 'dig-2',
    category: 'digestive',
    title: '세균성 이질',
    isScenario: false,
    emoji: '🦠',
    preventionTip: '손 씻기, 음식과 물은 깨끗하게',
  },
  {
    id: 'dig-3',
    category: 'digestive',
    title: '장티푸스',
    isScenario: false,
    emoji: '🧫',
    preventionTip: '손 씻기, 음식과 물은 깨끗하게',
  },
  {
    id: 'dig-4',
    category: 'digestive',
    title: '콜레라',
    isScenario: false,
    emoji: '💧',
    preventionTip: '손 씻기, 음식과 물은 깨끗하게',
  },
  {
    id: 'dig-5',
    category: 'digestive',
    title: 'A형 간염',
    isScenario: false,
    emoji: '🧪',
    preventionTip: '손 씻기, 음식과 물은 깨끗하게',
  },
  {
    id: 'dig-6',
    category: 'digestive',
    title: '오염된 물을 마셨어요',
    isScenario: true,
    emoji: '🚱',
    preventionTip: '손 씻기, 음식과 물은 깨끗하게',
  },
  {
    id: 'dig-7',
    category: 'digestive',
    title: '화장실에 다녀와서 손을 씻지 않고 간식을 먹었어요',
    isScenario: true,
    emoji: '🍪',
    preventionTip: '손 씻기, 음식과 물은 깨끗하게',
  },

  // --- [호흡기계 😷] ---
  {
    id: 'resp-1',
    category: 'respiratory',
    title: '인플루엔자',
    isScenario: false,
    emoji: '🌡️',
    preventionTip: '마스크 쓰기, 기침 예절, 2시간마다 10분 환기',
  },
  {
    id: 'resp-2',
    category: 'respiratory',
    title: '결핵',
    isScenario: false,
    emoji: '🫁',
    preventionTip: '마스크 쓰기, 기침 예절, 2시간마다 10분 환기',
  },
  {
    id: 'resp-3',
    category: 'respiratory',
    title: '홍역',
    isScenario: false,
    emoji: '🤒',
    preventionTip: '마스크 쓰기, 기침 예절, 2시간마다 10분 환기',
  },
  {
    id: 'resp-4',
    category: 'respiratory',
    title: '유행성 이하선염',
    isScenario: false,
    emoji: '🤕',
    preventionTip: '마스크 쓰기, 기침 예절, 2시간마다 10분 환기',
  },
  {
    id: 'resp-5',
    category: 'respiratory',
    title: '친구가 마스크 없이 내 앞에서 재채기했어요',
    isScenario: true,
    emoji: '🤧',
    preventionTip: '마스크 쓰기, 기침 예절, 2시간마다 10분 환기',
  },
  {
    id: 'resp-6',
    category: 'respiratory',
    title: '환기하지 않은 교실에서 기침하는 친구와 오래 이야기했어요',
    isScenario: true,
    emoji: '🗣️',
    preventionTip: '마스크 쓰기, 기침 예절, 2시간마다 10분 환기',
  },

  // --- [피부 🖐️] ---
  {
    id: 'skin-1',
    category: 'skin',
    title: '농가진',
    isScenario: false,
    emoji: '🩹',
    preventionTip: '감염 부위 접촉 피하기, 개인 물건 따로 쓰기, 상처는 바로 소독',
  },
  {
    id: 'skin-2',
    category: 'skin',
    title: '사마귀',
    isScenario: false,
    emoji: '🦶',
    preventionTip: '감염 부위 접촉 피하기, 개인 물건 따로 쓰기, 상처는 바로 소독',
  },
  {
    id: 'skin-3',
    category: 'skin',
    title: '무좀',
    isScenario: false,
    emoji: '🧦',
    preventionTip: '감염 부위 접촉 피하기, 개인 물건 따로 쓰기, 상처는 바로 소독',
  },
  {
    id: 'skin-4',
    category: 'skin',
    title: '친구 물집의 진물을 맨손으로 만졌어요',
    isScenario: true,
    emoji: '🖐️',
    preventionTip: '감염 부위 접촉 피하기, 개인 물건 따로 쓰기, 상처는 바로 소독',
  },
  {
    id: 'skin-5',
    category: 'skin',
    title: '무좀이 있는 사람과 수건을 같이 썼어요',
    isScenario: true,
    emoji: '🛁',
    preventionTip: '감염 부위 접촉 피하기, 개인 물건 따로 쓰기, 상처는 바로 소독',
  },
];

/**
 * Fisher-Yates shuffle & pick exact 15 questions
 */
export function getShuffledQuestions(count = 15): QuestionItem[] {
  const array = [...RAW_QUESTION_BANK];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.slice(0, count);
}
