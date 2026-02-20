import { GameEvent } from '@/lib/types/event';

export const initiationEvents: GameEvent[] = [
  {
    id: 'init-1',
    phase: 'initiation',
    title: 'スポンサー面談・プロジェクト憲章作成',
    description: '営業本部長の高山さんとプロジェクトの目的・期待値を確認し、プロジェクト憲章を作成する',
    category: '統合マネジメント',
    dialogue: [
      { speaker: '高山 誠一', speakerId: 'takayama', text: 'PMに就任してくれてありがとう。今回のプロジェクトは会社にとって非常に重要だ。', emotion: 'neutral' },
      { speaker: '高山 誠一', speakerId: 'takayama', text: '営業部門では顧客情報や案件管理がExcelや紙ベースで、情報共有や進捗把握に大きな課題がある。新しいシステムをフルスクラッチで開発して営業力を強化したい。', emotion: 'neutral' },
      { speaker: '高山 誠一', speakerId: 'takayama', text: '予算は5,000万円、期間は12ヶ月だ。まずはプロジェクト憲章を作成して、正式にキックオフしたい。', emotion: 'neutral' },
    ],
    choices: [
      {
        id: 'init-1-a',
        text: '目的・成功基準・制約条件を明記した詳細な憲章を作成し、経営会議で承認を得る。',
        effects: {
          costImpact: 50,
          scheduleImpact: 0.3,
          earnedValueDelta: 90,
          stakeholderImpacts: [
            { stakeholderId: 'takayama', satisfactionDelta: 1 },
          ],
          riskImpacts: [],
        },
        feedback: '詳細な憲章はプロジェクトの公式な認可文書として、後工程での指針になります。',
        pmbokReference: 'PMBOK: プロジェクト統合マネジメント - プロジェクト憲章の作成では、目的、成功基準、主要ステークホルダー、前提条件・制約条件を明記します。',
      },
      {
        id: 'init-1-b',
        text: '要点を絞ったコンパクトな憲章を迅速に作成し、詳細は後工程で詰める。',
        effects: {
          costImpact: 0,
          scheduleImpact: 0,
          earnedValueDelta: 50,
          stakeholderImpacts: [
            { stakeholderId: 'takayama', satisfactionDelta: -1 },
          ],
          riskImpacts: [
            { action: 'add', riskId: 'risk-incomplete-charter', description: '憲章の不備によるスコープ解釈のズレ', probability: 'medium', impact: 'medium' },
          ],
        },
        feedback: 'スピードは大事ですが、憲章が不十分だとスコープの解釈違いが生じるリスクがあります。',
        pmbokReference: 'PMBOK: プロジェクト統合マネジメント - 憲章が不十分だと、後工程で期待値のズレやスコープクリープを招きます。',
      },
      {
        id: 'init-1-c',
        text: 'テンプレートベースで効率的に作成し、レビュー会議で主要ステークホルダーの承認を得る。',
        effects: {
          costImpact: 20,
          scheduleImpact: 0.2,
          earnedValueDelta: 80,
          stakeholderImpacts: [
            { stakeholderId: 'takayama', satisfactionDelta: 1 },
            { stakeholderId: 'sasaki', satisfactionDelta: 1 },
          ],
          riskImpacts: [],
        },
        feedback: 'テンプレート活用とレビュー会議の組み合わせは効率的かつ合意形成に有効です。',
        pmbokReference: 'PMBOK: プロジェクト統合マネジメント - 組織のプロセス資産（テンプレート等）を活用し、ステークホルダーの合意を得ることが推奨されます。',
      },
    ],
    unlockDocument: 'charter',
    isRequired: true,
    order: 1,
  },
  {
    id: 'init-2',
    phase: 'initiation',
    title: 'ビジネスニーズ・要求ヒアリング',
    description: '営業企画課長の田中さんや関連部署からビジネスニーズと要求を収集する',
    category: 'ステークホルダー・マネジメント',
    dialogue: [
      { speaker: '田中 美咲', speakerId: 'tanaka', text: '今は顧客情報がExcelのファイルに散在していて、担当者ごとにバラバラなんです。案件の進捗も把握できず、営業会議の資料作りに毎週半日かかっています。', emotion: 'worried' },
      { speaker: '田中 美咲', speakerId: 'tanaka', text: '外出先からも案件情報を確認・更新できるモバイル対応や、見積書の自動作成機能もほしいのですが…', emotion: 'worried' },
      { speaker: '大森 正義', speakerId: 'omori', text: 'このプロジェクトはDX推進の第一歩だ。成功すれば他部門にも展開したい。ROIを意識してほしい。', emotion: 'neutral' },
    ],
    choices: [
      {
        id: 'init-2-a',
        text: '各部門を個別訪問し、業務課題と要望を網羅的にヒアリングする。ステークホルダー登録簿も作成。',
        effects: {
          costImpact: 50,
          scheduleImpact: 0.4,
          earnedValueDelta: 85,
          stakeholderImpacts: [
            { stakeholderId: 'tanaka', satisfactionDelta: 1 },
            { stakeholderId: 'omori', satisfactionDelta: 1 },
            { stakeholderId: 'yamamoto', satisfactionDelta: 1 },
          ],
          riskImpacts: [],
        },
        feedback: '網羅的なヒアリングはステークホルダーの期待値を正確に把握する最良の方法です。',
        pmbokReference: 'PMBOK: プロジェクト・ステークホルダー・マネジメント - ステークホルダー登録簿と権力/関心度グリッドはステークホルダー分析の重要ツールです。',
      },
      {
        id: 'init-2-b',
        text: '営業部の要望のみ聞いて迅速に進める。他部門は必要に応じて後から対応。',
        effects: {
          costImpact: 0,
          scheduleImpact: 0,
          earnedValueDelta: 45,
          stakeholderImpacts: [
            { stakeholderId: 'omori', satisfactionDelta: -1 },
            { stakeholderId: 'yamamoto', satisfactionDelta: -1 },
          ],
          riskImpacts: [
            { action: 'add', riskId: 'risk-stakeholder-resistance', description: '軽視されたステークホルダーからの後続抵抗', probability: 'medium', impact: 'medium' },
          ],
        },
        feedback: '一部のステークホルダーのみのヒアリングでは、後から追加要求や抵抗が発生するリスクがあります。',
        pmbokReference: 'PMBOK: プロジェクト・ステークホルダー・マネジメント - すべてのステークホルダーの期待値を管理することが抵抗の最小化につながります。',
      },
      {
        id: 'init-2-c',
        text: 'ワークショップ形式で関連部署を集め、要求を一括収集する。優先度も合わせて決める。',
        effects: {
          costImpact: 30,
          scheduleImpact: 0.2,
          earnedValueDelta: 75,
          stakeholderImpacts: [
            { stakeholderId: 'tanaka', satisfactionDelta: 1 },
            { stakeholderId: 'omori', satisfactionDelta: 1 },
          ],
          riskImpacts: [],
        },
        feedback: 'ワークショップは効率的に多様な意見を集め、合意形成にもつながります。',
        pmbokReference: 'PMBOK: プロジェクト・スコープ・マネジメント - 要求事項の収集技法としてワークショップ、インタビュー、アンケート等があります。',
      },
    ],
    isRequired: true,
    order: 2,
  },
];
