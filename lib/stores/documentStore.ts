import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  DocumentType,
  DocumentStatus,
  DocumentData,
  CharterData,
  RequirementsData,
  WbsData,
  ScheduleData,
  RiskRegisterData,
  ChangeLogData,
  LessonsLearnedData,
} from '@/lib/types/document';

interface DocumentEntry {
  type: DocumentType;
  status: DocumentStatus;
  data: DocumentData;
  lastModified: number;
}

interface DocumentStore {
  documents: Record<DocumentType, DocumentEntry>;
  unlockedDocuments: DocumentType[];
  unlockDocument: (type: DocumentType) => void;
  updateDocument: (type: DocumentType, data: DocumentData) => void;
  completeDocument: (type: DocumentType) => void;
  getDocument: (type: DocumentType) => DocumentEntry;
  getCompletedCount: () => number;
  resetDocuments: () => void;
}

const defaultCharter: CharterData = {
  projectName: '顧客・案件管理システム新規開発プロジェクト',
  projectManager: '',
  sponsor: '高山 誠一（CFO）',
  startDate: '',
  endDate: '',
  budget: '5,000万円',
  background: '',
  objectives: [''],
  scope: '',
  outOfScope: '',
  milestones: [{ name: '', date: '' }],
  risks: [''],
  stakeholders: [''],
  approver: '',
};

const defaultRequirements: RequirementsData = {
  projectName: '顧客・案件管理システム新規開発プロジェクト',
  version: '1.0',
  functionalRequirements: [{ id: 'FR-001', category: '', description: '', priority: 'high', source: '' }],
  nonFunctionalRequirements: [{ id: 'NFR-001', category: '', description: '', priority: 'high', source: '' }],
  constraints: [''],
  assumptions: [''],
};

const defaultWbs: WbsData = {
  projectName: '顧客・案件管理システム新規開発プロジェクト',
  items: [
    { id: '1', name: '顧客・案件管理システム', level: 0, parentId: null, duration: '12ヶ月', assignee: 'PM' },
    { id: '1.1', name: '立上げ・要件定義', level: 1, parentId: '1', duration: '', assignee: '' },
    { id: '1.2', name: '設計', level: 1, parentId: '1', duration: '', assignee: '' },
    { id: '1.3', name: '開発', level: 1, parentId: '1', duration: '', assignee: '' },
    { id: '1.4', name: 'テスト', level: 1, parentId: '1', duration: '', assignee: '' },
    { id: '1.5', name: '展開・導入', level: 1, parentId: '1', duration: '', assignee: '' },
  ],
};

const defaultSchedule: ScheduleData = {
  projectName: '顧客・案件管理システム新規開発プロジェクト',
  totalMonths: 12,
  items: [
    { id: 'S-001', task: '要件定義', startMonth: 1, endMonth: 2, assignee: '', dependency: '', status: 'not_started' },
    { id: 'S-002', task: '基本設計', startMonth: 3, endMonth: 4, assignee: '', dependency: 'S-001', status: 'not_started' },
    { id: 'S-003', task: '詳細設計', startMonth: 4, endMonth: 5, assignee: '', dependency: 'S-002', status: 'not_started' },
    { id: 'S-004', task: '開発', startMonth: 5, endMonth: 8, assignee: '', dependency: 'S-003', status: 'not_started' },
    { id: 'S-005', task: 'テスト', startMonth: 8, endMonth: 10, assignee: '', dependency: 'S-004', status: 'not_started' },
    { id: 'S-006', task: '移行・展開', startMonth: 10, endMonth: 12, assignee: '', dependency: 'S-005', status: 'not_started' },
  ],
};

const defaultRiskRegister: RiskRegisterData = {
  projectName: '顧客・案件管理システム新規開発プロジェクト',
  items: [{ id: 'R-001', description: '', category: '', probability: 'medium', impact: 'medium', response: '', owner: '', status: 'open' }],
};

const defaultChangeLog: ChangeLogData = {
  projectName: '顧客・案件管理システム新規開発プロジェクト',
  items: [{ id: 'CR-001', date: '', requestor: '', description: '', impact: '', decision: 'pending', reason: '' }],
};

const defaultLessons: LessonsLearnedData = {
  projectName: '顧客・案件管理システム新規開発プロジェクト',
  items: [{ id: 'LL-001', phase: '', category: '', description: '', recommendation: '' }],
  overallReflection: '',
};

function createInitialDocuments(): Record<DocumentType, DocumentEntry> {
  return {
    charter: { type: 'charter', status: 'not_started', data: { ...defaultCharter }, lastModified: 0 },
    requirements: { type: 'requirements', status: 'not_started', data: { ...defaultRequirements }, lastModified: 0 },
    wbs: { type: 'wbs', status: 'not_started', data: { ...defaultWbs }, lastModified: 0 },
    schedule: { type: 'schedule', status: 'not_started', data: { ...defaultSchedule }, lastModified: 0 },
    'risk-register': { type: 'risk-register', status: 'not_started', data: { ...defaultRiskRegister }, lastModified: 0 },
    'change-log': { type: 'change-log', status: 'not_started', data: { ...defaultChangeLog }, lastModified: 0 },
    'lessons-learned': { type: 'lessons-learned', status: 'not_started', data: { ...defaultLessons }, lastModified: 0 },
  };
}

export const useDocumentStore = create<DocumentStore>()(
  persist(
    (set, get) => ({
      documents: createInitialDocuments(),
      unlockedDocuments: [],

      unlockDocument: (type) => {
        const state = get();
        if (!state.unlockedDocuments.includes(type)) {
          set({ unlockedDocuments: [...state.unlockedDocuments, type] });
        }
      },

      updateDocument: (type, data) => {
        const state = get();
        const doc = state.documents[type];
        set({
          documents: {
            ...state.documents,
            [type]: {
              ...doc,
              data,
              status: doc.status === 'not_started' ? 'draft' : doc.status,
              lastModified: Date.now(),
            },
          },
        });
      },

      completeDocument: (type) => {
        const state = get();
        set({
          documents: {
            ...state.documents,
            [type]: { ...state.documents[type], status: 'completed', lastModified: Date.now() },
          },
        });
      },

      getDocument: (type) => get().documents[type],

      getCompletedCount: () => {
        const docs = get().documents;
        return Object.values(docs).filter(d => d.status === 'completed').length;
      },

      resetDocuments: () => set({
        documents: createInitialDocuments(),
        unlockedDocuments: [],
      }),
    }),
    {
      name: 'pm-trainer-documents',
    }
  )
);
