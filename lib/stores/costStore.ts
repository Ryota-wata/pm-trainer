import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CostResource {
  id: string;
  name: string;
  role: string;
  unitCost: number; // 万円/人月
  availability: number; // 0-100%
}

export interface CostTask {
  id: string;
  name: string;
  phase: string;
  estimatedEffort: number; // 人月
  assignedResourceIds: string[];
  startMonth: number;
  endMonth: number;
}

export interface CostStore {
  resources: CostResource[];
  tasks: CostTask[];
  contingencyRate: number; // %

  addResource: (resource: CostResource) => void;
  updateResource: (id: string, updates: Partial<CostResource>) => void;
  removeResource: (id: string) => void;

  addTask: (task: CostTask) => void;
  updateTask: (id: string, updates: Partial<CostTask>) => void;
  removeTask: (id: string) => void;

  setContingencyRate: (rate: number) => void;

  getTotalPlannedCost: () => number;
  getMonthlyWorkload: () => { month: number; hours: Record<string, number> }[];
  getCostBreakdown: () => { phase: string; cost: number }[];
  resetCosts: () => void;
}

const defaultResources: CostResource[] = [
  { id: 'res-1', name: 'PMメンバー', role: 'PM', unitCost: 120, availability: 100 },
  { id: 'res-2', name: 'SE（社内）', role: 'SE', unitCost: 80, availability: 50 },
  { id: 'res-3', name: 'SE（ベンダー）', role: 'SE', unitCost: 100, availability: 100 },
  { id: 'res-4', name: 'PG（ベンダー）', role: 'PG', unitCost: 70, availability: 100 },
  { id: 'res-5', name: 'テスター', role: 'テスト', unitCost: 50, availability: 100 },
  { id: 'res-6', name: '業務担当（営業部）', role: '業務', unitCost: 60, availability: 30 },
];

const defaultTasks: CostTask[] = [
  { id: 'ct-1', name: '要件定義', phase: '要件定義', estimatedEffort: 3, assignedResourceIds: ['res-1', 'res-2', 'res-6'], startMonth: 1, endMonth: 2 },
  { id: 'ct-2', name: '基本設計', phase: '設計開発', estimatedEffort: 4, assignedResourceIds: ['res-2', 'res-3'], startMonth: 3, endMonth: 4 },
  { id: 'ct-3', name: '詳細設計', phase: '設計開発', estimatedEffort: 3, assignedResourceIds: ['res-3', 'res-4'], startMonth: 4, endMonth: 5 },
  { id: 'ct-4', name: '開発（画面）', phase: '設計開発', estimatedEffort: 6, assignedResourceIds: ['res-3', 'res-4'], startMonth: 5, endMonth: 8 },
  { id: 'ct-5', name: '開発（バッチ・連携）', phase: '設計開発', estimatedEffort: 4, assignedResourceIds: ['res-4'], startMonth: 6, endMonth: 8 },
  { id: 'ct-6', name: '単体テスト', phase: 'テスト', estimatedEffort: 2, assignedResourceIds: ['res-4', 'res-5'], startMonth: 7, endMonth: 9 },
  { id: 'ct-7', name: '結合テスト', phase: 'テスト', estimatedEffort: 3, assignedResourceIds: ['res-3', 'res-5'], startMonth: 9, endMonth: 10 },
  { id: 'ct-8', name: 'UAT', phase: 'テスト', estimatedEffort: 2, assignedResourceIds: ['res-5', 'res-6'], startMonth: 10, endMonth: 11 },
  { id: 'ct-9', name: '環境構築・データ投入', phase: '終結', estimatedEffort: 2, assignedResourceIds: ['res-2', 'res-3'], startMonth: 11, endMonth: 12 },
  { id: 'ct-10', name: '研修・展開', phase: '終結', estimatedEffort: 1.5, assignedResourceIds: ['res-1', 'res-6'], startMonth: 11, endMonth: 12 },
  { id: 'ct-11', name: 'PM管理工数', phase: '全体', estimatedEffort: 6, assignedResourceIds: ['res-1'], startMonth: 1, endMonth: 12 },
];

function createInitialState() {
  return {
    resources: defaultResources.map(r => ({ ...r })),
    tasks: defaultTasks.map(t => ({ ...t, assignedResourceIds: [...t.assignedResourceIds] })),
    contingencyRate: 10,
  };
}

export const useCostStore = create<CostStore>()(
  persist(
    (set, get) => ({
      ...createInitialState(),

      addResource: (resource) => set(s => ({ resources: [...s.resources, resource] })),
      updateResource: (id, updates) => set(s => ({
        resources: s.resources.map(r => r.id === id ? { ...r, ...updates } : r),
      })),
      removeResource: (id) => set(s => ({ resources: s.resources.filter(r => r.id !== id) })),

      addTask: (task) => set(s => ({ tasks: [...s.tasks, task] })),
      updateTask: (id, updates) => set(s => ({
        tasks: s.tasks.map(t => t.id === id ? { ...t, ...updates } : t),
      })),
      removeTask: (id) => set(s => ({ tasks: s.tasks.filter(t => t.id !== id) })),

      setContingencyRate: (rate) => set({ contingencyRate: rate }),

      getTotalPlannedCost: () => {
        const { resources, tasks, contingencyRate } = get();
        let totalCost = 0;
        for (const task of tasks) {
          const taskDuration = task.endMonth - task.startMonth + 1;
          for (const resId of task.assignedResourceIds) {
            const resource = resources.find(r => r.id === resId);
            if (resource) {
              const effortPerResource = task.estimatedEffort / task.assignedResourceIds.length;
              totalCost += effortPerResource * resource.unitCost;
            }
          }
        }
        return Math.round(totalCost * (1 + contingencyRate / 100));
      },

      getMonthlyWorkload: () => {
        const { resources, tasks } = get();
        const months: { month: number; hours: Record<string, number> }[] = [];
        for (let m = 1; m <= 12; m++) {
          const hours: Record<string, number> = {};
          for (const res of resources) hours[res.id] = 0;
          for (const task of tasks) {
            if (m >= task.startMonth && m <= task.endMonth) {
              const duration = task.endMonth - task.startMonth + 1;
              const effortPerMonth = task.estimatedEffort / duration;
              for (const resId of task.assignedResourceIds) {
                const perResource = effortPerMonth / task.assignedResourceIds.length;
                hours[resId] = (hours[resId] || 0) + perResource;
              }
            }
          }
          months.push({ month: m, hours });
        }
        return months;
      },

      getCostBreakdown: () => {
        const { resources, tasks } = get();
        const phases: Record<string, number> = {};
        for (const task of tasks) {
          let taskCost = 0;
          for (const resId of task.assignedResourceIds) {
            const resource = resources.find(r => r.id === resId);
            if (resource) {
              taskCost += (task.estimatedEffort / task.assignedResourceIds.length) * resource.unitCost;
            }
          }
          phases[task.phase] = (phases[task.phase] || 0) + taskCost;
        }
        return Object.entries(phases).map(([phase, cost]) => ({ phase, cost: Math.round(cost) }));
      },

      resetCosts: () => set(createInitialState()),
    }),
    { name: 'pm-trainer-costs' }
  )
);
