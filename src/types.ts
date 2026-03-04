export type ChartType = 'bar' | 'line' | 'pie';

export interface ChartOptions {
  title: string;
  xAxisTitle: string;
  yAxisTitle: string;
  showLegend: boolean;
  showValues: boolean;
  hideZeroValues: boolean;
  showGrid: boolean;
  yAxisMax: string;
  yAxisStep: string;
  barThickness: string;
  unit: string;
  exportPadding: number;
  colorPalette: string[];
}

export type Row = Record<string, string | number | null>;

export interface ParsedChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
}

export const COLOR_PALETTES: Record<string, string[]> = {
  default: [
    '#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6',
    '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16',
  ],
  pastel: [
    '#93c5fd', '#fca5a5', '#86efac', '#fcd34d', '#c4b5fd',
    '#f9a8d4', '#5eead4', '#fdba74', '#a5b4fc', '#bef264',
  ],
  bold: [
    '#1d4ed8', '#dc2626', '#16a34a', '#d97706', '#7c3aed',
    '#db2777', '#0d9488', '#ea580c', '#4f46e5', '#65a30d',
  ],
};
