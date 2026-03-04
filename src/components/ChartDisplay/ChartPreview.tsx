import { useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import type { ChartType, ParsedChartData, ChartOptions } from '../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

interface Props {
  chartType: ChartType;
  data: ParsedChartData;
  options: ChartOptions;
  chartRef: React.RefObject<ChartJS | null>;
}

export default function ChartPreview({
  chartType,
  data,
  options,
  chartRef,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  if (data.labels.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
        Enter data to see your chart
      </div>
    );
  }

  const isPie = chartType === 'pie';

  const chartData = {
    labels: data.labels,
    datasets: data.datasets.map((ds, i) => ({
      label: ds.label,
      data: ds.data,
      backgroundColor: isPie
        ? options.colorPalette.slice(0, ds.data.length)
        : options.colorPalette[i % options.colorPalette.length],
      borderColor: isPie
        ? '#fff'
        : options.colorPalette[i % options.colorPalette.length],
      borderWidth: isPie ? 2 : 2,
      tension: 0.3,
    })),
  };

  const pad = Math.max(0, options.exportPadding);

  const barThickness = options.barThickness !== '' ? Number(options.barThickness) : undefined;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    ...(chartType === 'bar' && barThickness !== undefined && {
      datasets: { bar: { barThickness } },
    }),
    layout: {
      padding: pad,
    },
    plugins: {
      title: {
        display: !!options.title,
        text: options.title,
        font: { size: 16 },
      },
      legend: {
        display: options.showLegend,
      },
      datalabels: {
        display: ((ctx: { dataIndex: number; dataset: { data: (number | null)[] } }) => {
          if (!options.showValues) return false;
          if (options.hideZeroValues && ctx.dataset.data[ctx.dataIndex] === 0) return false;
          return true;
        }) as (context: unknown) => boolean,
        anchor: isPie ? 'center' as const : 'end' as const,
        align: isPie ? 'center' as const : 'top' as const,
        font: { weight: 'bold' as const, size: 12 },
        color: isPie ? '#fff' : '#374151',
        formatter: (value: number) =>
          options.unit ? `${value} ${options.unit}` : value,
      },
      tooltip: {
        callbacks: {
          label: (ctx: { dataset: { label?: string }; formattedValue: string }) => {
            const label = ctx.dataset.label || '';
            const val = ctx.formattedValue;
            const suffix = options.unit ? ` ${options.unit}` : '';
            return `${label}: ${val}${suffix}`;
          },
        },
      },
    },
    ...(!isPie && {
      scales: {
        x: {
          title: {
            display: !!options.xAxisTitle,
            text: options.xAxisTitle,
            font: { size: 14 },
          },
          grid: {
            display: options.showGrid,
          },
        },
        y: {
          title: {
            display: !!options.yAxisTitle,
            text: options.yAxisTitle,
            font: { size: 14 },
          },
          grid: {
            display: options.showGrid,
          },
          ...(options.yAxisMax !== '' && {
            max: Number(options.yAxisMax),
          }),
          ticks: {
            ...(options.yAxisStep !== '' && {
              stepSize: Number(options.yAxisStep),
            }),
            callback: (value: string | number) =>
              options.unit ? `${value} ${options.unit}` : value,
          },
        },
      },
    }),
  };

  const Component = chartType === 'bar' ? Bar : chartType === 'line' ? Line : Pie;

  return (
    <div ref={containerRef} className="h-[400px] lg:h-[500px]">
      <Component
        ref={chartRef as never}
        data={chartData}
        options={chartOptions}
      />
    </div>
  );
}
