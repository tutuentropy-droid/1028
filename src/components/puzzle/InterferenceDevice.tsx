import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Lock, Unlock, Info, Eye, TrendingUp, Waves } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import type { PhotonHit, ScienceInterference } from '@/types';

interface InterferenceDeviceProps {
  compact?: boolean;
  scientistId?: string;
  onSpecialLevelUnlock?: () => void;
}

const SCIENCE_INTERFERENCES: ScienceInterference[] = [
  {
    id: 'inf-planck-einstein',
    scientistIds: ['planck', 'einstein'],
    title: '能量量子化 → 光量子假说',
    year: '1900 → 1905',
    explanation: '普朗克的能量量子化假说最初只是为了解决黑体辐射的数学技巧，他本人并不相信原子的量子化。但爱因斯坦大胆地将这一思想推广：不仅能量的发射和吸收是量子化的，光本身就是由一个个光量子（光子）组成的。这一思想跃迁，将普朗克的"数学技巧"变成了描述光的本质的物理实在，直接催生了量子力学的诞生。',
  },
  {
    id: 'inf-einstein-bohr',
    scientistIds: ['einstein', 'bohr'],
    title: '光量子 → 原子量子化轨道',
    year: '1905 → 1913',
    explanation: '爱因斯坦的光量子假说说明电子与光子之间存在能量交换的量子特性。玻尔将这一思想应用到原子结构中：如果光子的能量是量子化的，那么原子中电子的能量也应该是量子化的。他假设电子只能在特定的离散轨道上运动，当电子跃迁时就会发射或吸收一个光子，其能量正好等于两个轨道的能量差。这完美解释了氢原子的光谱线规律。',
  },
  {
    id: 'inf-bohr-schrodinger',
    scientistIds: ['bohr', 'schrodinger'],
    title: '玻尔轨道 → 波动力学',
    year: '1913 → 1926',
    explanation: '玻尔模型中电子为何只能在特定轨道上运动？这个问题困扰了物理学界十多年。德布罗意提出物质波假说后，薛定谔想到：如果电子是波，那么玻尔的量子化轨道条件就等效于"驻波条件"——轨道周长必须是电子波长的整数倍。沿着这条思路，薛定谔推导出了著名的波动方程，将玻尔的半经典模型升级为完整的量子力学理论。',
  },
  {
    id: 'inf-schrodinger-heisenberg',
    scientistIds: ['schrodinger', 'heisenberg'],
    title: '波动力学 ↔ 矩阵力学',
    year: '1925 → 1927',
    explanation: '1925年海森堡从可观测的光谱线出发，创立了矩阵力学；1926年薛定谔从德布罗意波出发，创立了波动力学。两种理论形式完全不同，却得出了完全相同的结果。薛定谔很快证明了两者在数学上是等价的。随后海森堡基于波动力学的数学结构，发现了不确定性原理——这两条看似不同的理论路径，最终交汇在同一个量子实在之上。',
  },
  {
    id: 'inf-einstein-bell',
    scientistIds: ['einstein', 'bell'],
    title: 'EPR佯谬 → 贝尔不等式',
    year: '1935 → 1964',
    explanation: '爱因斯坦在1935年提出EPR佯谬，试图通过思想实验证明量子力学是不完备的，应该存在更底层的"定域隐变量"理论。这个哲学争论持续了近30年，直到贝尔提出了一个可以用实验检验的数学不等式。如果爱因斯坦是对的，实验结果应该满足贝尔不等式；如果量子力学是对的，不等式就会被违反。一个哲学问题，就这样变成了一个可以用实验数据回答的问题。',
  },
  {
    id: 'inf-bohr-einstein-debate',
    scientistIds: ['bohr', 'einstein'],
    title: '世纪辩论：量子力学的诠释之争',
    year: '1927 → 1935',
    explanation: '爱因斯坦和玻尔的索尔维辩论是物理学史上最著名的思想交锋。爱因斯坦一次次设计精妙的思想实验（如光子箱实验）来挑战量子力学的自洽性，试图证明不确定性原理可以被突破。而玻尔每次都能在一夜苦思之后，找到爱因斯坦论证中的漏洞，用量子力学本身的逻辑来捍卫哥本哈根诠释。这场辩论虽然没有胜负，却深刻地塑造了我们对量子世界的理解。',
  },
  {
    id: 'inf-all-synthesis',
    scientistIds: ['planck', 'heisenberg'],
    title: '量子力学的综合：从普朗克到海森堡',
    year: '1900 → 1927',
    explanation: '从1900年普朗克的能量量子化，到1927年不确定性原理的提出，量子力学的完整框架只用了27年就构建完成。普朗克点燃了火种，爱因斯坦让光变成了粒子，玻尔给原子画了轨道，薛定谔写下了波动方程，海森堡画出了不确定的边界。每一位科学家的工作都建立在前人的思想之上，又与其他人的思想产生"干涉"——有时是建设性的加强，有时是破坏性的辩论，但最终都共同照亮了量子世界的奥秘。',
  },
];

