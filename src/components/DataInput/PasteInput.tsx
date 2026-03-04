import { useState } from 'react';
import { parseCSV } from '../../utils/csvParser';
import { parseJSON } from '../../utils/jsonParser';
import type { Row } from '../../types';

interface Props {
  onDataParsed: (rows: Row[], columns: string[]) => void;
}

export default function PasteInput({ onDataParsed }: Props) {
  const [text, setText] = useState('');
  const [format, setFormat] = useState<'csv' | 'json'>('csv');
  const [error, setError] = useState('');

  const handleParse = () => {
    setError('');
    try {
      let grid: string[][];
      if (format === 'csv') {
        grid = parseCSV(text);
      } else {
        grid = parseJSON(text);
      }

      if (grid.length < 2) {
        setError('Need at least a header row and one data row');
        return;
      }

      const columns = grid[0];
      const rows: Row[] = grid.slice(1).map(row =>
        Object.fromEntries(
          columns.map((col, i) => [col, row[i] ?? ''])
        ) as Row
      );

      onDataParsed(rows, columns);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Parse error');
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <button
          onClick={() => setFormat('csv')}
          className={`px-3 py-1 text-sm rounded ${
            format === 'csv'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          CSV
        </button>
        <button
          onClick={() => setFormat('json')}
          className={`px-3 py-1 text-sm rounded ${
            format === 'json'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          JSON
        </button>
      </div>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={
          format === 'csv'
            ? 'Label,Value\nApples,30\nBananas,20\nOranges,45'
            : '[{"label":"Apples","value":30},{"label":"Bananas","value":20}]'
        }
        className="w-full h-48 p-3 border border-gray-300 rounded font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
      <button
        onClick={handleParse}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Apply Data
      </button>
    </div>
  );
}
