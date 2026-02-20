export type DocumentType =
  | 'charter'
  | 'requirements'
  | 'wbs'
  | 'schedule'
  | 'risk-register'
  | 'change-log'
  | 'lessons-learned';

export type DocumentStatus = 'not_started' | 'draft' | 'completed';

export interface DocumentMeta {
  type: DocumentType;
  title: string;
  titleJa: string;
  description: string;
  phase: string;
  template: Record<string, unknown>;
  scoringCriteria: string[];
}

export interface CharterData {
  projectName: string;
  projectManager: string;
  sponsor: string;
  startDate: string;
  endDate: string;
  budget: string;
  background: string;
  objectives: string[];
  scope: string;
  outOfScope: string;
  milestones: { name: string; date: string }[];
  risks: string[];
  stakeholders: string[];
  approver: string;
}

export interface RequirementItem {
  id: string;
  category: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  source: string;
}

export interface RequirementsData {
  projectName: string;
  version: string;
  functionalRequirements: RequirementItem[];
  nonFunctionalRequirements: RequirementItem[];
  constraints: string[];
  assumptions: string[];
}

export interface WbsItem {
  id: string;
  name: string;
  level: number;
  parentId: string | null;
  duration: string;
  assignee: string;
}

export interface WbsData {
  projectName: string;
  items: WbsItem[];
}

export interface ScheduleItem {
  id: string;
  task: string;
  startMonth: number;
  endMonth: number;
  assignee: string;
  dependency: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'delayed';
}

export interface ScheduleData {
  projectName: string;
  totalMonths: number;
  items: ScheduleItem[];
}

export interface RiskItem {
  id: string;
  description: string;
  category: string;
  probability: 'high' | 'medium' | 'low';
  impact: 'high' | 'medium' | 'low';
  response: string;
  owner: string;
  status: 'open' | 'mitigated' | 'occurred' | 'closed';
}

export interface RiskRegisterData {
  projectName: string;
  items: RiskItem[];
}

export interface ChangeLogItem {
  id: string;
  date: string;
  requestor: string;
  description: string;
  impact: string;
  decision: 'approved' | 'rejected' | 'pending';
  reason: string;
}

export interface ChangeLogData {
  projectName: string;
  items: ChangeLogItem[];
}

export interface LessonItem {
  id: string;
  phase: string;
  category: string;
  description: string;
  recommendation: string;
}

export interface LessonsLearnedData {
  projectName: string;
  items: LessonItem[];
  overallReflection: string;
}

export type DocumentData =
  | CharterData
  | RequirementsData
  | WbsData
  | ScheduleData
  | RiskRegisterData
  | ChangeLogData
  | LessonsLearnedData;
