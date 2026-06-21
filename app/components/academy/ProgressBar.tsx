'use client';

interface ProgressBarProps {
  percentage: number;
  label?: string;
  showPercentage?: boolean;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeConfig = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

export default function ProgressBar({
  percentage,
  label,
  showPercentage = true,
  color = '#F0548B',
  size = 'md',
}: ProgressBarProps) {
  // Clamp percentage between 0 and 100
  const clampedPercentage = Math.min(100, Math.max(0, percentage));

  return (
    <div className="w-full">
      {/* Label and percentage */}
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-sm font-medium text-gray-700">{label}</span>
          )}
          {showPercentage && (
            <span className="text-sm font-semibold text-gray-600">
              {Math.round(clampedPercentage)}%
            </span>
          )}
        </div>
      )}

      {/* Progress bar track */}
      <div className={`w-full rounded-full bg-gray-100 overflow-hidden ${sizeConfig[size]}`}>
        {/* Progress bar fill */}
        <div
          className={`rounded-full transition-all duration-500 ease-out ${sizeConfig[size]}`}
          style={{
            width: `${clampedPercentage}%`,
            backgroundColor: color }}
        />
      </div>
    </div>
  );
}
