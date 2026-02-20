export type PhaseId = 'initiation' | 'pre-requirements' | 'rom-planning' | 'requirements' | 'estimation' | 'design-dev' | 'testing' | 'closing';

export type PhaseStatus = 'locked' | 'active' | 'completed';

export interface Phase {
  id: PhaseId;
  name: string;
  nameJa: string;
  description: string;
  eventIds: string[];
  requiredDocuments: string[];
  status: PhaseStatus;
}

export interface StakeholderState {
  id: string;
  name: string;
  satisfaction: number;       // 1-5 (PMBOKエンゲージメントレベル準拠)
  engagement: 'unaware' | 'resistant' | 'neutral' | 'supportive' | 'leading';
}

export interface ProjectRisk {
  id: string;
  description: string;
  probability: 'high' | 'medium' | 'low';
  impact: 'high' | 'medium' | 'low';
  status: 'identified' | 'mitigated' | 'occurred' | 'closed';
  response?: string;
  source: string;
}

export interface QualityRecord {
  defectsFound: number;
  defectsResolved: number;
  reviewsSkipped: number;
  testCoverage: 'full' | 'partial' | 'minimal' | 'none';
}

export interface ProjectState {
  // EVM
  plannedBudget: number;    // BAC: 5000万
  actualCost: number;       // AC
  earnedValue: number;      // EV
  plannedValue: number;     // PV
  // Schedule
  totalMonths: number;      // 12
  elapsedMonths: number;
  delayMonths: number;
  // Quality
  quality: QualityRecord;
  // Stakeholders (7名個別)
  stakeholders: StakeholderState[];
  // Risks (動的に増減)
  risks: ProjectRisk[];
}

export interface GameState {
  currentPhase: PhaseId;
  phases: Record<PhaseId, Phase>;
  projectState: ProjectState;
  completedEvents: string[];
  currentEventId: string | null;
  isGameStarted: boolean;
  isGameCompleted: boolean;
  log: GameLogEntry[];
}

export interface GameLogEntry {
  timestamp: number;
  phase: PhaseId;
  eventId: string;
  choiceId: string;
  description: string;
}
