'use client';

interface BadgeProps {
  icon: string;
  title: string;
  description?: string;
  earnedAt?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeConfig = {
  sm: { container: 'w-12 h-12', icon: 'text-lg', title: 'text-xs' },
  md: { container: 'w-16 h-16', icon: 'text-2xl', title: 'text-sm' },
  lg: { container: 'w-20 h-20', icon: 'text-3xl', title: 'text-base' },
};

export default function Badge({
  icon,
  title,
  description,
  earnedAt,
  size = 'md',
}: BadgeProps) {
  const config = sizeConfig[size];

  return (
    <div className="flex flex-col items-center gap-2 p-3">
      {/* Badge icon circle */}
      <div
        className={`${config.container} rounded-full bg-gradient-to-tr from-[#F0548B] to-[#f87aaa] flex items-center justify-center shadow-md`}
      >
        <span className={config.icon}>{icon}</span>
      </div>

      {/* Badge title */}
      <p className={`${config.title} font-semibold text-gray-800 text-center`}>
        {title}
      </p>

      {/* Description */}
      {description && (
        <p className="text-xs text-gray-500 text-center max-w-[120px]">
          {description}
        </p>
      )}

      {/* Earned date */}
      {earnedAt && (
        <p className="text-[10px] text-gray-400">
          {new Date(earnedAt).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
