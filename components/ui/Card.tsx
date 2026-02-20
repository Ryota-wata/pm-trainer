import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export default function Card({ children, className = '', onClick, hover = false }: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 shadow-sm ${hover ? 'hover:shadow-md hover:border-gray-300 cursor-pointer transition-all duration-200' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
