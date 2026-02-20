'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import { useDocumentStore } from '@/lib/stores/documentStore';
import { documentMeta } from '@/lib/data/documents/templates';
import { DocumentType } from '@/lib/types/document';
import DocumentForm from '@/components/document/DocumentForm';
import ReferencePanel from '@/components/document/ReferencePanel';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Toast from '@/components/ui/Toast';

export default function DocumentEditClient() {
  const params = useParams();
  const router = useRouter();
  const docType = params.docType as DocumentType;
  const { documents, unlockedDocuments } = useDocumentStore();
  const [showToast, setShowToast] = useState(false);
  const [isRefOpen, setIsRefOpen] = useState(false);

  const meta = documentMeta[docType];
  const doc = documents[docType];
  const isUnlocked = unlockedDocuments.includes(docType);

  const handleSaved = useCallback(() => {
    setShowToast(true);
  }, []);

  if (!meta || !isUnlocked) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">このドキュメントはまだアンロックされていません。</p>
        <Button variant="ghost" onClick={() => router.back()} className="mt-4">戻る</Button>
      </div>
    );
  }

  return (
    <div className={`transition-[padding] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${isRefOpen ? 'md:pr-[420px] lg:pr-[480px]' : ''}`}>
      <div className="max-w-4xl mx-auto px-4 py-6 animate-fade-in">
        {/* Navigation */}
        <div className="mb-5">
          <Button variant="ghost" size="sm" onClick={() => router.push('/game/document')}>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              ドキュメント一覧
            </span>
          </Button>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{meta.titleJa}</h1>
              <Badge variant={doc?.status === 'completed' ? 'success' : doc?.status === 'draft' ? 'warning' : 'info'} size="md">
                {doc?.status === 'completed' ? '完了' : doc?.status === 'draft' ? '下書き' : '未着手'}
              </Badge>
            </div>
            <p className="text-sm text-gray-500">{meta.description}</p>
          </div>
        </div>

        {/* Scoring criteria + Reference toggle */}
        <div className="flex items-stretch gap-3 mb-8">
          <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-xl p-4 border border-blue-100/60">
            <h3 className="text-xs font-bold text-blue-700/80 uppercase tracking-wider mb-2.5">評価基準</h3>
            <ul className="space-y-1.5">
              {meta.scoringCriteria.map((c, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-blue-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                  {c}
                </li>
              ))}
            </ul>
          </div>

          {/* Reference panel toggle */}
          <button
            onClick={() => setIsRefOpen(!isRefOpen)}
            className={`shrink-0 w-12 flex flex-col items-center justify-center gap-1.5 rounded-xl border transition-all duration-200 group ${
              isRefOpen
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/25'
                : 'bg-white border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-600 hover:shadow-md'
            }`}
            aria-label="参考資料パネルの開閉"
          >
            <svg className={`w-5 h-5 transition-transform duration-200 ${isRefOpen ? 'scale-110' : 'group-hover:scale-110'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="text-[10px] font-bold leading-none tracking-tight" style={{ writingMode: 'vertical-rl' }}>
              参考資料
            </span>
          </button>
        </div>

        {/* Form */}
        <DocumentForm docType={docType} onSaved={handleSaved} />

        {/* Toast */}
        <Toast
          message="ドキュメントを保存しました"
          type="success"
          isVisible={showToast}
          onClose={() => setShowToast(false)}
        />
      </div>

      {/* Reference Panel */}
      <ReferencePanel
        isOpen={isRefOpen}
        onClose={() => setIsRefOpen(false)}
        currentDocType={docType}
      />
    </div>
  );
}
