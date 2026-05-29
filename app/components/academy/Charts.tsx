'use client';

// === ScoreTrendChart (Line Chart) ===

interface ScoreTrendDataPoint {
  label: string;
  value: number;
}

interface ScoreTrendChartProps {
  data: ScoreTrendDataPoint[];
  height?: number;
  color?: string;
  locale?: 'ar' | 'en';
}

export function ScoreTrendChart({
  data,
  height = 200,
  color = '#F0548B',
  locale = 'ar',
}: ScoreTrendChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center text-sm text-gray-400" style={{ height }}>
        {locale === 'ar' ? 'لا توجد بيانات' : 'No data'}
      </div>
    );
  }

  const padding = { top: 20, right: 20, bottom: 40, left: 40 };
  const width = 500;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxValue = Math.max(...data.map((d) => d.value), 100);
  const minValue = Math.min(...data.map((d) => d.value), 0);
  const valueRange = maxValue - minValue || 1;

  const getX = (index: number) =>
    padding.left + (index / Math.max(data.length - 1, 1)) * chartWidth;
  const getY = (value: number) =>
    padding.top + chartHeight - ((value - minValue) / valueRange) * chartHeight;

  // Build SVG path
  const pathPoints = data.map((d, i) => `${getX(i)},${getY(d.value)}`);
  const linePath = `M ${pathPoints.join(' L ')}`;

  // Area fill path
  const areaPath = `${linePath} L ${getX(data.length - 1)},${padding.top + chartHeight} L ${getX(0)},${padding.top + chartHeight} Z`;

  // Y-axis labels
  const yLabels = [0, 25, 50, 75, 100].filter((v) => v <= maxValue);

  return (
    <div className="w-full overflow-hidden">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {/* Grid lines */}
        {yLabels.map((val) => (
          <g key={val}>
            <line
              x1={padding.left}
              y1={getY(val)}
              x2={width - padding.right}
              y2={getY(val)}
              stroke="#e5e7eb"
              strokeWidth="1"
              strokeDasharray="4,4"
            />
            <text
              x={padding.left - 8}
              y={getY(val) + 4}
              textAnchor="end"
              className="text-[10px] fill-gray-400"
            >
              {val}
            </text>
          </g>
        ))}

        {/* Area fill */}
        <path d={areaPath} fill={color} opacity="0.1" />

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {data.map((d, i) => (
          <circle
            key={i}
            cx={getX(i)}
            cy={getY(d.value)}
            r="4"
            fill="white"
            stroke={color}
            strokeWidth="2"
          />
        ))}

        {/* X-axis labels */}
        {data.map((d, i) => (
          <text
            key={i}
            x={getX(i)}
            y={height - 8}
            textAnchor="middle"
            className="text-[9px] fill-gray-500"
          >
            {d.label.length > 8 ? d.label.slice(0, 8) + '…' : d.label}
          </text>
        ))}
      </svg>
    </div>
  );
}

// === DistributionChart (Bar Chart) ===

interface DistributionDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface DistributionChartProps {
  data: DistributionDataPoint[];
  height?: number;
  locale?: 'ar' | 'en';
}

export function DistributionChart({
  data,
  height = 200,
  locale = 'ar',
}: DistributionChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center text-sm text-gray-400" style={{ height }}>
        {locale === 'ar' ? 'لا توجد بيانات' : 'No data'}
      </div>
    );
  }

  const padding = { top: 20, right: 20, bottom: 40, left: 40 };
  const width = 500;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const barWidth = Math.min(50, (chartWidth / data.length) * 0.6);
  const barGap = (chartWidth - barWidth * data.length) / (data.length + 1);

  const defaultColors = ['#F0548B', '#f87aaa', '#fb9dbe', '#fcc0d4', '#fde3ec'];

  return (
    <div className="w-full overflow-hidden">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const val = Math.round(maxValue * ratio);
          const y = padding.top + chartHeight - ratio * chartHeight;
          return (
            <g key={ratio}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="1"
                strokeDasharray="4,4"
              />
              <text
                x={padding.left - 8}
                y={y + 4}
                textAnchor="end"
                className="text-[10px] fill-gray-400"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const barHeight = (d.value / maxValue) * chartHeight;
          const x = padding.left + barGap * (i + 1) + barWidth * i;
          const y = padding.top + chartHeight - barHeight;
          const barColor = d.color || defaultColors[i % defaultColors.length];

          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx="4"
                fill={barColor}
                className="transition-all duration-300"
              />
              {/* Value on top */}
              <text
                x={x + barWidth / 2}
                y={y - 6}
                textAnchor="middle"
                className="text-[10px] fill-gray-600 font-medium"
              >
                {d.value}
              </text>
              {/* Label below */}
              <text
                x={x + barWidth / 2}
                y={height - 8}
                textAnchor="middle"
                className="text-[10px] fill-gray-500"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
