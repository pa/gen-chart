import { useState, useRef, useEffect } from 'react';
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

function EditableHeader({
  name,
  onRename,
}: {
  name: string;
  onRename: (newName: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const commit = () => {
    setEditing(false);
    const trimmed = draft.trim();
    if (trimmed && trimmed !== name) {
      onRename(trimmed);
    } else {
      setDraft(name);
    }
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={e => {
          e.stopPropagation();
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') {
            setDraft(name);
            setEditing(false);
          }
        }}
        onKeyUp={e => e.stopPropagation()}
        onKeyPress={e => e.stopPropagation()}
        onClick={e => e.stopPropagation()}
        onMouseDown={e => e.stopPropagation()}
        className="w-full bg-transparent border-none outline-none text-sm font-semibold text-gray-700 px-0"
        style={{ height: '100%' }}
      />
    );
  }

  return (
    <span
      onClick={e => {
        e.stopPropagation();
        setEditing(true);
        setDraft(name);
      }}
      className="cursor-pointer text-sm font-semibold text-gray-700 select-none"
      title="Click to rename"
    >
      {name}
    </span>
  );
}

export default function SpreadsheetGrid({
  rows,
  columns,
  onRowsChange,
  onColumnsChange,
}: Props) {
  const handleRename = (index: number, newName: string) => {
    const oldName = columns[index];
    if (newName === oldName) return;
    const newColumns = columns.map((c, i) => (i === index ? newName : c));
    const newRows = rows.map(r => {
      const next: Row = {};
      for (const col of columns) {
        next[col === oldName ? newName : col] = r[col];
      }
      return next;
    });
    onColumnsChange(newColumns);
    onRowsChange(newRows);
  };

  const gridColumns = columns.map((col, i) => ({
    ...keyColumn(col, textColumn),
    title: (
      <EditableHeader
        key={col}
        name={col}
        onRename={(newName) => handleRename(i, newName)}
      />
    ),
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
