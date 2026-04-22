import { useCallback, useEffect, useState } from 'react'
import Button from '../../../../shared/ui/Button'
import { ROLES } from '../../../../shared/constants/roles'
import { handleApiError } from '../../../../shared/utils/handleApiError'
import { adminUserApi } from '../api/adminUser.api'
import UserTable from '../components/UserTable'

function AdminUsersPage() {
  const [actionUserId, setActionUserId] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [pageState, setPageState] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 1,
  })
  const [users, setUsers] = useState([])

  const loadUsers = useCallback(async (page = pageState.page) => {
    setIsLoading(true)

    try {
      const response = await adminUserApi.getList({
        page,
        size: pageState.size,
      })

      setUsers(response.items)
      setPageState({
        page: response.page,
        size: response.size,
        totalElements: response.totalElements,
        totalPages: response.totalPages,
      })
      setErrorMessage('')
    } catch (error) {
      setErrorMessage(handleApiError(error))
    } finally {
      setIsLoading(false)
    }
  }, [pageState.page, pageState.size])

  useEffect(() => {
    loadUsers(0)
  }, [loadUsers])

  const handleToggleLock = async (user) => {
    setActionUserId(user.id)

    try {
      await adminUserApi.updateLock(user.id, !user.isLocked)
      await loadUsers(pageState.page)
    } catch (error) {
      setErrorMessage(handleApiError(error))
    } finally {
      setActionUserId(null)
    }
  }

  const handleToggleRole = async (user) => {
    setActionUserId(user.id)

    try {
      const nextRole = user.role === ROLES.admin ? ROLES.user : ROLES.admin
      await adminUserApi.updateRole(user.id, nextRole)
      await loadUsers(pageState.page)
    } catch (error) {
      setErrorMessage(handleApiError(error))
    } finally {
      setActionUserId(null)
    }
  }

  const handleDelete = async (user) => {
    const confirmed = window.confirm(`Delete user ${user.email}?`)

    if (!confirmed) {
      return
    }

    setActionUserId(user.id)

    adminUserApi
      .deleteUser(user.id)
      .then(async () => {
        const nextPage =
          users.length === 1 && pageState.page > 0
            ? pageState.page - 1
            : pageState.page
        await loadUsers(nextPage)
        setErrorMessage('')
      })
      .catch((error) => {
        setErrorMessage(handleApiError(error))
      })
      .finally(() => {
        setActionUserId(null)
      })
  }

  return (
    <section className="grid gap-4">
      <div className="mb-2">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-100/70">
          User Management
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-stone-50">
          Admin users
        </h2>
        <p className="mt-2 text-sm text-stone-300">
          This page is loading users from the backend `/admin/users` endpoint.
        </p>
        <p className="mt-1 text-sm text-stone-400">
          {pageState.totalElements} users total, page {pageState.page + 1} /{' '}
          {Math.max(pageState.totalPages, 1)}
        </p>
      </div>

      {errorMessage ? <p className="text-sm text-rose-300">{errorMessage}</p> : null}
      {isLoading ? <p className="text-sm text-stone-300">Loading users...</p> : null}
      <UserTable
        actionUserId={actionUserId}
        onDelete={handleDelete}
        onToggleLock={handleToggleLock}
        onToggleRole={handleToggleRole}
        users={users}
      />

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          variant="secondary"
          className="border-amber-200/15 bg-amber-200/8 text-stone-100 hover:bg-amber-200/14"
          disabled={isLoading || pageState.page === 0}
          onClick={() => loadUsers(pageState.page - 1)}
        >
          Previous
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="border-amber-200/15 bg-amber-200/8 text-stone-100 hover:bg-amber-200/14"
          disabled={
            isLoading || pageState.page >= Math.max(pageState.totalPages - 1, 0)
          }
          onClick={() => loadUsers(pageState.page + 1)}
        >
          Next
        </Button>
      </div>
    </section>
  )
}

export default AdminUsersPage
