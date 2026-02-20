'use client';

import { useState } from 'react';
import { DocumentType } from '@/lib/types/document';
import { PhaseId } from '@/lib/types/game';
import { useGameStore } from '@/lib/stores/gameStore';
import { useDocumentStore } from '@/lib/stores/documentStore';
import { getEventById } from '@/lib/engine/gameEngine';
import { documentMeta } from '@/lib/data/documents/templates';

interface ReferencePanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentDocType: DocumentType;
}

const phaseOrder: PhaseId[] = [
  'initiation', 'pre-requirements', 'rom-planning', 'requirements',
  'estimation', 'design-dev', 'testing', 'closing',
];

const phaseMeta: Record<PhaseId, { icon: string; color: string; bgLight: string; border: string }> = {
  'initiation':       { icon: '\u{1F680}', color: 'text-orange-600', bgLight: 'bg-orange-50', border: 'border-orange-200' },
  'pre-requirements': { icon: '\u{1F50D}', color: 'text-amber-600',  bgLight: 'bg-amber-50',  border: 'border-amber-200' },
  'rom-planning':     { icon: '\u{1F4D0}', color: 'text-yellow-600', bgLight: 'bg-yellow-50', border: 'border-yellow-200' },
  'requirements':     { icon: '\u{1F4CB}', color: 'text-lime-600',   bgLight: 'bg-lime-50',   border: 'border-lime-200' },
  'estimation':       { icon: '\u{1F9EE}', color: 'text-emerald-600',bgLight: 'bg-emerald-50',border: 'border-emerald-200' },
  'design-dev':       { icon: '\u{2699}\u{FE0F}', color: 'text-blue-600', bgLight: 'bg-blue-50', border: 'border-blue-200' },
  'testing':          { icon: '\u{1F9EA}', color: 'text-violet-600', bgLight: 'bg-violet-50', border: 'border-violet-200' },
  'closing':          { icon: '\u{1F3C1}', color: 'text-slate-600',  bgLight: 'bg-slate-50',  border: 'border-slate-200' },
};

type TabId = 'events' | 'documents';

