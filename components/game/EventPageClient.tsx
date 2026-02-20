'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/stores/gameStore';
import { useDocumentStore } from '@/lib/stores/documentStore';
import { getEventById } from '@/lib/engine/gameEngine';
import { EventChoice } from '@/lib/types/event';
import { ProjectState } from '@/lib/types/game';
import { DocumentType } from '@/lib/types/document';
import DialogueBox from '@/components/game/DialogueBox';
import ChoicePanel from '@/components/game/ChoicePanel';
import ChoiceResultPanel from '@/components/game/ChoiceResultPanel';
import MetricsPanel from '@/components/game/MetricsPanel';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export default function EventPageClient() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.eventId as string;
  const { projectState, completeEvent, completedEvents, log } = useGameStore();
  const { unlockDocument } = useDocumentStore();

  const isAlreadyCompleted = completedEvents.includes(eventId);
  const isBaselineSet = completedEvents.includes('est-3');
  const logEntry = useMemo(() => log.find(l => l.eventId === eventId), [log, eventId]);

  const [pageState, setPageState] = useState<'dialogue' | 'result'>(isAlreadyCompleted ? 'result' : 'dialogue');
  const [selectedChoice, setSelectedChoice] = useState<EventChoice | null>(null);
  const [previousProjectState, setPreviousProjectState] = useState<ProjectState>(projectState);
  const [visibleDialogues, setVisibleDialogues] = useState(0);

  const event = getEventById(eventId);

  // For completed events, find the choice that was selected from the log
  const completedChoiceId = logEntry?.choiceId;
  const completedChoice = useMemo(
    () => event?.choices.find(c => c.id === completedChoiceId) ?? null,
    [event, completedChoiceId]
  );

  useEffect(() => {
    if (event && !isAlreadyCompleted && pageState === 'dialogue') {
      const timer = setInterval(() => {
        setVisibleDialogues(prev => {
          if (prev >= event.dialogue.length) {
            clearInterval(timer);
            return prev;
          }
          return prev + 1;
        });
      }, 600);
      return () => clearInterval(timer);
    }
    if (isAlreadyCompleted && event) {
      setVisibleDialogues(event.dialogue.length);
    }
  }, [event, pageState, isAlreadyCompleted]);

  if (!event) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">イベントが見つかりません。</p>
        <Button variant="ghost" onClick={() => router.back()} className="mt-4">戻る</Button>
      </div>
    );
  }

  const handleChoiceSelect = (choice: EventChoice) => {
    setPreviousProjectState(JSON.parse(JSON.stringify(projectState)));
    setSelectedChoice(choice);
    completeEvent(eventId, choice.id, choice.effects, choice.text);
    if (event.unlockDocument) {
      unlockDocument(event.unlockDocument as DocumentType);
    }
    setPageState('result');
  };

  const allDialoguesVisible = visibleDialogues >= event.dialogue.length;
  const activeChoiceId = selectedChoice?.id ?? completedChoiceId ?? '';

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>← 戻る</Button>
        {isAlreadyCompleted && !selectedChoice && (
          <Badge variant="success" size="md">完了済み（閲覧モード）</Badge>
        )}
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{event.title}</h1>
        <p className="text-sm text-gray-500">{event.description}</p>
        <p className="text-xs text-gray-400 mt-1">{event.category}</p>
      </div>

      <div className="space-y-3 mb-8">
        {event.dialogue.slice(0, visibleDialogues).map((line, index) => (
          <DialogueBox key={index} line={line} index={isAlreadyCompleted ? 0 : index} />
        ))}
      </div>

      {/* Active choice selection (not yet completed) */}
      {pageState === 'dialogue' && allDialoguesVisible && !isAlreadyCompleted && (
        <div className="animate-fade-in">
          <ChoicePanel choices={event.choices} onSelect={handleChoiceSelect} />
        </div>
      )}

      {/* Result view: after just choosing OR reviewing a completed event */}
      {(pageState === 'result' || isAlreadyCompleted) && activeChoiceId && (
        <div className="space-y-6 animate-fade-in">
          {/* Choice comparison panel showing all choices */}
          <ChoiceResultPanel choices={event.choices} selectedChoiceId={activeChoiceId} />

          {/* Metric changes (only show after baseline is set and when just made the choice) */}
          {selectedChoice && isBaselineSet && (
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span>📊</span> プロジェクト状態の変化
              </h3>
              <MetricsPanel projectState={projectState} previousProjectState={previousProjectState} />
            </Card>
          )}

          {/* Document unlock notification */}
          {selectedChoice && event.unlockDocument && (
            <Card className="p-4 bg-green-50 border-green-200">
              <p className="text-green-700 text-sm font-medium flex items-center gap-2">
                <span>📄</span> ドキュメントがアンロックされました！
                <Button size="sm" variant="ghost" className="text-green-700 underline ml-auto" onClick={() => router.push(`/game/document/${event.unlockDocument}`)}>
                  作成する →
                </Button>
              </p>
            </Card>
          )}

          <div className="flex justify-center">
            <Button onClick={() => router.back()}>
              フェーズに戻る
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
