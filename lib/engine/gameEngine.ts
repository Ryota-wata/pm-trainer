import { PhaseId } from '@/lib/types/game';
import { GameEvent } from '@/lib/types/event';
import { initiationEvents } from '@/lib/data/events/initiation';
import { preRequirementsEvents } from '@/lib/data/events/pre-requirements';
import { romPlanningEvents } from '@/lib/data/events/rom-planning';
import { requirementsEvents } from '@/lib/data/events/requirements';
import { estimationEvents } from '@/lib/data/events/estimation';
import { designDevEvents } from '@/lib/data/events/design-dev';
import { testingEvents } from '@/lib/data/events/testing';
import { closingEvents } from '@/lib/data/events/closing';

const allEvents: GameEvent[] = [
  ...initiationEvents,
  ...preRequirementsEvents,
  ...romPlanningEvents,
  ...requirementsEvents,
  ...estimationEvents,
  ...designDevEvents,
  ...testingEvents,
  ...closingEvents,
];

export function getEventsByPhase(phase: PhaseId): GameEvent[] {
  return allEvents.filter(e => e.phase === phase).sort((a, b) => a.order - b.order);
}

export function getEventById(eventId: string): GameEvent | undefined {
  return allEvents.find(e => e.id === eventId);
}

export function getPhaseProgress(phase: PhaseId, completedEvents: string[]): number {
  const phaseEvents = getEventsByPhase(phase);
  if (phaseEvents.length === 0) return 0;
  const completed = phaseEvents.filter(e => completedEvents.includes(e.id)).length;
  return Math.round((completed / phaseEvents.length) * 100);
}

export function isPhaseComplete(phase: PhaseId, completedEvents: string[]): boolean {
  const phaseEvents = getEventsByPhase(phase);
  const requiredEvents = phaseEvents.filter(e => e.isRequired);
  return requiredEvents.every(e => completedEvents.includes(e.id));
}

export function getNextEvent(phase: PhaseId, completedEvents: string[]): GameEvent | undefined {
  const phaseEvents = getEventsByPhase(phase);
  return phaseEvents.find(e => !completedEvents.includes(e.id));
}

export function getAllEvents(): GameEvent[] {
  return allEvents;
}
