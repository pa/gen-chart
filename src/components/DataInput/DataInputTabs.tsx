import { useState } from 'react';
import SpreadsheetGrid from './SpreadsheetGrid';
import PasteInput from './PasteInput';
import type { Row } from '../../types';

interface Props {
  rows: Row[];
  columns: string[];
  onRowsChange: (rows: Row[]) => void;
  onColumnsChange: (columns: string[]) => void;
}

export default function DataInputTabs({
  rows,
  columns,
  onRowsChange,
  onColumnsChange,
}: Props) {
  const [tab, setTab] = useState<'grid' | 'paste'>('grid');

  return (
    <div className="flex flex-col gap-3">
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setTab('grid')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            tab === 'grid'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Spreadsheet
        </button>
        <button
          onClick={() => setTab('paste')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            tab === 'paste'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Paste CSV/JSON
        </button>
      </div>
      {tab === 'grid' ? (
        <SpreadsheetGrid
          rows={rows}
          columns={columns}
          onRowsChange={onRowsChange}
          onColumnsChange={onColumnsChange}
        />
      ) : (
        <PasteInput
          onDataParsed={(newRows, newColumns) => {
            onColumnsChange(newColumns);
            onRowsChange(newRows);
          }}
        />
      )}
    </div>
  );
}
