import { GameEvent } from '@/lib/types/event';

export const testingEvents: GameEvent[] = [
  {
    id: 'test-1',
    phase: 'testing',
    title: 'テスト計画・実施',
    description: 'テスト計画を策定し、結合テスト・システムテストを実施する',
    category: '品質マネジメント',
    dialogue: [
      { speaker: '中村 裕子', speakerId: 'nakamura', text: '結合テストに入ります。テストケースは全部で500件。自動テストと手動テストの比率をどうしますか？', emotion: 'neutral' },
      { speaker: '鈴木 大輔', speakerId: 'suzuki', text: '自動テストの環境構築に2週間かかりますが、長期的にはテスト効率が大幅に上がります。', emotion: 'neutral' },
      { speaker: '田中 美咲', speakerId: 'tanaka', text: '業務シナリオベースのテストケースも入れてほしいです。実際の業務フローで問題ないか確認したいです。', emotion: 'neutral' },
    ],
    choices: [
      {
        id: 'test-1-a',
        text: '自動テスト環境を構築し、業務シナリオテストも含めた包括的なテスト計画で実施する。',
        effects: {
          costImpact: 80,
          scheduleImpact: 0.5,
          earnedValueDelta: 360,
          stakeholderImpacts: [
            { stakeholderId: 'nakamura', satisfactionDelta: 1 },
            { stakeholderId: 'tanaka', satisfactionDelta: 1 },
          ],
          riskImpacts: [],
          qualityImpact: { testCoverage: 'full' },
        },
        feedback: '包括的なテスト計画は品質の確保に最も効果的です。',
        pmbokReference: 'PMBOK: プロジェクト・品質マネジメント - テスト計画はV字モデルに基づき、要件から逆算したテストレベルを定義します。',
      },
      {
        id: 'test-1-b',
        text: '手動テスト中心で進め、重要な機能のみ自動テストを適用する。',
        effects: {
          costImpact: 0,
          scheduleImpact: 0,
          earnedValueDelta: 300,
          stakeholderImpacts: [],
          riskImpacts: [
            { action: 'add', riskId: 'risk-insufficient-testing', description: 'テスト網羅性不足による品質リスク', probability: 'medium', impact: 'medium' },
          ],
          qualityImpact: { testCoverage: 'partial' },
        },
        feedback: '手動テスト中心はコスト効率が良いですが、回帰テストの品質に不安が残ります。',
        pmbokReference: 'PMBOK: プロジェクト・品質マネジメント - テスト戦略はリスクベースで優先順位をつけることが重要です。',
      },
      {
        id: 'test-1-c',
        text: 'テスト期間を短縮し、主要機能の動作確認のみに絞る。スケジュール遵守を優先。',
        effects: {
          costImpact: -50,
          scheduleImpact: -0.3,
          earnedValueDelta: 250,
          stakeholderImpacts: [
            { stakeholderId: 'nakamura', satisfactionDelta: -1 },
          ],
          riskImpacts: [
            { action: 'add', riskId: 'risk-quality-issues', description: 'テスト不足による本番障害リスク', probability: 'high', impact: 'high' },
          ],
          qualityImpact: { testCoverage: 'minimal', reviewsSkipped: 1 },
        },
        feedback: 'テスト期間の短縮は品質リスクを大幅に増加させます。本番障害のコストはテストコストを大きく上回ります。',
        pmbokReference: 'PMBOK: プロジェクト・品質マネジメント - テスト工程の短縮は品質低下の主要因です。品質コスト（失敗コスト）の観点から慎重に判断すべきです。',
      },
    ],
    isRequired: true,
    order: 1,
  },
  {
    id: 'test-2',
    phase: 'testing',
    title: '品質問題・変更管理対応',
    description: 'テスト中に発見された品質問題と変更要求に対応する',
    category: '統合マネジメント',
    dialogue: [
      { speaker: '田中 美咲', speakerId: 'tanaka', text: '経営会議で基幹システム（ERP）との連携が必須になりました。今回のシステムに組み込めませんか？', emotion: 'worried' },
      { speaker: '中村 裕子', speakerId: 'nakamura', text: '基幹システム連携を追加すると、開発に+1.5ヶ月、コストに+300万程度かかると見積もっています。', emotion: 'neutral' },
      { speaker: '高山 誠一', speakerId: 'takayama', text: '連携は営業と経理の二重入力を無くすために必要だが、予算と期限は動かせない。なんとかならないか？', emotion: 'angry' },
    ],
    choices: [
      {
        id: 'test-2-a',
        text: '変更要求を正式に受け付け、基幹システム連携の影響分析を行った上で変更管理委員会（CCB）に諮る。',
        effects: {
          costImpact: 50,
          scheduleImpact: 0.3,
          earnedValueDelta: 350,
          stakeholderImpacts: [
            { stakeholderId: 'tanaka', satisfactionDelta: 1 },
            { stakeholderId: 'takayama', satisfactionDelta: 1 },
          ],
          riskImpacts: [],
        },
        feedback: '変更管理プロセスを通じた対応は、透明性と合意形成に優れています。',
        pmbokReference: 'PMBOK: プロジェクト統合マネジメント - 統合変更管理では、すべての変更要求を正式なプロセスで評価・承認・追跡します。',
      },
      {
        id: 'test-2-b',
        text: '他の優先度の低い機能を削除して、基幹システム連携を入れ替える。',
        effects: {
          costImpact: 0,
          scheduleImpact: 0,
          earnedValueDelta: 310,
          stakeholderImpacts: [
            { stakeholderId: 'tanaka', satisfactionDelta: -1 },
          ],
          riskImpacts: [
            { action: 'add', riskId: 'risk-missing-features', description: '削除された機能による業務影響', probability: 'medium', impact: 'medium' },
          ],
          qualityImpact: { reviewsSkipped: 1 },
        },
        feedback: 'スコープのトレードオフは有効ですが、削除する機能の選択には慎重さが必要です。',
        pmbokReference: 'PMBOK: プロジェクト・スコープ・マネジメント - スコープ変更時は、ベースラインとの差分を明確にし影響を評価した上で判断します。',
      },
      {
        id: 'test-2-c',
        text: '予算追加（300万）と期限延長（1.5ヶ月）を要求し、正式にスコープを拡大する。',
        effects: {
          costImpact: 300,
          scheduleImpact: 1.5,
          earnedValueDelta: 290,
          stakeholderImpacts: [
            { stakeholderId: 'takayama', satisfactionDelta: -2 },
            { stakeholderId: 'tanaka', satisfactionDelta: 1 },
          ],
          riskImpacts: [],
        },
        feedback: '正当な変更要求には適切なリソースが必要です。ただし、ステークホルダーの合意が不可欠です。',
        pmbokReference: 'PMBOK: プロジェクト統合マネジメント - 変更の影響を正確に伝え、意思決定者の承認を得ることが重要です。',
      },
    ],
    isRequired: true,
    order: 2,
  },
  {
    id: 'test-3',
    phase: 'testing',
    title: '受入テスト・リリース判定',
    description: 'ユーザー受入テスト（UAT）を実施し、リリース可否を判定する',
    category: '品質マネジメント',
    dialogue: [
      { speaker: '田中 美咲', speakerId: 'tanaka', text: '受入テストで15件の不具合が報告されています。うち3件は業務に支障がある重大なものです。', emotion: 'worried' },
      { speaker: '山本 真理', speakerId: 'yamamoto', text: '操作性は概ね良いのですが、既存のExcel帳票とフォーマットが異なる部分があって実務で問題になりそうです。', emotion: 'worried' },
      { speaker: '佐々木 健太', speakerId: 'sasaki', text: 'セキュリティテストは問題なしだ。ただし、重大不具合の修正後に再テストが必要だ。', emotion: 'neutral' },
    ],
    choices: [
      {
        id: 'test-3-a',
        text: '重大不具合3件を最優先で修正し、再テストを実施する。リリースはテスト完了後に判断。',
        effects: {
          costImpact: 50,
          scheduleImpact: 0.5,
          earnedValueDelta: 355,
          stakeholderImpacts: [
            { stakeholderId: 'tanaka', satisfactionDelta: 1 },
            { stakeholderId: 'yamamoto', satisfactionDelta: 1 },
          ],
          riskImpacts: [],
          qualityImpact: { defectsFound: 15, defectsResolved: 15, testCoverage: 'full' },
        },
        feedback: '品質を確保した上でのリリース判断は正しいアプローチです。',
        pmbokReference: 'PMBOK: プロジェクト・品質マネジメント - 受入テストの目的は成果物が要件を満たすことを検証することです。',
      },
      {
        id: 'test-3-b',
        text: '重大不具合のみ修正し、軽微な問題は本番後のパッチで対応。スケジュールを守る。',
        effects: {
          costImpact: 20,
          scheduleImpact: 0.2,
          earnedValueDelta: 310,
          stakeholderImpacts: [
            { stakeholderId: 'yamamoto', satisfactionDelta: -1 },
          ],
          riskImpacts: [
            { action: 'add', riskId: 'risk-post-release-defects', description: '未修正の不具合が本番運用に影響', probability: 'medium', impact: 'medium' },
          ],
          qualityImpact: { defectsFound: 15, defectsResolved: 3, testCoverage: 'partial' },
        },
        feedback: 'スケジュール重視の判断ですが、本番後の不具合対応コストは通常高くなります。',
        pmbokReference: 'PMBOK: プロジェクト・品質マネジメント - 内部失敗コスト（テスト中の修正）は外部失敗コスト（本番後の修正）より小さいのが一般的です。',
      },
      {
        id: 'test-3-c',
        text: 'すべての不具合を修正し、完全な状態でリリースする。必要に応じてスケジュール延期。',
        effects: {
          costImpact: 100,
          scheduleImpact: 1,
          earnedValueDelta: 340,
          stakeholderImpacts: [
            { stakeholderId: 'takayama', satisfactionDelta: -1 },
          ],
          riskImpacts: [],
          qualityImpact: { defectsFound: 15, defectsResolved: 15, testCoverage: 'full' },
        },
        feedback: '完璧を求めるのは品質意識の高さの表れですが、費用対効果を考慮すべきです。',
        pmbokReference: 'PMBOK: プロジェクト・品質マネジメント - 品質は「要件への適合」であり、「完璧」ではありません。費用対効果を考慮した品質管理が重要です。',
      },
    ],
    isRequired: true,
    order: 3,
  },
];
