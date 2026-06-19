import { useMemo } from 'react'
import { useUsers } from '@/services'
import { Text } from '@/ui'

type Stat = { label: string; value: string | number; hint: string }

export const HomePage = () => {
  const { users } = useUsers()

  const stats = useMemo<Stat[]>(() => {
    const data = users?.data ?? []
    const total = users?.pagination.total_items ?? 0
    const active = data.filter((u) => u.status === 'active').length
    const pending = data.filter((u) => u.status === 'pending').length
    return [
      { label: 'Total users', value: total, hint: 'across all pages' },
      { label: 'Active (this page)', value: active, hint: 'status = active' },
      { label: 'Pending (this page)', value: pending, hint: 'status = pending' },
    ]
  }, [users])

  return (
    <main className="flex flex-col gap-6 p-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-dark-20">Dashboard</h1>
        <Text className="text-dark-50">
          Welcome back — here is a quick overview.
        </Text>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-2 rounded-2xl bg-sidebar-10 p-6 shadow-3xl"
          >
            <Text className="text-sm text-dark-50">{stat.label}</Text>
            <span className="text-3xl font-bold text-dark-20">
              {stat.value}
            </span>
            <Text className="text-xs text-gray-10">{stat.hint}</Text>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-sidebar-10 p-6 shadow-3xl">
        <h2 className="mb-2 text-lg font-semibold text-dark-20">
          About this template
        </h2>
        <Text className="text-dark-50">
          This page, the sidebar and the Users CRUD are all wired to a mock API.
          Use the <span className="font-semibold">Users</span> section to try
          create / edit / delete — everything persists in memory for the
          session.
        </Text>
      </div>
    </main>
  )
}
