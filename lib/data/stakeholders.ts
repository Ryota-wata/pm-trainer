import { Stakeholder } from '@/lib/types/stakeholder';

export const stakeholders: Stakeholder[] = [
  {
    id: 'takayama',
    name: '高山 誠一',
    role: '取締役営業本部長（プロジェクトスポンサー）',
    department: '経営層',
    personality: 'コスト意識が高く、期限厳守を重視。データに基づく判断を好む。',
    priorities: ['コスト削減', '期限厳守', 'ROI'],
    avatar: '\u{1F454}',
    color: 'bg-indigo-500',
  },
  {
    id: 'tanaka',
    name: '田中 美咲',
    role: '営業企画課長（業務オーナー）',
    department: '営業部',
    personality: '現場目線で使いやすさを重視。改善意欲が高いが、現場への影響を心配する。',
    priorities: ['使いやすさ', '業務効率', '現場定着'],
    avatar: '\u{1F469}\u{200D}\u{1F4BC}',
    color: 'bg-pink-500',
  },
  {
    id: 'sasaki',
    name: '佐々木 健太',
    role: '情報システム部長',
    department: '情報システム部',
    personality: 'セキュリティと品質に厳格。技術的な正確さを求める。',
    priorities: ['セキュリティ', '品質', 'システム安定性'],
    avatar: '\u{1F512}',
    color: 'bg-emerald-500',
  },
  {
    id: 'nakamura',
    name: '中村 裕子',
    role: '開発チームリーダー',
    department: '開発チーム',
    personality: '現実的で、実現可能な見積もりを重視。チームの負荷を気にする。',
    priorities: ['実現可能性', 'チーム負荷', '技術品質'],
    avatar: '\u{1F469}\u{200D}\u{1F4BB}',
    color: 'bg-violet-500',
  },
  {
    id: 'suzuki',
    name: '鈴木 大輔',
    role: 'ベンダーPM',
    department: '外部ベンダー',
    personality: '契約範囲に忠実。追加要件には慎重。プロフェッショナルな対応。',
    priorities: ['契約遵守', 'スコープ管理', '納期'],
    avatar: '\u{1F91D}',
    color: 'bg-amber-500',
  },
  {
    id: 'yamamoto',
    name: '山本 真理',
    role: 'エンドユーザー代表（営業担当者）',
    department: '営業部',
    personality: '変化に不安を感じやすい。丁寧な説明と段階的な導入を好む。',
    priorities: ['操作の簡単さ', '研修充実', '段階的導入'],
    avatar: '\u{1F464}',
    color: 'bg-teal-500',
  },
  {
    id: 'omori',
    name: '大森 正義',
    role: '社長',
    department: '経営層',
    personality: 'ROI重視。大局的な視点で判断。定期的な報告を求める。',
    priorities: ['ROI', '企業競争力', 'DX推進'],
    avatar: '\u{1F468}\u{200D}\u{1F4BC}',
    color: 'bg-red-500',
  },
];

export function getStakeholder(id: string): Stakeholder | undefined {
  return stakeholders.find(s => s.id === id);
}
