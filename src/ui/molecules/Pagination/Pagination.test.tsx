import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Pagination } from './Pagination'

const pageNumbers = () =>
  screen
    .getAllByRole('button')
    .map((button) => button.textContent)
    .filter((text) => text && !['Prev', 'Next'].includes(text))

describe('Pagination', () => {
  it('renders nothing for a single page', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={vi.fn()} />
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing when there are no pages at all', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={0} onPageChange={vi.fn()} />
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('lists every page while there are seven or fewer', () => {
    render(<Pagination currentPage={1} totalPages={7} onPageChange={vi.fn()} />)
    expect(pageNumbers()).toEqual(['1', '2', '3', '4', '5', '6', '7'])
  })

  it('collapses the tail with an ellipsis near the start', () => {
    render(
      <Pagination currentPage={2} totalPages={20} onPageChange={vi.fn()} />
    )
    expect(pageNumbers()).toEqual(['1', '2', '3', '20'])
  })

  it('collapses both sides in the middle', () => {
    render(
      <Pagination currentPage={10} totalPages={20} onPageChange={vi.fn()} />
    )
    expect(pageNumbers()).toEqual(['1', '9', '10', '11', '20'])
  })

  it('collapses the head near the end', () => {
    render(
      <Pagination currentPage={19} totalPages={20} onPageChange={vi.fn()} />
    )
    expect(pageNumbers()).toEqual(['1', '18', '19', '20'])
  })

  it('disables Prev on the first page and Next on the last', () => {
    const { rerender } = render(
      <Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />
    )
    expect(screen.getByRole('button', { name: 'Prev' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled()

    rerender(
      <Pagination currentPage={5} totalPages={5} onPageChange={vi.fn()} />
    )
    expect(screen.getByRole('button', { name: 'Prev' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled()
  })

  it('reports the page that was clicked', async () => {
    const onPageChange = vi.fn()
    render(
      <Pagination currentPage={2} totalPages={20} onPageChange={onPageChange} />
    )

    await userEvent.click(screen.getByRole('button', { name: '3' }))
    expect(onPageChange).toHaveBeenCalledWith(3)

    await userEvent.click(screen.getByRole('button', { name: 'Prev' }))
    expect(onPageChange).toHaveBeenCalledWith(1)

    await userEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(onPageChange).toHaveBeenCalledWith(3)
  })
})
