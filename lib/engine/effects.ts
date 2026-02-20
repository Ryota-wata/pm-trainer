import { DocumentType } from '@/lib/types/document';
import { ChoiceEffects } from '@/lib/types/event';

const emptyEffects: ChoiceEffects = {
  costImpact: 0,
  scheduleImpact: 0,
  earnedValueDelta: 0,
  stakeholderImpacts: [],
  riskImpacts: [],
};

export function getDocumentCompletionBonus(docType: DocumentType): ChoiceEffects {
  const bonuses: Record<DocumentType, ChoiceEffects> = {
    charter: {
      ...emptyEffects,
      earnedValueDelta: 50,
      stakeholderImpacts: [{ stakeholderId: 'takayama', satisfactionDelta: 1 }],
    },
    requirements: {
      ...emptyEffects,
      earnedValueDelta: 50,
      stakeholderImpacts: [
        { stakeholderId: 'tanaka', satisfactionDelta: 1 },
        { stakeholderId: 'sasaki', satisfactionDelta: 1 },
      ],
    },
    wbs: {
      ...emptyEffects,
      earnedValueDelta: 50,
      stakeholderImpacts: [{ stakeholderId: 'nakamura', satisfactionDelta: 1 }],
    },
    schedule: {
      ...emptyEffects,
      earnedValueDelta: 80,
      stakeholderImpacts: [{ stakeholderId: 'tanaka', satisfactionDelta: 1 }],
    },
    'risk-register': {
      ...emptyEffects,
      earnedValueDelta: 50,
      stakeholderImpacts: [{ stakeholderId: 'sasaki', satisfactionDelta: 1 }],
    },
    'change-log': {
      ...emptyEffects,
      earnedValueDelta: 30,
      stakeholderImpacts: [{ stakeholderId: 'tanaka', satisfactionDelta: 1 }],
    },
    'lessons-learned': {
      ...emptyEffects,
      earnedValueDelta: 50,
      qualityImpact: { defectsResolved: 2 },
    },
  };
  return bonuses[docType] || { ...emptyEffects };
}

export function calculatePhaseBonus(completedEventsInPhase: number, totalEventsInPhase: number): ChoiceEffects {
  const ratio = completedEventsInPhase / totalEventsInPhase;
  if (ratio >= 1) return {
    ...emptyEffects,
    earnedValueDelta: 50,
    stakeholderImpacts: [{ stakeholderId: 'takayama', satisfactionDelta: 1 }],
  };
  if (ratio >= 0.75) return {
    ...emptyEffects,
    earnedValueDelta: 20,
  };
  return { ...emptyEffects };
}
