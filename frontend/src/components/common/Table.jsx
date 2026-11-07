import { ChevronUp, ChevronDown } from 'lucide-react';

export default function Table({ columns, data, loading, emptyMessage = 'No records found.', onSort, sortKey, sortDir }) {
  if (loading) {
    return (
      <div className="border border-[#DCE3DA] rounded-lg overflow-hidden bg-white">
        <div className="divide-y divide-[#DCE3DA]">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="px-4 py-3.5 flex gap-4 animate-pulse">
              {columns.map((col) => (
                <div key={col.key} className={`h-4 bg-[#EFEFEA] rounded ${col.className || 'flex-1'}`} />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="border border-[#DCE3DA] rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-[#F7F8F4] border-b border-[#DCE3DA]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={[
                    'px-4 py-3 text-xs font-semibold text-[#737B75] uppercase tracking-wider',
                    col.sortable ? 'cursor-pointer hover:text-[#252B27] select-none' : '',
                    col.headerClassName || '',
                  ].join(' ')}
                  onClick={() => col.sortable && onSort?.(col.key)}
                >
                  <div className="inline-flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DCE3DA]">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-[#737B75]">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr
                  key={row.id || row._id || rowIdx}
                  className="hover:bg-[#F7F8F4]/80 transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`px-4 py-3.5 text-[#252B27] ${col.cellClassName || ''}`}>
                      {col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
