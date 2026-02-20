import { ProjectState, StakeholderState, ProjectRisk, QualityRecord } from '@/lib/types/game';

export function getCPI(state: ProjectState): number {
  if (state.actualCost === 0) return 1;
  return state.earnedValue / state.actualCost;
}

export function getSPI(state: ProjectState): number {
  if (state.plannedValue === 0) return 1;
  return state.earnedValue / state.plannedValue;
}

export function getCpiStatus(cpi: number): { label: string; color: string } {
  if (cpi >= 1.0) return { label: '良好', color: 'text-green-600' };
  if (cpi >= 0.9) return { label: '注意', color: 'text-yellow-600' };
  return { label: '超過', color: 'text-red-600' };
}

export function getSpiStatus(spi: number): { label: string; color: string } {
  if (spi >= 1.0) return { label: '順調', color: 'text-green-600' };
  if (spi >= 0.9) return { label: '遅延気味', color: 'text-yellow-600' };
  return { label: '遅延', color: 'text-red-600' };
}

export function getStakeholderSummary(stakeholders: StakeholderState[]): { average: number; minName: string; minSatisfaction: number } {
  if (stakeholders.length === 0) return { average: 3, minName: '-', minSatisfaction: 3 };
  const avg = stakeholders.reduce((sum, s) => sum + s.satisfaction, 0) / stakeholders.length;
  const min = stakeholders.reduce((a, b) => a.satisfaction < b.satisfaction ? a : b);
  return { average: Math.round(avg * 10) / 10, minName: min.name, minSatisfaction: min.satisfaction };
}

export function getRiskSummary(risks: ProjectRisk[]): { total: number; unmitigated: number; occurred: number } {
  return {
    total: risks.length,
    unmitigated: risks.filter(r => r.status === 'identified').length,
    occurred: risks.filter(r => r.status === 'occurred').length,
  };
}

export function getQualityScore(quality: QualityRecord): number {
  let score = 80;
  const unresolvedDefects = quality.defectsFound - quality.defectsResolved;
  score -= unresolvedDefects * 3;
  score -= quality.reviewsSkipped * 10;
  if (quality.testCoverage === 'full') score += 10;
  else if (quality.testCoverage === 'partial') score += 5;
  else if (quality.testCoverage === 'minimal') score -= 5;
  else if (quality.testCoverage === 'none') score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function getBudgetScore(state: ProjectState): number {
  const cpi = getCPI(state);
  return Math.min(100, Math.max(0, Math.round(cpi * 100)));
}

export function getScheduleScore(state: ProjectState): number {
  const spi = getSPI(state);
  return Math.min(100, Math.max(0, Math.round(spi * 100 - state.delayMonths * 5)));
}

export function getStakeholderScore(stakeholders: StakeholderState[]): number {
  if (stakeholders.length === 0) return 60;
  const avg = stakeholders.reduce((sum, s) => sum + s.satisfaction, 0) / stakeholders.length;
  return Math.round(avg * 20); // 5 → 100, 3 → 60, 1 → 20
}

export function getRiskScore(risks: ProjectRisk[]): number {
  const summary = getRiskSummary(risks);
  return Math.max(0, 100 - summary.unmitigated * 15 - summary.occurred * 25);
}

export function calculateFinalScore(state: ProjectState, docCount: number): number {
  const budgetScore = getBudgetScore(state);
  const scheduleScore = getScheduleScore(state);
  const qualityScore = getQualityScore(state.quality);
  const stakeholderScore = getStakeholderScore(state.stakeholders);
  const riskScore = getRiskScore(state.risks);
  const docScore = Math.round((docCount / 7) * 100);

  const weights = { budget: 0.2, schedule: 0.2, quality: 0.2, stakeholder: 0.15, risk: 0.15, document: 0.1 };
  return Math.round(
    budgetScore * weights.budget +
    scheduleScore * weights.schedule +
    qualityScore * weights.quality +
    stakeholderScore * weights.stakeholder +
    riskScore * weights.risk +
    docScore * weights.document
  );
}

export function getRank(score: number): { rank: string; label: string; color: string } {
  if (score >= 90) return { rank: 'S', label: '伝説のPM', color: 'text-yellow-400' };
  if (score >= 80) return { rank: 'A', label: '優秀なPM', color: 'text-blue-400' };
  if (score >= 65) return { rank: 'B', label: '一人前のPM', color: 'text-green-500' };
  if (score >= 50) return { rank: 'C', label: '成長中のPM', color: 'text-orange-400' };
  return { rank: 'D', label: '修行が必要', color: 'text-red-400' };
}

export function formatBudget(amount: number): string {
  if (amount >= 10000) return `${(amount / 10000).toFixed(0)}億円`;
  return `${amount.toLocaleString()}万円`;
}
