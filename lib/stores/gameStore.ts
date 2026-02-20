import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PhaseId, Phase, GameLogEntry, GameState, ProjectState, StakeholderState } from '@/lib/types/game';
import { ChoiceEffects } from '@/lib/types/event';

const PHASE_PV_PER_EVENT: Record<PhaseId, number> = {
  'initiation': 75,
  'pre-requirements': 125,
  'rom-planning': 117,
  'requirements': 250,
  'estimation': 167,
  'design-dev': 583,
  'testing': 333,
  'closing': 125,
};

const initialPhases: Record<PhaseId, Phase> = {
  'initiation': {
    id: 'initiation',
    name: 'Initiation',
    nameJa: '立上げ・要求定義',
    description: 'プロジェクト憲章を作成し、ビジネスニーズと要求を把握する',
    eventIds: ['init-1', 'init-2'],
    requiredDocuments: ['charter'],
    status: 'active',
  },
  'pre-requirements': {
    id: 'pre-requirements',
    name: 'Pre-Requirements',
    nameJa: 'プレ要件定義',
    description: '現状業務を分析し、あるべき姿を定義する',
    eventIds: ['prereq-1', 'prereq-2'],
    requiredDocuments: [],
    status: 'locked',
  },
  'rom-planning': {
    id: 'rom-planning',
    name: 'ROM & PM Planning',
    nameJa: '超概算・PM計画',
    description: '超概算見積とPM計画を策定し、ステークホルダーの合意を得る',
    eventIds: ['rom-1', 'rom-2', 'rom-3'],
    requiredDocuments: ['risk-register'],
    status: 'locked',
  },
  'requirements': {
    id: 'requirements',
    name: 'Requirements',
    nameJa: '要件定義',
    description: '機能要件・非機能要件を定義し、レビューとベンダー選定を行う',
    eventIds: ['req-1', 'req-2', 'req-3'],
    requiredDocuments: ['requirements'],
    status: 'locked',
  },
  'estimation': {
    id: 'estimation',
    name: 'Estimation & Baseline',
    nameJa: '見積・ベースライン',
    description: 'WBS作成、工数算出、山積み・山崩しを行いベースラインを設定する',
    eventIds: ['est-1', 'est-2', 'est-3'],
    requiredDocuments: ['wbs', 'schedule'],
    status: 'locked',
  },
  'design-dev': {
    id: 'design-dev',
    name: 'Design & Development',
    nameJa: '設計・開発',
    description: '基本設計・詳細設計を行い、開発と品質管理を推進する',
    eventIds: ['dev-1', 'dev-2', 'dev-3'],
    requiredDocuments: ['change-log'],
    status: 'locked',
  },
  'testing': {
    id: 'testing',
    name: 'Testing & Release',
    nameJa: 'テスト・リリース',
    description: 'テスト計画・実施、品質問題対応、受入テスト・リリース判定を行う',
    eventIds: ['test-1', 'test-2', 'test-3'],
    requiredDocuments: [],
    status: 'locked',
  },
  'closing': {
    id: 'closing',
    name: 'Closing',
    nameJa: '終結',
    description: 'システムの展開・引渡しを行い、教訓を収集して完了報告する',
    eventIds: ['close-1', 'close-2'],
    requiredDocuments: ['lessons-learned'],
    status: 'locked',
  },
};

const initialStakeholders: StakeholderState[] = [
  { id: 'takayama', name: '高山 誠一', satisfaction: 3, engagement: 'supportive' },
  { id: 'tanaka', name: '田中 美咲', satisfaction: 3, engagement: 'supportive' },
  { id: 'sasaki', name: '佐々木 健太', satisfaction: 3, engagement: 'neutral' },
  { id: 'nakamura', name: '中村 裕子', satisfaction: 3, engagement: 'supportive' },
  { id: 'yamamoto', name: '山本 真理', satisfaction: 3, engagement: 'resistant' },
  { id: 'omori', name: '大森 正義', satisfaction: 3, engagement: 'supportive' },
  { id: 'suzuki', name: '鈴木 大輔', satisfaction: 3, engagement: 'neutral' },
];

