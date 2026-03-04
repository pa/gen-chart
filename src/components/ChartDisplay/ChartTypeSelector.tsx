import type { ChartType } from '../../types';

interface Props {
  chartType: ChartType;
  onChange: (type: ChartType) => void;
}

const types: { value: ChartType; label: string }[] = [
  { value: 'bar', label: 'Bar' },
  { value: 'line', label: 'Line' },
  { value: 'pie', label: 'Pie' },
];

export default function ChartTypeSelector({ chartType, onChange }: Props) {
  return (
    <div className="flex gap-1">
      {types.map(t => (
        <button
          key={t.value}
          onClick={() => onChange(t.value)}
          className={`px-4 py-2 text-sm font-medium rounded ${
            chartType === t.value
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
