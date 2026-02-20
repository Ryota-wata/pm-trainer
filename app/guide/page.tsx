'use client';

import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

const knowledgeAreas = [
  {
    name: 'プロジェクト統合マネジメント',
    icon: '🔗',
    description: 'プロジェクト全体を統合的に管理する。プロジェクト憲章の作成、変更管理、プロジェクトの終結を含む。',
    keyPoints: ['プロジェクト憲章', '統合変更管理', 'プロジェクト終結', '教訓の収集'],
  },
  {
    name: 'プロジェクト・スコープ・マネジメント',
    icon: '🎯',
    description: 'プロジェクトの範囲を定義し管理する。必要な作業のみが含まれることを保証する。',
    keyPoints: ['要求事項の収集', 'スコープ定義', 'WBS作成', 'スコープの検証とコントロール'],
  },
  {
    name: 'プロジェクト・スケジュール・マネジメント',
    icon: '📅',
    description: 'プロジェクトのスケジュールを計画し管理する。期限内の完了を目指す。',
    keyPoints: ['アクティビティ定義', 'クリティカルパス法', 'ファストトラッキング', 'クラッシング'],
  },
  {
    name: 'プロジェクト・コスト・マネジメント',
    icon: '💰',
    description: 'プロジェクトの予算を計画し管理する。予算内での完了を目指す。',
    keyPoints: ['コスト見積り', 'コストベースライン', 'EVM（アーンド・バリュー）', 'コストコントロール'],
  },
  {
    name: 'プロジェクト・品質マネジメント',
    icon: '✨',
    description: 'プロジェクトの成果物が要件を満たすことを保証する。',
    keyPoints: ['品質計画', '品質保証', '品質コントロール', '品質コスト'],
  },
  {
    name: 'プロジェクト資源マネジメント',
    icon: '👥',
    description: 'プロジェクトに必要な人的・物的資源を計画し管理する。',
    keyPoints: ['チーム編成', 'チーム開発', 'チームマネジメント', '資源コントロール'],
  },
  {
    name: 'プロジェクト・コミュニケーション・マネジメント',
    icon: '💬',
    description: 'プロジェクトの情報を適切に管理・配信する。',
    keyPoints: ['コミュニケーション計画', '情報配信', 'コミュニケーション監視'],
  },
  {
    name: 'プロジェクト・リスク・マネジメント',
    icon: '⚠️',
    description: 'プロジェクトのリスクを特定・分析・対応する。',
    keyPoints: ['リスク特定', '定性的リスク分析', '定量的リスク分析', 'リスク対応計画'],
  },
  {
    name: 'プロジェクト調達マネジメント',
    icon: '📦',
    description: '外部からの調達（ベンダー管理等）を計画し管理する。',
    keyPoints: ['調達計画', '調達の実行', '調達のコントロール'],
  },
  {
    name: 'プロジェクト・ステークホルダー・マネジメント',
    icon: '🤝',
    description: 'ステークホルダーの期待値を管理し、エンゲージメントを最適化する。',
    keyPoints: ['ステークホルダー特定', 'エンゲージメント計画', 'エンゲージメント管理', '権力/関心度グリッド'],
  },
];

const processGroups = [
  { name: '立上げ', description: 'プロジェクトの公式な開始。プロジェクト憲章の作成とステークホルダーの特定を行う。', color: 'bg-purple-100 text-purple-800' },
  { name: '計画', description: 'プロジェクト目標達成のための詳細計画を策定する。スコープ、スケジュール、コスト、品質等の計画を含む。', color: 'bg-blue-100 text-blue-800' },
  { name: '実行', description: '計画に基づきプロジェクト作業を遂行する。チームの指揮、成果物の作成、品質保証を行う。', color: 'bg-green-100 text-green-800' },
  { name: '監視・コントロール', description: 'プロジェクトの進捗をモニタリングし、必要な是正措置を講じる。変更管理を含む。', color: 'bg-yellow-100 text-yellow-800' },
  { name: '終結', description: 'プロジェクトを正式に完了させる。成果物の引渡し、教訓の収集、契約の終結を行う。', color: 'bg-red-100 text-red-800' },
];

export default function GuidePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-4">
          <Button variant="ghost" size="sm" onClick={() => router.push('/')}>← タイトルに戻る</Button>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">PMBOKガイド</h1>
        <p className="text-gray-500 mb-8">プロジェクトマネジメント知識体系ガイド（PMBOK）の基本概念</p>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5つのプロセス群</h2>
          <p className="text-gray-600 mb-6">PMBOKでは、プロジェクトマネジメントのプロセスを5つのプロセス群に分類しています。</p>
          <div className="grid gap-4">
            {processGroups.map((pg, i) => (
              <Card key={i} className="p-5">
                <div className="flex items-start gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${pg.color}`}>{pg.name}</span>
                  <p className="text-gray-700 text-sm">{pg.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">10の知識エリア</h2>
          <p className="text-gray-600 mb-6">PMBOKでは、プロジェクトマネジメントの知識を10のエリアに体系化しています。</p>
          <div className="grid gap-4">
            {knowledgeAreas.map((area, i) => (
              <Card key={i} className="p-5">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{area.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{area.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{area.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {area.keyPoints.map((kp, j) => (
                        <span key={j} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{kp}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
