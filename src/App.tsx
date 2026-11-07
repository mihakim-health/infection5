/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { GameStatus, GameSpeed, QuestionItem, RouteType, PlayHistoryItem, ScoreDoc } from './types';
import { getShuffledQuestions } from './data/questions';
import { soundManager } from './utils/audio';
import { signInAnonymousStudent, savePlayerProfile, saveGameScore, subscribeClassScores } from './lib/firebase';
import { GameHeader } from './components/GameHeader';
import { DefenseStage } from './components/DefenseStage';
import { ResolutionBanner } from './components/ResolutionBanner';
import { StartScreen } from './components/StartScreen';
import { GameOverModal } from './components/GameOverModal';
import { LearningGuideModal } from './components/LearningGuideModal';
import { LeaderboardScreen } from './components/LeaderboardScreen';

const SPEED_DURATION: Record<GameSpeed, number> = {
  slow: 15000,
  normal: 10000,
  fast: 7000,
};

export default function App() {
  const [status, setStatus] = useState<GameStatus>('READY');
  const [speed, setSpeed] = useState<GameSpeed>('normal');
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [progress, setProgress] = useState(0); // 0 to 1
  const [history, setHistory] = useState<PlayHistoryItem[]>([]);

  // Class code from URL (?class=5-1), default to "all"
  const classCode = useMemo(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('class');
      if (code && code.trim().length > 0) {
        return code.trim();
      }
    } catch {
      // fallback
    }
    return 'all';
  }, []);

  // Check URL parameter: ?view=leaderboard
  const initialIsLeaderboardView = useMemo(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('view') === 'leaderboard';
    } catch {
      return false;
    }
  }, []);

  const [showLeaderboardView, setShowLeaderboardView] = useState<boolean>(initialIsLeaderboardView);

  // Real-time scores for this classCode
  const [scores, setScores] = useState<ScoreDoc[]>([]);

  // Student Nickname (strictly 2~8 characters, zero PII)
  const [playerNickname, setPlayerNickname] = useState<string>('');

  // 2-second resolution feedback state
  const [selectedRoute, setSelectedRoute] = useState<RouteType | null>(null);
  const [lastUserChoice, setLastUserChoice] = useState<RouteType | 'timeout' | null>(null);
  const [lastIsCorrect, setLastIsCorrect] = useState(false);
  const [lastComboBonus, setLastComboBonus] = useState(0);

  // Classroom helper modals and sound settings
  const [isMuted, setIsMuted] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Stable references for timer management and race-condition prevention
  const movementTimerRef = useRef<number | null>(null);
  const resolutionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isProcessingAnswerRef = useRef<boolean>(false);

  const statusRef = useRef<GameStatus>(status);
  statusRef.current = status;

  const speedRef = useRef<GameSpeed>(speed);
  speedRef.current = speed;

  const questionsRef = useRef<QuestionItem[]>(questions);
  questionsRef.current = questions;

  const currentIndexRef = useRef<number>(currentIndex);
  currentIndexRef.current = currentIndex;

  const livesRef = useRef<number>(lives);
  livesRef.current = lives;

  const scoreRef = useRef<number>(score);
  scoreRef.current = score;

  const comboRef = useRef<number>(combo);
  comboRef.current = combo;

  const playerNicknameRef = useRef<string>(playerNickname);
  playerNicknameRef.current = playerNickname;

  const classCodeRef = useRef<string>(classCode);
  classCodeRef.current = classCode;

  // Real-time subscription to class leaderboard scores via Firestore onSnapshot
  useEffect(() => {
    const unsubscribe = subscribeClassScores(classCode, (updatedScores) => {
      setScores(updatedScores);
    });
    return () => {
      unsubscribe();
    };
  }, [classCode]);

  // Clear all running timers cleanly
  const clearAllTimers = useCallback(() => {
    if (movementTimerRef.current !== null) {
      cancelAnimationFrame(movementTimerRef.current);
      movementTimerRef.current = null;
    }
    if (resolutionTimerRef.current !== null) {
      clearTimeout(resolutionTimerRef.current);
      resolutionTimerRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  // Toggle sound
  const handleToggleMute = () => {
    soundManager.enabled = !soundManager.enabled;
    setIsMuted(!soundManager.enabled);
  };

  // Open and close dedicated leaderboard view, syncing URL (?view=leaderboard)
  const handleOpenLeaderboard = useCallback(() => {
    setShowLeaderboardView(true);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('view', 'leaderboard');
      window.history.replaceState({}, '', url.toString());
    } catch {}
  }, []);

  const handleBackToGame = useCallback(() => {
    setShowLeaderboardView(false);
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('view');
      window.history.replaceState({}, '', url.toString());
    } catch {}
  }, []);

  // Start question at exact 0% with a single fresh timer
  const startQuestion = useCallback((targetIndex: number) => {
    // 1. Completely clear any previous timers
    clearAllTimers();
    isProcessingAnswerRef.current = false;

    // 2. Reset position to strictly 0%
    setProgress(0);
    setCurrentIndex(targetIndex);
    setSelectedRoute(null);
    setLastUserChoice(null);
    setStatus('PLAYING');

    // 3. Start single movement timer
    const duration = SPEED_DURATION[speedRef.current];
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const p = Math.min(1, elapsed / duration);
      setProgress(p);

      if (p >= 1) {
        // Reached bottom barrier! Timeout
        triggerAnswer(null, true);
      } else {
        movementTimerRef.current = requestAnimationFrame(tick);
      }
    };

    movementTimerRef.current = requestAnimationFrame(tick);
  }, [clearAllTimers]);

  // Answer handler guarded against duplicate calls
  const triggerAnswer = useCallback(
    (choice: RouteType | null, isTimeout = false) => {
      if (isProcessingAnswerRef.current || statusRef.current !== 'PLAYING') {
        return; // Prevent duplicate triggers for the same question
      }
      isProcessingAnswerRef.current = true;

      // Stop bacteria movement immediately
      if (movementTimerRef.current !== null) {
        cancelAnimationFrame(movementTimerRef.current);
        movementTimerRef.current = null;
      }

      const qIndex = currentIndexRef.current;
      const currentQ = questionsRef.current[qIndex];
      if (!currentQ) return;

      const isCorrect = !isTimeout && choice === currentQ.category;
      let nextLives = livesRef.current;
      let nextCombo = comboRef.current;
      let earnedScore = 0;
      let bonus = 0;

      if (isCorrect) {
        nextCombo += 1;
        bonus = nextCombo > 1 ? Math.min(nextCombo - 1, 5) * 30 : 0;
        earnedScore = 100 + bonus;
        scoreRef.current += earnedScore;
        setScore(scoreRef.current);
        setCombo(nextCombo);
        setMaxCombo((prev) => Math.max(prev, nextCombo));
        soundManager.playCorrect(nextCombo);
        if (nextCombo > 2) {
          setTimeout(() => soundManager.playCombo(), 200);
        }
      } else {
        nextLives = Math.max(0, nextLives - 1);
        nextCombo = 0;
        setLives(nextLives);
        setCombo(0);
        soundManager.playWrong();
      }

      const historyRecord: PlayHistoryItem = {
        question: currentQ,
        userChoice: isTimeout ? 'timeout' : choice,
        isCorrect,
        earnedScore,
      };

      setHistory((prev) => [...prev, historyRecord]);
      setSelectedRoute(choice);
      setLastUserChoice(isTimeout ? 'timeout' : choice);
      setLastIsCorrect(isCorrect);
      setLastComboBonus(bonus);
      setStatus('RESOLVING');

      // Exact 2-second resolution window
      resolutionTimerRef.current = setTimeout(() => {
        resolutionTimerRef.current = null;
        if (nextLives <= 0) {
          setStatus('GAME_OVER');
          // Non-blocking auto-save score to Firestore
          const finalScore = scoreRef.current;
          const nick = playerNicknameRef.current || '지킴이';
          saveGameScore(nick, finalScore, classCodeRef.current).catch(() => {});
        } else if (qIndex + 1 >= 15) {
          setStatus('VICTORY');
          // Non-blocking auto-save score to Firestore
          const finalScore = scoreRef.current;
          const nick = playerNicknameRef.current || '지킴이';
          saveGameScore(nick, finalScore, classCodeRef.current).catch(() => {});
        } else {
          startQuestion(qIndex + 1);
        }
      }, 2000);
    },
    [startQuestion]
  );

  // Pure game start - independent of Firebase network states
  const startGame = useCallback(
    (nicknameInput?: string) => {
      clearAllTimers();
      isProcessingAnswerRef.current = false;
      setShowLeaderboardView(false);

      const activeNickname = nicknameInput || playerNickname || '지킴이';
      setPlayerNickname(activeNickname);

      // Pick 15 questions and initialize game metrics
      const selectedPool = getShuffledQuestions(15);
      questionsRef.current = selectedPool;
      setQuestions(selectedPool);

      scoreRef.current = 0;
      setScore(0);
      setLives(3);
      setCombo(0);
      setMaxCombo(0);
      setHistory([]);

      // Start first question at 0%
      startQuestion(0);
    },
    [clearAllTimers, playerNickname, startQuestion]
  );

  // Background Firebase auth decoupled from game flow
  const handleStartFromScreen = useCallback(
    (nickname: string) => {
      // 1. Immediately start game without waiting
      startGame(nickname);

      // 2. Completely detached background sync
      setTimeout(() => {
        signInAnonymousStudent()
          .then((user) => {
            if (user && nickname) {
              savePlayerProfile(user.uid, nickname).catch(() => {});
            }
          })
          .catch(() => {});
      }, 0);
    },
    [startGame]
  );

  // Keyboard shortcut support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (statusRef.current !== 'PLAYING') return;

      if (e.key === '1' || e.key === 'a' || e.key === 'A') {
        triggerAnswer('digestive', false);
      } else if (e.key === '2' || e.key === 's' || e.key === 'S') {
        triggerAnswer('respiratory', false);
      } else if (e.key === '3' || e.key === 'd' || e.key === 'D') {
        triggerAnswer('skin', false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerAnswer]);

  const currentQuestion = questions[currentIndex];

  return (
    <div className="flex flex-col min-h-screen bg-slate-100 text-slate-800">
      {/* Top Navigation HUD */}
      <GameHeader
        score={score}
        lives={lives}
        maxLives={3}
        currentIndex={currentIndex}
        totalQuestions={15}
        combo={combo}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenGuide={() => setIsGuideOpen(true)}
        onRestart={() => startGame(playerNickname)}
        nickname={playerNickname}
        classCode={classCode}
        onOpenLeaderboard={handleOpenLeaderboard}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative">
        {/* Dedicated Leaderboard Screen (?view=leaderboard or clicked) */}
        {showLeaderboardView ? (
          <LeaderboardScreen
            scores={scores}
            currentNickname={playerNickname}
            classCode={classCode}
            onBackToGame={handleBackToGame}
          />
        ) : (
          <>
            {status === 'READY' && (
              <StartScreen
                onStart={handleStartFromScreen}
                speed={speed}
                onChangeSpeed={(newSpeed) => {
                  setSpeed(newSpeed);
                  speedRef.current = newSpeed;
                }}
                onOpenGuide={() => setIsGuideOpen(true)}
                scores={scores}
                classCode={classCode}
                initialNickname={playerNickname}
                onViewLeaderboard={handleOpenLeaderboard}
              />
            )}

            {(status === 'PLAYING' || status === 'RESOLVING') && currentQuestion && (
              <DefenseStage
                currentQuestion={currentQuestion}
                progress={progress}
                onSelectRoute={(route) => triggerAnswer(route, false)}
                isResolving={status === 'RESOLVING'}
                selectedRoute={selectedRoute}
                correctRoute={currentQuestion.category}
              />
            )}

            {/* 2-Second Resolution Banner */}
            {status === 'RESOLVING' && currentQuestion && (
              <ResolutionBanner
                question={currentQuestion}
                isCorrect={lastIsCorrect}
                userChoice={lastUserChoice}
                comboCount={combo}
                comboBonus={lastComboBonus}
              />
            )}

            {/* Game Over / Victory Modal with Leaderboard */}
            {(status === 'GAME_OVER' || status === 'VICTORY') && (
              <GameOverModal
                isVictory={status === 'VICTORY'}
                score={score}
                maxCombo={maxCombo}
                history={history}
                onRestart={() => startGame(playerNickname)}
                nickname={playerNickname}
                scores={scores}
                classCode={classCode}
                onViewLeaderboard={handleOpenLeaderboard}
              />
            )}
          </>
        )}

        {/* Learning Guide Reference Modal */}
        <LearningGuideModal
          isOpen={isGuideOpen}
          onClose={() => setIsGuideOpen(false)}
        />
      </main>
    </div>
  );
}
