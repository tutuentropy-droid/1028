import type { Scientist } from '@/types';

export const scientists: Scientist[] = [
  {
    id: 'planck',
    name: '马克斯·普朗克',
    nameEn: 'Max Planck',
    years: '1858 - 1947',
    contribution: '量子力学奠基人 · 能量量子化假说',
    accentColor: 'cyan',
    concept: {
      title: '能量量子化',
      formula: 'E = hν',
      formulaParts: {
        left: 'E = ',
        blank: 'h',
        right: 'ν',
      },
      description: '1900年，普朗克在研究黑体辐射时，提出了一个革命性的假说：能量不是连续的，而是以一个个"能量子"的形式存在。每个能量子的能量等于普朗克常数 h 乘以频率 ν。',
      history: '在19世纪末，经典物理学无法解释黑体辐射的紫外灾难。普朗克被迫假设能量是量子化的，他自己也认为这只是一个数学技巧，但这一假设却开启了量子力学的大门。普朗克常数 h = 6.626 × 10^-34 J·s 成为了量子世界的基本尺度。',
    },
    puzzle: {
      type: 'drag-number',
      title: '量子谜题 · 能量子拖拽',
      instruction: '将正确的能量子数值拖入公式中的空缺位置，完成普朗克能量公式。',
      targets: [
        { id: 'blank-h', label: '普朗克常数 h', correctOptionId: 'opt-6626' },
      ],
      options: [
        { id: 'opt-6626', label: '6.626 × 10⁻³⁴', value: '6.626 × 10⁻³⁴ J·s' },
        { id: 'opt-314', label: '3.1416', value: '3.1416' },
        { id: 'opt-98', label: '9.8', value: '9.8 m/s²' },
        { id: 'opt-299', label: '2.998 × 10⁸', value: '2.998 × 10⁸ m/s' },
      ],
    },
    recording: {
      title: '历史录音 · 普朗克的演讲',
      speaker: '马克斯·普朗克',
      year: '1920年 诺贝尔奖演讲',
      text: '我发现，能量的发射和吸收不是连续的过程，而是以离散的量子形式进行的。这个发现完全出乎我的意料，我曾试图将它纳入经典理论的框架，但都失败了。现在我明白了，这是一个全新的物理世界的入口。在这个量子的世界里，我们所熟悉的连续变化的观念不再适用，取而代之的是跳跃式的、不连续的变化。我相信，未来的物理学家们将在这条道路上发现更多令人惊叹的真理。',
    },
  },
  {
    id: 'einstein',
    name: '阿尔伯特·爱因斯坦',
    nameEn: 'Albert Einstein',
    years: '1879 - 1955',
    contribution: '光量子假说 · 光电效应解释',
    accentColor: 'purple',
    concept: {
      title: '光量子',
      formula: 'E = hν',
      formulaParts: {
        left: 'E = ',
        blank: 'h',
        right: 'ν （光子能量）',
      },
      description: '1905年，爱因斯坦将普朗克的量子假说推广到光本身。他提出光不仅在发射和吸收时是量子化的，光本身就是由一个个"光量子"（光子）组成的。每个光子的能量 E = hν。',
      history: '光电效应实验显示，光的强度不影响能否打出电子，只有光的频率决定一切。经典波动理论无法解释这一现象。爱因斯坦的光量子假说完美解释了光电效应：每个光子携带一份能量，只有频率足够高（能量足够大）的光子才能打出电子。这一发现为爱因斯坦赢得了1921年的诺贝尔物理学奖。',
    },
    puzzle: {
      type: 'photon-match',
      title: '量子谜题 · 光子匹配',
      instruction: '将光子（左侧）与其对应的频率和能量效果（右侧）进行匹配。注意：频率越高，能量越大！',
      targets: [
        { id: 'target-red', label: '🔴 红光', correctOptionId: 'opt-low' },
        { id: 'target-green', label: '🟢 绿光', correctOptionId: 'opt-mid' },
        { id: 'target-uv', label: '💜 紫外线', correctOptionId: 'opt-high' },
      ],
      options: [
        { id: 'opt-low', label: '低频率 · 无法打出电子', value: 'low' },
        { id: 'opt-mid', label: '中频率 · 打出慢速电子', value: 'mid' },
        { id: 'opt-high', label: '高频率 · 打出快速电子', value: 'high' },
      ],
    },
    recording: {
      title: '历史录音 · 爱因斯坦的思考',
      speaker: '阿尔伯特·爱因斯坦',
      year: '1951年 私人信件',
      text: '关于光量子，我已经思考了整整五十年，但直到今天，我仍然不能说我完全理解了它。光究竟是波还是粒子？这个问题困扰着我，也困扰着整个物理学界。有时候我觉得我已经找到了答案，但很快我又陷入了更深的困惑。我相信，量子理论中隐藏着我们尚未理解的更深层的真理。年轻人啊，请不要以为你理解了量子力学——如果你说你理解了，那只能说明你还没有真正理解它。',
    },
  },
  {
    id: 'bohr',
    name: '尼尔斯·玻尔',
    nameEn: 'Niels Bohr',
    years: '1885 - 1962',
    contribution: '原子结构模型 · 量子化轨道',
    accentColor: 'orange',
    concept: {
      title: '玻尔原子模型',
      formula: 'Eₙ = -13.6eV / n²',
      formulaParts: {
        left: 'Eₙ = -13.6eV / ',
        blank: 'n',
        right: '²',
      },
      description: '1913年，玻尔提出了原子结构的量子化模型。电子只能在特定的轨道上运动，这些轨道对应着确定的能量级。当电子从高能级跃迁到低能级时，会发射出一个光子，其能量等于两个能级的差。',
      history: '卢瑟福的行星模型无法解释原子为何稳定——按照经典电磁学，绕核运动的电子会辐射能量并最终坠毁。玻尔大胆假设电子只能在量子化的轨道上存在，轨道的角动量是 h/2π 的整数倍。n=1 是基态，能量最低最稳定。这一模型成功解释了氢原子的光谱线。',
    },
    puzzle: {
      type: 'drag-orbit',
      title: '量子谜题 · 电子轨道',
      instruction: '将电子拖拽到正确的轨道上。从内到外依次是 n=1, n=2, n=3 轨道，能量依次升高。',
      targets: [
        { id: 'orbit-n1', label: 'n=1 基态', correctOptionId: 'electron-1' },
        { id: 'orbit-n2', label: 'n=2 激发态', correctOptionId: 'electron-2' },
        { id: 'orbit-n3', label: 'n=3 激发态', correctOptionId: 'electron-3' },
      ],
      options: [
        { id: 'electron-1', label: '电子 e⁻ (最低能量)', value: 'n=1' },
        { id: 'electron-2', label: '电子 e⁻ (中等能量)', value: 'n=2' },
        { id: 'electron-3', label: '电子 e⁻ (最高能量)', value: 'n=3' },
      ],
    },
    recording: {
      title: '历史录音 · 玻尔的原子',
      speaker: '尼尔斯·玻尔',
      year: '1922年 诺贝尔奖演讲',
      text: '当我第一次想到原子中的电子只能在特定轨道上运动时，我感到一阵眩晕。如果这是真的，那么我们对物质的理解将发生根本性的改变。电子不再是一颗微小的行星，而是一种奇异的量子存在。它只能从一个能级跳跃到另一个能级，中间没有过渡——这就是量子跃迁。我们必须接受这个事实：在原子的尺度上，我们日常的直觉和经典物理学都不再适用。物理学需要全新的语言，全新的思维方式。',
    },
  },
];

export const getScientistById = (id: string): Scientist | undefined => {
  return scientists.find((s) => s.id === id);
};
