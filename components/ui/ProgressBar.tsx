interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md';
}

export default function ProgressBar({ value, max = 100, color = 'bg-blue-500', label, showValue = true, size = 'md' }: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const barHeight = size === 'sm' ? 'h-2' : 'h-3';

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-sm text-gray-600">{label}</span>}
          {showValue && <span className="text-sm font-medium text-gray-700">{Math.round(value)}/{max}</span>}
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${barHeight} overflow-hidden`}>
        <div
          className={`${color} ${barHeight} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
