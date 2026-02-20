import { Stakeholder } from './stakeholder';
import { GameEvent } from './event';

export interface Scenario {
  id: string;
  title: string;
  company: string;
  description: string;
  duration: number;
  budget: number;
  stakeholders: Stakeholder[];
  events: GameEvent[];
}
