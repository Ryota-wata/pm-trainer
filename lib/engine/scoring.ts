import { ProjectState } from '@/lib/types/game';
import {
  getCPI, getSPI, getQualityScore, getRiskSummary,
  getBudgetScore, getScheduleScore, getStakeholderScore, getRiskScore,
  calculateFinalScore, getRank, formatBudget,
} from '@/lib/utils/helpers';

export interface CategoryFeedback {
  category: string;
  score: number;
  grade: string;
  feedback: string;
  pmbokArea: string;
}

function getGrade(score: number): string {
  if (score >= 90) return 'S';
  if (score >= 80) return 'A';
  if (score >= 65) return 'B';
  if (score >= 50) return 'C';
  return 'D';
}

export function generateFeedback(state: ProjectState, docCount: number): CategoryFeedback[] {
  const cpi = getCPI(state);
  const spi = getSPI(state);
  const budgetScore = getBudgetScore(state);
  const scheduleScore = getScheduleScore(state);
  const qualityScore = getQualityScore(state.quality);
  const stakeholderScore = getStakeholderScore(state.stakeholders);
  const riskSummary = getRiskSummary(state.risks);
  const riskScore = getRiskScore(state.risks);
  const docScore = Math.round((docCount / 7) * 100);

  const unresolvedDefects = state.quality.defectsFound - state.quality.defectsResolved;
  const avgSatisfaction = state.stakeholders.reduce((s, sh) => s + sh.satisfaction, 0) / state.stakeholders.length;

  return [
    {
      category: 'コスト管理（EVM）',
      score: budgetScore,
      grade: getGrade(budgetScore),
      feedback: cpi >= 1.0
        ? `CPI ${cpi.toFixed(2)} — コスト効率が優秀です。AC ${formatBudget(state.actualCost)} に対し EV ${formatBudget(state.earnedValue)} を達成しました。`
        : cpi >= 0.9
        ? `CPI ${cpi.toFixed(2)} — 若干のコスト超過傾向です。AC ${formatBudget(state.actualCost)}、EV ${formatBudget(state.earnedValue)}。EACの見直しを検討してください。`
        : `CPI ${cpi.toFixed(2)} — コスト超過が発生しています。AC ${formatBudget(state.actualCost)} で EV ${formatBudget(state.earnedValue)} の実績です。`,
      pmbokArea: 'プロジェクト・コスト・マネジメント（EVM）',
    },
    {
      category: 'スケジュール（EVM）',
      score: scheduleScore,
      grade: getGrade(scheduleScore),
      feedback: spi >= 1.0
        ? `SPI ${spi.toFixed(2)} — スケジュール効率が良好です。計画値 ${formatBudget(state.plannedValue)} に対し ${formatBudget(state.earnedValue)} の進捗を達成。`
        : spi >= 0.9
        ? `SPI ${spi.toFixed(2)} — 軽微な遅延傾向です。クリティカルパスの管理を強化しましょう。`
        : `SPI ${spi.toFixed(2)} — スケジュール遅延が発生しています。是正措置（クラッシング/ファストトラッキング）の検討が必要です。`,
      pmbokArea: 'プロジェクト・スケジュール・マネジメント',
    },
    {
      category: '品質',
      score: qualityScore,
      grade: getGrade(qualityScore),
      feedback: unresolvedDefects === 0 && state.quality.reviewsSkipped === 0
        ? `欠陥${state.quality.defectsFound}件すべて解消済み。レビュー省略なし。品質管理が徹底されています。`
        : unresolvedDefects <= 3
        ? `未解消の欠陥が${unresolvedDefects}件あります。レビュー省略${state.quality.reviewsSkipped}回。品質保証プロセスを見直しましょう。`
        : `未解消の欠陥が${unresolvedDefects}件と多い状況です。レビュー省略${state.quality.reviewsSkipped}回。品質コストの観点から予防的管理が必要です。`,
      pmbokArea: 'プロジェクト・品質マネジメント',
    },
    {
      category: 'ステークホルダー',
      score: stakeholderScore,
      grade: getGrade(stakeholderScore),
      feedback: avgSatisfaction >= 4
        ? `平均満足度 ${avgSatisfaction.toFixed(1)}/5。ステークホルダーとの関係構築が優秀です。`
        : avgSatisfaction >= 3
        ? `平均満足度 ${avgSatisfaction.toFixed(1)}/5。一部のステークホルダーとの調整に改善の余地があります。`
        : `平均満足度 ${avgSatisfaction.toFixed(1)}/5。ステークホルダーの不満が蓄積しています。エンゲージメント評価マトリクスの活用を検討してください。`,
      pmbokArea: 'プロジェクト・ステークホルダー・マネジメント',
    },
    {
      category: 'リスク管理',
      score: riskScore,
      grade: getGrade(riskScore),
      feedback: riskSummary.unmitigated === 0 && riskSummary.occurred === 0
        ? `全${riskSummary.total}件のリスクが適切に管理されています。事前のリスク特定と対応策が効果を発揮しました。`
        : riskSummary.occurred === 0
        ? `${riskSummary.unmitigated}件の未対応リスクがあります。定期的なリスクレビューを実施しましょう。`
        : `${riskSummary.occurred}件のリスクが顕在化しました。リスク登録簿の活用と定量的リスク分析の導入を検討してください。`,
      pmbokArea: 'プロジェクト・リスク・マネジメント',
    },
    {
      category: 'ドキュメント',
      score: docScore,
      grade: getGrade(docScore),
      feedback: docCount >= 6
        ? `${docCount}/7件のドキュメントを完成。プロジェクト文書が充実しています。`
        : docCount >= 4
        ? `${docCount}/7件のドキュメントを完成。基本的な記録はありますが、より詳細な文書化が望まれます。`
        : `${docCount}/7件のみ完成。ドキュメントが不足しています。プロジェクト文書はナレッジマネジメントの基盤です。`,
      pmbokArea: 'プロジェクト統合マネジメント',
    },
  ];
}

