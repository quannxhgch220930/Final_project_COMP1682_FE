import Button from '../ui/Button'

function Pagination({ currentPage, totalPages, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        type="button"
        variant="secondary"
        onClick={() => onChange(Math.max(1, currentPage - 1))}
      >
        Previous
      </Button>
      <span className="text-sm text-stone-500">
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
