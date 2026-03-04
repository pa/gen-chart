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
      ...(chartType === 'bar' && options.barThickness !== '' && {
        barThickness: Number(options.barThickness),
      }),
    })),
  };

  const pad = Math.max(0, options.exportPadding);
  const baseFontSize = Number(options.fontSize) || 12;
  const fontFamily = options.fontFamily || 'sans-serif';
  const rotation = Number(options.labelRotation) || 0;
  // Always use positive rotation so labels angle downward away from the chart area.
  // Negative rotation angles labels upward into the bars, hiding them.
  const tickRotation = Math.abs(rotation);
  const boldWeight = options.boldLabels ? 'bold' as const : undefined;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: pad,
    },
    plugins: {
      title: {
        display: !!options.title,
        text: options.title,
        font: { size: baseFontSize + 4, family: fontFamily, weight: boldWeight },
      },
      legend: {
        display: options.showLegend,
        labels: {
          font: { size: baseFontSize, family: fontFamily, weight: boldWeight },
        },
      },
      datalabels: {
        display: ((ctx: { dataIndex: number; dataset: { data: (number | null)[] } }) => {
          if (!options.showValues) return false;
          if (options.hideZeroValues && ctx.dataset.data[ctx.dataIndex] === 0) return false;
          return true;
        }) as (context: unknown) => boolean,
        anchor: isPie ? 'center' as const : 'end' as const,
        align: isPie ? 'center' as const : 'top' as const,
        offset: 4,
        clamp: true,
        clip: true,
        font: () => ({
          weight: options.boldLabels ? 'bold' as const : 'normal' as const,
          size: baseFontSize,
          family: fontFamily,
        }),
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
            font: { size: baseFontSize + 2, family: fontFamily, weight: boldWeight },
          },
          grid: {
            display: options.showGrid,
          },
          ticks: {
            maxRotation: tickRotation,
            minRotation: tickRotation,
            font: { size: baseFontSize, family: fontFamily, weight: boldWeight },
          },
        },
        y: {
          title: {
            display: !!options.yAxisTitle,
            text: options.yAxisTitle,
            font: { size: baseFontSize + 2, family: fontFamily, weight: boldWeight },
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
            font: { size: baseFontSize, family: fontFamily, weight: boldWeight },
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
        key={`${chartType}-${options.barThickness}-${options.boldLabels}-${baseFontSize}-${fontFamily}`}
        ref={chartRef as never}
        data={chartData}
        options={chartOptions}
      />
    </div>
  );
}
