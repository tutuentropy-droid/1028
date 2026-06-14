import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { getScientistById } from '@/data/scientists';
import { useGameStore } from '@/store/gameStore';
import ConceptIntro from '@/components/puzzle/ConceptIntro';
import DragNumberPuzzle from '@/components/puzzle/DragNumberPuzzle';
import PhotonMatchPuzzle from '@/components/puzzle/PhotonMatchPuzzle';
import OrbitPuzzle from '@/components/puzzle/OrbitPuzzle';
import SchrodingerPuzzle from '@/components/puzzle/SchrodingerPuzzle';
import EntanglementPuzzle from '@/components/puzzle/EntanglementPuzzle';
import RecordingPlayer from '@/components/puzzle/RecordingPlayer';
import FeedbackOverlay from '@/components/puzzle/FeedbackOverlay';

const Puzzle = () => {
  const { scientistId } = useParams<{ scientistId: string }>();
  const navigate = useNavigate();
  const scientist = scientistId ? getScientistById(scientistId) : undefined;

  const {
    energyLevel,
    incrementLevel,
    decrementLevel,
    completePuzzle,
    unlockRecording,
    isPuzzleCompleted,
    isRecordingUnlocked,
    resetLevel,
  } = useGameStore();

  const [feedbackType, setFeedbackType] = useState<'correct' | 'incorrect' | null>(null);
  const [puzzleKey, setPuzzleKey] = useState(0);
  const [hasAnswered, setHasAnswered] = useState(false);

  const isCompleted = scientist ? isPuzzleCompleted(scientist.id) : false;
  const recordingUnlocked = scientist ? isRecordingUnlocked(scientist.id) : false;

  useEffect(() => {
    if (scientist) {
      setHasAnswered(isCompleted);
    }
  }, [scientist, isCompleted]);

  const handleCorrect = useCallback(() => {
    if (!scientist || hasAnswered) return;

    setHasAnswered(true);
    incrementLevel();
    completePuzzle(scientist.id);
    unlockRecording(scientist.id);
    setFeedbackType('correct');

    setTimeout(() => {
      setFeedbackType(null);
    }, 2500);
  }, [scientist, hasAnswered, incrementLevel, completePuzzle, unlockRecording]);

  const handleIncorrect = useCallback(() => {
    if (!scientist || hasAnswered) return;

    const newLevel = energyLevel - 1;
    
    if (newLevel <= 0) {
      resetLevel();
      setFeedbackType('incorrect');
      setTimeout(() => {
        setFeedbackType(null);
      }, 2000);
    } else {
      decrementLevel();
      setFeedbackType('incorrect');
      setTimeout(() => {
        setFeedbackType(null);
      }, 1500);
    }
  }, [scientist, hasAnswered, energyLevel, decrementLevel, resetLevel]);

  const handleReset = () => {
    setPuzzleKey((k) => k + 1);
    setHasAnswered(false);
  };

  const handleBack = () => {
    navigate('/');
  };

  if (!scientist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-indigo-400">科学家未找到</p>
      </div>
    );
  }

  const renderPuzzle = () => {
    const disabled = isCompleted && hasAnswered;

    switch (scientist.puzzle.type) {
      case 'drag-number':
        return (
          <DragNumberPuzzle
            key={puzzleKey}
            puzzle={scientist.puzzle}
            onCorrect={handleCorrect}
            onIncorrect={handleIncorrect}
            disabled={disabled}
          />
        );
      case 'photon-match':
        return (
          <PhotonMatchPuzzle
            key={puzzleKey}
            puzzle={scientist.puzzle}
            onCorrect={handleCorrect}
            onIncorrect={handleIncorrect}
            disabled={disabled}
          />
        );
      case 'drag-orbit':
        return (
          <OrbitPuzzle
            key={puzzleKey}
            puzzle={scientist.puzzle}
            onCorrect={handleCorrect}
            onIncorrect={handleIncorrect}
            disabled={disabled}
          />
        );
      case 'schrodinger-quiz':
        return (
          <SchrodingerPuzzle
            key={puzzleKey}
            puzzle={scientist.puzzle}
            onCorrect={handleCorrect}
            onIncorrect={handleIncorrect}
            disabled={disabled}
          />
        );
      case 'entanglement-match':
        return (
          <EntanglementPuzzle
            key={puzzleKey}
            puzzle={scientist.puzzle}
            anecdotes={scientist.anecdotes}
            onCorrect={handleCorrect}
            onIncorrect={handleIncorrect}
            disabled={disabled}
          />
        );
      default:
        return null;
    }
  };

  const getBackButtonClass = () => {
    switch (scientist.accentColor) {
      case 'cyan':
        return 'hover:text-glow-cyan hover:border-glow-cyan/50';
      case 'purple':
        return 'hover:text-glow-purple hover:border-glow-purple/50';
      case 'orange':
        return 'hover:text-glow-orange hover:border-glow-orange/50';
      default:
        return 'hover:text-glow-cyan hover:border-glow-cyan/50';
    }
  };

  return (
    <div className="relative min-h-screen w-full">
      <FeedbackOverlay type={feedbackType} />

      <div className="relative z-10 container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <button
            onClick={handleBack}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-indigo-500/30 text-indigo-300 transition-all ${getBackButtonClass()}`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回首页</span>
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-white mb-2">
            {scientist.name}
          </h2>
          <p className="text-indigo-400/70 font-mono text-sm">
            {scientist.nameEn} · {scientist.years}
          </p>
          <p className="text-indigo-300/80 mt-2">{scientist.contribution}</p>

          {isCompleted && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="mt-4 inline-block"
            >
              <span className="px-4 py-1.5 rounded-full text-sm bg-glow-green/15 text-glow-green border border-glow-green/40">
                ✓ 已完成
              </span>
            </motion.div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-4">
            <ConceptIntro
              concept={scientist.concept}
              accentColor={scientist.accentColor}
            />

            {isCompleted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-6"
              >
                <button
                  onClick={handleReset}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>重新挑战</span>
                </button>
              </motion.div>
            )}
          </div>

          <div className="lg:col-span-8">
            <div className="glass-card p-6 md:p-8">
              {renderPuzzle()}
            </div>

            <div className="mt-8">
              <RecordingPlayer
                recording={scientist.recording}
                isUnlocked={recordingUnlocked}
                accentColor={scientist.accentColor}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Puzzle;
