'use client';

interface StatCardProps {
  count: number | string;
  label: string;
  icon: string;
  trend?: {
    direction: 'up' | 'down' | 'stable';
    value?: string;
  };
}

const trendConfig = {
  up: { color: 'text-green-600', bg: 'bg-green-50', arrow: '↑' },
  down: { color: 'text-red-600', bg: 'bg-red-50', arrow: '↓' },
  stable: { color: 'text-gray-500', bg: 'bg-gray-50', arrow: '→' },
};

export default function StatCard({ count, label, icon, trend }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        {/* Icon */}
        <div className="w-10 h-10 rounded-lg bg-[#fef0f5] flex items-center justify-center text-lg">
          {icon}
        </div>

        {/* Trend indicator */}
        {trend && (
          <div
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${trendConfig[trend.direction].bg} ${trendConfig[trend.direction].color}`}
          >
            <span>{trendConfig[trend.direction].arrow}</span>
            {trend.value && <span>{trend.value}</span>}
          </div>
        )}
      </div>

      {/* Count */}
      <div className="mt-3">
        <p className="text-2xl font-bold text-gray-900">{count}</p>
        <p className="text-sm text-gray-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}
