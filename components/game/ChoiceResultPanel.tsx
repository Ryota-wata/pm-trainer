'use client';

import { EventChoice, ChoiceEffects } from '@/lib/types/event';
import { useGameStore } from '@/lib/stores/gameStore';
import { formatBudget } from '@/lib/utils/helpers';
import Card from '@/components/ui/Card';

interface ChoiceResultPanelProps {
  choices: EventChoice[];
  selectedChoiceId: string;
}

function getStakeholderName(id: string, projectState: { stakeholders: { id: string; name: string }[] }): string {
  const sh = projectState.stakeholders.find(s => s.id === id);
  return sh ? sh.name.split(' ')[0] : id;
}

function EffectBadges({ effects, projectState, isBaselineSet }: { effects: ChoiceEffects; projectState: { stakeholders: { id: string; name: string }[] }; isBaselineSet: boolean }) {
  const badges: { text: string; positive: boolean }[] = [];

  if (effects.costImpact > 0) {
    badges.push({
      text: isBaselineSet ? `投資 +${formatBudget(effects.costImpact)}` : '工数: 増加',
      positive: true,
    });
  } else if (effects.costImpact < 0) {
    badges.push({
      text: isBaselineSet ? `${formatBudget(Math.abs(effects.costImpact))}コスト削減` : '工数: 削減',
      positive: false,
    });
  }

  if (effects.scheduleImpact > 0) {
    badges.push({
      text: isBaselineSet ? `+${effects.scheduleImpact}ヶ月` : 'スケジュール: 遅延',
      positive: false,
    });
  } else if (effects.scheduleImpact < 0) {
    badges.push({
      text: isBaselineSet ? `${effects.scheduleImpact}ヶ月短縮` : 'スケジュール: 短縮',
      positive: true,
    });
  }

  for (const si of effects.stakeholderImpacts) {
    const name = getStakeholderName(si.stakeholderId, projectState);
    badges.push({
      text: `${name} ${si.satisfactionDelta > 0 ? '↑' : '↓'}`,
      positive: si.satisfactionDelta > 0,
    });
  }

  for (const ri of effects.riskImpacts) {
    if (ri.action === 'add') {
      badges.push({ text: 'リスク発生', positive: false });
    } else if (ri.action === 'mitigate') {
      badges.push({ text: 'リスク軽減', positive: true });
    }
  }

  if (effects.qualityImpact) {
    if (effects.qualityImpact.defectsResolved && effects.qualityImpact.defectsResolved > 0) {
      badges.push({ text: isBaselineSet ? `欠陥${effects.qualityImpact.defectsResolved}件解消` : '欠陥解消', positive: true });
    }
    if (effects.qualityImpact.reviewsSkipped && effects.qualityImpact.reviewsSkipped > 0) {
      badges.push({ text: 'レビュー省略', positive: false });
    }
    if (effects.qualityImpact.testCoverage === 'full') {
      badges.push({ text: 'テスト完全実施', positive: true });
    }
    if (effects.qualityImpact.testCoverage === 'minimal') {
      badges.push({ text: 'テスト最小限', positive: false });
    }
  }

  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {badges.map((badge, i) => (
        <span
          key={i}
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            badge.positive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {badge.text}
        </span>
      ))}
    </div>
  );
}

function scoreEffects(effects: ChoiceEffects): number {
  let score = effects.earnedValueDelta;
  score -= effects.costImpact * 0.5;
  score -= effects.scheduleImpact * 100;
  score += effects.stakeholderImpacts.reduce((s, i) => s + i.satisfactionDelta * 50, 0);
  score -= effects.riskImpacts.filter(r => r.action === 'add').length * 80;
  score += effects.riskImpacts.filter(r => r.action === 'mitigate' || r.action === 'close').length * 60;
  return score;
}

type Rating = 'best' | 'acceptable' | 'risky';

function getRating(choice: EventChoice, choices: EventChoice[]): Rating {
  const scores = choices.map(c => scoreEffects(c.effects));
  const score = scoreEffects(choice.effects);
  const maxScore = Math.max(...scores);
  const minScore = Math.min(...scores);
  if (scores.every(s => s === scores[0])) return 'acceptable';
  if (score === maxScore) return 'best';
  if (score === minScore) return 'risky';
  return 'acceptable';
}

const ratingConfig: Record<Rating, { icon: string; label: string; color: string; bg: string; border: string }> = {
  best:       { icon: '◎', label: '最適な判断', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' },
  acceptable: { icon: '○', label: '許容できる判断', color: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  risky:      { icon: '△', label: 'リスクの高い判断', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
};

export default function ChoiceResultPanel({ choices, selectedChoiceId }: ChoiceResultPanelProps) {
  const { projectState, completedEvents } = useGameStore();
  const isBaselineSet = completedEvents.includes('est-3');
  const selectedChoice = choices.find(c => c.id === selectedChoiceId);
  const selectedRating = selectedChoice ? getRating(selectedChoice, choices) : 'acceptable';
  const config = ratingConfig[selectedRating];

  return (
    <div className="space-y-4">
      {/* Verdict banner */}
      {selectedChoice && (
        <Card className={`p-5 ${config.bg} ${config.border}`}>
          <div className="flex items-start gap-3">
            <span className={`text-3xl shrink-0`}>{config.icon}</span>
            <div className="flex-1 min-w-0">
              <div className={`text-lg font-bold ${config.color} mb-1`}>
                {config.label}
              </div>
              <p className="text-sm text-gray-700 mb-2">{selectedChoice.feedback}</p>
              <p className="text-xs text-blue-600 font-medium leading-relaxed">{selectedChoice.pmbokReference}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Cost explanation */}
      <div className="text-xs text-gray-500 bg-gray-50 rounded-lg px-4 py-3 leading-relaxed">
        {isBaselineSet ? (
          <>
            <span className="font-semibold text-gray-600">コストについて:</span>{' '}
            丁寧な分析やレビューには工数（=コスト）がかかりますが、品質向上やリスク低減につながります。
            重要なのは「コストをかけたか」ではなく「費用対効果（CPI = EV / AC）」が高いかどうかです。
            コスト削減が常に良い選択とは限りません。
          </>
        ) : (
          <>
            <span className="font-semibold text-gray-600">この段階では:</span>{' '}
            まだベースラインが確定していないため、具体的なコスト・スケジュールの数値は表示されません。
            ベースライン設定後（見積・ベースラインフェーズ完了後）に予実管理が始まります。
          </>
        )}
      </div>

      {/* All choices comparison */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <span>📋</span> 全選択肢の比較
        </h3>
        {choices.map((choice, index) => {
          const isSelected = choice.id === selectedChoiceId;
          const rating = getRating(choice, choices);
          const rc = ratingConfig[rating];
          return (
            <Card
              key={choice.id}
              className={`p-4 transition-all ${
                isSelected
                  ? 'ring-2 ring-blue-500 bg-blue-50/30 border-blue-200'
                  : 'opacity-70'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                  isSelected ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {String.fromCharCode(65 + index)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {isSelected && (
                      <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                        あなたの選択
                      </span>
                    )}
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${rc.bg} ${rc.color}`}>
                      {rc.icon} {rc.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-1">{choice.text}</p>
                  <EffectBadges effects={choice.effects} projectState={projectState} isBaselineSet={isBaselineSet} />
                  {/* Show feedback for all choices */}
                  <div className={`mt-2 p-3 rounded-lg border ${isSelected ? 'bg-white border-blue-100' : 'bg-gray-50 border-gray-100'}`}>
                    <p className="text-sm text-gray-600">{choice.feedback}</p>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
