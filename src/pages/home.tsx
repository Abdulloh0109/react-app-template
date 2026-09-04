import { useMemo } from 'react'
import { useUsersQuery } from '@/services'
import { Spinner, Text } from '@/ui'

type Stat = { label: string; value: string | number; hint: string }

export const HomePage = () => {
  const { users, isLoadingUsers, isUsersError, refetchUsers } = useUsersQuery()

  const stats = useMemo<Stat[]>(() => {
    const data = users?.data ?? []
    const total = users?.pagination.total_items ?? 0
    const active = data.filter((u) => u.status === 'active').length
    const pending = data.filter((u) => u.status === 'pending').length
    return [
      { label: 'Total users', value: total, hint: 'across all pages' },
      { label: 'Active (this page)', value: active, hint: 'status = active' },
      {
        label: 'Pending (this page)',
        value: pending,
        hint: 'status = pending',
      },
    ]
  }, [users])

  return (
    <main className="flex flex-col gap-6 overflow-y-auto p-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-content">Dashboard</h1>
        <Text className="text-content-subtle">
          Welcome back — here is a quick overview.
        </Text>
      </div>

      {isUsersError ? (
        <div className="flex flex-col items-start gap-3 rounded-lg border border-line bg-surface p-6 shadow-card">
          <Text className="text-tone-danger-content">
            Could not load the overview.
          </Text>
          <button
            type="button"
            onClick={() => refetchUsers()}
            className="text-sm font-medium text-accent-text hover:text-accent-hover"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col gap-2 rounded-lg border border-line bg-surface p-6 shadow-card"
            >
              <Text className="text-sm text-content-subtle">{stat.label}</Text>
              <span className="text-3xl font-medium text-content">
                {isLoadingUsers ? (
                  <Spinner className="size-6 text-accent-text" />
                ) : (
                  stat.value
                )}
              </span>
              <Text className="text-xs text-content-subtle">{stat.hint}</Text>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-lg border border-line bg-surface p-6 shadow-card">
        <h2 className="mb-2 text-base font-semibold text-content">
          About this template
        </h2>
        <Text className="text-content-muted">
          This page, the sidebar and the Users CRUD are all wired to a mock API.
          Use the <span className="font-semibold">Users</span> section to try
          create / edit / delete — everything persists in memory for the
          session.
        </Text>
      </div>
    </main>
  )
}
