import EventPageClient from '@/components/game/EventPageClient';

export function generateStaticParams() {
  return [
    // Initiation
    { eventId: 'init-1' }, { eventId: 'init-2' },
    // Pre-Requirements
    { eventId: 'prereq-1' }, { eventId: 'prereq-2' },
    // ROM & PM Planning
    { eventId: 'rom-1' }, { eventId: 'rom-2' }, { eventId: 'rom-3' },
    // Requirements
    { eventId: 'req-1' }, { eventId: 'req-2' }, { eventId: 'req-3' },
    // Estimation
    { eventId: 'est-1' }, { eventId: 'est-2' }, { eventId: 'est-3' },
    // Design & Development
    { eventId: 'dev-1' }, { eventId: 'dev-2' }, { eventId: 'dev-3' },
    // Testing
    { eventId: 'test-1' }, { eventId: 'test-2' }, { eventId: 'test-3' },
    // Closing
    { eventId: 'close-1' }, { eventId: 'close-2' },
  ];
}

export default function EventPage() {
  return <EventPageClient />;
}
