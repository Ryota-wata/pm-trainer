import { GameEvent } from '@/lib/types/event';

export const preRequirementsEvents: GameEvent[] = [
  {
    id: 'prereq-1',
    phase: 'pre-requirements',
    title: '現状業務分析（As-Is）',
    description: '現行の営業業務フローを可視化し、課題を特定する',
    category: 'スコープ・マネジメント',
    dialogue: [
      { speaker: '田中 美咲', speakerId: 'tanaka', text: '営業の業務フローを整理したいのですが、担当者ごとにやり方が違っていて…顧客管理も案件管理も標準化されていないのが実情です。', emotion: 'worried' },
      { speaker: '山本 真理', speakerId: 'yamamoto', text: '私たちは長年Excelと紙でやってきました。急にシステムに変えると言われても、何が良くなるのか具体的に示してほしいです。', emotion: 'worried' },
      { speaker: '山本 真理', speakerId: 'yamamoto', text: '日々の業務を具体的に言うと、朝はExcelで案件リストを確認し、外出先ではメモを取り、帰社後にExcelに転記しています。月末の営業報告書作成には丸一日かかります。', emotion: 'worried' },
      { speaker: '田中 美咲', speakerId: 'tanaka', text: '顧客からの問い合わせ対応で過去の商談履歴が見つからず、平均15分かかっています。営業担当の退職時には引継ぎに2週間かかることもあります。', emotion: 'worried' },
      { speaker: '中村 裕子', speakerId: 'nakamura', text: '業務フロー図を作成すれば、ボトルネックや重複作業が見えてくるはずです。どの粒度で分析しますか？', emotion: 'neutral' },
    ],
    choices: [
      {
        id: 'prereq-1-a',
        text: '全業務プロセスを詳細にフロー図化し、定量的な課題分析（処理時間、エラー率等）も実施する。',
        effects: {
          costImpact: 80,
          scheduleImpact: 0.5,
          earnedValueDelta: 140,
          stakeholderImpacts: [
            { stakeholderId: 'tanaka', satisfactionDelta: 1 },
            { stakeholderId: 'yamamoto', satisfactionDelta: 1 },
            { stakeholderId: 'nakamura', satisfactionDelta: 1 },
          ],
          riskImpacts: [],
        },
        feedback: '詳細な現状分析は要件定義の品質を高め、手戻りを防ぎます。現場の協力が得られたことも大きな成果です。',
        pmbokReference: 'PMBOK: プロジェクト・スコープ・マネジメント - 現状分析（As-Is分析）は、改善対象の業務を正確に理解するための基本プロセスです。',
      },
      {
        id: 'prereq-1-b',
        text: '主要な業務フローのみ概要レベルで整理し、詳細は要件定義フェーズで確認する。',
        effects: {
          costImpact: 0,
          scheduleImpact: 0,
          earnedValueDelta: 90,
          stakeholderImpacts: [
            { stakeholderId: 'yamamoto', satisfactionDelta: -1 },
          ],
          riskImpacts: [
            { action: 'add', riskId: 'risk-insufficient-analysis', description: '分析不足による要件漏れリスク', probability: 'medium', impact: 'high' },
          ],
        },
        feedback: '概要レベルの分析はスピードがありますが、詳細な課題を見落とす可能性があります。',
        pmbokReference: 'PMBOK: プロジェクト・リスク・マネジメント - 分析フェーズの省略は後工程での手戻りリスクを増大させます。',
      },
      {
        id: 'prereq-1-c',
        text: '現場メンバーと一緒にワークショップ形式で業務フローを整理し、課題を共有する。',
        effects: {
          costImpact: 40,
          scheduleImpact: 0.3,
          earnedValueDelta: 130,
          stakeholderImpacts: [
            { stakeholderId: 'tanaka', satisfactionDelta: 1 },
            { stakeholderId: 'yamamoto', satisfactionDelta: 1 },
          ],
          riskImpacts: [],
        },
        feedback: '現場参加型の分析は当事者意識を醸成し、後の変革への抵抗を減らします。',
        pmbokReference: 'PMBOK: プロジェクト・ステークホルダー・マネジメント - ステークホルダーを早期に巻き込むことでエンゲージメントが向上します。',
      },
    ],
    isRequired: true,
    order: 1,
  },
  {
    id: 'prereq-2',
    phase: 'pre-requirements',
    title: 'あるべき姿定義（To-Be）',
    description: '新システムで実現すべき業務のあるべき姿を定義する',
    category: 'スコープ・マネジメント',
    dialogue: [
      { speaker: '大森 正義', speakerId: 'omori', text: '新システムでは案件の進捗をリアルタイムで把握し、売上予測の精度を上げたい。経営ダッシュボードも実現してほしい。', emotion: 'neutral' },
      { speaker: '佐々木 健太', speakerId: 'sasaki', text: '顧客情報を扱うシステムなので、セキュリティ基準はしっかり確保してほしい。個人情報保護とアクセス制御は最重要だ。', emotion: 'neutral' },
      { speaker: '大森 正義', speakerId: 'omori', text: '具体的なKPIとしては、営業会議の準備時間50%削減、案件の受注率10%向上、顧客対応時間30%短縮を達成したい。', emotion: 'neutral' },
      { speaker: '佐々木 健太', speakerId: 'sasaki', text: '個人情報保護法への準拠は必須だ。アクセス権限は部門・役職ベースで制御し、監査ログの保持期間は5年、バックアップは日次で取得してほしい。', emotion: 'neutral' },
      { speaker: '田中 美咲', speakerId: 'tanaka', text: '理想を言えばキリがないですが、現実的に12ヶ月で何ができるかを見極めたいです。', emotion: 'neutral' },
    ],
    choices: [
      {
        id: 'prereq-2-a',
        text: '理想像を描きつつ、フェーズ分けで段階的に実現するロードマップを作成する。',
        effects: {
          costImpact: 30,
          scheduleImpact: 0.3,
          earnedValueDelta: 140,
          stakeholderImpacts: [
            { stakeholderId: 'omori', satisfactionDelta: 1 },
            { stakeholderId: 'tanaka', satisfactionDelta: 1 },
            { stakeholderId: 'sasaki', satisfactionDelta: 1 },
          ],
          riskImpacts: [],
        },
        feedback: '段階的な実現計画は、理想と現実のバランスを取る優れたアプローチです。',
        pmbokReference: 'PMBOK: プロジェクト統合マネジメント - 段階的詳細化（Progressive Elaboration）は不確実性を管理する有効な手法です。',
      },
      {
        id: 'prereq-2-b',
        text: '全ステークホルダーの要望をすべて取り込んだ理想的なTo-Beを定義する。',
        effects: {
          costImpact: 50,
          scheduleImpact: 0.2,
          earnedValueDelta: 100,
          stakeholderImpacts: [
            { stakeholderId: 'omori', satisfactionDelta: 1 },
          ],
          riskImpacts: [
            { action: 'add', riskId: 'risk-scope-expansion', description: 'スコープ拡大による予算・スケジュール圧迫', probability: 'high', impact: 'high' },
          ],
        },
        feedback: '全要望の取り込みは満足度を高めますが、実現可能性との乖離がリスクになります。',
        pmbokReference: 'PMBOK: プロジェクト・スコープ・マネジメント - スコープの肥大化（ゴールドプレーティング）はプロジェクトリスクを増大させます。',
      },
      {
        id: 'prereq-2-c',
        text: 'コア業務の改善に絞り、最小限のTo-Beを定義する。DX推進の話は次期で対応。',
        effects: {
          costImpact: 0,
          scheduleImpact: 0,
          earnedValueDelta: 110,
          stakeholderImpacts: [
            { stakeholderId: 'omori', satisfactionDelta: -1 },
            { stakeholderId: 'sasaki', satisfactionDelta: -1 },
          ],
          riskImpacts: [],
        },
        feedback: 'スコープを絞ることは安全ですが、経営層の期待との乖離に注意が必要です。',
        pmbokReference: 'PMBOK: プロジェクト・スコープ・マネジメント - スコープ定義では、ステークホルダーの期待値と実現可能性のバランスが重要です。',
      },
    ],
    isRequired: true,
    order: 2,
  },
];
