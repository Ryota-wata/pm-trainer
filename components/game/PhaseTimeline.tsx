'use client';

import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/stores/gameStore';
import { PhaseId } from '@/lib/types/game';
import { getPhaseProgress } from '@/lib/engine/gameEngine';

const phases: { id: PhaseId; label: string; icon: string }[] = [
  { id: 'initiation', label: '立上げ', icon: '🚀' },
  { id: 'pre-requirements', label: 'プレ要件', icon: '🔍' },
  { id: 'rom-planning', label: '超概算', icon: '📐' },
  { id: 'requirements', label: '要件定義', icon: '📋' },
  { id: 'estimation', label: '見積', icon: '🧮' },
  { id: 'design-dev', label: '設計開発', icon: '⚙️' },
  { id: 'testing', label: 'テスト', icon: '🧪' },
  { id: 'closing', label: '終結', icon: '🏁' },
];

export default function PhaseTimeline() {
  const router = useRouter();
  const { currentPhase, phases: phaseStates, completedEvents } = useGameStore();

  return (
    <div className="flex items-center gap-1 px-4 py-3 bg-white border-b border-gray-200 overflow-x-auto">
      {phases.map((phase, index) => {
        const state = phaseStates[phase.id];
        const progress = getPhaseProgress(phase.id, completedEvents);
        const isActive = phase.id === currentPhase;
        const isCompleted = state.status === 'completed';
        const isLocked = state.status === 'locked';
        const isClickable = isCompleted || isActive;

        return (
          <div key={phase.id} className="flex items-center">
            <button
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive ? 'bg-blue-50 text-blue-700 ring-2 ring-blue-200' :
                isCompleted ? 'bg-green-50 text-green-700 hover:bg-green-100 hover:ring-2 hover:ring-green-200' :
                'bg-gray-50 text-gray-400'
              } ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
              onClick={isClickable ? () => router.push(`/game/phase/${phase.id}`) : undefined}
              disabled={!isClickable}
            >
              <span className="text-base">{isCompleted ? '✅' : isLocked ? '🔒' : phase.icon}</span>
              <span className="whitespace-nowrap">{phase.label}</span>
              {isActive && (
                <span className="text-xs bg-blue-200 text-blue-800 px-1.5 py-0.5 rounded-full">
                  {progress}%
                </span>
              )}
            </button>
            {index < phases.length - 1 && (
              <div className={`w-6 h-0.5 mx-1 ${isCompleted ? 'bg-green-300' : 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
