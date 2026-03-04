import { useState, useRef } from 'react';
import type { Chart as ChartJS } from 'chart.js';
import DataInputTabs from './components/DataInput/DataInputTabs';
import ChartPreview from './components/ChartDisplay/ChartPreview';
import ChartTypeSelector from './components/ChartDisplay/ChartTypeSelector';
import ChartOptions from './components/ChartDisplay/ChartOptions';
import ExportButton from './components/ExportButton';
import { useChartData } from './hooks/useChartData';
import type { ChartType, ChartOptions as ChartOptionsType, Row } from './types';
import { COLOR_PALETTES } from './types';

const DEFAULT_COLUMNS = ['Label', 'Value'];
const DEFAULT_ROWS: Row[] = [
  { Label: 'Apples', Value: '30' },
  { Label: 'Bananas', Value: '20' },
  { Label: 'Oranges', Value: '45' },
  { Label: 'Grapes', Value: '15' },
  { Label: 'Mangoes', Value: '35' },
];

export default function App() {
  const [rows, setRows] = useState<Row[]>(DEFAULT_ROWS);
  const [columns, setColumns] = useState<string[]>(DEFAULT_COLUMNS);
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [options, setOptions] = useState<ChartOptionsType>({
    title: '',
    xAxisTitle: '',
    yAxisTitle: '',
    showLegend: true,
    showValues: false,
    yAxisMax: '',
    unit: '',
    exportPadding: 20,
    colorPalette: COLOR_PALETTES.default,
  });

  const chartRef = useRef<ChartJS | null>(null);
  const chartData = useChartData(rows, columns);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="Gen Chart" className="w-8 h-8" />
            <h1 className="text-xl font-bold text-gray-900">Gen Chart</h1>
          </div>
          <a
            href="https://github.com/pramodhayyappan/gen-chart"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            GitHub
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left panel: Data Input */}
          <div className="w-full lg:w-[45%] bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Data Input
            </h2>
            <DataInputTabs
              rows={rows}
              columns={columns}
              onRowsChange={setRows}
              onColumnsChange={setColumns}
            />
          </div>

          {/* Right panel: Chart */}
          <div className="w-full lg:w-[55%] flex flex-col gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <ChartTypeSelector
                  chartType={chartType}
                  onChange={setChartType}
                />
                <ExportButton chartRef={chartRef} data={chartData} padding={options.exportPadding} />
              </div>
              <ChartPreview
                chartType={chartType}
                data={chartData}
                options={options}
                chartRef={chartRef}
              />
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Options
              </h2>
              <ChartOptions options={options} onChange={setOptions} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
