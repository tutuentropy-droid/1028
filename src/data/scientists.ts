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
  {
    id: 'schrodinger',
    name: '埃尔温·薛定谔',
    nameEn: 'Erwin Schrödinger',
    years: '1887 - 1961',
    contribution: '波动力学创始人 · 薛定谔方程 · 薛定谔的猫',
    accentColor: 'purple',
    concept: {
      title: '薛定谔方程',
      formula: 'iħ ∂Ψ/∂t = ĤΨ',
      formulaParts: {
        left: 'iħ ∂Ψ/∂t = ',
        blank: 'Ĥ',
        right: 'Ψ',
      },
      description: '1926年，薛定谔提出了描述微观粒子运动状态的基本方程——薛定谔方程。方程中的波函数 Ψ 描述了粒子的量子态，它可以处于多个本征态的线性叠加之中。',
      history: '薛定谔的波动力学与海森堡的矩阵力学是等价的，但波动方程的形式更加直观，迅速成为量子力学的标准工具。为了说明叠加态的奇特之处，薛定谔提出了著名的"猫"思想实验：在观测之前，猫同时处于"活"和"死"的叠加态。这个悖论至今仍在引发关于量子力学诠释的深刻讨论。',
    },
    puzzle: {
      type: 'schrodinger-quiz',
      title: '薛定谔的叠加态挑战',
      instruction: '两个答案处于量子叠加态，它们会左右振荡。在波函数坍缩前做出选择吧！答对将提升你的"叠加正确率"。连续三次叠加态猜中可获得猫咪奖励！',
      targets: [],
      options: [
        { id: 'ans-correct', label: '波函数 Ψ 描述粒子的量子态', value: '波函数是复数函数，其模方表示概率密度' },
        { id: 'distractor-1', label: '波函数总是实数函数', value: '所有量子态都必须是实数' },
      ],
      question: '根据薛定谔的量子力学，波函数 Ψ 的物理意义是什么？',
      correctAnswerId: 'ans-correct',
      distractors: [
        { id: 'distractor-2', label: '波函数直接代表粒子的空间位置', value: 'Ψ 就是粒子的坐标函数' },
        { id: 'distractor-3', label: '波函数没有物理意义', value: 'Ψ 只是一个数学工具，没有实际意义' },
      ],
    },
    recording: {
      title: '历史录音 · 薛定谔的猫',
      speaker: '埃尔温·薛定谔',
      year: '1952年 私人访谈',
      text: '我那只可怜的猫啊，它既是活的又是死的，直到有人打开盒子去看它。这听起来荒谬绝伦，但这正是量子力学告诉我们的。微观粒子可以同时处于多个状态的叠加之中，只有在被测量时，波函数才会"坍缩"到一个确定的状态。我提出这个思想实验，是想说明量子力学的哥本哈根诠释有多么反直觉。然而几十年过去了，这个悖论依然没有得到完全解决。也许我们永远无法理解量子世界——我们只能计算它，接受它，然后学会与它共处。对了，如果你连续三次在波函数坍缩前猜对了，记得给那只猫一些鱼干，它 deserves it。',
    },
  },
  {
    id: 'bell',
    name: '约翰·贝尔',
    nameEn: 'John Stewart Bell',
    years: '1928 - 1990',
    contribution: '量子纠缠 · 贝尔不等式 · 量子非定域性',
    accentColor: 'cyan',
    concept: {
      title: '贝尔不等式',
      formula: '|P(a,b) - P(a,c)| ≤ 1 + P(b,c)',
      formulaParts: {
        left: '|P(a,b) - P(a,c)| ≤ ',
        blank: '1',
        right: ' + P(b,c)',
      },
      description: '1964年，约翰·贝尔提出了著名的贝尔不等式，为量子纠缠的争论提供了可实验验证的判据。如果不等式被违反，就说明定域实在论是错误的，量子纠缠确实存在"幽灵般的超距作用"。',
      history: '自从爱因斯坦提出EPR佯谬以来，关于量子纠缠的争论一直停留在哲学层面。贝尔将这个哲学问题转化为一个可以用实验检验的数学不等式。此后的一系列实验，包括阿斯佩实验和2015年的无漏洞实验，都确凿地证明了贝尔不等式被违反——量子世界确实是非定域的。这一发现为量子计算、量子密码学等量子信息科学奠定了基础。',
    },
    puzzle: {
      type: 'entanglement-match',
      title: '量子纠缠 · 时空配对',
      instruction: '将左侧的历史事件与右侧的现代量子概念进行配对。每正确配对三次，解锁一篇量子力学家的八卦轶事！',
      targets: [
        { id: 'hist-solvay', label: '1927 索尔维会议', correctOptionId: 'opt-copenhagen' },
        { id: 'hist-epr', label: '1935 EPR佯谬', correctOptionId: 'opt-spooky' },
        { id: 'hist-bell', label: '1964 贝尔定理', correctOptionId: 'opt-local-realism' },
        { id: 'hist-aspect', label: '1982 阿斯佩实验', correctOptionId: 'opt-violation' },
        { id: 'hist-teleport', label: '1997 量子隐形传态', correctOptionId: 'opt-quantum-info' },
        { id: 'hist-loophole', label: '2015 无漏洞实验', correctOptionId: 'opt-entanglement-proven' },
      ],
      options: [
        { id: 'opt-copenhagen', label: '哥本哈根诠释', value: '量子力学的标准诠释' },
        { id: 'opt-spooky', label: '幽灵般的超距作用', value: '爱因斯坦对纠缠的描述' },
        { id: 'opt-local-realism', label: '定域实在论的终结', value: '贝尔不等式的物理意义' },
        { id: 'opt-violation', label: '贝尔不等式违反', value: '实验证实量子非定域性' },
        { id: 'opt-quantum-info', label: '量子信息科学', value: '量子态的传输与处理' },
        { id: 'opt-entanglement-proven', label: '量子纠缠确定性', value: '无漏洞实验的结论' },
      ],
    },
    recording: {
      title: '历史录音 · 贝尔的思考',
      speaker: '约翰·贝尔',
      year: '1980年代 访谈',
      text: '当我第一次想到那个不等式的时候，我并没有意识到它会变得如此重要。我只是想，如果爱因斯坦是对的，如果世界真的是定域实在的，那会怎么样？我发现，如果是那样的话，某些关联就不可能超过一个特定的界限——这就是贝尔不等式。而如果量子力学是对的，这个不等式就会被违反。这就把一个哲学争论变成了一个可以用实验来回答的问题。实验结果出来的时候，我必须承认，我有一点失望。我曾私下里希望爱因斯坦是对的。但实验就是实验——自然比我们的直觉更奇妙。量子纠缠是真实的，这个世界比我们想象的更加不可思议。',
    },
    anecdotes: [
      {
        id: 'anecdote-1',
        title: '薛定谔的猫：一个讽刺性的思想实验',
        scientist: '埃尔温·薛定谔',
        year: '1935年',
        content: '很多人以为薛定谔是想用"猫"来说明量子力学有多么正确，但事实恰恰相反。薛定谔提出这个思想实验，是为了讽刺哥本哈根诠释的荒谬之处——他想说："看，如果量子力学是对的，那猫就会既死又活，这显然很可笑对吧？"他原本是站在爱因斯坦这边，反对量子力学的哥本哈根诠释的。但没想到的是，这个本来用于"归谬"的思想实验，反而成了量子力学最著名的"代言人"。薛定谔如果泉下有知，大概会哭笑不得。',
      },
      {
        id: 'anecdote-2',
        title: '泡利：物理学界的"上帝之鞭"',
        scientist: '沃尔夫冈·泡利',
        year: '1920-1950年代',
        content: '泡利是出了名的尖酸刻薄，对谁都不留情面。据说有一次，一位年轻物理学家给泡利看自己的论文，泡利看完后说："这不对，这甚至连错误都算不上。"（This isn\'t right. This isn\'t even wrong.）这句话后来成了科学界的经典吐槽。还有一次，爱因斯坦在索尔维会议上提出一个思想实验来质疑量子力学，玻尔一时答不上来，泡利却在旁边冷冷地说："别急，如果爱因斯坦错了，我们会知道的。更重要的是，如果他对了，我们也会知道。"不过泡利虽然毒舌，但判断力惊人地准确，被称为"物理学的良心"。',
      },
      {
        id: 'anecdote-3',
        title: '玻尔与爱因斯坦的世纪辩论',
        scientist: '尼尔斯·玻尔 & 阿尔伯特·爱因斯坦',
        year: '1927-1935年',
        content: '在1927年和1930年的索尔维会议上，爱因斯坦和玻尔展开了物理学史上最著名的辩论。爱因斯坦每次都精心设计一个思想实验，试图证明量子力学有漏洞。第一天会议结束时，爱因斯坦信心满满地提出自己的质疑，玻尔则眉头紧锁、一言不发。但第二天早上，玻尔总是能给出完美的反驳。最精彩的一次是1930年，爱因斯坦搬出了自己最得意的相对论来"收拾"量子力学，结果玻尔想了一整晚，居然用爱因斯坦自己的广义相对论把他反驳了回去。这段历史被称为"物理学的神仙打架"。',
      },
      {
        id: 'anecdote-4',
        title: '费曼的保险箱与恶作剧之王',
        scientist: '理查德·费曼',
        year: '1940年代 曼哈顿计划期间',
        content: '费曼不仅是诺贝尔奖级的物理学家，还是个恶作剧大王。在曼哈顿计划期间，所有文件都锁在保密柜里。费曼觉得保险箱密码太简单了，就经常偷偷打开别人的柜子，留个纸条"猜猜是谁干的"，再锁回去，搞得大家人心惶惶。他还学会了开保险柜锁，最快只需要几分钟。后来安保人员知道了，不但没惩罚他，反而请他来改进安全系统。除了撬锁，费曼还擅长打鼓、画裸体画、在脱衣舞俱乐部做物理研究——他的人生信条是："物理学不仅仅是关于自然的学问，更是关于人类如何理解自然的学问。"',
      },
    ],
  },
];

export const getScientistById = (id: string): Scientist | undefined => {
  return scientists.find((s) => s.id === id);
};
