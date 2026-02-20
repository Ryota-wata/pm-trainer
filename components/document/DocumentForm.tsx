'use client';

import { useState } from 'react';
import { DocumentType, CharterData, RequirementsData, WbsData, ScheduleData, RiskRegisterData, ChangeLogData, LessonsLearnedData } from '@/lib/types/document';
import { useDocumentStore } from '@/lib/stores/documentStore';
import { useGameStore } from '@/lib/stores/gameStore';
import { getDocumentCompletionBonus } from '@/lib/engine/effects';
import Button from '@/components/ui/Button';

interface DocumentFormProps {
  docType: DocumentType;
  onSaved: () => void;
}

export default function DocumentForm({ docType, onSaved }: DocumentFormProps) {
  const { documents, updateDocument, completeDocument } = useDocumentStore();
  const { applyChoiceEffects } = useGameStore();
  const doc = documents[docType];
  const [data, setData] = useState(doc.data);

  const handleSave = () => {
    updateDocument(docType, data);
    onSaved();
  };

  const handleComplete = () => {
    updateDocument(docType, data);
    completeDocument(docType);
    const bonus = getDocumentCompletionBonus(docType);
    applyChoiceEffects(bonus);
    onSaved();
  };

  const updateField = (field: string, value: unknown) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {docType === 'charter' && <CharterForm data={data as CharterData} onChange={updateField} />}
      {docType === 'requirements' && <RequirementsForm data={data as RequirementsData} onChange={updateField} />}
      {docType === 'wbs' && <WbsForm data={data as WbsData} onChange={updateField} />}
      {docType === 'schedule' && <ScheduleForm data={data as ScheduleData} onChange={updateField} />}
      {docType === 'risk-register' && <RiskRegisterForm data={data as RiskRegisterData} onChange={updateField} />}
      {docType === 'change-log' && <ChangeLogForm data={data as ChangeLogData} onChange={updateField} />}
      {docType === 'lessons-learned' && <LessonsLearnedForm data={data as LessonsLearnedData} onChange={updateField} />}

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="secondary" onClick={handleSave}>下書き保存</Button>
        <Button onClick={handleComplete}>完成として保存</Button>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, multiline }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {multiline ? (
        <textarea className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-y min-h-20" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} />
      ) : (
        <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      )}
    </div>
  );
}

function ListField({ label, items, onChange, placeholder }: { label: string; items: string[]; onChange: (items: string[]) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <input className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400" value={item} onChange={e => { const newItems = [...items]; newItems[i] = e.target.value; onChange(newItems); }} placeholder={placeholder} />
          {items.length > 1 && <button className="text-red-400 hover:text-red-600 px-2" onClick={() => onChange(items.filter((_, j) => j !== i))}>×</button>}
        </div>
      ))}
      <button className="text-sm text-blue-600 hover:text-blue-800" onClick={() => onChange([...items, ''])}>+ 追加</button>
    </div>
  );
}

function CharterForm({ data, onChange }: { data: CharterData; onChange: (field: string, value: unknown) => void }) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">基本情報</h3>
      <div className="grid grid-cols-2 gap-4">
        <InputField label="プロジェクト名" value={data.projectName} onChange={v => onChange('projectName', v)} />
        <InputField label="プロジェクトマネージャー" value={data.projectManager} onChange={v => onChange('projectManager', v)} placeholder="あなたの名前" />
        <InputField label="スポンサー" value={data.sponsor} onChange={v => onChange('sponsor', v)} />
        <InputField label="承認者" value={data.approver} onChange={v => onChange('approver', v)} />
        <InputField label="開始日" value={data.startDate} onChange={v => onChange('startDate', v)} placeholder="2024年4月" />
        <InputField label="終了日" value={data.endDate} onChange={v => onChange('endDate', v)} placeholder="2025年3月" />
      </div>
      <InputField label="予算" value={data.budget} onChange={v => onChange('budget', v)} />
      <InputField label="背景・目的" value={data.background} onChange={v => onChange('background', v)} multiline placeholder="プロジェクト立ち上げの背景と目的を記載" />
      <ListField label="プロジェクト目標" items={data.objectives} onChange={v => onChange('objectives', v)} placeholder="達成すべき目標" />
      <InputField label="スコープ（対象範囲）" value={data.scope} onChange={v => onChange('scope', v)} multiline placeholder="プロジェクトの対象範囲" />
      <InputField label="スコープ外" value={data.outOfScope} onChange={v => onChange('outOfScope', v)} multiline placeholder="対象外の項目" />
      <ListField label="主要リスク" items={data.risks} onChange={v => onChange('risks', v)} placeholder="想定されるリスク" />
      <ListField label="主要ステークホルダー" items={data.stakeholders} onChange={v => onChange('stakeholders', v)} placeholder="ステークホルダー名と役割" />
    </div>
  );
}

