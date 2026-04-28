import { Table as AntTable } from 'antd'

function Table({
  columns,
  data,
  containerClassName = '',
}) {
  const normalizedColumns = columns.map((column) => ({
    dataIndex: column.key,
    key: column.key,
    title: column.label,
    render: column.render ? (_, row) => column.render(row) : undefined,
  }))

  return (
    <div className={`overflow-hidden rounded-3xl border border-stone-200 bg-white/90 p-2 shadow-[0_20px_45px_rgba(63,39,18,0.08)] ${containerClassName}`.trim()}>
      <AntTable
        columns={normalizedColumns}
        dataSource={data}
        pagination={false}
        rowKey={(row) => row.id}
        scroll={{ x: true }}
      />
    </div>
  )
}

export default Table
