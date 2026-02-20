import { GameEvent } from '@/lib/types/event';

export const closingEvents: GameEvent[] = [
  {
    id: 'close-1',
    phase: 'closing',
    title: '展開・導入・引渡し',
    description: 'システムの本番環境への展開と引渡しを行う',
    category: '統合マネジメント',
    dialogue: [
      { speaker: '中村 裕子', speakerId: 'nakamura', text: '本番環境の構築とデータ初期投入のリハーサルは完了しています。本番展開は週末の2日間で実施予定です。', emotion: 'neutral' },
      { speaker: '山本 真理', speakerId: 'yamamoto', text: '新しいシステムの操作研修はいつ受けられるのでしょうか？ちゃんと使えるか不安です。', emotion: 'worried' },
      { speaker: '田中 美咲', speakerId: 'tanaka', text: 'いきなり全機能を使い始めるのは不安です。段階的に導入してもらえませんか？', emotion: 'worried' },
    ],
    choices: [
      {
        id: 'close-1-a',
        text: '2週間の並行運用期間を設け、充実した操作研修も実施する。段階的な移行で安心感を確保。',
        effects: {
          costImpact: 100,
          scheduleImpact: 0.5,
          earnedValueDelta: 140,
          stakeholderImpacts: [
            { stakeholderId: 'yamamoto', satisfactionDelta: 2 },
            { stakeholderId: 'tanaka', satisfactionDelta: 1 },
          ],
          riskImpacts: [],
        },
        feedback: '段階的移行と研修は、ユーザーの不安を軽減しシステム定着率を高めます。',
        pmbokReference: 'PMBOK: プロジェクト・ステークホルダー・マネジメント - 変革管理では、影響を受ける人々への支援（研修・サポート）がシステム導入成功の鍵です。',
      },
      {
        id: 'close-1-b',
        text: '週末に一括切り替えし、翌週からサポート体制を強化する。マニュアルを充実させて対応。',
        effects: {
          costImpact: -50,
          scheduleImpact: -0.3,
          earnedValueDelta: 95,
          stakeholderImpacts: [
            { stakeholderId: 'yamamoto', satisfactionDelta: -2 },
            { stakeholderId: 'tanaka', satisfactionDelta: -1 },
          ],
          riskImpacts: [
            { action: 'add', riskId: 'risk-big-bang-failure', description: 'ビッグバン切替時の大規模障害リスク', probability: 'medium', impact: 'high' },
          ],
        },
        feedback: '一括切り替えは効率的ですが、ユーザーの混乱と抵抗を招くリスクがあります。',
        pmbokReference: 'PMBOK: プロジェクト・リスク・マネジメント - ビッグバン方式の移行はスケジュール効率は良いが、失敗時のインパクトが大きいハイリスクな手法です。',
      },
      {
        id: 'close-1-c',
        text: '部門ごとに段階的に移行する。先行部門の経験を後続に活かす。',
        effects: {
          costImpact: 50,
          scheduleImpact: 0.5,
          earnedValueDelta: 135,
          stakeholderImpacts: [
            { stakeholderId: 'yamamoto', satisfactionDelta: 1 },
            { stakeholderId: 'tanaka', satisfactionDelta: 1 },
            { stakeholderId: 'nakamura', satisfactionDelta: 1 },
          ],
          riskImpacts: [],
        },
        feedback: '段階的展開は最もリスクの低い移行方法です。学習効果も活かせます。',
        pmbokReference: 'PMBOK: プロジェクト統合マネジメント - 段階的な展開（フェーズドロールアウト）は、リスクを分散しフィードバックを活かせる移行戦略です。',
      },
    ],
    isRequired: true,
    order: 1,
  },
  {
    id: 'close-2',
    phase: 'closing',
    title: '教訓収集・完了報告',
    description: 'プロジェクトの教訓を収集し、完了報告を行って正式に終結する',
    category: '統合マネジメント',
    dialogue: [
      { speaker: '中村 裕子', speakerId: 'nakamura', text: '振り返りを行いたいのですが、チームメンバーの率直な意見を集めるにはどうすべきでしょうか。', emotion: 'neutral' },
      { speaker: '高山 誠一', speakerId: 'takayama', text: '最終的な成果と実績を報告してくれ。予算と期限の遵守状況も含めて。教訓を次に活かしたい。', emotion: 'neutral' },
      { speaker: '田中 美咲', speakerId: 'tanaka', text: '新システムのおかげで案件の進捗が一目で分かるようになり、営業会議の準備時間が半分以下になりました！', emotion: 'happy' },
    ],
    choices: [
      {
        id: 'close-2-a',
        text: '全ステークホルダーのレトロスペクティブとROI分析を含む包括的な完了報告書を作成する。',
        effects: {
          costImpact: 10,
          scheduleImpact: 0.2,
          earnedValueDelta: 140,
          stakeholderImpacts: [
            { stakeholderId: 'takayama', satisfactionDelta: 1 },
            { stakeholderId: 'omori', satisfactionDelta: 2 },
            { stakeholderId: 'suzuki', satisfactionDelta: 1 },
          ],
          riskImpacts: [],
          qualityImpact: { defectsResolved: 2 },
        },
        feedback: '包括的な振り返りとROI分析は組織の成長に最も貢献するアプローチです。',
        pmbokReference: 'PMBOK: プロジェクト統合マネジメント - 教訓の収集とプロジェクト終結はPMBOKの重要プロセスです。ベネフィットの実現確認も含みます。',
      },
      {
        id: 'close-2-b',
        text: 'PMとチームリーダーのみで簡潔に振り返り、要点だけまとめて報告する。',
        effects: {
          costImpact: 0,
          scheduleImpact: 0,
          earnedValueDelta: 85,
          stakeholderImpacts: [
            { stakeholderId: 'suzuki', satisfactionDelta: -1 },
            { stakeholderId: 'takayama', satisfactionDelta: -1 },
          ],
          riskImpacts: [],
        },
        feedback: '効率的ですが、多様な視点が反映されず、重要な教訓を見逃す可能性があります。',
        pmbokReference: 'PMBOK: プロジェクト統合マネジメント - 教訓収集では多様なステークホルダーの視点を取り入れることが推奨されます。',
      },
      {
        id: 'close-2-c',
        text: 'アンケートで匿名フィードバックを集め、DX推進の次ステップも含めた報告書を作成する。',
        effects: {
          costImpact: 0,
          scheduleImpact: 0.1,
          earnedValueDelta: 130,
          stakeholderImpacts: [
            { stakeholderId: 'takayama', satisfactionDelta: 1 },
            { stakeholderId: 'omori', satisfactionDelta: 1 },
          ],
          riskImpacts: [],
        },
        feedback: '匿名フィードバックは率直な意見を引き出しやすく、次期提案も付加価値があります。',
        pmbokReference: 'PMBOK: プロジェクト統合マネジメント - 教訓収集の手法にはインタビュー、ワークショップ、アンケート等があり、状況に応じて選択します。',
      },
    ],
    unlockDocument: 'lessons-learned',
    isRequired: true,
    order: 2,
  },
];
