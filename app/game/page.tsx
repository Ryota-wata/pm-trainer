'use client';

import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/stores/gameStore';
import { useDocumentStore } from '@/lib/stores/documentStore';
import { getPhaseProgress } from '@/lib/engine/gameEngine';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import MetricsPanel from '@/components/game/MetricsPanel';
import { PhaseId } from '@/lib/types/game';
import { formatBudget, getCPI, getSPI, getCpiStatus, getSpiStatus, getRiskSummary } from '@/lib/utils/helpers';

const phaseRoutes: Record<PhaseId, string> = {
  'initiation': '/game/phase/initiation',
  'pre-requirements': '/game/phase/pre-requirements',
  'rom-planning': '/game/phase/rom-planning',
  'requirements': '/game/phase/requirements',
  'estimation': '/game/phase/estimation',
  'design-dev': '/game/phase/design-dev',
  'testing': '/game/phase/testing',
  'closing': '/game/phase/closing',
};

const phaseIcons: Record<PhaseId, string> = {
  'initiation': '🚀',
  'pre-requirements': '🔍',
  'rom-planning': '📐',
  'requirements': '📋',
  'estimation': '🧮',
  'design-dev': '⚙️',
  'testing': '🧪',
  'closing': '🏁',
};

export default function GameDashboard() {
  const router = useRouter();
  const { currentPhase, phases, projectState, completedEvents } = useGameStore();
  const { getCompletedCount } = useDocumentStore();

  const currentPhaseData = phases[currentPhase];
  const progress = getPhaseProgress(currentPhase, completedEvents);
  const isBaselineSet = completedEvents.includes('est-3');
  const riskSummary = getRiskSummary(projectState.risks);
  const shAvg = projectState.stakeholders.reduce((s, sh) => s + sh.satisfaction, 0) / projectState.stakeholders.length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">ダッシュボード</h1>
        <p className="text-gray-500">顧客・案件管理システム新規開発 - 東洋テクノロジー株式会社</p>
      </div>

      {isBaselineSet ? (
        /* ベースライン後: EVM指標を表示 */
        (() => {
          const cpi = getCPI(projectState);
          const spi = getSPI(projectState);
          const cpiStatus = getCpiStatus(cpi);
          const spiStatus = getSpiStatus(spi);
          return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="p-4">
                <div className="text-sm text-gray-500 mb-1">コスト効率 (CPI)</div>
                <div className={`text-2xl font-bold ${cpiStatus.color}`}>{cpi.toFixed(2)}</div>
                <div className="text-xs text-gray-400">AC {formatBudget(projectState.actualCost)} / BAC {formatBudget(projectState.plannedBudget)}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-500 mb-1">スケジュール効率 (SPI)</div>
                <div className={`text-2xl font-bold ${spiStatus.color}`}>{spi.toFixed(2)}</div>
                <div className="text-xs text-gray-400">{projectState.elapsedMonths.toFixed(1)} / {projectState.totalMonths}ヶ月</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-500 mb-1">リスク</div>
                <div className={`text-2xl font-bold ${riskSummary.unmitigated === 0 ? 'text-green-600' : riskSummary.unmitigated <= 2 ? 'text-yellow-600' : 'text-red-600'}`}>{riskSummary.unmitigated}件未対応</div>
                <div className="text-xs text-gray-400">合計 {riskSummary.total}件</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-500 mb-1">ドキュメント</div>
                <div className="text-2xl font-bold text-gray-900">{getCompletedCount()} / 7</div>
                <div className="mt-1">
                  <Button size="sm" variant="ghost" onClick={() => router.push('/game/document')} className="text-blue-600 px-0">
                    一覧 →
                  </Button>
                </div>
              </Card>
            </div>
          );
        })()
      ) : (
        /* ベースライン前: 定性的な指標を表示 */
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="text-sm text-gray-500 mb-1">ステークホルダー</div>
            <div className={`text-2xl font-bold ${shAvg >= 3.5 ? 'text-green-600' : shAvg >= 2.5 ? 'text-yellow-600' : 'text-red-600'}`}>
              {shAvg >= 3.5 ? '良好' : shAvg >= 2.5 ? '普通' : '注意'}
            </div>
            <div className="text-xs text-gray-400">平均満足度 {shAvg.toFixed(1)}/5</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-500 mb-1">リスク</div>
            <div className={`text-2xl font-bold ${riskSummary.unmitigated === 0 ? 'text-green-600' : riskSummary.unmitigated <= 2 ? 'text-yellow-600' : 'text-red-600'}`}>{riskSummary.unmitigated}件未対応</div>
            <div className="text-xs text-gray-400">合計 {riskSummary.total}件</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-500 mb-1">ドキュメント</div>
            <div className="text-2xl font-bold text-gray-900">{getCompletedCount()} / 7</div>
            <div className="mt-1">
              <Button size="sm" variant="ghost" onClick={() => router.push('/game/document')} className="text-blue-600 px-0">
                一覧 →
              </Button>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-500 mb-1">予実管理</div>
            <div className="text-lg font-bold text-gray-400">---</div>
            <div className="text-xs text-gray-400">ベースライン設定後に開始</div>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">現在のフェーズ</h2>
          <div className="text-center py-4">
            <div className="text-4xl mb-2">
              {phaseIcons[currentPhase]}
            </div>
            <h3 className="text-xl font-semibold text-gray-900">{currentPhaseData.nameJa}</h3>
            <p className="text-sm text-gray-500 mt-1">{currentPhaseData.description}</p>
            <div className="mt-4">
              <div className="text-sm text-gray-500 mb-1">進捗: {progress}%</div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
          <Button className="w-full mt-4" onClick={() => router.push(phaseRoutes[currentPhase])}>
            フェーズを進める
          </Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {isBaselineSet ? 'プロジェクト指標' : 'プロジェクト状況'}
          </h2>
          {isBaselineSet ? (
            <MetricsPanel projectState={projectState} />
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-2">ステークホルダー満足度</div>
                <div className="flex flex-wrap gap-1.5">
                  {projectState.stakeholders.map(s => (
                    <span key={s.id} className={`text-xs px-2 py-0.5 rounded-full ${
                      s.satisfaction >= 4 ? 'bg-green-100 text-green-700' :
                      s.satisfaction >= 3 ? 'bg-gray-100 text-gray-600' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {s.name.split(' ')[0]} {s.satisfaction}/5
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">リスク管理</div>
                <div className="text-xs text-gray-400">
                  {riskSummary.total === 0 ? 'リスクはまだ識別されていません' : `${riskSummary.total}件識別 / ${riskSummary.unmitigated}件未対応`}
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                <div className="text-xs text-blue-600">
                  CPI・SPI等の予実管理指標は、見積・ベースラインフェーズ完了後に表示されます。
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
