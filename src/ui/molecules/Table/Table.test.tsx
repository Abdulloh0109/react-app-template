import type { ColumnDef } from '@tanstack/react-table'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Table } from './Table'

type Row = { id: string; name: string }

const columns: ColumnDef<Row>[] = [
  { accessorKey: 'name', header: 'Name', cell: ({ row }) => row.original.name },
]

const rows: Row[] = [
  { id: '1', name: 'Ava Carter' },
  { id: '2', name: 'Liam Bennett' },
]

describe('Table', () => {
  it('renders a row per record', () => {
    render(<Table columns={columns} data={rows} />)

    expect(screen.getByText('Ava Carter')).toBeInTheDocument()
    expect(screen.getByText('Liam Bennett')).toBeInTheDocument()
  })

  it('marks the body busy and shows a spinner while loading', () => {
    render(<Table columns={columns} data={[]} isLoading />)

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.queryByText('No data')).not.toBeInTheDocument()
  })

  it('shows the empty state with its hint when there are no rows', () => {
    render(
      <Table
        columns={columns}
        data={[]}
        emptyText="No users yet"
        emptyHint="Add the first one."
      />
    )

    expect(screen.getByText('No users yet')).toBeInTheDocument()
    expect(screen.getByText('Add the first one.')).toBeInTheDocument()
  })

  it('shows the error state instead of the empty state, with a retry', async () => {
    const onRetry = vi.fn()
    render(
      <Table
        columns={columns}
        data={[]}
        isError
        errorText="Could not load users."
        onRetry={onRetry}
        emptyText="No users yet"
      />
    )

    // An error must not be mistaken for "there is nothing here".
    expect(screen.getByText('Could not load users.')).toBeInTheDocument()
    expect(screen.queryByText('No users yet')).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Try again' }))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('prefers the loading state over the error state', () => {
    render(<Table columns={columns} data={[]} isLoading isError />)

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.queryByText(/Could not load/)).not.toBeInTheDocument()
  })

  it('omits the retry button when no handler is given', () => {
    render(<Table columns={columns} data={[]} isError />)

    expect(
      screen.queryByRole('button', { name: 'Try again' })
    ).not.toBeInTheDocument()
  })

  it('calls onRowClick with the row data', async () => {
    const onRowClick = vi.fn()
    render(<Table columns={columns} data={rows} onRowClick={onRowClick} />)

    await userEvent.click(screen.getByText('Ava Carter'))

    expect(onRowClick).toHaveBeenCalledWith(rows[0])
  })

  it('exposes an accessible name through the caption', () => {
    render(<Table columns={columns} data={rows} caption="Users" />)

    expect(screen.getByRole('table', { name: 'Users' })).toBeInTheDocument()
  })
})
