'use client';

import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/stores/gameStore';
import { useDocumentStore } from '@/lib/stores/documentStore';
import { useCostStore } from '@/lib/stores/costStore';
import Button from '@/components/ui/Button';

export default function TitlePage() {
  const router = useRouter();
  const { isGameStarted, resetGame } = useGameStore();
  const { resetDocuments } = useDocumentStore();
  const { resetCosts } = useCostStore();

  const handleNewGame = () => {
    resetGame();
    resetDocuments();
    resetCosts();
    router.push('/game');
  };

  const handleContinue = () => {
    router.push('/game');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      <div className="text-center animate-fade-in">
        <div className="mb-2 text-blue-300 text-sm font-medium tracking-widest uppercase">
          PMBOK Project Management
        </div>
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-300 via-white to-blue-300 bg-clip-text text-transparent">
          PM Trainer
        </h1>
        <p className="text-xl text-blue-200 mb-2">
          プロジェクトマネジメント ロールプレイングゲーム
        </p>
        <p className="text-sm text-blue-300/70 mb-12 max-w-md mx-auto">
          仮想プロジェクトのPMとして、ステークホルダーと調整しながら
          プロジェクトを成功に導こう
        </p>

        <div className="space-y-4">
          <div>
            <Button size="lg" onClick={handleNewGame} className="w-64 animate-pulse-glow">
              新しいゲームを始める
            </Button>
          </div>
          {isGameStarted && (
            <div className="animate-fade-in">
              <Button size="lg" variant="secondary" onClick={handleContinue} className="w-64">
                続きから再開する
              </Button>
            </div>
          )}
          <div>
            <Button size="lg" variant="ghost" onClick={() => router.push('/guide')} className="w-64 text-blue-300 hover:text-white hover:bg-white/10">
              PMBOKガイド
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 text-center text-blue-400/50 text-xs">
        <p>シナリオ: 顧客・案件管理システム新規開発プロジェクト</p>
        <p className="mt-1">中堅製造業「東洋テクノロジー」 | 12ヶ月 | 予算5,000万円</p>
      </div>
    </div>
  );
}
