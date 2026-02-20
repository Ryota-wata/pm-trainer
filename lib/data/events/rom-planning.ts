import { GameEvent } from '@/lib/types/event';

export const romPlanningEvents: GameEvent[] = [
  {
    id: 'rom-1',
    phase: 'rom-planning',
    title: '機能洗い出し・超概算見積',
    description: '必要な機能を洗い出し、ROM（超概算）レベルの見積を作成する',
    category: 'コスト・マネジメント',
    dialogue: [
      { speaker: '中村 裕子', speakerId: 'nakamura', text: 'As-Is/To-Be分析の結果から、大きく5つの機能群が必要と見ています。概算で工数を見積もりましょう。', emotion: 'neutral' },
      { speaker: '鈴木 大輔', speakerId: 'suzuki', text: 'この段階では±50%程度の精度が一般的です。類似プロジェクトの実績から概算を出しましょう。', emotion: 'neutral' },
      { speaker: '高山 誠一', speakerId: 'takayama', text: '超概算でも構わないから、まず全体感を掴みたい。5,000万で収まりそうか？', emotion: 'neutral' },
    ],
    choices: [
      {
        id: 'rom-1-a',
        text: '類推見積とパラメトリック見積を併用し、幅を持たせた超概算（3,500万〜5,500万）を提示する。',
        effects: {
          costImpact: 20,
          scheduleImpact: 0.2,
          earnedValueDelta: 130,
          stakeholderImpacts: [
            { stakeholderId: 'takayama', satisfactionDelta: 1 },
            { stakeholderId: 'suzuki', satisfactionDelta: 1 },
          ],
          riskImpacts: [],
        },
        feedback: '幅を持たせた見積は誠実であり、精度向上の余地を示す適切なアプローチです。',
        pmbokReference: 'PMBOK: プロジェクト・コスト・マネジメント - ROM見積は±25%〜±75%の精度が一般的です。類推見積りとパラメトリック見積りの併用が推奨されます。',
      },
      {
        id: 'rom-1-b',
        text: '過去の類似案件から4,800万と概算し、予算内に収まると報告する。',
        effects: {
          costImpact: 0,
          scheduleImpact: 0,
          earnedValueDelta: 90,
          stakeholderImpacts: [
            { stakeholderId: 'takayama', satisfactionDelta: 1 },
          ],
          riskImpacts: [
            { action: 'add', riskId: 'risk-underestimate', description: '楽観的な見積りによる後工程での予算超過', probability: 'medium', impact: 'high' },
          ],
        },
        feedback: '単一数値の提示は分かりやすいですが、不確実性を隠すリスクがあります。',
        pmbokReference: 'PMBOK: プロジェクト・コスト・マネジメント - 見積りの精度はプロジェクトの進行とともに向上します。初期段階で確定的な数値を示すのは危険です。',
      },
      {
        id: 'rom-1-c',
        text: '機能ごとにざっくりとした工数を積み上げ、ボトムアップの概算を作成する。',
        effects: {
          costImpact: 40,
          scheduleImpact: 0.3,
          earnedValueDelta: 120,
          stakeholderImpacts: [
            { stakeholderId: 'nakamura', satisfactionDelta: 1 },
          ],
          riskImpacts: [],
        },
        feedback: 'ボトムアップ的なアプローチは根拠が明確になりますが、この段階では時間がかかりすぎる面もあります。',
        pmbokReference: 'PMBOK: プロジェクト・コスト・マネジメント - ボトムアップ見積りは精度が高いが、十分な情報が必要です。ROM段階ではトップダウンとの併用が実務的です。',
      },
    ],
    isRequired: true,
    order: 1,
  },
  {
    id: 'rom-2',
    phase: 'rom-planning',
    title: 'PM計画策定（リスク・品質・調達含む）',
    description: 'プロジェクトマネジメント計画を策定する（リスク、品質、調達計画を含む）',
    category: 'リスク・マネジメント',
    dialogue: [
      { speaker: '佐々木 健太', speakerId: 'sasaki', text: 'フルスクラッチ開発なので、要件の認識ズレによる手戻りリスクが最も心配だ。リスク対応計画をしっかり立ててほしい。', emotion: 'worried' },
      { speaker: '中村 裕子', speakerId: 'nakamura', text: '品質基準と調達方針も決めておく必要があります。ベンダー選定の評価基準はどうしますか？', emotion: 'neutral' },
      { speaker: '山本 真理', speakerId: 'yamamoto', text: '新しいシステムを導入しても、営業担当が使いこなせなければ意味がないと思います。定着しないリスクもありますよね。', emotion: 'worried' },
      { speaker: '中村 裕子', speakerId: 'nakamura', text: '過去の類似プロジェクトでは、要件の手戻りが平均2回発生し、その都度1ヶ月の遅延が出ています。新技術導入時の学習コストも見積りに含める必要があります。', emotion: 'neutral' },
      { speaker: '佐々木 健太', speakerId: 'sasaki', text: '品質基準として、単体テストカバレッジ80%以上、結合テストのバグ密度0.5件/KL以下を設定したい。セキュリティ脆弱性診断も必須だ。', emotion: 'neutral' },
    ],
    choices: [
      {
        id: 'rom-2-a',
        text: 'リスク・品質・調達の各計画を包括的に策定する。確率・影響度マトリクスで定性的リスク分析を実施。',
        effects: {
          costImpact: 80,
          scheduleImpact: 0.5,
          earnedValueDelta: 135,
          stakeholderImpacts: [
            { stakeholderId: 'sasaki', satisfactionDelta: 1 },
            { stakeholderId: 'nakamura', satisfactionDelta: 1 },
          ],
          riskImpacts: [
            { action: 'add', riskId: 'risk-requirements-gap', description: '要件認識のズレによる手戻り', probability: 'medium', impact: 'high', response: 'プロトタイプレビューと段階的な要件確認（軽減戦略）' },
            { action: 'add', riskId: 'risk-tech-selection', description: '技術選定の失敗による品質リスク', probability: 'low', impact: 'high', response: 'POC実施と技術検証（軽減戦略）' },
            { action: 'add', riskId: 'risk-user-adoption', description: '営業担当のシステム定着リスク', probability: 'medium', impact: 'medium', response: '段階的導入と研修プログラム（軽減戦略）' },
          ],
        },
        feedback: '包括的なリスク分析により3件のリスクを識別し、それぞれに対応策（軽減戦略）を策定できました。事前にリスクを識別・対応策を準備することで、問題発生時の対応力が大幅に向上します。',
        pmbokReference: 'PMBOK: プロジェクト・リスク・マネジメント - リスク特定→定性的分析（確率・影響度マトリクス）→対応策立案のプロセスが推奨されます。定量的分析（モンテカルロ等）は大規模・高リスクプロジェクトで実施します。',
      },
      {
        id: 'rom-2-b',
        text: '影響度の高いリスク上位に絞って対応策を策定し、品質・調達は要件定義後に計画する。',
        effects: {
          costImpact: 0,
          scheduleImpact: 0,
          earnedValueDelta: 100,
          stakeholderImpacts: [],
          riskImpacts: [
            { action: 'add', riskId: 'risk-requirements-gap', description: '要件認識のズレによる手戻り', probability: 'medium', impact: 'high', response: '要件レビューの強化（軽減戦略）' },
            { action: 'add', riskId: 'risk-tech-selection', description: '技術選定の失敗', probability: 'low', impact: 'high', response: '基本的な技術検証（軽減戦略）' },
            { action: 'add', riskId: 'risk-user-adoption', description: '営業担当のシステム定着リスク', probability: 'medium', impact: 'medium' },
          ],
        },
        feedback: '重要リスクへの集中は効率的ですが、ユーザー定着リスクに対応策がなく、品質・調達計画の後回しもリスクを伴います。',
        pmbokReference: 'PMBOK: プロジェクト・リスク・マネジメント - リスクの優先順位付け（定性的分析）は限られたリソースの有効活用に役立ちますが、低優先度リスクも監視リストに記録すべきです。',
      },
      {
        id: 'rom-2-c',
        text: 'リスクは認識するが詳細な計画は立てず、発生時に対応する方針で進める。',
        effects: {
          costImpact: 0,
          scheduleImpact: 0,
          earnedValueDelta: 70,
          stakeholderImpacts: [
            { stakeholderId: 'sasaki', satisfactionDelta: -1 },
            { stakeholderId: 'nakamura', satisfactionDelta: -1 },
          ],
          riskImpacts: [
            { action: 'add', riskId: 'risk-requirements-gap', description: '要件認識のズレによる手戻り（未対応）', probability: 'medium', impact: 'high' },
            { action: 'add', riskId: 'risk-tech-selection', description: '技術選定の失敗（未対応）', probability: 'low', impact: 'high' },
            { action: 'add', riskId: 'risk-user-adoption', description: '営業担当のシステム定着リスク（未対応）', probability: 'medium', impact: 'medium' },
          ],
        },
        feedback: 'リスクは存在しますが対応策が策定されていません。受容（事後対応）戦略は、問題発生時のコストが事前の軽減策の数倍になることがあります。',
        pmbokReference: 'PMBOK: プロジェクト・リスク・マネジメント - リスク対応戦略には回避・軽減・転嫁・受容があります。受容は意図的な判断であるべきで、計画の怠慢であってはなりません。',
      },
    ],
    unlockDocument: 'risk-register',
    isRequired: true,
    order: 2,
  },
  {
    id: 'rom-3',
    phase: 'rom-planning',
    title: 'ステークホルダー合意形成（ゲート1）',
    description: '超概算見積とPM計画をステークホルダーに説明し、プロジェクト推進の合意を得る',
    category: 'ステークホルダー・マネジメント',
    dialogue: [
      { speaker: '高山 誠一', speakerId: 'takayama', text: 'ここまでの分析結果と概算を見せてもらった。5,000万でやれるのか、正直に言ってほしい。', emotion: 'neutral' },
      { speaker: '大森 正義', speakerId: 'omori', text: '経営会議でGo/No-Goの判断をしなければならない。リスクも含めて判断材料がほしい。', emotion: 'neutral' },
      { speaker: '田中 美咲', speakerId: 'tanaka', text: '現場としてはぜひ進めてほしいですが、無理のないスケジュールでお願いしたいです。', emotion: 'neutral' },
    ],
    choices: [
      {
        id: 'rom-3-a',
        text: 'リスクと不確実性を正直に説明し、条件付きでの推進を提案する。マイルストーンごとの見直しポイントも設定。',
        effects: {
          costImpact: 10,
          scheduleImpact: 0.2,
          earnedValueDelta: 130,
          stakeholderImpacts: [
            { stakeholderId: 'takayama', satisfactionDelta: 1 },
            { stakeholderId: 'omori', satisfactionDelta: 1 },
            { stakeholderId: 'tanaka', satisfactionDelta: 1 },
          ],
          riskImpacts: [],
        },
        feedback: '透明性のある報告と段階的な見直しポイントの設定は、信頼構築に最適です。',
        pmbokReference: 'PMBOK: プロジェクト・ステークホルダー・マネジメント - ステークホルダーとの合意形成では、正確な情報提供と段階的なコミットメントが効果的です。',
      },
      {
        id: 'rom-3-b',
        text: '楽観的な見通しを示し、予算内・期限内で完了できると断言する。',
        effects: {
          costImpact: 0,
          scheduleImpact: 0,
          earnedValueDelta: 80,
          stakeholderImpacts: [
            { stakeholderId: 'takayama', satisfactionDelta: 1 },
          ],
          riskImpacts: [
            { action: 'add', riskId: 'risk-trust-erosion', description: '過度な楽観報告による後の信頼喪失', probability: 'high', impact: 'high' },
          ],
        },
        feedback: '楽観的な報告は短期的に承認を得やすいですが、後で問題が顕在化した時のダメージが大きくなります。',
        pmbokReference: 'PMBOK: プロジェクト・コミュニケーション・マネジメント - 正確で透明性のあるコミュニケーションはPMの基本責務です。',
      },
      {
        id: 'rom-3-c',
        text: 'スコープを縮小した安全案と、フルスコープのチャレンジ案の2案を提示し、経営に選択させる。',
        effects: {
          costImpact: 20,
          scheduleImpact: 0.1,
          earnedValueDelta: 120,
          stakeholderImpacts: [
            { stakeholderId: 'takayama', satisfactionDelta: 1 },
            { stakeholderId: 'omori', satisfactionDelta: 1 },
          ],
          riskImpacts: [],
        },
        feedback: '複数案の提示は経営層に選択肢を与え、当事者意識を持たせる良いアプローチです。',
        pmbokReference: 'PMBOK: プロジェクト統合マネジメント - 意思決定者に選択肢とトレードオフを提示することで、合理的な判断を促せます。',
      },
    ],
    isRequired: true,
    order: 3,
  },
];