export default function ReferencePanel({ isOpen, onClose, currentDocType }: ReferencePanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>('events');

  return (
    <>
      {/* Backdrop - mobile only */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full z-50 flex flex-col
          bg-white/95 backdrop-blur-xl
          shadow-[-8px_0_30px_rgba(0,0,0,0.08)]
          border-l border-gray-200/60
          transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          w-full md:w-[420px] lg:w-[480px]`}
      >
        {/* Header */}
        <div className="shrink-0 px-5 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900 tracking-tight">参考資料</h2>
                <p className="text-[11px] text-gray-400">イベント履歴・ドキュメントを参照</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-150"
              aria-label="パネルを閉じる"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tab switcher - pill style */}
          <div className="mt-3.5 flex gap-1 p-1 bg-gray-100 rounded-lg">
            <button
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
                activeTab === 'events'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('events')}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              イベント履歴
            </button>
            <button
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
                activeTab === 'documents'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('documents')}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              ドキュメント
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {activeTab === 'events' ? (
            <EventHistoryTab />
          ) : (
            <DocumentsTab currentDocType={currentDocType} />
          )}
        </div>
      </div>
    </>
  );
}

/* ─── Accordion height animation helper ─── */

function AccordionContent({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) {
  return (
    <div
      className="grid transition-[grid-template-rows,opacity] duration-300 ease-in-out"
      style={{
        gridTemplateRows: isOpen ? '1fr' : '0fr',
        opacity: isOpen ? 1 : 0,
      }}
    >
      <div className="overflow-hidden">
        {children}
      </div>
    </div>
  );
}

/* ─── Event History Tab ─── */

function EventHistoryTab() {
  const { completedEvents, log, phases } = useGameStore();
  const [openPhases, setOpenPhases] = useState<Set<PhaseId>>(new Set());
  const [openEvents, setOpenEvents] = useState<Set<string>>(new Set());

  const togglePhase = (phase: PhaseId) => {
    setOpenPhases(prev => {
      const next = new Set(prev);
      if (next.has(phase)) next.delete(phase);
      else next.add(phase);
      return next;
    });
  };

  const toggleEvent = (eventId: string) => {
    setOpenEvents(prev => {
      const next = new Set(prev);
      if (next.has(eventId)) next.delete(eventId);
      else next.add(eventId);
      return next;
    });
  };

  if (completedEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
          <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-400">まだ完了したイベントはありません</p>
        <p className="text-xs text-gray-300 mt-1">ゲームを進めるとここに履歴が表示されます</p>
      </div>
    );
  }

  // Group completed events by phase
  const eventsByPhase: Partial<Record<PhaseId, string[]>> = {};
  for (const phase of phaseOrder) {
    const phaseCompletedEvents = completedEvents.filter(eid => {
      const ev = getEventById(eid);
      return ev?.phase === phase;
    });
    if (phaseCompletedEvents.length > 0) {
      eventsByPhase[phase] = phaseCompletedEvents;
    }
  }

  return (
    <div className="p-3 space-y-1.5">
      {phaseOrder.map(phase => {
        const events = eventsByPhase[phase];
        if (!events || events.length === 0) return null;
        const phaseData = phases[phase];
        const pm = phaseMeta[phase];
        const isPhaseOpen = openPhases.has(phase);

        return (
          <div key={phase} className="rounded-xl overflow-hidden">
            {/* Phase header */}
            <button
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors duration-150
                ${isPhaseOpen ? `${pm.bgLight}` : 'hover:bg-gray-50'}`}
              onClick={() => togglePhase(phase)}
            >
              <span className="text-base leading-none">{pm.icon}</span>
              <span className={`text-[13px] font-semibold flex-1 ${isPhaseOpen ? pm.color : 'text-gray-700'}`}>
                {phaseData.nameJa}
              </span>
              <span className="text-[11px] text-gray-400 tabular-nums mr-1">{events.length}件</span>
              <svg
                className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isPhaseOpen ? 'rotate-90' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Phase events */}
            <AccordionContent isOpen={isPhaseOpen}>
              <div className={`ml-3 border-l-2 ${pm.border} space-y-0.5 pb-2`}>
                {events.map(eventId => {
                  const event = getEventById(eventId);
                  if (!event) return null;
                  const logEntry = log.find(l => l.eventId === eventId);
                  const isEventOpen = openEvents.has(eventId);

                  return (
                    <div key={eventId}>
                      {/* Event row */}
                      <button
                        className={`w-full flex items-center gap-2 px-3 py-2 text-left transition-colors duration-150 ${
                          isEventOpen ? 'bg-gray-50/80' : 'hover:bg-gray-50/50'
                        }`}
                        onClick={() => toggleEvent(eventId)}
                      >
                        <span className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                          <svg className="w-2.5 h-2.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                        <span className="text-[13px] text-gray-700 flex-1 truncate">{event.title}</span>
                        <svg
                          className={`w-3 h-3 text-gray-300 shrink-0 transition-transform duration-200 ${isEventOpen ? 'rotate-90' : ''}`}
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>

                      {/* Event detail */}
                      <AccordionContent isOpen={isEventOpen}>
                        <div className="px-3 pb-3 space-y-2.5">
                          {/* Dialogue */}
                          {event.dialogue.length > 0 && (
                            <div className="space-y-1.5 pt-1">
                              {event.dialogue.map((line, idx) => (
                                <div key={idx} className="flex gap-2 items-start">
                                  <div className="shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center mt-0.5">
                                    <span className="text-[9px] font-bold text-gray-600">
                                      {line.speaker.charAt(0)}
                                    </span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <span className="text-[11px] font-semibold text-gray-500">{line.speaker}</span>
                                    <div className="mt-0.5 bg-white rounded-lg rounded-tl-sm border border-gray-100 px-2.5 py-1.5 text-xs text-gray-600 leading-relaxed shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                                      {line.text}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Selected choice */}
                          {logEntry && (() => {
                            const selectedChoice = event.choices.find(c => c.id === logEntry.choiceId);
                            if (!selectedChoice) return null;
                            return (
                              <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-100/80 rounded-xl p-3 space-y-2">
                                <div className="flex items-center gap-1.5">
                                  <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                  </div>
                                  <span className="text-[11px] font-bold text-blue-700 tracking-wide uppercase">あなたの判断</span>
                                </div>
                                <p className="text-xs text-blue-900 font-medium leading-relaxed">{selectedChoice.text}</p>
                                <div className="h-px bg-blue-100" />
                                <p className="text-[11px] text-blue-700/80 leading-relaxed">{selectedChoice.feedback}</p>
                                {selectedChoice.pmbokReference && (
                                  <div className="flex items-start gap-1.5 pt-0.5">
                                    <svg className="w-3 h-3 text-blue-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-[11px] text-blue-500 leading-relaxed">{selectedChoice.pmbokReference}</p>
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      </AccordionContent>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Documents Tab ─── */

function DocumentsTab({ currentDocType }: { currentDocType: DocumentType }) {
  const { documents } = useDocumentStore();
  const [openDocs, setOpenDocs] = useState<Set<DocumentType>>(new Set());

  const toggleDoc = (docType: DocumentType) => {
    setOpenDocs(prev => {
      const next = new Set(prev);
      if (next.has(docType)) next.delete(docType);
      else next.add(docType);
      return next;
    });
  };

  const allDocTypes: DocumentType[] = ['charter', 'requirements', 'wbs', 'schedule', 'risk-register', 'change-log', 'lessons-learned'];
  const visibleDocs = allDocTypes.filter(dt => {
    if (dt === currentDocType) return false;
    const doc = documents[dt];
    return doc.status === 'draft' || doc.status === 'completed';
  });

  if (visibleDocs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
          <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-400">参照可能なドキュメントはありません</p>
        <p className="text-xs text-gray-300 mt-1">他のドキュメントを作成すると参照できます</p>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-2">
      {visibleDocs.map(docType => {
        const meta = documentMeta[docType];
        const doc = documents[docType];
        const isOpen = openDocs.has(docType);
        const isCompleted = doc.status === 'completed';

        return (
          <div key={docType} className={`rounded-xl border transition-colors duration-150 ${
            isOpen ? 'border-gray-200 bg-white shadow-sm' : 'border-transparent hover:bg-gray-50'
          }`}>
            <button
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left"
              onClick={() => toggleDoc(docType)}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                isCompleted
                  ? 'bg-gradient-to-br from-green-400 to-emerald-500'
                  : 'bg-gradient-to-br from-amber-300 to-yellow-400'
              }`}>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isCompleted ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  )}
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[13px] font-semibold text-gray-800 block truncate">{meta.titleJa}</span>
                <span className="text-[11px] text-gray-400">{meta.phase}</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wide ${
                isCompleted
                  ? 'bg-green-50 text-green-600'
                  : 'bg-amber-50 text-amber-600'
              }`}>
                {isCompleted ? '完了' : '下書き'}
              </span>
              <svg
                className={`w-3.5 h-3.5 text-gray-300 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <AccordionContent isOpen={isOpen}>
              <div className="px-3 pb-3">
                <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 leading-relaxed space-y-1.5 border border-gray-100">
                  <DocumentPreview docType={docType} data={doc.data} />
                </div>
              </div>
            </AccordionContent>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Document Preview (read-only summary) ─── */

function DocumentPreview({ docType, data }: { docType: DocumentType; data: unknown }) {
  switch (docType) {
    case 'charter': {
      const d = data as import('@/lib/types/document').CharterData;
      return (
        <>
          <PreviewField label="プロジェクト名" value={d.projectName} />
          <PreviewField label="PM" value={d.projectManager} />
          <PreviewField label="スポンサー" value={d.sponsor} />
          <PreviewField label="予算" value={d.budget} />
          <PreviewField label="背景・目的" value={d.background} />
          <PreviewField label="スコープ" value={d.scope} />
          {d.objectives.filter(Boolean).length > 0 && <PreviewList label="目標" items={d.objectives} />}
          {d.risks.filter(Boolean).length > 0 && <PreviewList label="リスク" items={d.risks} />}
          {d.stakeholders.filter(Boolean).length > 0 && <PreviewList label="ステークホルダー" items={d.stakeholders} />}
        </>
      );
    }
    case 'requirements': {
      const d = data as import('@/lib/types/document').RequirementsData;
      const reqs = [...d.functionalRequirements, ...d.nonFunctionalRequirements].filter(r => r.description);
      return (
        <>
          {reqs.map(r => (
            <div key={r.id} className="flex items-baseline gap-1.5">
              <span className="text-[10px] font-mono text-gray-400 shrink-0">{r.id}</span>
              <span>{r.description}</span>
              <span className={`ml-auto text-[10px] shrink-0 px-1.5 py-px rounded font-medium ${
                r.priority === 'high' ? 'bg-red-50 text-red-500' : r.priority === 'medium' ? 'bg-yellow-50 text-yellow-600' : 'bg-gray-100 text-gray-400'
              }`}>{r.priority === 'high' ? '高' : r.priority === 'medium' ? '中' : '低'}</span>
            </div>
          ))}
          {d.constraints.filter(Boolean).length > 0 && <PreviewList label="制約" items={d.constraints} />}
        </>
      );
    }
    case 'wbs': {
      const d = data as import('@/lib/types/document').WbsData;
      return (
        <>
          {d.items.filter(i => i.name).map(item => (
            <div key={item.id} className="flex items-baseline gap-1.5" style={{ paddingLeft: `${item.level * 12}px` }}>
              <span className="text-[10px] font-mono text-gray-400 shrink-0">{item.id}</span>
              <span className={item.level === 0 ? 'font-semibold' : ''}>{item.name}</span>
              {item.duration && <span className="ml-auto text-gray-400 shrink-0">{item.duration}</span>}
            </div>
          ))}
        </>
      );
    }
    case 'schedule': {
      const d = data as import('@/lib/types/document').ScheduleData;
      return (
        <>
          {d.items.filter(i => i.task).map(item => (
            <div key={item.id} className="flex items-center justify-between">
              <span>{item.task}</span>
              <span className="text-[11px] font-mono text-gray-400">{item.startMonth}-{item.endMonth}月</span>
            </div>
          ))}
        </>
      );
    }
    case 'risk-register': {
      const d = data as import('@/lib/types/document').RiskRegisterData;
      return (
        <>
          {d.items.filter(i => i.description).map(item => (
            <div key={item.id} className="space-y-0.5">
              <div className="flex items-baseline gap-1.5">
                <span className="text-[10px] font-mono text-gray-400 shrink-0">{item.id}</span>
                <span>{item.description}</span>
              </div>
              <div className="flex gap-1.5 ml-6">
                <span className={`text-[10px] px-1.5 py-px rounded font-medium ${
                  item.probability === 'high' ? 'bg-red-50 text-red-500' : item.probability === 'medium' ? 'bg-yellow-50 text-yellow-600' : 'bg-green-50 text-green-500'
                }`}>確率:{item.probability === 'high' ? '高' : item.probability === 'medium' ? '中' : '低'}</span>
                <span className={`text-[10px] px-1.5 py-px rounded font-medium ${
                  item.impact === 'high' ? 'bg-red-50 text-red-500' : item.impact === 'medium' ? 'bg-yellow-50 text-yellow-600' : 'bg-green-50 text-green-500'
                }`}>影響:{item.impact === 'high' ? '高' : item.impact === 'medium' ? '中' : '低'}</span>
              </div>
            </div>
          ))}
        </>
      );
    }
    case 'change-log': {
      const d = data as import('@/lib/types/document').ChangeLogData;
      return (
        <>
          {d.items.filter(i => i.description).map(item => (
            <div key={item.id} className="space-y-0.5">
              <div className="flex items-baseline gap-1.5">
                <span className="text-[10px] font-mono text-gray-400 shrink-0">{item.id}</span>
                <span className="flex-1">{item.description}</span>
                {item.date && <span className="text-[10px] text-gray-400 shrink-0">{item.date}</span>}
              </div>
              <div className="ml-6">
                <span className={`text-[10px] px-1.5 py-px rounded font-medium ${
                  item.decision === 'approved' ? 'bg-green-50 text-green-600' : item.decision === 'rejected' ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-500'
                }`}>{item.decision === 'approved' ? '承認' : item.decision === 'rejected' ? '却下' : '保留'}</span>
              </div>
            </div>
          ))}
        </>
      );
    }
    case 'lessons-learned': {
      const d = data as import('@/lib/types/document').LessonsLearnedData;
      return (
        <>
          {d.items.filter(i => i.description).map(item => (
            <div key={item.id} className="space-y-0.5">
              <div className="flex items-baseline gap-1.5">
                <span className="text-[10px] font-mono text-gray-400 shrink-0">{item.id}</span>
                <span>{item.description}</span>
              </div>
              {item.recommendation && (
                <p className="ml-6 text-blue-600">
                  <span className="text-[10px] font-semibold">推奨:</span> {item.recommendation}
                </p>
              )}
            </div>
          ))}
          {d.overallReflection && <PreviewField label="全体振り返り" value={d.overallReflection} />}
        </>
      );
    }
    default:
      return null;
  }
}

function PreviewField({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div>
      <span className="text-[11px] font-semibold text-gray-400">{label}</span>
      <p className="text-gray-700">{value}</p>
    </div>
  );
}

function PreviewList({ label, items }: { label: string; items: string[] }) {
  const filtered = items.filter(Boolean);
  if (filtered.length === 0) return null;
  return (
    <div>
      <span className="text-[11px] font-semibold text-gray-400">{label}</span>
      <ul className="mt-0.5 space-y-0.5">
        {filtered.map((item, i) => (
          <li key={i} className="flex items-baseline gap-1.5 text-gray-700">
            <span className="w-1 h-1 rounded-full bg-gray-300 shrink-0 mt-1.5" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
