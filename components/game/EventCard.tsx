'use client';

import { GameEvent } from '@/lib/types/event';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

interface EventCardProps {
  event: GameEvent;
  isCompleted: boolean;
  onClick: () => void;
}

export default function EventCard({ event, isCompleted, onClick }: EventCardProps) {
  return (
    <Card
      hover
      className={`p-4 ${isCompleted ? 'bg-gray-50' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{isCompleted ? '✅' : '📌'}</span>
            <h3 className={`font-semibold ${isCompleted ? 'text-gray-600' : 'text-gray-900'}`}>
              {event.title}
            </h3>
          </div>
          <p className="text-sm text-gray-500 ml-8">{event.description}</p>
          {isCompleted && (
            <p className="text-xs text-blue-500 ml-8 mt-1">クリックして内容を確認 →</p>
          )}
        </div>
        <Badge variant={isCompleted ? 'success' : 'info'} size="sm">
          {isCompleted ? '完了' : event.category}
        </Badge>
      </div>
    </Card>
  );
}