const initialProjectState: ProjectState = {
  plannedBudget: 5000,
  actualCost: 0,
  earnedValue: 0,
  plannedValue: 0,
  totalMonths: 12,
  elapsedMonths: 0,
  delayMonths: 0,
  quality: {
    defectsFound: 0,
    defectsResolved: 0,
    reviewsSkipped: 0,
    testCoverage: 'none',
  },
  stakeholders: JSON.parse(JSON.stringify(initialStakeholders)),
  risks: [],
};

function applyEffectsToState(current: ProjectState, effects: ChoiceEffects, phase?: PhaseId, isBaselineSet?: boolean): ProjectState {
  // EVM — ベースライン設定前はコスト・スケジュール・EV/PVを追跡しない
  const trackEvm = !!isBaselineSet;
  const actualCost = trackEvm ? current.actualCost + effects.costImpact : current.actualCost;
  const earnedValue = trackEvm ? current.earnedValue + effects.earnedValueDelta : current.earnedValue;
  const plannedValue = trackEvm && phase
    ? current.plannedValue + PHASE_PV_PER_EVENT[phase]
    : current.plannedValue;

  // Schedule
  const elapsedMonths = trackEvm ? current.elapsedMonths + effects.scheduleImpact : current.elapsedMonths;
  const delayMonths = Math.max(0, elapsedMonths - current.totalMonths);

  // Quality
  const quality = { ...current.quality };
  if (effects.qualityImpact) {
    if (effects.qualityImpact.defectsFound !== undefined) quality.defectsFound += effects.qualityImpact.defectsFound;
    if (effects.qualityImpact.defectsResolved !== undefined) quality.defectsResolved += effects.qualityImpact.defectsResolved;
    if (effects.qualityImpact.reviewsSkipped !== undefined) quality.reviewsSkipped += effects.qualityImpact.reviewsSkipped;
    if (effects.qualityImpact.testCoverage !== undefined) quality.testCoverage = effects.qualityImpact.testCoverage;
  }

  // Stakeholders
  const stakeholders = current.stakeholders.map(s => {
    const impact = effects.stakeholderImpacts.find(i => i.stakeholderId === s.id);
    if (!impact) return s;
    return { ...s, satisfaction: Math.max(1, Math.min(5, s.satisfaction + impact.satisfactionDelta)) };
  });

  // Risks
  const risks = [...current.risks];
  for (const ri of effects.riskImpacts) {
    switch (ri.action) {
      case 'add': {
        if (!risks.find(r => r.id === ri.riskId)) {
          risks.push({
            id: ri.riskId,
            description: ri.description || '',
            probability: ri.probability || 'medium',
            impact: ri.impact || 'medium',
            status: 'identified',
            response: ri.response,
            source: phase || 'document',
          });
        }
        break;
      }
      case 'mitigate': {
        const idx = risks.findIndex(r => r.id === ri.riskId);
        if (idx >= 0) risks[idx] = { ...risks[idx], status: 'mitigated', response: ri.response || risks[idx].response };
        break;
      }
      case 'occur': {
        const idx = risks.findIndex(r => r.id === ri.riskId);
        if (idx >= 0) risks[idx] = { ...risks[idx], status: 'occurred' };
        break;
      }
      case 'close': {
        const idx = risks.findIndex(r => r.id === ri.riskId);
        if (idx >= 0) risks[idx] = { ...risks[idx], status: 'closed' };
        break;
      }
    }
  }

  return {
    ...current,
    actualCost,
    earnedValue,
    plannedValue,
    elapsedMonths,
    delayMonths,
    quality,
    stakeholders,
    risks,
  };
}

interface GameStore extends GameState {
  startGame: () => void;
  resetGame: () => void;
  setCurrentEvent: (eventId: string | null) => void;
  completeEvent: (eventId: string, choiceId: string, effects: ChoiceEffects, description: string) => void;
  advancePhase: () => void;
  applyChoiceEffects: (effects: ChoiceEffects) => void;
  completeGame: () => void;
}

