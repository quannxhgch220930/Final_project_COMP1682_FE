import Table from '../../../../shared/ui/Table'
import Button from '../../../../shared/ui/Button'
import { ROLES } from '../../../../shared/constants/roles'

function createColumns({ actionUserId, onDelete, onToggleLock, onToggleRole }) {
  return [
    { key: 'fullName', label: 'Full name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    {
      key: 'isVerified',
      label: 'Verified',
      render: (user) => (user.isVerified ? 'Yes' : 'No'),
    },
    {
      key: 'isLocked',
      label: 'Locked',
      render: (user) => (user.isLocked ? 'Yes' : 'No'),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (user) => {
        const isBusy = actionUserId === user.id

        return (
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              disabled={isBusy}
              onClick={() => onToggleLock(user)}
            >
              {user.isLocked ? 'Unlock' : 'Lock'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={isBusy}
              onClick={() => onToggleRole(user)}
            >
              {user.role === ROLES.admin ? 'Make user' : 'Make admin'}
            </Button>
            <Button
              type="button"
              disabled={isBusy}
              onClick={() => onDelete(user)}
            >
              Delete
            </Button>
          </div>
        )
      },
    },
  ]
}

function ProductTable(props) {
  return (
    <Table
      bodyCellClassName="px-3 py-3 align-top text-slate-100"
      columns={createColumns(props)}
      containerClassName="border-sky-200/20 bg-slate-950/40"
      data={props.products}
      emptyClassName="px-3 py-6 text-center text-slate-400"
      headCellClassName="px-3 py-3 font-semibold uppercase tracking-[0.14em]"
      headRowClassName="border-b border-sky-200/10 text-slate-400"
      rowClassName="border-b border-sky-200/10 last:border-b-0"
    />
  )
}

export default ProductTable
