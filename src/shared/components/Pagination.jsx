import Button from '../ui/Button'

function Pagination({ currentPage, totalPages, onChange }) {
  return (
    <div className="pagination">
      <Button
        type="button"
        variant="secondary"
        onClick={() => onChange(Math.max(1, currentPage - 1))}
      >
        Previous
      </Button>
      <span className="muted">
        Page {currentPage} / {totalPages}
      </span>
      <Button
        type="button"
        variant="secondary"
        onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
      >
        Next
      </Button>
    </div>
  )
}

export default Pagination