const phaseOrder: PhaseId[] = ['initiation', 'pre-requirements', 'rom-planning', 'requirements', 'estimation', 'design-dev', 'testing', 'closing'];

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      currentPhase: 'initiation' as PhaseId,
      phases: { ...initialPhases },
      projectState: JSON.parse(JSON.stringify(initialProjectState)),
      completedEvents: [],
      currentEventId: null,
      isGameStarted: false,
      isGameCompleted: false,
      log: [],

      startGame: () => set({
        isGameStarted: true,
        currentPhase: 'initiation' as PhaseId,
        phases: JSON.parse(JSON.stringify(initialPhases)),
        projectState: JSON.parse(JSON.stringify(initialProjectState)),
        completedEvents: [],
        currentEventId: null,
        isGameCompleted: false,
        log: [],
      }),

      resetGame: () => set({
        isGameStarted: true,
        currentPhase: 'initiation' as PhaseId,
        phases: JSON.parse(JSON.stringify(initialPhases)),
        projectState: JSON.parse(JSON.stringify(initialProjectState)),
        completedEvents: [],
        currentEventId: null,
        isGameCompleted: false,
        log: [],
      }),

      setCurrentEvent: (eventId) => set({ currentEventId: eventId }),

      completeEvent: (eventId, choiceId, effects, description) => {
        const state = get();
        const isBaselineSet = state.completedEvents.includes('est-3');
        let newProjectState = applyEffectsToState(state.projectState, effects, state.currentPhase, isBaselineSet);

        // est-3完了 = ベースライン設定 → 計画フェーズ分のPV/EVを初期化してEVM開始
        if (eventId === 'est-3') {
          const preBaselinePhases: PhaseId[] = ['initiation', 'pre-requirements', 'rom-planning', 'requirements', 'estimation'];
          let baselinePV = 0;
          for (const ph of preBaselinePhases) {
            const phaseData = initialPhases[ph];
            baselinePV += PHASE_PV_PER_EVENT[ph] * phaseData.eventIds.length;
          }
          // 計画フェーズは完了済みなので EV = PV、AC = PV（計画通り）
          newProjectState = {
            ...newProjectState,
            plannedValue: baselinePV,
            earnedValue: baselinePV,
            actualCost: baselinePV,
            elapsedMonths: 5, // 計画フェーズに5ヶ月経過（立上げ〜見積）
          };
        }

        const entry: GameLogEntry = {
          timestamp: Date.now(),
          phase: state.currentPhase,
          eventId,
          choiceId,
          description,
        };
        set({
          completedEvents: [...state.completedEvents, eventId],
          projectState: newProjectState,
          currentEventId: null,
          log: [...state.log, entry],
        });
      },

      advancePhase: () => {
        const state = get();
        const currentIndex = phaseOrder.indexOf(state.currentPhase);
        if (currentIndex >= phaseOrder.length - 1) return;

        const nextPhase = phaseOrder[currentIndex + 1];
        const updatedPhases = { ...state.phases };
        updatedPhases[state.currentPhase] = { ...updatedPhases[state.currentPhase], status: 'completed' };
        updatedPhases[nextPhase] = { ...updatedPhases[nextPhase], status: 'active' };

        set({
          currentPhase: nextPhase,
          phases: updatedPhases,
        });
      },

      applyChoiceEffects: (effects) => {
        const state = get();
        const newProjectState = applyEffectsToState(state.projectState, effects);
        set({ projectState: newProjectState });
      },

      completeGame: () => set({ isGameCompleted: true }),
    }),
    {
      name: 'pm-trainer-game',
      version: 2,
      migrate: () => {
        // Reset all old save data when migrating to version 2
        return {
          currentPhase: 'initiation' as PhaseId,
          phases: JSON.parse(JSON.stringify(initialPhases)),
          projectState: JSON.parse(JSON.stringify(initialProjectState)),
          completedEvents: [],
          currentEventId: null,
          isGameStarted: false,
          isGameCompleted: false,
          log: [],
        };
      },
    }
  )
);
