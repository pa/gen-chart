import type { Chart as ChartJS } from 'chart.js';
import type { ParsedChartData } from '../types';

interface Props {
  chartRef: React.RefObject<ChartJS | null>;
  data: ParsedChartData;
  padding: number;
}

export default function ExportButton({ chartRef, data, padding }: Props) {
  const downloadPNG = () => {
    const chart = chartRef.current;
    if (!chart) return;

    const src = chart.canvas;
    const pad = Math.max(0, padding);

    const canvas = document.createElement('canvas');
    canvas.width = src.width + pad * 2;
    canvas.height = src.height + pad * 2;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(src, pad, pad);

    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'chart.png';
    a.click();
  };

  const copyCSV = () => {
    if (data.labels.length === 0) return;

    const header = ['Label', ...data.datasets.map(d => d.label)].join(',');
    const rows = data.labels.map((label, i) =>
      [label, ...data.datasets.map(d => d.data[i])].join(',')
    );
    const csv = [header, ...rows].join('\n');
    navigator.clipboard.writeText(csv);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={downloadPNG}
        className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
      >
        Download PNG
      </button>
      <button
        onClick={copyCSV}
        className="px-4 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
      >
        Copy as CSV
      </button>
    </div>
  );
}
