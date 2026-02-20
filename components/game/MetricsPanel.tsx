'use client';

import { ProjectState } from '@/lib/types/game';
import {
  getCPI, getSPI, getCpiStatus, getSpiStatus,
  getStakeholderSummary, getRiskSummary, getQualityScore,
  formatBudget,
} from '@/lib/utils/helpers';

interface MetricsPanelProps {
  projectState: ProjectState;
  previousProjectState?: ProjectState;
}

export default function MetricsPanel({ projectState, previousProjectState }: MetricsPanelProps) {
  const cpi = getCPI(projectState);
  const spi = getSPI(projectState);
  const cpiStatus = getCpiStatus(cpi);
  const spiStatus = getSpiStatus(spi);
  const shSummary = getStakeholderSummary(projectState.stakeholders);
  const riskSummary = getRiskSummary(projectState.risks);
  const qualityScore = getQualityScore(projectState.quality);

  const prevCpi = previousProjectState ? getCPI(previousProjectState) : null;
  const prevSpi = previousProjectState ? getSPI(previousProjectState) : null;
  const prevShAvg = previousProjectState
    ? previousProjectState.stakeholders.reduce((s, sh) => s + sh.satisfaction, 0) / previousProjectState.stakeholders.length
    : null;
  const prevRiskCount = previousProjectState ? getRiskSummary(previousProjectState.risks).unmitigated : null;
  const prevQuality = previousProjectState ? getQualityScore(previousProjectState.quality) : null;

  function DiffBadge({ current, previous }: { current: number; previous: number | null }) {
    if (previous === null) return null;
    const diff = Math.round((current - previous) * 100) / 100;
    if (diff === 0) return null;
    return (
      <span className={`text-xs ml-1 ${diff > 0 ? 'text-green-600' : 'text-red-600'}`}>
        {diff > 0 ? '+' : ''}{diff.toFixed(2)}
      </span>
    );
  }

  return (
    <div className="space-y-4">
      {/* EVM Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">コスト効率 (CPI)</div>
          <div className={`text-lg font-bold ${cpiStatus.color}`}>
            {cpi.toFixed(2)}
            <DiffBadge current={cpi} previous={prevCpi} />
          </div>
          <div className="text-xs text-gray-400">
            AC {formatBudget(projectState.actualCost)} / EV {formatBudget(projectState.earnedValue)}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">スケジュール効率 (SPI)</div>
          <div className={`text-lg font-bold ${spiStatus.color}`}>
            {spi.toFixed(2)}
            <DiffBadge current={spi} previous={prevSpi} />
          </div>
          <div className="text-xs text-gray-400">
            EV {formatBudget(projectState.earnedValue)} / PV {formatBudget(projectState.plannedValue)}
          </div>
        </div>
      </div>

      {/* Quality */}
      <div className="bg-gray-50 rounded-lg p-3">
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">品質スコア</div>
          <div className={`text-sm font-bold ${qualityScore >= 70 ? 'text-green-600' : qualityScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
            {qualityScore}/100
            {prevQuality !== null && (
              <span className={`text-xs ml-1 ${qualityScore - prevQuality > 0 ? 'text-green-600' : qualityScore - prevQuality < 0 ? 'text-red-600' : ''}`}>
                {qualityScore - prevQuality !== 0 && `${qualityScore - prevQuality > 0 ? '+' : ''}${qualityScore - prevQuality}`}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-4 mt-1 text-xs text-gray-400">
          <span>欠陥: {projectState.quality.defectsFound - projectState.quality.defectsResolved}件未解消</span>
          <span>レビュー省略: {projectState.quality.reviewsSkipped}回</span>
          <span>テスト: {projectState.quality.testCoverage === 'full' ? '完全' : projectState.quality.testCoverage === 'partial' ? '部分的' : projectState.quality.testCoverage === 'minimal' ? '最小限' : '未実施'}</span>
        </div>
      </div>

      {/* Stakeholder Summary */}
      <div className="bg-gray-50 rounded-lg p-3">
        <div className="flex justify-between items-center mb-2">
          <div className="text-xs text-gray-500">ステークホルダー満足度</div>
          <div className={`text-sm font-bold ${shSummary.average >= 3.5 ? 'text-green-600' : shSummary.average >= 2.5 ? 'text-yellow-600' : 'text-red-600'}`}>
            平均 {shSummary.average}/5
            {prevShAvg !== null && (() => {
              const diff = Math.round((shSummary.average - prevShAvg) * 10) / 10;
              if (diff === 0) return null;
              return <span className={`text-xs ml-1 ${diff > 0 ? 'text-green-600' : 'text-red-600'}`}>{diff > 0 ? '+' : ''}{diff}</span>;
            })()}
          </div>
        </div>
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

      {/* Risk Summary */}
      <div className="bg-gray-50 rounded-lg p-3">
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">リスク管理</div>
          <div className={`text-sm font-bold ${riskSummary.unmitigated === 0 ? 'text-green-600' : riskSummary.unmitigated <= 2 ? 'text-yellow-600' : 'text-red-600'}`}>
            {riskSummary.unmitigated}件未対応
            {prevRiskCount !== null && (() => {
              const diff = riskSummary.unmitigated - prevRiskCount;
              if (diff === 0) return null;
              return <span className={`text-xs ml-1 ${diff > 0 ? 'text-red-600' : 'text-green-600'}`}>{diff > 0 ? '+' : ''}{diff}</span>;
            })()}
          </div>
        </div>
        <div className="text-xs text-gray-400 mt-1">
          合計 {riskSummary.total}件 (顕在化: {riskSummary.occurred}件)
        </div>
      </div>
    </div>
  );
}
