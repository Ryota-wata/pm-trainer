'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCostStore, CostStore, CostTask } from '@/lib/stores/costStore';
import { useGameStore } from '@/lib/stores/gameStore';
import { formatBudget, getCPI, getSPI, getCpiStatus, getSpiStatus } from '@/lib/utils/helpers';
import { ProjectState } from '@/lib/types/game';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

type Tab = 'overview' | 'resources' | 'tasks' | 'workload';

export default function CostManagementPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const { projectState } = useGameStore();
  const store = useCostStore();
  const totalBudget = projectState.plannedBudget;
  const usedBudget = projectState.actualCost;

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'overview', label: '概要', icon: '📊' },
    { id: 'resources', label: 'リソース・単価', icon: '👥' },
    { id: 'tasks', label: 'タスク工数', icon: '📋' },
    { id: 'workload', label: '山積み計画', icon: '📈' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 animate-fade-in">
      <div className="mb-4">
        <Button variant="ghost" size="sm" onClick={() => router.push('/game')}>← ダッシュボード</Button>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">コスト管理</h1>
        <p className="text-sm text-gray-500">リソースの単価設定、タスクの工数見積、山積み計画でコストを管理します</p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && <OverviewTab store={store} totalBudget={totalBudget} usedBudget={usedBudget} projectState={projectState} />}
      {activeTab === 'resources' && <ResourcesTab store={store} />}
      {activeTab === 'tasks' && <TasksTab store={store} />}
      {activeTab === 'workload' && <WorkloadTab store={store} />}
    </div>
  );
}

