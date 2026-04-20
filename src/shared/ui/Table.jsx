function Table({
  columns,
  data,
  bodyCellClassName = 'px-3 py-3 align-top text-stone-800',
  containerClassName = '',
  emptyClassName = 'px-3 py-6 text-center text-stone-500',
  headCellClassName = 'px-3 py-3 font-semibold uppercase tracking-[0.14em]',
  headRowClassName = 'border-b border-stone-200 text-stone-500',
  rowClassName = 'border-b border-stone-100 last:border-b-0',
}) {
  return (
    <div
      className={`overflow-x-auto rounded-2xl border border-stone-200 bg-white/85 p-5 shadow-[0_20px_45px_rgba(63,39,18,0.08)] backdrop-blur ${containerClassName}`.trim()}
    >
      <table className="min-w-full border-collapse text-left text-sm">
        <thead>
          <tr className={headRowClassName}>
            {columns.map((column) => (
              <th key={column.key} className={headCellClassName}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row) => (
              <tr key={row.id} className={rowClassName}>
                {columns.map((column) => (
                  <td key={column.key} className={bodyCellClassName}>
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className={emptyClassName}>
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Table