export function generateOverallFeedback(state: ProjectState, docCount: number): string {
  const score = calculateFinalScore(state, docCount);
  const { label } = getRank(score);
  const cpi = getCPI(state);
  const spi = getSPI(state);

  if (score >= 90) {
    return `素晴らしい結果です！「${label}」として、CPI ${cpi.toFixed(2)}・SPI ${spi.toFixed(2)} の優秀な実績でプロジェクトを成功に導きました。ステークホルダーの信頼を獲得し、バランスの取れたプロジェクトマネジメントを実現した手腕は見事です。`;
  }
  if (score >= 80) {
    return `非常に良い結果です。「${label}」として、CPI ${cpi.toFixed(2)}・SPI ${spi.toFixed(2)} の実績で多くの局面で適切な判断ができました。いくつかの改善点はありますが、PMBOKの知識エリアを十分に理解し実践できています。`;
  }
  if (score >= 65) {
    return `プロジェクトを無事完了させました。「${label}」として、CPI ${cpi.toFixed(2)}・SPI ${spi.toFixed(2)}。基本的なマネジメントスキルを発揮しました。トレードオフの判断やステークホルダー調整のスキルを磨くことで、さらに成長できるでしょう。`;
  }
  if (score >= 50) {
    return `プロジェクトは完了しましたが課題が残りました。「${label}」、CPI ${cpi.toFixed(2)}・SPI ${spi.toFixed(2)}。PMBOKの各知識エリアの理解を深め、計画段階での準備をより充実させることをお勧めします。`;
  }
  return `プロジェクトは多くの困難に直面しました。「${label}」、CPI ${cpi.toFixed(2)}・SPI ${spi.toFixed(2)}。この経験から多くを学べるはずです。PMBOKのプロセス群と知識エリアを体系的に学習し、次のプロジェクトに活かしましょう。`;
}
