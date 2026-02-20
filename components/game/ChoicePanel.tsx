'use client';

import { useState } from 'react';
import { EventChoice } from '@/lib/types/event';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface ChoicePanelProps {
  choices: EventChoice[];
  onSelect: (choice: EventChoice) => void;
  disabled?: boolean;
}

export default function ChoicePanel({ choices, onSelect, disabled }: ChoicePanelProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
        <span>🤔</span> あなたの判断は？
      </h3>
      {choices.map((choice, index) => (
        <Card
          key={choice.id}
          hover={!disabled}
          className={`p-4 transition-all ${
            selectedId === choice.id ? 'ring-2 ring-blue-400 bg-blue-50' : ''
          } ${disabled ? 'opacity-60' : ''}`}
          onClick={() => !disabled && setSelectedId(choice.id)}
        >
          <div className="flex items-start gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold">
              {String.fromCharCode(65 + index)}
            </span>
            <p className="text-sm text-gray-700 flex-1">{choice.text}</p>
          </div>
        </Card>
      ))}
      {selectedId && !disabled && (
        <div className="flex justify-end animate-fade-in">
          <Button onClick={() => {
            const choice = choices.find(c => c.id === selectedId);
            if (choice) onSelect(choice);
          }}>
            この判断で進める
          </Button>
        </div>
      )}
    </div>
  );
}
