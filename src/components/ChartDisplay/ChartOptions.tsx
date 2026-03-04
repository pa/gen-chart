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
      <div className="grid grid-cols-4 gap-3 items-end">
        <div className="flex items-center gap-2 py-2">
          <input
            type="checkbox"
            id="showLegend"
            checked={options.showLegend}
            onChange={e =>
              onChange({ ...options, showLegend: e.target.checked })
            }
            className="rounded"
          />
          <label htmlFor="showLegend" className="text-sm text-gray-700">
            Show Legend
          </label>
        </div>
        <div className="flex items-center gap-2 py-2">
          <input
            type="checkbox"
            id="showValues"
            checked={options.showValues}
            onChange={e =>
              onChange({ ...options, showValues: e.target.checked })
            }
            className="rounded"
          />
          <label htmlFor="showValues" className="text-sm text-gray-700">
            Show Values
          </label>
        </div>
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
        <div className="flex gap-2">
          {Object.entries(COLOR_PALETTES).map(([name, colors]) => (
            <button
              key={name}
              onClick={() => onChange({ ...options, colorPalette: colors })}
              className={`flex gap-0.5 p-1.5 rounded border-2 ${
                options.colorPalette === colors
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
      </div>
    </div>
  );
}
