'use client';

import { useRouter } from 'next/navigation';
import { useDocumentStore } from '@/lib/stores/documentStore';
import { documentMeta } from '@/lib/data/documents/templates';
import { DocumentType } from '@/lib/types/document';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

const allDocTypes: DocumentType[] = ['charter', 'requirements', 'wbs', 'schedule', 'risk-register', 'change-log', 'lessons-learned'];

export default function DocumentListPage() {
  const router = useRouter();
  const { documents, unlockedDocuments } = useDocumentStore();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.push('/game')}>← ダッシュボード</Button>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">プロジェクトドキュメント</h1>
      <p className="text-gray-500 mb-8">イベントを進めるとドキュメントがアンロックされます。作成することでドキュメントスコアが向上します。</p>

      <div className="space-y-3">
        {allDocTypes.map(docType => {
          const meta = documentMeta[docType];
          const doc = documents[docType];
          const isUnlocked = unlockedDocuments.includes(docType);

          return (
            <Card
              key={docType}
              hover={isUnlocked}
              className={`p-5 ${!isUnlocked ? 'opacity-50' : ''}`}
              onClick={isUnlocked ? () => router.push(`/game/document/${docType}`) : undefined}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{doc?.status === 'completed' ? '✅' : isUnlocked ? '📝' : '🔒'}</span>
                    <h3 className="font-semibold text-gray-900">{meta.titleJa}</h3>
                  </div>
                  <p className="text-sm text-gray-500 ml-8">{meta.description}</p>
                  <p className="text-xs text-gray-400 ml-8 mt-1">フェーズ: {meta.phase}</p>
                </div>
                <Badge
                  variant={doc?.status === 'completed' ? 'success' : doc?.status === 'draft' ? 'warning' : 'default'}
                  size="md"
                >
                  {doc?.status === 'completed' ? '完了' : doc?.status === 'draft' ? '下書き' : isUnlocked ? '未着手' : 'ロック中'}
                </Badge>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
