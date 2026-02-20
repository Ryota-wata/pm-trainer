'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/stores/gameStore';
import PhaseTimeline from '@/components/game/PhaseTimeline';
import StatusBar from '@/components/game/StatusBar';

export default function GameLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isGameStarted } = useGameStore();

  useEffect(() => {
    if (!isGameStarted) {
      router.push('/');
    }
  }, [isGameStarted, router]);

  if (!isGameStarted) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PhaseTimeline />
      <StatusBar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
