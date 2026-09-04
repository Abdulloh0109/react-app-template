import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './Button'
import { PlusIcon } from '@/assets/icons'

describe('Button', () => {
  it('defaults to type="button" so it never submits a form by accident', () => {
    render(<Button>Save</Button>)
    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute(
      'type',
      'button'
    )
  })

  it('keeps an explicit type', () => {
    render(<Button type="submit">Save</Button>)
    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute(
      'type',
      'submit'
    )
  })

  it('calls onClick when pressed', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Save</Button>)

    await userEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('blocks clicks while loading and exposes a busy indicator', async () => {
    const onClick = vi.fn()
    render(
      <Button isLoading onClick={onClick}>
        Save
      </Button>
    )

    const button = screen.getByRole('button', { name: /Save/ })
    expect(button).toBeDisabled()
    expect(screen.getByRole('status')).toBeInTheDocument()

    await userEvent.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('blocks clicks when disabled', async () => {
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>
    )

    await userEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('hides the icon from assistive tech — the label carries the meaning', () => {
    const { container } = render(<Button icon={PlusIcon}>Add user</Button>)

    expect(screen.getByRole('button', { name: 'Add user' })).toBeInTheDocument()
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden')
  })

  it('lets a caller override a base class', () => {
    render(<Button classNames={{ base: 'w-full' }}>Save</Button>)
    expect(screen.getByRole('button', { name: 'Save' })).toHaveClass('w-full')
  })

  it.each(['primary', 'secondary', 'danger', 'text'] as const)(
    'renders the %s variant',
    (variant) => {
      render(<Button variant={variant}>Save</Button>)
      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
    }
  )
})