function RequirementsForm({ data, onChange }: { data: RequirementsData; onChange: (field: string, value: unknown) => void }) {
  const addRequirement = (type: 'functionalRequirements' | 'nonFunctionalRequirements') => {
    const list = data[type];
    const prefix = type === 'functionalRequirements' ? 'FR' : 'NFR';
    const newId = `${prefix}-${String(list.length + 1).padStart(3, '0')}`;
    onChange(type, [...list, { id: newId, category: '', description: '', priority: 'medium', source: '' }]);
  };

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-gray-900">機能要件</h3>
      {data.functionalRequirements.map((req, i) => (
        <div key={req.id} className="border rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">{req.id}</div>
          <div className="grid grid-cols-2 gap-2">
            <input className="rounded border border-gray-300 px-2 py-1 text-sm" value={req.category} onChange={e => { const list = [...data.functionalRequirements]; list[i] = { ...list[i], category: e.target.value }; onChange('functionalRequirements', list); }} placeholder="カテゴリ" />
            <select className="rounded border border-gray-300 px-2 py-1 text-sm" value={req.priority} onChange={e => { const list = [...data.functionalRequirements]; list[i] = { ...list[i], priority: e.target.value as 'high' | 'medium' | 'low' }; onChange('functionalRequirements', list); }}>
              <option value="high">高</option><option value="medium">中</option><option value="low">低</option>
            </select>
          </div>
          <textarea className="w-full rounded border border-gray-300 px-2 py-1 text-sm resize-y" value={req.description} onChange={e => { const list = [...data.functionalRequirements]; list[i] = { ...list[i], description: e.target.value }; onChange('functionalRequirements', list); }} placeholder="要件の説明" rows={2} />
          <input className="w-full rounded border border-gray-300 px-2 py-1 text-sm" value={req.source} onChange={e => { const list = [...data.functionalRequirements]; list[i] = { ...list[i], source: e.target.value }; onChange('functionalRequirements', list); }} placeholder="要求元" />
        </div>
      ))}
      <button className="text-sm text-blue-600 hover:text-blue-800" onClick={() => addRequirement('functionalRequirements')}>+ 機能要件を追加</button>

      <h3 className="font-semibold text-gray-900">非機能要件</h3>
      {data.nonFunctionalRequirements.map((req, i) => (
        <div key={req.id} className="border rounded-lg p-3 space-y-2">
          <div className="text-sm font-medium text-gray-500">{req.id}</div>
          <div className="grid grid-cols-2 gap-2">
            <input className="rounded border border-gray-300 px-2 py-1 text-sm" value={req.category} onChange={e => { const list = [...data.nonFunctionalRequirements]; list[i] = { ...list[i], category: e.target.value }; onChange('nonFunctionalRequirements', list); }} placeholder="カテゴリ（セキュリティ/性能等）" />
            <select className="rounded border border-gray-300 px-2 py-1 text-sm" value={req.priority} onChange={e => { const list = [...data.nonFunctionalRequirements]; list[i] = { ...list[i], priority: e.target.value as 'high' | 'medium' | 'low' }; onChange('nonFunctionalRequirements', list); }}>
              <option value="high">高</option><option value="medium">中</option><option value="low">低</option>
            </select>
          </div>
          <textarea className="w-full rounded border border-gray-300 px-2 py-1 text-sm resize-y" value={req.description} onChange={e => { const list = [...data.nonFunctionalRequirements]; list[i] = { ...list[i], description: e.target.value }; onChange('nonFunctionalRequirements', list); }} placeholder="要件の説明" rows={2} />
        </div>
      ))}
      <button className="text-sm text-blue-600 hover:text-blue-800" onClick={() => addRequirement('nonFunctionalRequirements')}>+ 非機能要件を追加</button>

      <ListField label="制約条件" items={data.constraints} onChange={v => onChange('constraints', v)} placeholder="制約条件" />
      <ListField label="前提条件" items={data.assumptions} onChange={v => onChange('assumptions', v)} placeholder="前提条件" />
    </div>
  );
}

