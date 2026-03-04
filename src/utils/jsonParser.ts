export function parseJSON(json: string): string[][] {
  const data = JSON.parse(json);

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('JSON must be a non-empty array of objects');
  }

  const keys = Object.keys(data[0]);
  const headers = keys;
  const rows = data.map((item: Record<string, unknown>) =>
    keys.map(k => String(item[k] ?? ''))
  );

  return [headers, ...rows];
}