function OverviewTab({ store, totalBudget, usedBudget, projectState }: { store: CostStore; totalBudget: number; usedBudget: number; projectState: ProjectState }) {
  const plannedCost = store.getTotalPlannedCost();
  const breakdown = store.getCostBreakdown();
  const variance = totalBudget - plannedCost;
  const cpi = getCPI(projectState);
  const spi = getSPI(projectState);
  const cpiStatus = getCpiStatus(cpi);
  const spiStatus = getSpiStatus(spi);
  const eac = cpi > 0 ? Math.round(projectState.plannedBudget / cpi) : projectState.plannedBudget;

  return (
    <div className="space-y-6">
      {/* EVM Actual Values */}
      <Card className="p-6 bg-blue-50/50 border-blue-200">
        <h3 className="font-semibold text-gray-900 mb-3">EVM実績値（ゲーム内進捗）</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-white rounded-lg p-3 text-center">
            <div className="text-xs text-gray-500">BAC</div>
            <div className="text-lg font-bold text-gray-900">{formatBudget(projectState.plannedBudget)}</div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center">
            <div className="text-xs text-gray-500">PV（計画価値）</div>
            <div className="text-lg font-bold text-gray-700">{formatBudget(projectState.plannedValue)}</div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center">
            <div className="text-xs text-gray-500">EV（出来高）</div>
            <div className="text-lg font-bold text-blue-600">{formatBudget(projectState.earnedValue)}</div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center">
            <div className="text-xs text-gray-500">AC（実コスト）</div>
            <div className="text-lg font-bold text-orange-600">{formatBudget(projectState.actualCost)}</div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center">
            <div className="text-xs text-gray-500">EAC（完了見積）</div>
            <div className={`text-lg font-bold ${eac > projectState.plannedBudget ? 'text-red-600' : 'text-green-600'}`}>{formatBudget(eac)}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div className="bg-white rounded-lg p-3 flex items-center justify-between">
            <span className="text-sm text-gray-600">CPI（コスト効率）</span>
            <span className={`text-lg font-bold ${cpiStatus.color}`}>{cpi.toFixed(2)}</span>
          </div>
          <div className="bg-white rounded-lg p-3 flex items-center justify-between">
            <span className="text-sm text-gray-600">SPI（スケジュール効率）</span>
            <span className={`text-lg font-bold ${spiStatus.color}`}>{spi.toFixed(2)}</span>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-xs text-gray-500 mb-1">総予算（BAC）</div>
          <div className="text-2xl font-bold text-gray-900">{formatBudget(totalBudget)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-gray-500 mb-1">計画コスト（予備含む）</div>
          <div className={`text-2xl font-bold ${plannedCost > totalBudget ? 'text-red-600' : 'text-blue-600'}`}>{formatBudget(plannedCost)}</div>
          <div className="text-xs text-gray-400 mt-1">予備率 {store.contingencyRate}%</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-gray-500 mb-1">実コスト（AC）</div>
          <div className="text-2xl font-bold text-orange-600">{formatBudget(usedBudget)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-gray-500 mb-1">予算差異</div>
          <div className={`text-2xl font-bold ${variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {variance >= 0 ? '+' : ''}{formatBudget(Math.abs(variance))}
          </div>
          <Badge variant={variance >= 0 ? 'success' : 'danger'} size="sm">{variance >= 0 ? '予算内' : '超過'}</Badge>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">フェーズ別コスト内訳</h3>
        <div className="space-y-3">
          {breakdown.map(item => {
            const ratio = plannedCost > 0 ? (item.cost / plannedCost) * 100 : 0;
            return (
              <div key={item.phase} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-24 shrink-0">{item.phase}</span>
                <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${ratio}%` }} />
                </div>
                <span className="text-sm font-medium text-gray-700 w-24 text-right">{formatBudget(item.cost)} ({ratio.toFixed(0)}%)</span>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-3">予備費率の設定</h3>
        <p className="text-sm text-gray-500 mb-3">PMBOKではリスクに備えたコンティンジェンシー予備の設定が推奨されています。</p>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={0}
            max={30}
            value={store.contingencyRate}
            onChange={e => store.setContingencyRate(Number(e.target.value))}
            className="flex-1"
          />
          <span className="text-lg font-bold text-gray-900 w-16 text-right">{store.contingencyRate}%</span>
        </div>
        <p className="text-xs text-blue-600 mt-2">予備費: {formatBudget(Math.round(plannedCost - plannedCost / (1 + store.contingencyRate / 100)))}</p>
      </Card>
    </div>
  );
}

function ResourcesTab({ store }: { store: CostStore }) {
  const addResource = () => {
    const id = `res-${Date.now()}`;
    store.addResource({ id, name: '', role: '', unitCost: 80, availability: 100 });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">各リソースの月額単価（万円/人月）と稼働率を設定します。</p>
        <Button size="sm" onClick={addResource}>+ リソース追加</Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 font-medium text-gray-500">名前</th>
              <th className="text-left py-3 px-2 font-medium text-gray-500">役割</th>
              <th className="text-right py-3 px-2 font-medium text-gray-500">単価（万円/人月）</th>
              <th className="text-right py-3 px-2 font-medium text-gray-500">稼働率（%）</th>
              <th className="text-right py-3 px-2 font-medium text-gray-500">月額コスト</th>
              <th className="py-3 px-2 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {store.resources.map(res => (
              <tr key={res.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-2 px-2">
                  <input className="w-full rounded border border-gray-300 px-2 py-1 text-sm" value={res.name} onChange={e => store.updateResource(res.id, { name: e.target.value })} />
                </td>
                <td className="py-2 px-2">
                  <input className="w-full rounded border border-gray-300 px-2 py-1 text-sm" value={res.role} onChange={e => store.updateResource(res.id, { role: e.target.value })} />
                </td>
                <td className="py-2 px-2">
                  <input type="number" className="w-full rounded border border-gray-300 px-2 py-1 text-sm text-right" value={res.unitCost} onChange={e => store.updateResource(res.id, { unitCost: Number(e.target.value) })} />
                </td>
                <td className="py-2 px-2">
                  <input type="number" min={0} max={100} className="w-full rounded border border-gray-300 px-2 py-1 text-sm text-right" value={res.availability} onChange={e => store.updateResource(res.id, { availability: Number(e.target.value) })} />
                </td>
                <td className="py-2 px-2 text-right font-medium text-gray-700">
                  {(res.unitCost * res.availability / 100).toFixed(0)}万円
                </td>
                <td className="py-2 px-2">
                  <button className="text-red-400 hover:text-red-600 text-lg" onClick={() => store.removeResource(res.id)}>×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Card className="p-4 bg-blue-50 border-blue-200">
        <p className="text-xs text-blue-700">
          <strong>PMBOK: プロジェクト資源マネジメント</strong> - リソースの単価設定はボトムアップ見積りの基礎となります。
          稼働率は、実際にプロジェクトに割ける時間の割合です（会議・管理業務等を除く）。
        </p>
      </Card>
    </div>
  );
}

function TasksTab({ store }: { store: CostStore }) {
  const addTask = () => {
    const id = `ct-${Date.now()}`;
    store.addTask({ id, name: '', phase: '設計開発', estimatedEffort: 1, assignedResourceIds: [], startMonth: 1, endMonth: 2 });
  };

  const toggleResource = (taskId: string, resId: string, currentIds: string[]) => {
    const newIds = currentIds.includes(resId)
      ? currentIds.filter(id => id !== resId)
      : [...currentIds, resId];
    store.updateTask(taskId, { assignedResourceIds: newIds });
  };

  const getTaskCost = (task: CostTask): number => {
    let cost = 0;
    for (const resId of task.assignedResourceIds) {
      const res = store.resources.find(r => r.id === resId);
      if (res) cost += (task.estimatedEffort / task.assignedResourceIds.length) * res.unitCost;
    }
    return Math.round(cost);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">各タスクの工数（人月）を見積り、リソースをアサインします。</p>
        <Button size="sm" onClick={addTask}>+ タスク追加</Button>
      </div>

      <div className="space-y-3">
        {store.tasks.map(task => (
          <Card key={task.id} className="p-4">
            <div className="grid grid-cols-12 gap-3 items-start">
              <div className="col-span-3">
                <label className="text-xs text-gray-400">タスク名</label>
                <input className="w-full rounded border border-gray-300 px-2 py-1 text-sm" value={task.name} onChange={e => store.updateTask(task.id, { name: e.target.value })} />
              </div>
              <div className="col-span-1">
                <label className="text-xs text-gray-400">フェーズ</label>
                <select className="w-full rounded border border-gray-300 px-1 py-1 text-sm" value={task.phase} onChange={e => store.updateTask(task.id, { phase: e.target.value })}>
                  <option>立上げ</option><option>プレ要件</option><option>超概算</option><option>要件定義</option><option>見積</option><option>設計開発</option><option>テスト</option><option>終結</option><option>全体</option>
                </select>
              </div>
              <div className="col-span-1">
                <label className="text-xs text-gray-400">工数(人月)</label>
                <input type="number" step={0.5} min={0.5} className="w-full rounded border border-gray-300 px-2 py-1 text-sm text-right" value={task.estimatedEffort} onChange={e => store.updateTask(task.id, { estimatedEffort: Number(e.target.value) })} />
              </div>
              <div className="col-span-1">
                <label className="text-xs text-gray-400">開始月</label>
                <input type="number" min={1} max={12} className="w-full rounded border border-gray-300 px-2 py-1 text-sm text-right" value={task.startMonth} onChange={e => store.updateTask(task.id, { startMonth: Number(e.target.value) })} />
              </div>
              <div className="col-span-1">
                <label className="text-xs text-gray-400">終了月</label>
                <input type="number" min={1} max={12} className="w-full rounded border border-gray-300 px-2 py-1 text-sm text-right" value={task.endMonth} onChange={e => store.updateTask(task.id, { endMonth: Number(e.target.value) })} />
              </div>
              <div className="col-span-4">
                <label className="text-xs text-gray-400">アサインリソース</label>
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {store.resources.map(res => (
                    <button
                      key={res.id}
                      className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
                        task.assignedResourceIds.includes(res.id)
                          ? 'bg-blue-100 text-blue-700 border-blue-300'
                          : 'bg-gray-50 text-gray-400 border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => toggleResource(task.id, res.id, task.assignedResourceIds)}
                    >
                      {res.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="col-span-1 text-right">
                <label className="text-xs text-gray-400">コスト</label>
                <div className="text-sm font-bold text-gray-700">{getTaskCost(task)}万</div>
                <button className="text-red-400 hover:text-red-600 text-xs mt-1" onClick={() => store.removeTask(task.id)}>削除</button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-4 bg-blue-50 border-blue-200">
        <p className="text-xs text-blue-700">
          <strong>PMBOK: プロジェクト・コスト・マネジメント</strong> - ボトムアップ見積りでは、WBSの最下位レベル（ワークパッケージ）ごとに工数を見積り、
          リソースの単価を掛けてコストを算出します。見積りの精度はプロジェクトの進行とともに向上します。
        </p>
      </Card>
    </div>
  );
}

function WorkloadTab({ store }: { store: CostStore }) {
  const workload = store.getMonthlyWorkload();
  const maxPerMonth = Math.max(
    ...workload.map(m => Object.values(m.hours).reduce((a, b) => a + b, 0)),
    1
  );

  // Color palette for resources
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">月ごとのリソース山積み（人月）を可視化します。過負荷のリソースがないか確認しましょう。</p>

      {/* Stacked bar chart */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">月別リソース山積み</h3>
        <div className="flex items-end gap-2 h-64">
          {workload.map(month => {
            const total = Object.values(month.hours).reduce((a, b) => a + b, 0);
            return (
              <div key={month.month} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col-reverse" style={{ height: '200px' }}>
                  {store.resources.map((res, ri) => {
                    const val = month.hours[res.id] || 0;
                    if (val === 0) return null;
                    const height = (val / maxPerMonth) * 200;
                    return (
                      <div
                        key={res.id}
                        className="w-full transition-all duration-300 first:rounded-t"
                        style={{ height: `${height}px`, backgroundColor: colors[ri % colors.length] }}
                        title={`${res.name}: ${val.toFixed(1)}人月`}
                      />
                    );
                  })}
                </div>
                <div className="text-xs text-gray-500 mt-2">{month.month}月</div>
                <div className="text-xs font-medium text-gray-700">{total.toFixed(1)}</div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-200">
          {store.resources.map((res, ri) => (
            <div key={res.id} className="flex items-center gap-1.5 text-xs text-gray-600">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: colors[ri % colors.length] }} />
              {res.name}
            </div>
          ))}
        </div>
      </Card>

      {/* Per-resource monthly breakdown */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">リソース別月間負荷</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-2 font-medium text-gray-500 sticky left-0 bg-white">リソース</th>
                {workload.map(m => <th key={m.month} className="text-center py-2 px-2 font-medium text-gray-500 w-14">{m.month}月</th>)}
                <th className="text-center py-2 px-2 font-medium text-gray-500">合計</th>
              </tr>
            </thead>
            <tbody>
              {store.resources.map((res, ri) => {
                const total = workload.reduce((sum, m) => sum + (m.hours[res.id] || 0), 0);
                return (
                  <tr key={res.id} className="border-b border-gray-100">
                    <td className="py-2 px-2 font-medium text-gray-700 sticky left-0 bg-white whitespace-nowrap">
                      <span className="inline-block w-3 h-3 rounded mr-1.5" style={{ backgroundColor: colors[ri % colors.length] }} />
                      {res.name}
                    </td>
                    {workload.map(m => {
                      const val = m.hours[res.id] || 0;
                      const isOverloaded = val > 1.0;
                      return (
                        <td key={m.month} className={`text-center py-2 px-2 ${isOverloaded ? 'bg-red-50 text-red-700 font-bold' : val > 0 ? 'text-gray-700' : 'text-gray-300'}`}>
                          {val > 0 ? val.toFixed(1) : '-'}
                        </td>
                      );
                    })}
                    <td className="text-center py-2 px-2 font-bold text-gray-900">{total.toFixed(1)}</td>
                  </tr>
                );
              })}
              <tr className="border-t-2 border-gray-300 font-bold">
                <td className="py-2 px-2 text-gray-700 sticky left-0 bg-white">合計</td>
                {workload.map(m => {
                  const total = Object.values(m.hours).reduce((a, b) => a + b, 0);
                  return <td key={m.month} className="text-center py-2 px-2 text-gray-900">{total.toFixed(1)}</td>;
                })}
                <td className="text-center py-2 px-2 text-gray-900">
                  {workload.reduce((sum, m) => sum + Object.values(m.hours).reduce((a, b) => a + b, 0), 0).toFixed(1)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-red-500 mt-2">* 1.0人月を超えるセルは赤でハイライトされます（過負荷の可能性）</p>
      </Card>

      <Card className="p-4 bg-blue-50 border-blue-200">
        <p className="text-xs text-blue-700">
          <strong>PMBOK: プロジェクト資源マネジメント</strong> - 資源の山積み（Resource Histogram）は、リソースの過負荷を検出し、
          山崩し（Resource Leveling）やスムージングの必要性を判断するために使用します。
          特定の月にリソースが1.0人月を超える場合、作業の平準化を検討してください。
        </p>
      </Card>
    </div>
  );
}
