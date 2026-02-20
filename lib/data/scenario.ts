import { Scenario } from '@/lib/types/scenario';
import { stakeholders } from './stakeholders';

export const mainScenario: Scenario = {
  id: 'sales-management-system',
  title: '顧客・案件管理システム新規開発プロジェクト',
  company: '東洋テクノロジー株式会社',
  description: '中堅製造業「東洋テクノロジー」（従業員500名）では、営業活動や案件管理がExcel・紙ベースで行われており、情報共有の遅れや属人化が深刻な課題となっている。本プロジェクトでは、顧客管理・案件管理・見積/受注管理・売上分析機能を備えた業務システムをフルスクラッチで新規開発する。あなたはこのプロジェクトのPMとして、様々なステークホルダーと調整しながら、12ヶ月・予算5,000万円でプロジェクトを成功に導く必要があります。',
  duration: 12,
  budget: 5000,
  stakeholders,
  events: [],
};
