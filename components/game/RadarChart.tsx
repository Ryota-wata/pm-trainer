'use client';

import { ProjectState } from '@/lib/types/game';
import {
  getBudgetScore, getScheduleScore, getQualityScore,
  getStakeholderScore, getRiskScore,
} from '@/lib/utils/helpers';

interface RadarChartProps {
  projectState: ProjectState;
  docCount: number;
  size?: number;
}

export default function RadarChart({ projectState, docCount, size = 300 }: RadarChartProps) {
  const items: { key: string; label: string; value: number }[] = [
    { key: 'budget', label: 'コスト(CPI)', value: getBudgetScore(projectState) },
    { key: 'schedule', label: 'スケジュール(SPI)', value: getScheduleScore(projectState) },
    { key: 'quality', label: '品質', value: getQualityScore(projectState.quality) },
    { key: 'stakeholder', label: 'ステークホルダー', value: getStakeholderScore(projectState.stakeholders) },
    { key: 'risk', label: 'リスク管理', value: getRiskScore(projectState.risks) },
    { key: 'document', label: 'ドキュメント', value: Math.round((docCount / 7) * 100) },
  ];

  const center = size / 2;
  const radius = size / 2 - 40;
  const levels = [20, 40, 60, 80, 100];

  const getPoint = (index: number, value: number): { x: number; y: number } => {
    const angle = (Math.PI * 2 * index) / items.length - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const dataPoints = items.map((item, i) => getPoint(i, item.value));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <svg width={size} height={size} className="mx-auto">
      {levels.map(level => {
        const points = items.map((_, i) => getPoint(i, level));
        const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
        return (
          <path key={level} d={path} fill="none" stroke="#e5e7eb" strokeWidth={1} />
        );
      })}

      {items.map((_, i) => {
        const p = getPoint(i, 100);
        return (
          <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} stroke="#e5e7eb" strokeWidth={1} />
        );
      })}

      <path d={dataPath} fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6" strokeWidth={2} />

      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4} fill="#3b82f6" />
      ))}

      {items.map((item, i) => {
        const p = getPoint(i, 115);
        return (
          <text
            key={item.key}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs fill-gray-600 font-medium"
          >
            {item.label}
          </text>
        );
      })}

      {items.map((item, i) => {
        const p = getPoint(i, item.value);
        return (
          <text
            key={`val-${item.key}`}
            x={p.x}
            y={p.y - 12}
            textAnchor="middle"
            className="text-xs fill-blue-600 font-bold"
          >
            {item.value}
          </text>
        );
      })}
    </svg>
  );
}
