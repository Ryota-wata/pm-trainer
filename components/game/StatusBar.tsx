'use client';

import Link from 'next/link';
import { useGameStore } from '@/lib/stores/gameStore';
import { useDocumentStore } from '@/lib/stores/documentStore';
import { getCPI, getSPI, getCpiStatus, getSpiStatus, getStakeholderSummary, getRiskSummary, formatBudget } from '@/lib/utils/helpers';

export default function StatusBar() {
  const { projectState } = useGameStore();
  const { getCompletedCount } = useDocumentStore();

  const cpi = getCPI(projectState);
  const spi = getSPI(projectState);
  const cpiStatus = getCpiStatus(cpi);
  const spiStatus = getSpiStatus(spi);
  const shSummary = getStakeholderSummary(projectState.stakeholders);
  const riskSummary = getRiskSummary(projectState.risks);

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2">
      <div className="flex items-center gap-4 overflow-x-auto">
        <div className="flex items-center gap-3 text-xs shrink-0">
          <span className="text-gray-500">
            予算: {formatBudget(projectState.actualCost)} / {formatBudget(projectState.plannedBudget)}
          </span>
          <span className={`font-medium ${cpiStatus.color}`}>
            CPI {cpi.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs shrink-0">
          <span className="text-gray-500">
            進捗: {projectState.elapsedMonths.toFixed(1)} / {projectState.totalMonths}ヶ月
          </span>
          <span className={`font-medium ${spiStatus.color}`}>
            SPI {spi.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs shrink-0">
          <span className="text-gray-500">
            リスク: <span className={riskSummary.unmitigated > 0 ? 'text-red-600 font-medium' : 'text-green-600'}>{riskSummary.unmitigated}件未対応</span>
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs shrink-0">
          <span className="text-gray-500">
            SH満足度: <span className={shSummary.average >= 3.5 ? 'text-green-600 font-medium' : shSummary.average >= 2.5 ? 'text-yellow-600 font-medium' : 'text-red-600 font-medium'}>{shSummary.average}/5</span>
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0 border-l border-gray-200 pl-3 ml-auto">
          <Link href="/game/document" className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors px-2 py-1 rounded-lg hover:bg-blue-50">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <span>ドキュメント</span>
            <span className="bg-blue-100 text-blue-700 px-1.5 py-0 rounded-full text-xs">{getCompletedCount()}/7</span>
          </Link>
          <Link href="/game/cost" className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-800 transition-colors px-2 py-1 rounded-lg hover:bg-emerald-50">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>コスト管理</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
