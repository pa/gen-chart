import { useState, useRef, useEffect } from 'react';
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
const DEFAULT_OPTIONS: ChartOptionsType = {
  title: '',
  xAxisTitle: '',
  yAxisTitle: '',
  showLegend: true,
  showValues: false,
  hideZeroValues: true,
  showGrid: true,
  yAxisMax: '',
  yAxisStep: '',
  barThickness: '',
  labelRotation: '0',
  unit: '',
  exportPadding: 20,
  colorPalette: COLOR_PALETTES.default,
  fontSize: '12',
  fontFamily: 'sans-serif',
  boldLabels: false,
};
const DEFAULT_CHART_TYPE: ChartType = 'bar';

const SESSION_KEY = 'gen-chart-session';

function loadSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveSession(data: {
  rows: Row[];
  columns: string[];
  chartType: ChartType;
  options: ChartOptionsType;
}) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
}

export default function App() {
  const saved = loadSession();
  const [rows, setRows] = useState<Row[]>(saved?.rows ?? DEFAULT_ROWS);
  const [columns, setColumns] = useState<string[]>(saved?.columns ?? DEFAULT_COLUMNS);
  const [chartType, setChartType] = useState<ChartType>(saved?.chartType ?? DEFAULT_CHART_TYPE);
  const [options, setOptions] = useState<ChartOptionsType>({
    ...DEFAULT_OPTIONS,
    ...saved?.options,
  });

  const chartRef = useRef<ChartJS | null>(null);
  const chartData = useChartData(rows, columns);

  // Persist to sessionStorage on every change
  useEffect(() => {
    saveSession({ rows, columns, chartType, options });
  }, [rows, columns, chartType, options]);

  const resetChart = () => {
    setRows(DEFAULT_ROWS);
    setColumns(DEFAULT_COLUMNS);
    setChartType(DEFAULT_CHART_TYPE);
    setOptions({ ...DEFAULT_OPTIONS });
    sessionStorage.removeItem(SESSION_KEY);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="Gen Chart" className="w-8 h-8" />
            <h1 className="text-xl font-bold text-gray-900">Gen Chart</h1>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/pa/gen-chart"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              GitHub
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left panel: Data Input */}
          <div className="w-full lg:w-[45%] bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Data Input
              </h2>
              <button
                onClick={resetChart}
                className="px-3 py-1.5 text-sm bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100"
              >
                Reset
              </button>
            </div>
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
              <ChartOptions
                options={options}
                onChange={setOptions}
                chartType={chartType}
                rows={rows}
                columns={columns}
                onRowsChange={setRows}
                onColumnsChange={setColumns}
                onChartTypeChange={setChartType}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
