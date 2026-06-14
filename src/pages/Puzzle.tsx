import { useState, useCallback, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, Zap } from 'lucide-react';
import { getScientistById } from '@/data/scientists';
import { useGameStore } from '@/store/gameStore';
import ConceptIntro from '@/components/puzzle/ConceptIntro';
import DragNumberPuzzle from '@/components/puzzle/DragNumberPuzzle';
import PhotonMatchPuzzle from '@/components/puzzle/PhotonMatchPuzzle';
import OrbitPuzzle from '@/components/puzzle/OrbitPuzzle';
import SchrodingerPuzzle from '@/components/puzzle/SchrodingerPuzzle';
import EntanglementPuzzle from '@/components/puzzle/EntanglementPuzzle';
import HeisenbergPuzzle from '@/components/puzzle/HeisenbergPuzzle';
import InterferenceDevice from '@/components/puzzle/InterferenceDevice';
import RecordingPlayer from '@/components/puzzle/RecordingPlayer';
import FeedbackOverlay from '@/components/puzzle/FeedbackOverlay';
import type { PhotonHit, ScienceInterference } from '@/types';

const SCIENCE_INTERFERENCES: ScienceInterference[] = [
  { id: 'inf-planck-einstein', scientistIds: ['planck', 'einstein'], title: '', explanation: '', year: '' },
  { id: 'inf-einstein-bohr', scientistIds: ['einstein', 'bohr'], title: '', explanation: '', year: '' },
  { id: 'inf-bohr-schrodinger', scientistIds: ['bohr', 'schrodinger'], title: '', explanation: '', year: '' },
  { id: 'inf-schrodinger-heisenberg', scientistIds: ['schrodinger', 'heisenberg'], title: '', explanation: '', year: '' },
  { id: 'inf-einstein-bell', scientistIds: ['einstein', 'bell'], title: '', explanation: '', year: '' },
  { id: 'inf-bohr-einstein-debate', scientistIds: ['bohr', 'einstein'], title: '', explanation: '', year: '' },
  { id: 'inf-all-synthesis', scientistIds: ['planck', 'heisenberg'], title: '', explanation: '', year: '' },
];

