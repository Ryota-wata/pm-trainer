'use client';

import { DialogueLine } from '@/lib/types/event';
import { getStakeholder } from '@/lib/data/stakeholders';

interface DialogueBoxProps {
  line: DialogueLine;
  index: number;
}

const emotionStyle: Record<string, string> = {
  neutral: '',
  happy: 'border-l-green-400',
  angry: 'border-l-red-400',
  worried: 'border-l-yellow-400',
  surprised: 'border-l-purple-400',
};

export default function DialogueBox({ line, index }: DialogueBoxProps) {
  const stakeholder = getStakeholder(line.speakerId);
  const borderColor = emotionStyle[line.emotion || 'neutral'] || '';

  return (
    <div
      className={`flex gap-3 p-4 rounded-lg bg-gray-50 border-l-4 ${borderColor || 'border-l-blue-400'} animate-fade-in`}
      style={{ animationDelay: `${index * 0.15}s`, animationFillMode: 'both' }}
    >
      <div className="shrink-0">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${stakeholder?.color || 'bg-gray-400'} text-white`}>
          {stakeholder?.avatar || '👤'}
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-sm text-gray-900">{line.speaker}</span>
          {stakeholder && (
            <span className="text-xs text-gray-400">{stakeholder.role}</span>
          )}
        </div>
        <p className="text-gray-700 text-sm leading-relaxed">{line.text}</p>
      </div>
    </div>
  );
}