const CONTRAST_THRESHOLD = 70;
const SLIT_WIDTH = 8;
const SLIT_DISTANCE = 60;
const WAVELENGTH = 0.15;

const getScientistColor = (id: string): string => {
  switch (id) {
    case 'planck': return '#00d4ff';
    case 'einstein': return '#9d4edd';
    case 'bohr': return '#ff6b35';
    case 'schrodinger': return '#c77dff';
    case 'bell': return '#72efdd';
    case 'heisenberg': return '#39ff14';
    default: return '#00d4ff';
  }
};

const InterferenceDevice = ({ compact = false, scientistId, onSpecialLevelUnlock }: InterferenceDeviceProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const [showInterferenceInfo, setShowInterferenceInfo] = useState<ScienceInterference | null>(null);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const prevSpecialUnlockedRef = useRef(false);
  const [photonCountForDisplay, setPhotonCountForDisplay] = useState(0);

  const {
    photonHits,
    fringeContrast,
    specialLevelUnlocked,
    totalPhotons,
    unlockedInterferences,
    consecutiveCorrectScientists,
  } = useGameStore();

  const unlockedInterferenceData = useMemo(() => {
    return SCIENCE_INTERFERENCES.filter((inf) => unlockedInterferences.includes(inf.id));
  }, [unlockedInterferences]);

  const pendingInterference = useMemo(() => {
    if (consecutiveCorrectScientists.length < 2) return null;
    const lastTwo = consecutiveCorrectScientists.slice(-2);
    const match = SCIENCE_INTERFERENCES.find(
      (inf) =>
        (inf.scientistIds[0] === lastTwo[0] && inf.scientistIds[1] === lastTwo[1]) ||
        (inf.scientistIds[0] === lastTwo[1] && inf.scientistIds[1] === lastTwo[0])
    );
    if (match && !unlockedInterferences.includes(match.id)) {
      return match;
    }
    return null;
  }, [consecutiveCorrectScientists, unlockedInterferences]);

  const drawDoubleSlitExperiment = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      ctx.clearRect(0, 0, width, height);

      const slitY = height * 0.18;
      const screenY = height * 0.65;
      const centerX = width / 2;

      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, 'rgba(5, 8, 22, 0.3)');
      bgGrad.addColorStop(1, 'rgba(10, 14, 39, 0.5)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(99, 102, 241, 0.15)';
      ctx.lineWidth = 1;
      for (let i = 0; i < width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let i = 0; i < height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }

      const sourceX = centerX;
      const sourceY = 12;
      const sourceGrad = ctx.createRadialGradient(sourceX, sourceY, 0, sourceX, sourceY, 30);
      sourceGrad.addColorStop(0, 'rgba(0, 212, 255, 0.9)');
      sourceGrad.addColorStop(0.5, 'rgba(0, 212, 255, 0.3)');
      sourceGrad.addColorStop(1, 'rgba(0, 212, 255, 0)');
      ctx.fillStyle = sourceGrad;
      ctx.beginPath();
      ctx.arc(sourceX, sourceY, 30, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#00d4ff';
      ctx.beginPath();
      ctx.arc(sourceX, sourceY, 5, 0, Math.PI * 2);
      ctx.fill();

      const drawWave = (fromX: number, fromY: number, toX: number, toY: number, color: string, amp: number) => {
        const time = Date.now() / 1000;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        const dx = toX - fromX;
        const dy = toY - fromY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const steps = 80;
        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          const x = fromX + dx * t;
          const y = fromY + dy * t;
          const perpX = -dy / dist;
          const perpY = dx / dist;
          const wave = Math.sin(t * dist * WAVELENGTH * 10 - time * 4) * amp * (1 - Math.abs(t - 0.5) * 0.5);
          const px = x + perpX * wave;
          const py = y + perpY * wave;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
      };

      const slit1X = centerX - SLIT_DISTANCE / 2;
      const slit2X = centerX + SLIT_DISTANCE / 2;

      drawWave(sourceX, sourceY, slit1X, slitY, 'rgba(0, 212, 255, 0.5)', 8);
      drawWave(sourceX, sourceY, slit2X, slitY, 'rgba(157, 78, 221, 0.5)', 8);

      ctx.fillStyle = 'rgba(30, 35, 70, 0.9)';
      ctx.fillRect(0, slitY - 25, slit1X - SLIT_WIDTH / 2, 50);
      ctx.fillRect(slit1X + SLIT_WIDTH / 2, slitY - 25, slit2X - slit1X - SLIT_WIDTH, 50);
      ctx.fillRect(slit2X + SLIT_WIDTH / 2, slitY - 25, width - slit2X - SLIT_WIDTH / 2, 50);

      ctx.strokeStyle = 'rgba(0, 212, 255, 0.6)';
      ctx.lineWidth = 2;
      ctx.shadowColor = 'rgba(0, 212, 255, 0.5)';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(slit1X - SLIT_WIDTH / 2, slitY - 25);
      ctx.lineTo(slit1X - SLIT_WIDTH / 2, slitY + 25);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(slit1X + SLIT_WIDTH / 2, slitY - 25);
      ctx.lineTo(slit1X + SLIT_WIDTH / 2, slitY + 25);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(slit2X - SLIT_WIDTH / 2, slitY - 25);
      ctx.lineTo(slit2X - SLIT_WIDTH / 2, slitY + 25);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(slit2X + SLIT_WIDTH / 2, slitY - 25);
      ctx.lineTo(slit2X + SLIT_WIDTH / 2, slitY + 25);
      ctx.stroke();
      ctx.shadowBlur = 0;

      drawWave(slit1X, slitY, centerX - 100, screenY, 'rgba(0, 212, 255, 0.4)', 6);
      drawWave(slit1X, slitY, centerX, screenY, 'rgba(0, 212, 255, 0.5)', 6);
      drawWave(slit1X, slitY, centerX + 100, screenY, 'rgba(0, 212, 255, 0.4)', 6);
      drawWave(slit2X, slitY, centerX - 100, screenY, 'rgba(157, 78, 221, 0.4)', 6);
      drawWave(slit2X, slitY, centerX, screenY, 'rgba(157, 78, 221, 0.5)', 6);
      drawWave(slit2X, slitY, centerX + 100, screenY, 'rgba(157, 78, 221, 0.4)', 6);

      const maxIntensity = 30;
      const binWidth = 4;
      const bins: { [key: number]: { count: number; color: string } } = {};

      const screenStartX = 40;
      const screenEndX = width - 40;

      for (let x = screenStartX; x <= screenEndX; x += binWidth) {
        bins[x] = { count: 0, color: 'rgba(255,255,255,0.1)' };
      }

      photonHits.forEach((hit) => {
        const binKey = Math.round((hit.x * (screenEndX - screenStartX) + screenStartX) / binWidth) * binWidth;
        if (bins[binKey]) {
          bins[binKey].count += hit.intensity;
          bins[binKey].color = getScientistColor(hit.scientistId);
        }
      });

      const screenHeight = height * 0.28;
      const screenTop = screenY - screenHeight / 2;

      const screenGrad = ctx.createLinearGradient(0, screenTop, 0, screenTop + screenHeight);
      screenGrad.addColorStop(0, 'rgba(20, 25, 60, 0.8)');
      screenGrad.addColorStop(0.5, 'rgba(15, 20, 50, 0.9)');
      screenGrad.addColorStop(1, 'rgba(20, 25, 60, 0.8)');
      ctx.fillStyle = screenGrad;
      ctx.fillRect(screenStartX - 10, screenTop - 5, screenEndX - screenStartX + 20, screenHeight + 10);

      ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
      ctx.lineWidth = 1;
      ctx.strokeRect(screenStartX - 10, screenTop - 5, screenEndX - screenStartX + 20, screenHeight + 10);

      const contrastEffect = Math.max(0.3, fringeContrast / 100);

      Object.entries(bins).forEach(([xKey, data]) => {
        const x = Number(xKey);
        const intensity = Math.min(data.count / maxIntensity, 1) * contrastEffect;
        if (intensity > 0.01) {
          const alpha = Math.min(intensity * 1.2, 1);
          const centerY = screenTop + screenHeight / 2;
          const peakHeight = screenHeight * 0.92 * intensity;

          const barGrad = ctx.createLinearGradient(x, centerY - peakHeight / 2, x, centerY + peakHeight / 2);
          barGrad.addColorStop(0, `${data.color}00`);
          barGrad.addColorStop(0.2, `${data.color}${Math.floor(alpha * 200).toString(16).padStart(2, '0')}`);
          barGrad.addColorStop(0.5, `${data.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`);
          barGrad.addColorStop(0.8, `${data.color}${Math.floor(alpha * 200).toString(16).padStart(2, '0')}`);
          barGrad.addColorStop(1, `${data.color}00`);

          ctx.fillStyle = barGrad;
          ctx.fillRect(x - binWidth / 2, centerY - peakHeight / 2, binWidth - 1, peakHeight);

          ctx.globalAlpha = alpha * 0.3;
          ctx.fillStyle = data.color;
          ctx.shadowColor = data.color;
          ctx.shadowBlur = 6;
          ctx.fillRect(x - binWidth / 2 - 1, centerY - peakHeight / 2, binWidth + 1, peakHeight);
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;
        }
      });

      photonHits.slice(-15).forEach((hit, idx) => {
        const x = hit.x * (screenEndX - screenStartX) + screenStartX;
        const y = screenTop + screenHeight / 2;
        const age = (Date.now() - hit.timestamp) / 800;
        if (age < 1) {
          const alpha = (1 - age) * 0.9;
          const glowSize = 10 + age * 15;
          const color = getScientistColor(hit.scientistId);

          ctx.globalAlpha = alpha * 0.6;
          const hitGrad = ctx.createRadialGradient(x, y, 0, x, y, glowSize);
          hitGrad.addColorStop(0, color);
          hitGrad.addColorStop(0.5, `${color}88`);
          hitGrad.addColorStop(1, `${color}00`);
          ctx.fillStyle = hitGrad;
          ctx.beginPath();
          ctx.arc(x, y, glowSize, 0, Math.PI * 2);
          ctx.fill();

          ctx.globalAlpha = alpha;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(x, y, 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      });

      ctx.fillStyle = 'rgba(129, 140, 248, 0.7)';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.fillText('光子源', sourceX - 22, sourceY - 35);
      ctx.fillText('双缝', centerX - 12, slitY - 35);
      ctx.fillText('感光屏', centerX - 24, screenTop + screenHeight + 20);

      ctx.fillStyle = 'rgba(99, 102, 241, 0.5)';
      ctx.fillText('明纹', centerX, screenTop - 8);
      ctx.fillStyle = 'rgba(79, 70, 229, 0.4)';
      ctx.fillText('暗纹', centerX - 90, screenTop - 8);
      ctx.fillText('暗纹', centerX + 75, screenTop - 8);
    },
    [photonHits, fringeContrast]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    let running = true;
    const loop = () => {
      if (!running) return;
      drawDoubleSlitExperiment(ctx, rect.width, rect.height);
      animFrameRef.current = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      running = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [drawDoubleSlitExperiment]);

  useEffect(() => {
    setPhotonCountForDisplay(photonHits.length);
  }, [photonHits.length]);

  useEffect(() => {
    if (specialLevelUnlocked && !prevSpecialUnlockedRef.current) {
      prevSpecialUnlockedRef.current = true;
      setShowUnlockModal(true);
      if (onSpecialLevelUnlock) {
        onSpecialLevelUnlock();
      }
    }
    if (!specialLevelUnlocked) {
      prevSpecialUnlockedRef.current = false;
    }
  }, [specialLevelUnlocked, onSpecialLevelUnlock]);

  const contrastColor = fringeContrast >= CONTRAST_THRESHOLD
    ? '#39ff14'
    : fringeContrast >= 50
    ? '#00d4ff'
    : fringeContrast >= 25
    ? '#ff6b35'
    : '#ff2e63';

  return (
    <div className={`relative w-full ${compact ? 'glass-card p-3' : 'glass-card p-5'}`}>
      <div className={`flex items-center justify-between ${compact ? 'mb-2' : 'mb-4'}`}>
        <div className="flex items-center gap-2">
          <Waves className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} text-glow-cyan`} />
          <h3 className={`font-serif font-bold text-white ${compact ? 'text-sm' : 'text-lg'}`}>
            量子史话干涉实验装置
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {specialLevelUnlocked ? (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-glow-green/50 bg-glow-green/15 ${compact ? 'text-[10px]' : 'text-xs'}`}
            >
              <Unlock className={`${compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-glow-green`} />
              <span className="text-glow-green font-bold">特殊关卡已解锁</span>
            </motion.div>
          ) : (
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 ${compact ? 'text-[10px]' : 'text-xs'}`}>
              <Lock className={`${compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-indigo-400`} />
              <span className="text-indigo-400">特殊关卡锁定</span>
            </div>
          )}
        </div>
      </div>

      <div className="relative rounded-xl overflow-hidden mb-4" style={{ border: '1px solid rgba(99, 102, 241, 0.2)' }}>
        <canvas
          ref={canvasRef}
          className="w-full block"
          style={{ height: compact ? '180px' : '280px', background: '#050816' }}
        />
        <AnimatePresence>
          {pendingInterference && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-2 left-1/2 -translate-x-1/2 glass-card-orange px-3 py-1.5 flex items-center gap-2 cursor-pointer hover:bg-glow-orange/20 transition-colors"
              onClick={() => setShowInterferenceInfo(pendingInterference)}
            >
              <Sparkles className="w-3.5 h-3.5 text-glow-orange" />
              <span className="text-xs font-bold text-glow-orange">✨ 科学干涉条纹产生！点击查看</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className={`space-y-3 ${compact ? '' : 'space-y-4'}`}>
        <div>
          <div className={`flex items-center justify-between mb-1.5 ${compact ? 'text-[11px]' : 'text-xs'}`}>
            <span className="text-indigo-300/80 flex items-center gap-1.5">
              <TrendingUp className="w-3 h-3" />
              条纹对比度
            </span>
            <span className="font-mono font-bold" style={{ color: contrastColor, textShadow: `0 0 8px ${contrastColor}88` }}>
              {Math.round(fringeContrast)}% / {CONTRAST_THRESHOLD}%
            </span>
          </div>
          <div className={`w-full bg-quantum-800 rounded-full overflow-hidden ${compact ? 'h-2' : 'h-3'}`}>
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${fringeContrast}%` }}
              transition={{ duration: 0.5 }}
              style={{
                background: `linear-gradient(90deg, #ff2e63, #ff6b35, #00d4ff, ${fringeContrast >= CONTRAST_THRESHOLD ? '#39ff14' : '#9d4edd'})`,
                boxShadow: `0 0 10px ${contrastColor}88`,
              }}
            />
            <div
              className="h-full w-0.5 bg-white/40 relative -top-full pointer-events-none"
              style={{ left: `${CONTRAST_THRESHOLD}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="bg-quantum-800/50 rounded-lg px-2 py-2 text-center">
            <div className={`font-mono font-bold text-glow-cyan ${compact ? 'text-sm' : 'text-lg'}`}>
              {photonCountForDisplay}
            </div>
            <div className={`text-indigo-400/70 ${compact ? 'text-[9px]' : 'text-[10px]'}`}>累积光子</div>
          </div>
          <div className="bg-quantum-800/50 rounded-lg px-2 py-2 text-center">
            <div className={`font-mono font-bold text-glow-purple ${compact ? 'text-sm' : 'text-lg'}`}>
              {totalPhotons}
            </div>
            <div className={`text-indigo-400/70 ${compact ? 'text-[9px]' : 'text-[10px]'}`}>总发射数</div>
          </div>
          <div className="bg-quantum-800/50 rounded-lg px-2 py-2 text-center">
            <div className={`font-mono font-bold text-glow-orange ${compact ? 'text-sm' : 'text-lg'}`}>
              {unlockedInterferenceData.length}
            </div>
            <div className={`text-indigo-400/70 ${compact ? 'text-[9px]' : 'text-[10px]'}`}>科学干涉</div>
          </div>
        </div>

        {!compact && unlockedInterferenceData.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-3.5 h-3.5 text-glow-orange" />
              <span className="text-xs font-medium text-indigo-300">已解锁的科学干涉条纹</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {unlockedInterferenceData.map((inf) => (
                <motion.button
                  key={inf.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowInterferenceInfo(inf)}
                  className="px-2.5 py-1 rounded-lg border border-glow-orange/30 bg-glow-orange/10 text-glow-orange text-[10px] font-medium hover:bg-glow-orange/20 transition-colors flex items-center gap-1"
                >
                  <Eye className="w-3 h-3" />
                  {inf.title.split('：')[0]}
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showInterferenceInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-quantum-950/85 backdrop-blur-sm"
            onClick={() => setShowInterferenceInfo(null)}
          >
            <motion.div
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              className="glass-card-orange p-6 md:p-7 max-w-xl w-full relative"
              style={{ boxShadow: '0 0 50px rgba(255, 107, 53, 0.25)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowInterferenceInfo(null)}
                className="absolute top-4 right-4 text-indigo-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Waves className="w-7 h-7 text-glow-orange" />
                </motion.div>
                <h4 className="text-xl font-bold font-serif text-white">
                  {showInterferenceInfo.title}
                </h4>
              </div>

              {showInterferenceInfo.year && (
                <div className="mb-4">
                  <span className="text-sm text-glow-orange font-mono">
                    📅 {showInterferenceInfo.year}
                  </span>
                </div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-indigo-200/90 leading-relaxed text-sm"
              >
                <p className="mb-4">{showInterferenceInfo.explanation}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-5 pt-4 border-t border-glow-orange/20 text-center"
              >
                <p className="text-xs text-glow-orange">
                  🌊 两条历史思想波线在此产生了建设性干涉！
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showUnlockModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-quantum-950/90 backdrop-blur-md"
            onClick={() => setShowUnlockModal(false)}
          >
            <motion.div
              initial={{ scale: 0.7, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="glass-card p-8 md:p-10 max-w-md w-full relative text-center"
              style={{
                boxShadow: '0 0 80px rgba(57, 255, 20, 0.3), 0 0 120px rgba(57, 255, 20, 0.15)',
                borderColor: 'rgba(57, 255, 20, 0.4)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowUnlockModal(false)}
                className="absolute top-4 right-4 text-indigo-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ delay: 0.1, type: 'spring', damping: 15 }}
                className="w-20 h-20 mx-auto mb-5 rounded-full bg-glow-green/20 border-2 border-glow-green/50 flex items-center justify-center"
                style={{ boxShadow: '0 0 40px rgba(57, 255, 20, 0.5)' }}
              >
                <Unlock className="w-10 h-10 text-glow-green" />
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl md:text-3xl font-bold font-serif text-white mb-2"
                style={{ textShadow: '0 0 20px rgba(57, 255, 20, 0.5)' }}
              >
                🎉 特殊关卡已解锁！
              </motion.h3>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-glow-green mb-1 text-lg font-bold"
              >
                海森堡 · 不确定性原理
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-indigo-300/80 text-sm mb-6 leading-relaxed"
              >
                你的干涉条纹对比度达到了阈值！
                <br />
                当光子一个个累积，波动的本质终将显现。
                <br />
                现在，去挑战量子力学最深刻的原理吧。
              </motion.p>

              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowUnlockModal(false)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-glow-green/50 bg-glow-green/15 text-glow-green font-bold hover:bg-glow-green/25 transition-all"
                style={{ boxShadow: '0 0 20px rgba(57, 255, 20, 0.3)' }}
              >
                <Sparkles className="w-5 h-5" />
                <span>前往挑战</span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InterferenceDevice;
