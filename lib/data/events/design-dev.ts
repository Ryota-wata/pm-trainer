import { GameEvent } from '@/lib/types/event';

export const designDevEvents: GameEvent[] = [
  {
    id: 'dev-1',
    phase: 'design-dev',
    title: '基本設計・詳細設計',
    description: 'システムの基本設計と詳細設計を行い、開発の土台を固める',
    category: '品質マネジメント',
    dialogue: [
      { speaker: '中村 裕子', speakerId: 'nakamura', text: '基本設計のレビューに入ります。アーキテクチャはマイクロサービスベースで進める方針でよいですか？', emotion: 'neutral' },
      { speaker: '鈴木 大輔', speakerId: 'suzuki', text: 'マイクロサービスは柔軟性が高いですが、チームの経験が少ないと実装リスクが上がります。モノリスの方が安全かもしれません。', emotion: 'neutral' },
      { speaker: '佐々木 健太', speakerId: 'sasaki', text: 'どちらにしても、セキュリティアーキテクチャはしっかり設計してほしい。', emotion: 'neutral' },
    ],
    choices: [
      {
        id: 'dev-1-a',
        text: 'マイクロサービスを採用し、十分な設計レビューとプロトタイプ検証を実施する。',
        effects: {
          costImpact: 100,
          scheduleImpact: 0.5,
          earnedValueDelta: 600,
          stakeholderImpacts: [
            { stakeholderId: 'nakamura', satisfactionDelta: 1 },
            { stakeholderId: 'sasaki', satisfactionDelta: 1 },
          ],
          riskImpacts: [],
          qualityImpact: { testCoverage: 'partial' },
        },
        feedback: 'プロトタイプ検証によるリスク軽減は、新技術導入時の王道です。',
        pmbokReference: 'PMBOK: プロジェクト・品質マネジメント - 設計レビューとプロトタイピングは、品質の作り込みに有効な手法です。',
      },
      {
        id: 'dev-1-b',
        text: '安全なモノリスアーキテクチャを採用し、将来的にマイクロサービスに移行可能な設計にする。',
        effects: {
          costImpact: 0,
          scheduleImpact: 0,
          earnedValueDelta: 550,
          stakeholderImpacts: [
            { stakeholderId: 'suzuki', satisfactionDelta: 1 },
          ],
          riskImpacts: [],
        },
        feedback: 'チームのスキルに合わせた現実的な選択です。拡張性も考慮されています。',
        pmbokReference: 'PMBOK: プロジェクト資源マネジメント - チームの能力に合ったアーキテクチャ選択がプロジェクト成功に寄与します。',
      },
      {
        id: 'dev-1-c',
        text: '設計期間を短縮し、アジャイル的に開発しながら設計を詳細化する。',
        effects: {
          costImpact: 0,
          scheduleImpact: -0.3,
          earnedValueDelta: 480,
          stakeholderImpacts: [
            { stakeholderId: 'nakamura', satisfactionDelta: -1 },
          ],
          riskImpacts: [
            { action: 'add', riskId: 'risk-rework', description: '設計不足による手戻りリスク', probability: 'high', impact: 'high' },
          ],
          qualityImpact: { reviewsSkipped: 1 },
        },
        feedback: '設計フェーズの短縮はスケジュールには有効ですが、手戻りリスクが増加します。',
        pmbokReference: 'PMBOK: プロジェクト・スケジュール・マネジメント - ファストトラッキングは依存関係のある作業を並行実施する技法で、リスクの増加を伴います。',
      },
    ],
    isRequired: true,
    order: 1,
  },
  {
    id: 'dev-2',
    phase: 'design-dev',
    title: '開発・品質管理',
    description: '開発作業を進め、コードレビューやテストで品質を管理する',
    category: '品質マネジメント',
    dialogue: [
      { speaker: '中村 裕子', speakerId: 'nakamura', text: 'コードレビューでパフォーマンス上の問題が見つかりました。大量データ処理時にレスポンスが遅くなります。', emotion: 'worried' },
      { speaker: '佐々木 健太', speakerId: 'sasaki', text: 'セキュリティ監査でも指摘事項が3件出ている。本番環境では許容できないレベルだ。', emotion: 'angry' },
      { speaker: '鈴木 大輔', speakerId: 'suzuki', text: '修正にはアーキテクチャの一部見直しが必要で、2-3週間かかります。', emotion: 'worried' },
    ],
    choices: [
      {
        id: 'dev-2-a',
        text: 'パフォーマンスとセキュリティの両方を修正する。品質は妥協しない。',
        effects: {
          costImpact: 150,
          scheduleImpact: 0.7,
          earnedValueDelta: 610,
          stakeholderImpacts: [
            { stakeholderId: 'sasaki', satisfactionDelta: 1 },
            { stakeholderId: 'nakamura', satisfactionDelta: 1 },
          ],
          riskImpacts: [],
          qualityImpact: { defectsFound: 6, defectsResolved: 6, testCoverage: 'full' },
        },
        feedback: '品質への投資は長期的に見て最もコスト効果が高い選択です。',
        pmbokReference: 'PMBOK: プロジェクト・品質マネジメント - 品質コストの概念では、予防コスト・評価コストへの投資が失敗コストを減少させます。',
      },
      {
        id: 'dev-2-b',
        text: 'セキュリティ問題のみ修正し、パフォーマンスは本番後の最適化で対応する。',
        effects: {
          costImpact: 50,
          scheduleImpact: 0.3,
          earnedValueDelta: 550,
          stakeholderImpacts: [
            { stakeholderId: 'sasaki', satisfactionDelta: 1 },
            { stakeholderId: 'yamamoto', satisfactionDelta: -1 },
          ],
          riskImpacts: [
            { action: 'add', riskId: 'risk-performance-issues', description: 'パフォーマンス問題による本番運用リスク', probability: 'high', impact: 'medium' },
          ],
          qualityImpact: { defectsFound: 6, defectsResolved: 3 },
        },
        feedback: 'セキュリティ優先は正しい判断ですが、パフォーマンス問題はユーザー満足度に影響します。',
        pmbokReference: 'PMBOK: プロジェクト・品質マネジメント - 品質要求の優先順位付けでは、安全性・セキュリティが最優先されるべきです。',
      },
      {
        id: 'dev-2-c',
        text: '暫定的な回避策を適用し、本格修正は次期フェーズで対応する。',
        effects: {
          costImpact: 0,
          scheduleImpact: 0,
          earnedValueDelta: 470,
          stakeholderImpacts: [
            { stakeholderId: 'sasaki', satisfactionDelta: -1 },
            { stakeholderId: 'nakamura', satisfactionDelta: -1 },
            { stakeholderId: 'yamamoto', satisfactionDelta: -1 },
          ],
          riskImpacts: [
            { action: 'add', riskId: 'risk-technical-debt', description: '技術的負債の蓄積', probability: 'high', impact: 'high' },
            { action: 'add', riskId: 'risk-security-vulnerability', description: 'セキュリティ脆弱性が残存', probability: 'high', impact: 'high' },
          ],
          qualityImpact: { defectsFound: 6, defectsResolved: 0, reviewsSkipped: 1 },
        },
        feedback: 'ワークアラウンドは一時的な解決策ですが、技術的負債として蓄積されるリスクがあります。',
        pmbokReference: 'PMBOK: プロジェクト・リスク・マネジメント - ワークアラウンドは計画外のリスク対応であり、根本的な解決にはなりません。',
      },
    ],
    isRequired: true,
    order: 2,
  },
  {
    id: 'dev-3',
    phase: 'design-dev',
    title: '中間レビュー・予実管理',
    description: 'プロジェクトの中間レビューを行い、EVM指標で予実を管理する',
    category: 'コスト・マネジメント',
    dialogue: [
      { speaker: '中村 裕子', speakerId: 'nakamura', text: '現時点のEVM指標をまとめました。SPI（スケジュール効率指数）とCPI（コスト効率指数）を報告します。', emotion: 'neutral' },
      { speaker: '高山 誠一', speakerId: 'takayama', text: 'CPI/SPIが1.0未満だと問題だ。このままで大丈夫なのか？具体的な是正措置を示してほしい。', emotion: 'angry' },
      { speaker: '大森 正義', speakerId: 'omori', text: '月次の経営報告で進捗を報告する必要がある。わかりやすい形で説明してくれ。', emotion: 'neutral' },
    ],
    choices: [
      {
        id: 'dev-3-a',
        text: 'EVMデータに基づく詳細な分析レポートを作成し、具体的な是正措置を提案する。',
        effects: {
          costImpact: 0,
          scheduleImpact: 0.2,
          earnedValueDelta: 600,
          stakeholderImpacts: [
            { stakeholderId: 'takayama', satisfactionDelta: 1 },
            { stakeholderId: 'omori', satisfactionDelta: 1 },
          ],
          riskImpacts: [],
        },
        feedback: 'データドリブンな報告と具体的な是正措置は、ステークホルダーの信頼を獲得します。',
        pmbokReference: 'PMBOK: プロジェクト・コスト・マネジメント - EVMはプロジェクトのパフォーマンスを客観的に測定する手法です。SPI<1.0は遅延、CPI<1.0は予算超過を示します。',
      },
      {
        id: 'dev-3-b',
        text: '問題を楽観的に報告し、チームの士気を維持することを優先する。',
        effects: {
          costImpact: 0,
          scheduleImpact: 0,
          earnedValueDelta: 450,
          stakeholderImpacts: [
            { stakeholderId: 'takayama', satisfactionDelta: -2 },
            { stakeholderId: 'omori', satisfactionDelta: -1 },
          ],
          riskImpacts: [
            { action: 'add', riskId: 'risk-trust-erosion', description: '過小報告の発覚によるスポンサーの信頼喪失', probability: 'high', impact: 'high' },
          ],
          qualityImpact: { reviewsSkipped: 1 },
        },
        feedback: '問題を過小報告することは短期的には楽ですが、信頼を失い問題を悪化させます。',
        pmbokReference: 'PMBOK: プロジェクト・コミュニケーション・マネジメント - 正確で透明性のあるコミュニケーションはPMの基本責務です。',
      },
      {
        id: 'dev-3-c',
        text: 'リカバリープランを作成し、重要タスクにリソースを集中投入する。',
        effects: {
          costImpact: 100,
          scheduleImpact: -0.3,
          earnedValueDelta: 570,
          stakeholderImpacts: [
            { stakeholderId: 'takayama', satisfactionDelta: 1 },
          ],
          riskImpacts: [],
        },
        feedback: 'リカバリープランの策定と実行は、遅延時の適切な対応です。',
        pmbokReference: 'PMBOK: プロジェクト・スケジュール・マネジメント - スケジュール遅延時の是正措置には、クラッシング、ファストトラッキング、スコープ調整等があります。',
      },
    ],
    unlockDocument: 'change-log',
    isRequired: true,
    order: 3,
  },
];
