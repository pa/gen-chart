import { useMemo } from 'react';
import type { ParsedChartData, Row } from '../types';

export function useChartData(rows: Row[], columns: string[]): ParsedChartData {
  return useMemo(() => {
    if (columns.length < 2 || rows.length === 0) {
      return { labels: [], datasets: [] };
    }

    const labelCol = columns[0];
    const valueCols = columns.slice(1);

    const labels: string[] = [];
    const dataByCol: Record<string, number[]> = {};

    for (const col of valueCols) {
      dataByCol[col] = [];
    }

    for (const row of rows) {
      const label = String(row[labelCol] ?? '');
      if (!label) continue;

      labels.push(label);
      for (const col of valueCols) {
        const val = Number(row[col]);
        dataByCol[col].push(isNaN(val) ? 0 : val);
      }
    }

    const datasets = valueCols.map(col => ({
      label: col,
      data: dataByCol[col],
    }));

    return { labels, datasets };
  }, [rows, columns]);
}
