import { PhaseId, QualityRecord } from './game';

export interface ChoiceEffects {
  costImpact: number;              // 万円（実コスト増減）
  scheduleImpact: number;          // 月（遅延/短縮）
  earnedValueDelta: number;        // 万円（獲得出来高）
  stakeholderImpacts: { stakeholderId: string; satisfactionDelta: number }[];
  riskImpacts: { action: 'add' | 'mitigate' | 'occur' | 'close'; riskId: string; description?: string; probability?: 'high' | 'medium' | 'low'; impact?: 'high' | 'medium' | 'low'; response?: string }[];
  qualityImpact?: Partial<QualityRecord>;
}

export interface EventChoice {
  id: string;
  text: string;
  effects: ChoiceEffects;
  feedback: string;
  pmbokReference: string;
}

export interface DialogueLine {
  speaker: string;
  speakerId: string;
  text: string;
  emotion?: 'neutral' | 'happy' | 'angry' | 'worried' | 'surprised';
}

export interface GameEvent {
  id: string;
  phase: PhaseId;
  title: string;
  description: string;
  category: string;
  dialogue: DialogueLine[];
  choices: EventChoice[];
  unlockDocument?: string;
  isRequired: boolean;
  order: number;
}
