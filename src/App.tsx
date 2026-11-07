/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { GameStatus, GameSpeed, QuestionItem, RouteType, PlayHistoryItem } from './types';
import { getShuffledQuestions } from './data/questions';
import { soundManager } from './utils/audio';
import { GameHeader } from './components/GameHeader';
import { DefenseStage } from './components/DefenseStage';
import { ResolutionBanner } from './components/ResolutionBanner';
import { StartScreen } from './components/StartScreen';
import { GameOverModal } from './components/GameOverModal';
import { LearningGuideModal } from './components/LearningGuideModal';

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

  // Resolution state (2-second feedback window)
  const [selectedRoute, setSelectedRoute] = useState<RouteType | null>(null);
  const [lastUserChoice, setLastUserChoice] = useState<RouteType | 'timeout' | null>(null);
  const [lastIsCorrect, setLastIsCorrect] = useState(false);
  const [lastComboBonus, setLastComboBonus] = useState(0);

  // Classroom helper modals and sound settings
  const [isMuted, setIsMuted] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const startTimeRef = useRef<number>(0);
  const timerFrameRef = useRef<number | null>(null);

  // Toggle sound
  const handleToggleMute = () => {
    soundManager.enabled = !soundManager.enabled;
    setIsMuted(!soundManager.enabled);
  };

  // Start new game
  const startGame = useCallback(() => {
    const selectedPool = getShuffledQuestions(15);
    setQuestions(selectedPool);
    setCurrentIndex(0);
    setScore(0);
    setLives(3);
    setCombo(0);
    setMaxCombo(0);
    setProgress(0);
    setHistory([]);
    setSelectedRoute(null);
    setLastUserChoice(null);
    setStatus('PLAYING');
    startTimeRef.current = Date.now();
  }, []);

  // Answer handler
  const handleAnswer = useCallback(
    (choice: RouteType | null, isTimeout = false) => {
      if (status !== 'PLAYING') return;

      const currentQ = questions[currentIndex];
      if (!currentQ) return;

      const isCorrect = !isTimeout && choice === currentQ.category;
      let nextLives = lives;
      let nextCombo = combo;
      let earnedScore = 0;
      let bonus = 0;

      if (isCorrect) {
        nextCombo = combo + 1;
        // Combo bonus: +30 per streak level beyond 1
        bonus = nextCombo > 1 ? Math.min(nextCombo - 1, 5) * 30 : 0;
        earnedScore = 100 + bonus;
        setScore((prev) => prev + earnedScore);
        setCombo(nextCombo);
        setMaxCombo((prev) => Math.max(prev, nextCombo));
        soundManager.playCorrect(nextCombo);
        if (nextCombo > 2) {
          setTimeout(() => soundManager.playCombo(), 200);
        }
      } else {
        nextLives = Math.max(0, lives - 1);
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

      // Requirement: "맞히든 틀리든 정답과 예방 수칙 한 줄을 2초간 보여줘."
      setTimeout(() => {
        if (nextLives <= 0) {
          setStatus('GAME_OVER');
        } else if (currentIndex + 1 >= 15) {
          setStatus('VICTORY');
        } else {
          setCurrentIndex((prev) => prev + 1);
          setProgress(0);
          setSelectedRoute(null);
          setLastUserChoice(null);
          setStatus('PLAYING');
          startTimeRef.current = Date.now();
        }
      }, 2000);
    },
    [status, questions, currentIndex, lives, combo]
  );

  // Falling bacteria animation loop
  useEffect(() => {
    if (status !== 'PLAYING') {
      if (timerFrameRef.current) cancelAnimationFrame(timerFrameRef.current);
      return;
    }

    const duration = SPEED_DURATION[speed];
    startTimeRef.current = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const currentProgress = Math.min(1, elapsed / duration);
      setProgress(currentProgress);

      if (currentProgress >= 1) {
        // Reached bottom barrier! Timeout
        handleAnswer(null, true);
      } else {
        timerFrameRef.current = requestAnimationFrame(tick);
      }
    };

    timerFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (timerFrameRef.current) cancelAnimationFrame(timerFrameRef.current);
    };
  }, [status, currentIndex, speed, handleAnswer]);

  // Keyboard shortcut support for classroom ease
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status !== 'PLAYING') return;

      if (e.key === '1' || e.key === 'a' || e.key === 'A') {
        handleAnswer('digestive');
      } else if (e.key === '2' || e.key === 's' || e.key === 'S') {
        handleAnswer('respiratory');
      } else if (e.key === '3' || e.key === 'd' || e.key === 'D') {
        handleAnswer('skin');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, handleAnswer]);

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
        onRestart={startGame}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative">
        {status === 'READY' && (
          <StartScreen
            onStart={startGame}
            speed={speed}
            onChangeSpeed={setSpeed}
            onOpenGuide={() => setIsGuideOpen(true)}
          />
        )}

        {(status === 'PLAYING' || status === 'RESOLVING') && currentQuestion && (
          <DefenseStage
            currentQuestion={currentQuestion}
            progress={progress}
            onSelectRoute={(route) => handleAnswer(route)}
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

        {/* Game Over / Victory Modal */}
        {(status === 'GAME_OVER' || status === 'VICTORY') && (
          <GameOverModal
            isVictory={status === 'VICTORY'}
            score={score}
            maxCombo={maxCombo}
            history={history}
            onRestart={startGame}
          />
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
