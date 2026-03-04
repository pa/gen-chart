import {
  DynamicDataSheetGrid,
  textColumn,
  keyColumn,
} from 'react-datasheet-grid';
import type { Row } from '../../types';

interface Props {
  rows: Row[];
  columns: string[];
  onRowsChange: (rows: Row[]) => void;
  onColumnsChange: (columns: string[]) => void;
}

export default function SpreadsheetGrid({
  rows,
  columns,
  onRowsChange,
  onColumnsChange,
}: Props) {
  const gridColumns = columns.map(col => ({
    ...keyColumn(col, textColumn),
    title: col,
    minWidth: 120,
  }));

  const addColumn = () => {
    const name = `Series ${columns.length}`;
    onColumnsChange([...columns, name]);
    onRowsChange(rows.map(r => ({ ...r, [name]: null })));
  };

  const removeColumn = () => {
    if (columns.length <= 2) return;
    const removed = columns[columns.length - 1];
    onColumnsChange(columns.slice(0, -1));
    onRowsChange(rows.map(r => {
      const next = { ...r };
      delete next[removed];
      return next;
    }));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <button
          onClick={addColumn}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Column
        </button>
        <button
          onClick={removeColumn}
          disabled={columns.length <= 2}
          className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-40"
        >
          - Column
        </button>
      </div>
      <div className="border border-gray-200 rounded overflow-hidden">
        <DynamicDataSheetGrid
          value={rows}
          onChange={onRowsChange}
          columns={gridColumns}
          createRow={() =>
            Object.fromEntries(columns.map(c => [c, null])) as Row
          }
          height={400}
        />
      </div>
    </div>
  );
}