const generateInterferencePhoton = (scientistId: string): PhotonHit => {
  const slit1 = 0.35;
  const slit2 = 0.65;
  const useSlit1 = Math.random() > 0.5;
  const slitCenter = useSlit1 ? slit1 : slit2;
  const gaussian = (mean: number, std: number) => {
    const u1 = Math.random() || 1e-10;
    const u2 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + z * std;
  };
  const fringes = Math.sin(gaussian(slitCenter, 0.08) * 40) * 0.15;
  const x = Math.max(0.02, Math.min(0.98, gaussian(slitCenter, 0.08) + fringes * 0.01));
  return {
    x,
    y: 0.5,
    intensity: 0.7 + Math.random() * 0.6,
    scientistId,
    timestamp: Date.now(),
  };
};

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
    addPhotonHit,
    removePhotons,
    addConsecutiveCorrectScientist,
    resetConsecutiveCorrectScientists,
    unlockInterference,
    specialLevelUnlocked,
  } = useGameStore();

  const [feedbackType, setFeedbackType] = useState<'correct' | 'incorrect' | null>(null);
  const [puzzleKey, setPuzzleKey] = useState(0);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showPhotonAnim, setShowPhotonAnim] = useState(false);

  const isCompleted = scientist ? isPuzzleCompleted(scientist.id) : false;
  const recordingUnlocked = scientist ? isRecordingUnlocked(scientist.id) : false;

  const isLocked = scientist?.isSpecial && !specialLevelUnlocked;

  useEffect(() => {
    if (scientist) {
      setHasAnswered(isCompleted);
    }
  }, [scientist, isCompleted]);

  const checkScienceInterference = useCallback(
    (sId: string) => {
      const matched = addConsecutiveCorrectScientist(sId);
      if (matched) {
        const last = useGameStore.getState().consecutiveCorrectScientists.slice(-2);
        const found = SCIENCE_INTERFERENCES.find(
          (inf) =>
            (inf.scientistIds[0] === last[0] && inf.scientistIds[1] === last[1]) ||
            (inf.scientistIds[0] === last[1] && inf.scientistIds[1] === last[0])
        );
        if (found) {
          unlockInterference(found.id);
        }
      }
    },
    [addConsecutiveCorrectScientist, unlockInterference]
  );

  const emitPhotons = useCallback(
    (sId: string, count: number) => {
      setShowPhotonAnim(true);
      let i = 0;
      const emit = () => {
        if (i >= count) {
          setShowPhotonAnim(false);
          return;
        }
        addPhotonHit(generateInterferencePhoton(sId));
        i++;
        setTimeout(emit, 60 + Math.random() * 80);
      };
      emit();
    },
    [addPhotonHit]
  );

  const handleCorrect = useCallback(() => {
    if (!scientist || hasAnswered) return;

    setHasAnswered(true);
    incrementLevel();
    completePuzzle(scientist.id);
    unlockRecording(scientist.id);
    setFeedbackType('correct');
    emitPhotons(scientist.id, 12);
    checkScienceInterference(scientist.id);

    setTimeout(() => {
      setFeedbackType(null);
    }, 2500);
  }, [scientist, hasAnswered, incrementLevel, completePuzzle, unlockRecording, emitPhotons, checkScienceInterference]);

  const handleIncorrect = useCallback(() => {
    if (!scientist || hasAnswered) return;

    const isEntanglementPuzzle = scientist.puzzle.type === 'entanglement-match';

    if (isEntanglementPuzzle) {
      setFeedbackType('incorrect');
      removePhotons(3);
      setTimeout(() => {
        setFeedbackType(null);
      }, 1000);
      return;
    }

    resetConsecutiveCorrectScientists();
    removePhotons(5);

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
  }, [scientist, hasAnswered, energyLevel, decrementLevel, resetLevel, resetConsecutiveCorrectScientists, removePhotons]);

  const handleReset = () => {
    setPuzzleKey((k) => k + 1);
    setHasAnswered(false);
  };

  const handleEntanglementReset = useCallback(() => {
    setHasAnswered(false);
    setPuzzleKey((k) => k + 1);
  }, []);

  const handleEntanglementCorrect = useCallback(() => {
    if (!scientist || hasAnswered) return;
    setHasAnswered(true);
    incrementLevel();
    completePuzzle(scientist.id);
    unlockRecording(scientist.id);
    setFeedbackType('correct');
    emitPhotons(scientist.id, 15);
    checkScienceInterference(scientist.id);
    setTimeout(() => {
      setFeedbackType(null);
    }, 2500);
  }, [scientist, hasAnswered, incrementLevel, completePuzzle, unlockRecording, emitPhotons, checkScienceInterference]);

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
    const isEntanglementPuzzle = scientist.puzzle.type === 'entanglement-match';
    const disabled = isCompleted && hasAnswered && !isEntanglementPuzzle;

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
            onCorrect={handleEntanglementCorrect}
            onIncorrect={handleIncorrect}
            onReset={handleEntanglementReset}
            disabled={disabled}
          />
        );
      case 'heisenberg-quiz':
        return (
          <HeisenbergPuzzle
            key={puzzleKey}
            puzzle={scientist.puzzle}
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
      case 'green':
        return 'hover:text-glow-green hover:border-glow-green/50';
      default:
        return 'hover:text-glow-cyan hover:border-glow-cyan/50';
    }
  };

  if (isLocked) {
    return (
      <div className="relative min-h-screen w-full">
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
          <div className="min-h-[60vh] flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="glass-card p-10 max-w-lg text-center"
              style={{ borderColor: 'rgba(57, 255, 20, 0.3)', boxShadow: '0 0 50px rgba(57, 255, 20, 0.1)' }}
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-glow-green/10 border-2 border-glow-green/30 flex items-center justify-center">
                <Zap className="w-12 h-12 text-glow-green" />
              </div>
              <h2 className="text-2xl font-bold font-serif text-white mb-3">
                {scientist.name} · 特殊关卡
              </h2>
              <p className="text-indigo-300/80 mb-2 text-sm">{scientist.nameEn} · {scientist.years}</p>
              <p className="text-glow-green mb-6 font-bold">🔒 关卡已锁定</p>
              <p className="text-indigo-300/80 leading-relaxed mb-8 text-sm">
                完成其他科学家的量子谜题，
                <br />
                让干涉条纹对比度积累到阈值，
                <br />
                即可解锁这道量子力学最深的谜题。
              </p>
              <InterferenceDevice compact scientistId={scientist.id} />
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

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
            {scientist.isSpecial && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: 'spring' }}
                className="ml-3 inline-block px-3 py-1 text-xs rounded-full border-2 border-glow-green/50 bg-glow-green/10 text-glow-green align-middle"
                style={{ boxShadow: '0 0 20px rgba(57, 255, 20, 0.3)' }}
              >
                ⚡ 特殊关卡
              </motion.span>
            )}
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
          <div className="lg:col-span-4 space-y-6">
            <ConceptIntro
              concept={scientist.concept}
              accentColor={scientist.accentColor}
            />

            <InterferenceDevice compact scientistId={scientist.id} />

            {isCompleted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
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
            <div className={`glass-card p-6 md:p-8 relative ${showPhotonAnim ? 'ring-2 ring-glow-cyan/40' : ''}`}
              style={showPhotonAnim ? { boxShadow: '0 0 40px rgba(0, 212, 255, 0.2)' } : undefined}
            >
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
