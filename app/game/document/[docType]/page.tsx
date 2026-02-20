import DocumentEditClient from '@/components/document/DocumentEditClient';

export function generateStaticParams() {
  return [
    { docType: 'charter' },
    { docType: 'requirements' },
    { docType: 'wbs' },
    { docType: 'schedule' },
    { docType: 'risk-register' },
    { docType: 'change-log' },
    { docType: 'lessons-learned' },
  ];
}

export default function DocumentEditPage() {
  return <DocumentEditClient />;
}
