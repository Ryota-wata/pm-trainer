'use client';

import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/stores/gameStore';
import { useDocumentStore } from '@/lib/stores/documentStore';
import { PhaseId } from '@/lib/types/game';
import { getEventsByPhase, isPhaseComplete } from '@/lib/engine/gameEngine';
import PhaseIntro from '@/components/game/PhaseIntro';
import EventCard from '@/components/game/EventCard';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { DocumentType } from '@/lib/types/document';

const docNames: Record<DocumentType, string> = {
  charter: 'プロジェクト憲章',
  requirements: '要件定義書',
  wbs: 'WBS',
  schedule: 'スケジュール',
  'risk-register': 'リスク登録簿',
  'change-log': '変更管理記録',
  'lessons-learned': '教訓登録簿',
};

interface PhasePageProps {
  phaseId: PhaseId;
}

export default function PhasePage({ phaseId }: PhasePageProps) {
  const router = useRouter();
  const { phases, completedEvents, advancePhase, currentPhase } = useGameStore();
  const { documents, unlockedDocuments } = useDocumentStore();
  const phase = phases[phaseId];
  const events = getEventsByPhase(phaseId);
  const canAdvance = isPhaseComplete(phaseId, completedEvents) && currentPhase === phaseId;

  const handleAdvance = () => {
    advancePhase();
    router.push('/game');
  };

  const handleComplete = () => {
    router.push('/game/result');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <PhaseIntro phase={phase} />

      <div className="space-y-3 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <span>📝</span> イベント
        </h2>
        {events.map(event => (
          <EventCard
            key={event.id}
            event={event}
            isCompleted={completedEvents.includes(event.id)}
            onClick={() => router.push(`/game/event/${event.id}`)}
          />
        ))}
      </div>

      {phase.requiredDocuments.length > 0 && (
        <div className="space-y-3 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <span>📄</span> ドキュメント
          </h2>
          {phase.requiredDocuments.map(docType => {
            const dt = docType as DocumentType;
            const doc = documents[dt];
            const isUnlocked = unlockedDocuments.includes(dt);
            return (
              <Card
                key={docType}
                hover={isUnlocked}
                className={`p-4 ${!isUnlocked ? 'opacity-50' : ''}`}
                onClick={isUnlocked ? () => router.push(`/game/document/${docType}`) : undefined}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{doc?.status === 'completed' ? '✅' : isUnlocked ? '📝' : '🔒'}</span>
                    <span className="font-medium text-gray-900">{docNames[dt] || docType}</span>
                  </div>
                  <Badge variant={doc?.status === 'completed' ? 'success' : doc?.status === 'draft' ? 'warning' : 'default'}>
                    {doc?.status === 'completed' ? '完了' : doc?.status === 'draft' ? '下書き' : isUnlocked ? '未着手' : 'ロック中'}
                  </Badge>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {canAdvance && (
        <div className="text-center py-6 animate-fade-in">
          <p className="text-gray-600 mb-4">
            {phaseId === 'closing' ? 'すべてのフェーズが完了しました！' : 'このフェーズのイベントをすべて完了しました。'}
          </p>
          {phaseId === 'closing' ? (
            <Button size="lg" onClick={handleComplete} className="animate-pulse-glow">
              結果を確認する
            </Button>
          ) : (
            <Button size="lg" onClick={handleAdvance}>
              次のフェーズへ進む →
            </Button>
          )}
        </div>
      )}

      <div className="text-center mt-4">
        <Button variant="ghost" onClick={() => router.push('/game')}>
          ← ダッシュボードに戻る
        </Button>
      </div>
    </div>
  );
}
