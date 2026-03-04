import { COLOR_PALETTES } from '../../types';
import type { ChartOptions as ChartOptionsType } from '../../types';

interface Props {
  options: ChartOptionsType;
  onChange: (options: ChartOptionsType) => void;
}

export default function ChartOptions({ options, onChange }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Chart Title
        </label>
        <input
          type="text"
          value={options.title}
          onChange={e => onChange({ ...options, title: e.target.value })}
          placeholder="Enter chart title..."
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            X-Axis Title
          </label>
          <input
            type="text"
            value={options.xAxisTitle}
            onChange={e => onChange({ ...options, xAxisTitle: e.target.value })}
            placeholder="e.g. Categories"
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Y-Axis Title
          </label>
          <input
            type="text"
            value={options.yAxisTitle}
            onChange={e => onChange({ ...options, yAxisTitle: e.target.value })}
            placeholder="e.g. Count"
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {[
          { id: 'showLegend', label: 'Show Legend', key: 'showLegend' as const },
          { id: 'showValues', label: 'Show Values', key: 'showValues' as const },
          { id: 'hideZeroValues', label: 'Hide Zeros', key: 'hideZeroValues' as const },
          { id: 'showGrid', label: 'Show Grid', key: 'showGrid' as const },
        ].map(toggle => (
          <div key={toggle.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              id={toggle.id}
              checked={options[toggle.key]}
              onChange={e =>
                onChange({ ...options, [toggle.key]: e.target.checked })
              }
              className="rounded"
            />
            <label htmlFor={toggle.id} className="text-sm text-gray-700">
              {toggle.label}
            </label>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Y-Axis Max
          </label>
          <input
            type="number"
            value={options.yAxisMax}
            onChange={e => onChange({ ...options, yAxisMax: e.target.value })}
            placeholder="Auto"
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Y-Axis Interval
          </label>
          <input
            type="number"
            value={options.yAxisStep}
            onChange={e => onChange({ ...options, yAxisStep: e.target.value })}
            placeholder="Auto"
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bar Thickness
          </label>
          <input
            type="number"
            value={options.barThickness}
            onChange={e => onChange({ ...options, barThickness: e.target.value })}
            placeholder="Auto"
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Unit
          </label>
          <input
            type="text"
            value={options.unit}
            onChange={e => onChange({ ...options, unit: e.target.value })}
            placeholder="e.g. kg, $, %"
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Export Padding
          </label>
          <input
            type="number"
            min="0"
            value={options.exportPadding}
            onChange={e =>
              onChange({ ...options, exportPadding: Number(e.target.value) || 0 })
            }
            placeholder="20"
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Color Palette
        </label>
        <div className="flex gap-2 mb-2">
          {Object.entries(COLOR_PALETTES).map(([name, colors]) => (
            <button
              key={name}
              onClick={() => onChange({ ...options, colorPalette: [...colors] })}
              className={`flex gap-0.5 p-1.5 rounded border-2 ${
                JSON.stringify(options.colorPalette) === JSON.stringify(colors)
                  ? 'border-blue-600'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              title={name}
            >
              {colors.slice(0, 5).map((c, i) => (
                <span
                  key={i}
                  className="w-4 h-4 rounded-sm block"
                  style={{ backgroundColor: c }}
                />
              ))}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {options.colorPalette.map((color, i) => (
            <label key={i} className="relative cursor-pointer" title={`Color ${i + 1}`}>
              <input
                type="color"
                value={color}
                onChange={e => {
                  const next = [...options.colorPalette];
                  next[i] = e.target.value;
                  onChange({ ...options, colorPalette: next });
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <span
                className="block w-7 h-7 rounded border border-gray-300"
                style={{ backgroundColor: color }}
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
