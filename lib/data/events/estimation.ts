import { GameEvent } from '@/lib/types/event';

export const estimationEvents: GameEvent[] = [
  {
    id: 'est-1',
    phase: 'estimation',
    title: 'WBS作成・工数算出・積上げ見積',
    description: 'WBSを作成し、ワークパッケージごとに工数を算出して積上げ見積を行う',
    category: 'スコープ・マネジメント',
    dialogue: [
      { speaker: '中村 裕子', speakerId: 'nakamura', text: 'WBSは3階層まで分解すれば管理しやすいと思います。ワークパッケージの粒度が重要です。', emotion: 'neutral' },
      { speaker: '鈴木 大輔', speakerId: 'suzuki', text: '各ワークパッケージの工数を見積もりましょう。3点見積法を使えば精度が上がります。', emotion: 'neutral' },
      { speaker: '中村 裕子', speakerId: 'nakamura', text: '大枠としては、要件定義（2ヶ月）、基本設計（2ヶ月）、詳細設計（1.5ヶ月）、開発（3.5ヶ月）、テスト（2ヶ月）、展開・導入（1ヶ月）を想定しています。', emotion: 'neutral' },
      { speaker: '鈴木 大輔', speakerId: 'suzuki', text: 'ベンダー側はSE2名、PG3名の体制を想定しています。御社側はPM1名、業務担当2名の参画が必要です。ピーク時の開発フェーズは合計8名体制になります。', emotion: 'neutral' },
      { speaker: '中村 裕子', speakerId: 'nakamura', text: 'ボトムアップで積み上げると合計が5,200万になりそうです。予算をどう調整しますか？', emotion: 'worried' },
    ],
    choices: [
      {
        id: 'est-1-a',
        text: '3点見積法（楽観/最頻/悲観）で各タスクを見積もり、PERT法で期待値を算出する。',
        effects: {
          costImpact: 30,
          scheduleImpact: 0.3,
          earnedValueDelta: 185,
          stakeholderImpacts: [
            { stakeholderId: 'nakamura', satisfactionDelta: 1 },
            { stakeholderId: 'suzuki', satisfactionDelta: 1 },
          ],
          riskImpacts: [],
        },
        feedback: '3点見積法は見積りの不確実性を定量化する優れた手法です。',
        pmbokReference: 'PMBOK: プロジェクト・コスト・マネジメント - 3点見積法（PERT: (O+4M+P)/6）は見積りの精度と信頼性を向上させます。',
      },
      {
        id: 'est-1-b',
        text: '過去の類似プロジェクトを参考に、経験則で工数を見積もる。スピード重視。',
        effects: {
          costImpact: 0,
          scheduleImpact: 0,
          earnedValueDelta: 130,
          stakeholderImpacts: [
            { stakeholderId: 'nakamura', satisfactionDelta: -1 },
          ],
          riskImpacts: [
            { action: 'add', riskId: 'risk-estimate-inaccuracy', description: '見積り精度不足による後工程でのコスト超過', probability: 'medium', impact: 'high' },
          ],
        },
        feedback: '経験則は迅速ですが、精度が不安定で根拠が不明確になりがちです。',
        pmbokReference: 'PMBOK: プロジェクト・コスト・マネジメント - 類推見積りは迅速だが、精度は低くなる傾向があります。',
      },
      {
        id: 'est-1-c',
        text: 'ベンダーと共同でWBSを詳細化し、合意ベースの見積りを作成する。',
        effects: {
          costImpact: 40,
          scheduleImpact: 0.4,
          earnedValueDelta: 175,
          stakeholderImpacts: [
            { stakeholderId: 'suzuki', satisfactionDelta: 1 },
            { stakeholderId: 'nakamura', satisfactionDelta: 1 },
          ],
          riskImpacts: [],
        },
        feedback: 'ベンダーとの共同見積りは相互理解を深め、見積り精度を向上させます。',
        pmbokReference: 'PMBOK: プロジェクト調達マネジメント - ベンダーとの協業による見積りは、双方の専門知識を活かせます。',
      },
    ],
    unlockDocument: 'wbs',
    isRequired: true,
    order: 1,
  },
  {
    id: 'est-2',
    phase: 'estimation',
    title: '山積み・山崩し・確定見積',
    description: 'リソースの山積みを確認し、山崩しで平準化してから確定見積を作成する',
    category: 'スケジュール・マネジメント',
    dialogue: [
      { speaker: '中村 裕子', speakerId: 'nakamura', text: '山積みの結果、5月〜7月にリソースが集中し過負荷になっています。平準化が必要です。', emotion: 'worried' },
      { speaker: '鈴木 大輔', speakerId: 'suzuki', text: 'リソースの山崩しをすると、全体スケジュールが1ヶ月延びる可能性があります。', emotion: 'neutral' },
      { speaker: '中村 裕子', speakerId: 'nakamura', text: '主要マイルストーンは、要件定義完了（3月末）、基本設計完了（5月末）、開発完了（9月末）、UAT完了（11月末）、本番稼働（翌年3月末）です。', emotion: 'neutral' },
      { speaker: '中村 裕子', speakerId: 'nakamura', text: 'クリティカルパスは「要件定義→基本設計→詳細設計→開発→結合テスト→UAT」です。基幹システム連携部分はSAP側の改修が必要で、外部依存があります。', emotion: 'neutral' },
      { speaker: '高山 誠一', speakerId: 'takayama', text: 'スケジュールを延ばすのは避けたい。他の方法はないのか？', emotion: 'angry' },
    ],
    choices: [
      {
        id: 'est-2-a',
        text: 'リソースレベリング（山崩し）を実施し、現実的なスケジュールを組む。期限延長を提案。',
        effects: {
          costImpact: 0,
          scheduleImpact: 0.5,
          earnedValueDelta: 185,
          stakeholderImpacts: [
            { stakeholderId: 'nakamura', satisfactionDelta: 1 },
            { stakeholderId: 'takayama', satisfactionDelta: -1 },
          ],
          riskImpacts: [],
        },
        feedback: '現実的なリソース計画は長期的にプロジェクトの安定性を高めます。',
        pmbokReference: 'PMBOK: プロジェクト・スケジュール・マネジメント - リソースレベリングはリソース制約を考慮してスケジュールを最適化する手法です。',
      },
      {
        id: 'est-2-b',
        text: '追加リソース（外部人材）を投入して過負荷を解消する。コスト増は許容。',
        effects: {
          costImpact: 300,
          scheduleImpact: 0,
          earnedValueDelta: 170,
          stakeholderImpacts: [
            { stakeholderId: 'takayama', satisfactionDelta: -1 },
          ],
          riskImpacts: [
            { action: 'add', riskId: 'risk-communication-overhead', description: '人員増加によるコミュニケーションコスト増', probability: 'medium', impact: 'medium' },
          ],
        },
        feedback: 'クラッシングはコスト増と引き換えにスケジュールを維持する手法です。',
        pmbokReference: 'PMBOK: プロジェクト・スケジュール・マネジメント - クラッシングはクリティカルパス上の作業にリソースを追加する手法です。常にコスト増を伴います。',
      },
      {
        id: 'est-2-c',
        text: 'リソーススムージングで過負荷を緩和しつつ、クリティカルパスは維持する。',
        effects: {
          costImpact: 50,
          scheduleImpact: 0.2,
          earnedValueDelta: 175,
          stakeholderImpacts: [
            { stakeholderId: 'nakamura', satisfactionDelta: 1 },
            { stakeholderId: 'takayama', satisfactionDelta: 1 },
          ],
          riskImpacts: [],
        },
        feedback: 'リソーススムージングはフロート内でのリソース平準化で、クリティカルパスに影響を与えません。',
        pmbokReference: 'PMBOK: プロジェクト・スケジュール・マネジメント - リソーススムージングはフリーフロート内でリソースを平準化する手法で、完了日には影響しません。',
      },
    ],
    unlockDocument: 'schedule',
    isRequired: true,
    order: 2,
  },
  {
    id: 'est-3',
    phase: 'estimation',
    title: 'ベースライン設定・合意形成（ゲート2）',
    description: 'スコープ・スケジュール・コストのベースラインを設定し、ステークホルダーの合意を得る',
    category: '統合マネジメント',
    dialogue: [
      { speaker: '高山 誠一', speakerId: 'takayama', text: '最終的な見積りと計画を見せてくれ。これで正式に開発フェーズに入ることになる。', emotion: 'neutral' },
      { speaker: '大森 正義', speakerId: 'omori', text: 'ベースラインが設定されたら、以降の変更は正式な変更管理プロセスを通す必要があるな。', emotion: 'neutral' },
      { speaker: '鈴木 大輔', speakerId: 'suzuki', text: 'ベンダー側もこのベースラインに基づいて体制を確定します。合意後の大幅変更は難しくなります。', emotion: 'neutral' },
    ],
    choices: [
      {
        id: 'est-3-a',
        text: 'スコープ・スケジュール・コストの3つのベースラインを正式に設定し、変更管理プロセスも定義する。',
        effects: {
          costImpact: 20,
          scheduleImpact: 0.2,
          earnedValueDelta: 180,
          stakeholderImpacts: [
            { stakeholderId: 'takayama', satisfactionDelta: 1 },
            { stakeholderId: 'omori', satisfactionDelta: 1 },
            { stakeholderId: 'suzuki', satisfactionDelta: 1 },
          ],
          riskImpacts: [],
        },
        feedback: '3つのベースライン設定は、プロジェクト管理の基盤となる重要なマイルストーンです。',
        pmbokReference: 'PMBOK: プロジェクト統合マネジメント - パフォーマンス測定ベースライン（PMB）はスコープ・スケジュール・コストの統合ベースラインです。',
      },
      {
        id: 'est-3-b',
        text: 'コストベースラインのみ設定し、スコープとスケジュールは柔軟に対応する方針で進める。',
        effects: {
          costImpact: 0,
          scheduleImpact: 0,
          earnedValueDelta: 120,
          stakeholderImpacts: [
            { stakeholderId: 'takayama', satisfactionDelta: -1 },
          ],
          riskImpacts: [
            { action: 'add', riskId: 'risk-scope-creep', description: 'ベースライン未設定によるスコープクリープ', probability: 'high', impact: 'high' },
          ],
        },
        feedback: 'コストのみのベースライン設定は不十分です。スコープ・スケジュールの管理が困難になります。',
        pmbokReference: 'PMBOK: プロジェクト統合マネジメント - 3つのベースラインが揃わないと、EVMによるパフォーマンス測定ができません。',
      },
      {
        id: 'est-3-c',
        text: 'ベースラインを設定するが、一定の変更予備（マネジメント予備10%）も確保する。',
        effects: {
          costImpact: 30,
          scheduleImpact: 0.1,
          earnedValueDelta: 170,
          stakeholderImpacts: [
            { stakeholderId: 'takayama', satisfactionDelta: 1 },
            { stakeholderId: 'omori', satisfactionDelta: 1 },
          ],
          riskImpacts: [],
        },
        feedback: 'マネジメント予備の確保はリスク対応力を高める賢明な判断です。',
        pmbokReference: 'PMBOK: プロジェクト・コスト・マネジメント - マネジメント予備はベースラインに含まれず、予算の一部として管理されます。',
      },
    ],
    isRequired: true,
    order: 3,
  },
];