function WbsForm({ data, onChange }: { data: WbsData; onChange: (field: string, value: unknown) => void }) {
  const addItem = (parentId: string | null, level: number) => {
    const items = [...data.items];
    const newId = `${parentId || '1'}.${items.filter(i => i.parentId === (parentId || '1')).length + 1}`;
    items.push({ id: newId, name: '', level, parentId, duration: '', assignee: '' });
    onChange('items', items);
  };

  return (
    <div className="space-y-3">
      {data.items.map((item, i) => (
        <div key={item.id} className="flex items-center gap-2" style={{ paddingLeft: `${item.level * 24}px` }}>
          <span className="text-xs text-gray-400 w-10 shrink-0">{item.id}</span>
          <input className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm" value={item.name} onChange={e => { const items = [...data.items]; items[i] = { ...items[i], name: e.target.value }; onChange('items', items); }} placeholder="作業名" />
          <input className="w-20 rounded border border-gray-300 px-2 py-1 text-sm" value={item.duration} onChange={e => { const items = [...data.items]; items[i] = { ...items[i], duration: e.target.value }; onChange('items', items); }} placeholder="期間" />
          <input className="w-24 rounded border border-gray-300 px-2 py-1 text-sm" value={item.assignee} onChange={e => { const items = [...data.items]; items[i] = { ...items[i], assignee: e.target.value }; onChange('items', items); }} placeholder="担当" />
        </div>
      ))}
      <div className="flex gap-2">
        <button className="text-sm text-blue-600 hover:text-blue-800" onClick={() => addItem('1', 1)}>+ 第1階層を追加</button>
        <button className="text-sm text-blue-600 hover:text-blue-800" onClick={() => addItem(null, 2)}>+ 第2階層を追加</button>
      </div>
    </div>
  );
}

