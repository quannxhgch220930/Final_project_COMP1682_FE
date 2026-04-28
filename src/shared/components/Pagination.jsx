import { Pagination as AntPagination } from 'antd'

function Pagination({ currentPage, totalPages, onChange }) {
  return (
    <AntPagination
      current={currentPage}
      pageSize={1}
      total={totalPages}
      onChange={onChange}
      showSizeChanger={false}
    />
  )
}

export default Pagination
