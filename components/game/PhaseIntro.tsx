'use client';

import { Phase } from '@/lib/types/game';

interface PhaseIntroProps {
  phase: Phase;
}

const phaseIcons: Record<string, string> = {
  'initiation': '🚀',
  'pre-requirements': '🔍',
  'rom-planning': '📐',
  'requirements': '📋',
  'estimation': '🧮',
  'design-dev': '⚙️',
  'testing': '🧪',
  'closing': '🏁',
};

export default function PhaseIntro({ phase }: PhaseIntroProps) {
  return (
    <div className="text-center py-8 animate-fade-in">
      <div className="text-5xl mb-4">{phaseIcons[phase.id] || '📌'}</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{phase.nameJa}</h1>
      <p className="text-sm text-gray-400 mb-2">{phase.name}</p>
      <p className="text-gray-600 max-w-md mx-auto">{phase.description}</p>
    </div>
  );
}