function ScheduleForm({ data, onChange }: { data: ScheduleData; onChange: (field: string, value: unknown) => void }) {
  const months = Array.from({ length: data.totalMonths }, (_, i) => i + 1);

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-2 w-32">タスク</th>
              <th className="text-left py-2 px-2 w-20">担当</th>
              {months.map(m => (
                <th key={m} className="text-center py-2 px-1 w-8 text-xs">{m}月</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, i) => (
              <tr key={item.id} className="border-b">
                <td className="py-1 px-2">
                  <input className="w-full rounded border border-gray-300 px-1 py-0.5 text-sm" value={item.task} onChange={e => { const items = [...data.items]; items[i] = { ...items[i], task: e.target.value }; onChange('items', items); }} />
                </td>
                <td className="py-1 px-2">
                  <input className="w-full rounded border border-gray-300 px-1 py-0.5 text-sm" value={item.assignee} onChange={e => { const items = [...data.items]; items[i] = { ...items[i], assignee: e.target.value }; onChange('items', items); }} />
                </td>
                {months.map(m => (
                  <td key={m} className="py-1 px-0.5">
                    <div
                      className={`h-5 rounded cursor-pointer transition-colors ${m >= item.startMonth && m <= item.endMonth ? 'bg-blue-400' : 'bg-gray-100 hover:bg-gray-200'}`}
                      onClick={() => {
                        const items = [...data.items];
                        const cur = items[i];
                        if (m >= cur.startMonth && m <= cur.endMonth) {
                          if (m === cur.startMonth) items[i] = { ...cur, startMonth: m + 1 };
                          else if (m === cur.endMonth) items[i] = { ...cur, endMonth: m - 1 };
                        } else {
                          if (m < cur.startMonth) items[i] = { ...cur, startMonth: m };
                          else items[i] = { ...cur, endMonth: m };
                        }
                        onChange('items', items);
                      }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="text-sm text-blue-600 hover:text-blue-800" onClick={() => {
        const items = [...data.items];
        items.push({ id: `S-${String(items.length + 1).padStart(3, '0')}`, task: '', startMonth: 1, endMonth: 2, assignee: '', dependency: '', status: 'not_started' });
        onChange('items', items);
      }}>+ タスクを追加</button>
    </div>
  );
}

function RiskRegisterForm({ data, onChange }: { data: RiskRegisterData; onChange: (field: string, value: unknown) => void }) {
  return (
    <div className="space-y-3">
      {data.items.map((item, i) => (
        <div key={item.id} className="border rounded-lg p-3 space-y-2">
          <div className="text-sm font-medium text-gray-500">{item.id}</div>
          <textarea className="w-full rounded border border-gray-300 px-2 py-1 text-sm" value={item.description} onChange={e => { const items = [...data.items]; items[i] = { ...items[i], description: e.target.value }; onChange('items', items); }} placeholder="リスクの説明" rows={2} />
          <div className="grid grid-cols-3 gap-2">
            <input className="rounded border border-gray-300 px-2 py-1 text-sm" value={item.category} onChange={e => { const items = [...data.items]; items[i] = { ...items[i], category: e.target.value }; onChange('items', items); }} placeholder="カテゴリ" />
            <select className="rounded border border-gray-300 px-2 py-1 text-sm" value={item.probability} onChange={e => { const items = [...data.items]; items[i] = { ...items[i], probability: e.target.value as 'high' | 'medium' | 'low' }; onChange('items', items); }}>
              <option value="high">発生確率: 高</option><option value="medium">発生確率: 中</option><option value="low">発生確率: 低</option>
            </select>
            <select className="rounded border border-gray-300 px-2 py-1 text-sm" value={item.impact} onChange={e => { const items = [...data.items]; items[i] = { ...items[i], impact: e.target.value as 'high' | 'medium' | 'low' }; onChange('items', items); }}>
              <option value="high">影響度: 高</option><option value="medium">影響度: 中</option><option value="low">影響度: 低</option>
            </select>
          </div>
          <textarea className="w-full rounded border border-gray-300 px-2 py-1 text-sm" value={item.response} onChange={e => { const items = [...data.items]; items[i] = { ...items[i], response: e.target.value }; onChange('items', items); }} placeholder="対応策" rows={2} />
          <input className="w-full rounded border border-gray-300 px-2 py-1 text-sm" value={item.owner} onChange={e => { const items = [...data.items]; items[i] = { ...items[i], owner: e.target.value }; onChange('items', items); }} placeholder="リスクオーナー" />
        </div>
      ))}
      <button className="text-sm text-blue-600 hover:text-blue-800" onClick={() => {
        const items = [...data.items];
        items.push({ id: `R-${String(items.length + 1).padStart(3, '0')}`, description: '', category: '', probability: 'medium', impact: 'medium', response: '', owner: '', status: 'open' });
        onChange('items', items);
      }}>+ リスクを追加</button>
    </div>
  );
}

function ChangeLogForm({ data, onChange }: { data: ChangeLogData; onChange: (field: string, value: unknown) => void }) {
  return (
    <div className="space-y-3">
      {data.items.map((item, i) => (
        <div key={item.id} className="border rounded-lg p-3 space-y-2">
          <div className="text-sm font-medium text-gray-500">{item.id}</div>
          <div className="grid grid-cols-2 gap-2">
            <input className="rounded border border-gray-300 px-2 py-1 text-sm" value={item.date} onChange={e => { const items = [...data.items]; items[i] = { ...items[i], date: e.target.value }; onChange('items', items); }} placeholder="日付" />
            <input className="rounded border border-gray-300 px-2 py-1 text-sm" value={item.requestor} onChange={e => { const items = [...data.items]; items[i] = { ...items[i], requestor: e.target.value }; onChange('items', items); }} placeholder="要求者" />
          </div>
          <textarea className="w-full rounded border border-gray-300 px-2 py-1 text-sm" value={item.description} onChange={e => { const items = [...data.items]; items[i] = { ...items[i], description: e.target.value }; onChange('items', items); }} placeholder="変更内容" rows={2} />
          <textarea className="w-full rounded border border-gray-300 px-2 py-1 text-sm" value={item.impact} onChange={e => { const items = [...data.items]; items[i] = { ...items[i], impact: e.target.value }; onChange('items', items); }} placeholder="影響範囲" rows={1} />
          <div className="grid grid-cols-2 gap-2">
            <select className="rounded border border-gray-300 px-2 py-1 text-sm" value={item.decision} onChange={e => { const items = [...data.items]; items[i] = { ...items[i], decision: e.target.value as 'approved' | 'rejected' | 'pending' }; onChange('items', items); }}>
              <option value="pending">保留</option><option value="approved">承認</option><option value="rejected">却下</option>
            </select>
            <input className="rounded border border-gray-300 px-2 py-1 text-sm" value={item.reason} onChange={e => { const items = [...data.items]; items[i] = { ...items[i], reason: e.target.value }; onChange('items', items); }} placeholder="判断理由" />
          </div>
        </div>
      ))}
      <button className="text-sm text-blue-600 hover:text-blue-800" onClick={() => {
        const items = [...data.items];
        items.push({ id: `CR-${String(items.length + 1).padStart(3, '0')}`, date: '', requestor: '', description: '', impact: '', decision: 'pending', reason: '' });
        onChange('items', items);
      }}>+ 変更要求を追加</button>
    </div>
  );
}

function LessonsLearnedForm({ data, onChange }: { data: LessonsLearnedData; onChange: (field: string, value: unknown) => void }) {
  return (
    <div className="space-y-4">
      {data.items.map((item, i) => (
        <div key={item.id} className="border rounded-lg p-3 space-y-2">
          <div className="text-sm font-medium text-gray-500">{item.id}</div>
          <div className="grid grid-cols-2 gap-2">
            <select className="rounded border border-gray-300 px-2 py-1 text-sm" value={item.phase} onChange={e => { const items = [...data.items]; items[i] = { ...items[i], phase: e.target.value }; onChange('items', items); }}>
              <option value="">フェーズ選択</option>
              <option value="initiation">立上げ・要求定義</option>
              <option value="pre-requirements">プレ要件定義</option>
              <option value="rom-planning">超概算・PM計画</option>
              <option value="requirements">要件定義</option>
              <option value="estimation">見積・ベースライン</option>
              <option value="design-dev">設計・開発</option>
              <option value="testing">テスト・リリース</option>
              <option value="closing">終結</option>
            </select>
            <input className="rounded border border-gray-300 px-2 py-1 text-sm" value={item.category} onChange={e => { const items = [...data.items]; items[i] = { ...items[i], category: e.target.value }; onChange('items', items); }} placeholder="カテゴリ" />
          </div>
          <textarea className="w-full rounded border border-gray-300 px-2 py-1 text-sm" value={item.description} onChange={e => { const items = [...data.items]; items[i] = { ...items[i], description: e.target.value }; onChange('items', items); }} placeholder="教訓の内容" rows={2} />
          <textarea className="w-full rounded border border-gray-300 px-2 py-1 text-sm" value={item.recommendation} onChange={e => { const items = [...data.items]; items[i] = { ...items[i], recommendation: e.target.value }; onChange('items', items); }} placeholder="推奨事項・改善提案" rows={2} />
        </div>
      ))}
      <button className="text-sm text-blue-600 hover:text-blue-800" onClick={() => {
        const items = [...data.items];
        items.push({ id: `LL-${String(items.length + 1).padStart(3, '0')}`, phase: '', category: '', description: '', recommendation: '' });
        onChange('items', items);
      }}>+ 教訓を追加</button>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">全体的な振り返り</label>
        <textarea className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm resize-y" value={data.overallReflection} onChange={e => onChange('overallReflection', e.target.value)} placeholder="プロジェクト全体を通じての振り返り" rows={4} />
      </div>
    </div>
  );
}
