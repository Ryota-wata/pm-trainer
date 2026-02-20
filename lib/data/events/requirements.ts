import { GameEvent } from '@/lib/types/event';

export const requirementsEvents: GameEvent[] = [
  {
    id: 'req-1',
    phase: 'requirements',
    title: '機能要件定義',
    description: 'システムの機能要件を詳細に定義する',
    category: 'スコープ・マネジメント',
    dialogue: [
      { speaker: '田中 美咲', speakerId: 'tanaka', text: '要件として、顧客情報管理、案件パイプライン管理、見積書作成、売上予測ダッシュボードは必須です。', emotion: 'neutral' },
      { speaker: '中村 裕子', speakerId: 'nakamura', text: 'すべての要件を12ヶ月で実装するのは厳しいかもしれません。優先順位をつけませんか？', emotion: 'worried' },
      { speaker: '田中 美咲', speakerId: 'tanaka', text: 'できればモバイルアプリ対応と基幹システム連携もほしいのですが…予算的に可能でしょうか？', emotion: 'neutral' },
    ],
    choices: [
      {
        id: 'req-1-a',
        text: 'MoSCoW法で要件を分類し、Must/Shouldに集中する。Couldは余裕があれば対応。',
        effects: {
          costImpact: 30,
          scheduleImpact: 0.3,
          earnedValueDelta: 270,
          stakeholderImpacts: [
            { stakeholderId: 'tanaka', satisfactionDelta: 1 },
            { stakeholderId: 'nakamura', satisfactionDelta: 1 },
          ],
          riskImpacts: [],
          qualityImpact: { testCoverage: 'partial' },
        },
        feedback: 'MoSCoW法による優先順位付けは、スコープ管理の有効な手法です。',
        pmbokReference: 'PMBOK: プロジェクト・スコープ・マネジメント - 要求事項の優先順位付けにより、限られたリソースで最大の価値を提供できます。',
      },
      {
        id: 'req-1-b',
        text: 'すべての要件を受け入れ、リソースを追加して対応する。',
        effects: {
          costImpact: 500,
          scheduleImpact: 0.5,
          earnedValueDelta: 200,
          stakeholderImpacts: [
            { stakeholderId: 'tanaka', satisfactionDelta: 2 },
          ],
          riskImpacts: [
            { action: 'add', riskId: 'risk-gold-plating', description: '過剰スコープによる品質・スケジュールリスク', probability: 'high', impact: 'high' },
          ],
        },
        feedback: '全要件の受け入れは短期的に満足度を高めますが、予算・スケジュールリスクが大幅に増加します。',
        pmbokReference: 'PMBOK: プロジェクト・スコープ・マネジメント - ゴールドプレーティング（過剰な要件）はプロジェクトリスクを増大させます。',
      },
      {
        id: 'req-1-c',
        text: '第1フェーズはコア機能、第2フェーズで追加機能を実装する段階的アプローチを提案。',
        effects: {
          costImpact: 50,
          scheduleImpact: 0.2,
          earnedValueDelta: 250,
          stakeholderImpacts: [
            { stakeholderId: 'tanaka', satisfactionDelta: 1 },
          ],
          riskImpacts: [],
        },
        feedback: 'フェーズ分けは現実的なアプローチです。期待値管理もしやすくなります。',
        pmbokReference: 'PMBOK: プロジェクト統合マネジメント - 段階的詳細化は不確実性を管理する有効な手法です。',
      },
    ],
    unlockDocument: 'requirements',
    isRequired: true,
    order: 1,
  },
  {
    id: 'req-2',
    phase: 'requirements',
    title: '非機能要件・品質基準',
    description: 'セキュリティ、パフォーマンス等の非機能要件と品質基準を定義する',
    category: '品質マネジメント',
    dialogue: [
      { speaker: '佐々木 健太', speakerId: 'sasaki', text: 'セキュリティ要件として、多要素認証、データ暗号化、アクセスログ管理は必須だ。ISO27001準拠も視野に入れてほしい。', emotion: 'neutral' },
      { speaker: '中村 裕子', speakerId: 'nakamura', text: 'パフォーマンス要件も決めておきたいです。大量データ処理時のレスポンスタイム基準が必要です。', emotion: 'neutral' },
      { speaker: '鈴木 大輔', speakerId: 'suzuki', text: '非機能要件の厳しさによって、アーキテクチャ設計が大きく変わります。早めに確定したいですね。', emotion: 'neutral' },
    ],
    choices: [
      {
        id: 'req-2-a',
        text: 'セキュリティ・パフォーマンス・可用性・拡張性の全非機能要件を詳細に定義する。',
        effects: {
          costImpact: 50,
          scheduleImpact: 0.3,
          earnedValueDelta: 270,
          stakeholderImpacts: [
            { stakeholderId: 'sasaki', satisfactionDelta: 1 },
            { stakeholderId: 'nakamura', satisfactionDelta: 1 },
            { stakeholderId: 'suzuki', satisfactionDelta: 1 },
          ],
          riskImpacts: [],
          qualityImpact: { testCoverage: 'partial' },
        },
        feedback: '包括的な非機能要件定義は、設計・テストの品質を高めます。',
        pmbokReference: 'PMBOK: プロジェクト・品質マネジメント - 非機能要件（セキュリティ、パフォーマンス等）は品質の重要な構成要素です。',
      },
      {
        id: 'req-2-b',
        text: 'セキュリティ要件のみ詳細に定義し、他の非機能要件は設計フェーズで決める。',
        effects: {
          costImpact: 0,
          scheduleImpact: 0,
          earnedValueDelta: 210,
          stakeholderImpacts: [
            { stakeholderId: 'sasaki', satisfactionDelta: 1 },
            { stakeholderId: 'nakamura', satisfactionDelta: -1 },
          ],
          riskImpacts: [
            { action: 'add', riskId: 'risk-performance-issues', description: 'パフォーマンス要件未定義による後工程での問題', probability: 'medium', impact: 'medium' },
          ],
        },
        feedback: 'セキュリティ優先は正しいですが、他の非機能要件の後回しはリスクを伴います。',
        pmbokReference: 'PMBOK: プロジェクト・品質マネジメント - 非機能要件の軽視は品質リスクにつながります。',
      },
      {
        id: 'req-2-c',
        text: '業界標準の基準値を採用し、カスタマイズは最小限にして効率的に定義する。',
        effects: {
          costImpact: 20,
          scheduleImpact: 0.1,
          earnedValueDelta: 240,
          stakeholderImpacts: [
            { stakeholderId: 'sasaki', satisfactionDelta: 1 },
          ],
          riskImpacts: [],
        },
        feedback: '業界標準の活用は効率的で、合理的な品質基準を設定できます。',
        pmbokReference: 'PMBOK: プロジェクト・品質マネジメント - 業界標準やベストプラクティスの活用は品質計画の効率化につながります。',
      },
    ],
    isRequired: true,
    order: 2,
  },
  {
    id: 'req-3',
    phase: 'requirements',
    title: '要件レビュー・ベンダー選定',
    description: '要件定義書のレビューを実施し、開発ベンダーの選定を行う',
    category: '調達マネジメント',
    dialogue: [
      { speaker: '中村 裕子', speakerId: 'nakamura', text: '要件定義書のレビューを完了しました。いくつか曖昧な点がありますが、このまま進めますか？', emotion: 'neutral' },
      { speaker: '鈴木 大輔', speakerId: 'suzuki', text: 'ベンダー側の見積もりですが、要件の規模から4,200万円が妥当と考えています。ただし要件変更時は別途費用です。', emotion: 'neutral' },
      { speaker: '高山 誠一', speakerId: 'takayama', text: '4,200万は高い。3,500万程度に抑えられないか交渉してほしい。', emotion: 'angry' },
    ],
    choices: [
      {
        id: 'req-3-a',
        text: '曖昧な要件を解消してからベンダーの見積もり4,200万を受け入れる。品質を優先。',
        effects: {
          costImpact: 200,
          scheduleImpact: 0.3,
          earnedValueDelta: 260,
          stakeholderImpacts: [
            { stakeholderId: 'suzuki', satisfactionDelta: 1 },
            { stakeholderId: 'nakamura', satisfactionDelta: 1 },
            { stakeholderId: 'takayama', satisfactionDelta: -1 },
          ],
          riskImpacts: [],
        },
        feedback: '要件の明確化と適正見積の受入は、品質とスケジュールの安定性を確保します。',
        pmbokReference: 'PMBOK: プロジェクト調達マネジメント - ベンダー選定では、価格だけでなく品質・実績・リスクを総合的に評価します。',
      },
      {
        id: 'req-3-b',
        text: '3,500万に値引き交渉しつつ、スコープ調整も提案する。',
        effects: {
          costImpact: -200,
          scheduleImpact: 0,
          earnedValueDelta: 230,
          stakeholderImpacts: [
            { stakeholderId: 'takayama', satisfactionDelta: 1 },
            { stakeholderId: 'suzuki', satisfactionDelta: -1 },
          ],
          riskImpacts: [
            { action: 'add', riskId: 'risk-quality-compromise', description: '値引きによるベンダー品質低下リスク', probability: 'medium', impact: 'medium' },
          ],
        },
        feedback: '値引きは予算確保に有効ですが、品質やスコープへの影響を明確にする必要があります。',
        pmbokReference: 'PMBOK: プロジェクト調達マネジメント - ベンダー交渉ではWin-Winの関係を目指すことが長期的な成功につながります。',
      },
      {
        id: 'req-3-c',
        text: '複数ベンダーに相見積もりを取り、競争入札で最適な条件を引き出す。',
        effects: {
          costImpact: -100,
          scheduleImpact: 1,
          earnedValueDelta: 240,
          stakeholderImpacts: [
            { stakeholderId: 'takayama', satisfactionDelta: 1 },
            { stakeholderId: 'suzuki', satisfactionDelta: -1 },
          ],
          riskImpacts: [],
        },
        feedback: '競争入札は適正価格を把握するのに有効ですが、選定に時間がかかります。',
        pmbokReference: 'PMBOK: プロジェクト調達マネジメント - 調達方式の選択はプロジェクトの制約条件を考慮して決定します。',
      },
    ],
    isRequired: true,
    order: 3,
  },
];
