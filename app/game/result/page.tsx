'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/stores/gameStore';
import { useDocumentStore } from '@/lib/stores/documentStore';
import { calculateFinalScore, getRank, formatBudget, getCPI, getSPI, getCpiStatus, getSpiStatus, getRiskSummary, getQualityScore } from '@/lib/utils/helpers';
import { generateFeedback, generateOverallFeedback } from '@/lib/engine/scoring';
import RadarChart from '@/components/game/RadarChart';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export default function ResultPage() {
  const router = useRouter();
  const { projectState, completeGame, isGameCompleted, resetGame } = useGameStore();
  const { getCompletedCount, resetDocuments } = useDocumentStore();

  useEffect(() => {
    if (!isGameCompleted) {
      completeGame();
    }
  }, [isGameCompleted, completeGame]);

  const docCount = getCompletedCount();
  const overallScore = calculateFinalScore(projectState, docCount);
  const rank = getRank(overallScore);
  const feedbacks = generateFeedback(projectState, docCount);
  const overallFeedback = generateOverallFeedback(projectState, docCount);
  const cpi = getCPI(projectState);
  const spi = getSPI(projectState);
  const cpiStatus = getCpiStatus(cpi);
  const spiStatus = getSpiStatus(spi);
  const riskSummary = getRiskSummary(projectState.risks);
  const qualityScore = getQualityScore(projectState.quality);

  const handleNewGame = () => {
    resetGame();
    resetDocuments();
    router.push('/game');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">プロジェクト完了</h1>
        <p className="text-gray-500">顧客・案件管理システム新規開発 - 最終評価</p>
      </div>

      <div className="text-center mb-8">
        <div className={`text-8xl font-bold ${rank.color} mb-2`}>{rank.rank}</div>
        <p className="text-xl font-semibold text-gray-900">{rank.label}</p>
        <p className="text-3xl font-bold text-blue-600 mt-2">{overallScore}点</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 text-center">パフォーマンスチャート</h2>
          <RadarChart projectState={projectState} docCount={docCount} />
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">プロジェクト実績</h2>
          <div className="space-y-4">
            {/* EVM Results */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500">CPI</div>
                <div className={`text-lg font-bold ${cpiStatus.color}`}>{cpi.toFixed(2)}</div>
                <div className="text-xs text-gray-400">AC {formatBudget(projectState.actualCost)}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500">SPI</div>
                <div className={`text-lg font-bold ${spiStatus.color}`}>{spi.toFixed(2)}</div>
                <div className="text-xs text-gray-400">EV {formatBudget(projectState.earnedValue)}</div>
              </div>
            </div>

            {/* Budget Bar */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">予算</span>
                <span className="font-medium">{formatBudget(projectState.actualCost)} / {formatBudget(projectState.plannedBudget)}</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${projectState.actualCost > projectState.plannedBudget ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${Math.min((projectState.actualCost / projectState.plannedBudget) * 100, 100)}%` }} />
              </div>
              <p className="text-xs text-gray-400 mt-1">{projectState.actualCost <= projectState.plannedBudget ? '予算内' : `${formatBudget(projectState.actualCost - projectState.plannedBudget)}超過`}</p>
            </div>

            {/* Schedule */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">期間</span>
                <span className="font-medium">{projectState.elapsedMonths.toFixed(1)}ヶ月 / {projectState.totalMonths}ヶ月</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${projectState.elapsedMonths > projectState.totalMonths ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${Math.min((projectState.elapsedMonths / projectState.totalMonths) * 100, 100)}%` }} />
              </div>
              <p className="text-xs text-gray-400 mt-1">{projectState.delayMonths > 0 ? `${projectState.delayMonths.toFixed(1)}ヶ月遅延` : '期限内'}</p>
            </div>

            {/* Quality / Risk / Docs summary */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-gray-50 rounded-lg p-2">
                <div className="text-xs text-gray-500">品質</div>
                <div className={`text-sm font-bold ${qualityScore >= 70 ? 'text-green-600' : qualityScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>{qualityScore}/100</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-2">
                <div className="text-xs text-gray-500">リスク</div>
                <div className={`text-sm font-bold ${riskSummary.unmitigated === 0 ? 'text-green-600' : 'text-red-600'}`}>{riskSummary.unmitigated}件未対応</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-2">
                <div className="text-xs text-gray-500">文書</div>
                <div className="text-sm font-bold text-blue-600">{docCount}/7</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Stakeholder Results */}
      <Card className="p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3">ステークホルダー満足度</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {projectState.stakeholders.map(s => (
            <div key={s.id} className={`rounded-lg p-3 text-center ${
              s.satisfaction >= 4 ? 'bg-green-50 border border-green-200' :
              s.satisfaction >= 3 ? 'bg-gray-50 border border-gray-200' :
              'bg-red-50 border border-red-200'
            }`}>
              <div className="text-sm font-medium text-gray-700">{s.name}</div>
              <div className={`text-lg font-bold ${
                s.satisfaction >= 4 ? 'text-green-600' :
                s.satisfaction >= 3 ? 'text-gray-600' :
                'text-red-600'
              }`}>{s.satisfaction}/5</div>
              <div className="text-xs text-gray-400">{s.engagement}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-3">総合評価</h2>
        <p className="text-gray-700 leading-relaxed">{overallFeedback}</p>
      </Card>

      <div className="space-y-4 mb-8">
        <h2 className="text-lg font-bold text-gray-900">カテゴリ別フィードバック</h2>
        {feedbacks.map(fb => (
          <Card key={fb.category} className="p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">{fb.category}</h3>
              <div className="flex items-center gap-2">
                <Badge variant={fb.score >= 80 ? 'success' : fb.score >= 60 ? 'warning' : 'danger'}>
                  {fb.grade}ランク
                </Badge>
                <span className="text-sm font-bold text-gray-700">{fb.score}点</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">{fb.feedback}</p>
            <p className="text-xs text-blue-600 bg-blue-50 rounded px-3 py-1.5 inline-block">{fb.pmbokArea}</p>
          </Card>
        ))}
      </div>

      <div className="flex justify-center gap-4">
        <Button size="lg" onClick={handleNewGame}>
          もう一度プレイする
        </Button>
        <Button size="lg" variant="secondary" onClick={() => router.push('/')}>
          タイトルに戻る
        </Button>
      </div>
    </div>
  );
}
