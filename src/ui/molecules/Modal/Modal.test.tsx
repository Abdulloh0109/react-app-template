import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Modal } from './Modal'

const renderModal = (props: Partial<Parameters<typeof Modal>[0]> = {}) => {
  const onClose = vi.fn()
  const utils = render(
    <>
      <button type="button">outside trigger</button>
      <Modal open onClose={onClose} title="Edit user" {...props}>
        <input aria-label="Full name" />
        <button type="button">Save</button>
      </Modal>
    </>
  )
  return { onClose, ...utils }
}

describe('Modal', () => {
  it('renders nothing when closed', () => {
    render(
      <Modal open={false} onClose={vi.fn()} title="Edit user">
        content
      </Modal>
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('is a modal dialog named by its title', () => {
    renderModal()
    expect(screen.getByRole('dialog', { name: 'Edit user' })).toHaveAttribute(
      'aria-modal',
      'true'
    )
  })

  it('falls back to ariaLabel when there is no title', () => {
    render(
      <Modal open onClose={vi.fn()} ariaLabel="Confirm deletion">
        content
      </Modal>
    )
    expect(
      screen.getByRole('dialog', { name: 'Confirm deletion' })
    ).toBeInTheDocument()
  })

  it('moves focus to the dialog itself on open', () => {
    // Not the first control: Enter must not land on "Close" by accident.
    renderModal()
    expect(screen.getByRole('dialog', { name: 'Edit user' })).toHaveFocus()
  })

  it('closes on Escape', async () => {
    const { onClose } = renderModal()
    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('closes when the scrim is clicked', async () => {
    const { onClose } = renderModal()
    await userEvent.click(
      screen.getByRole('button', { name: 'Dismiss dialog' })
    )
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not close when the dialog body is clicked', async () => {
    const { onClose } = renderModal()
    await userEvent.click(screen.getByLabelText('Full name'))
    expect(onClose).not.toHaveBeenCalled()
  })

  it('keeps Tab inside the dialog', async () => {
    renderModal()

    // dialog -> close -> input -> Save -> wraps back to close
    await userEvent.tab()
    expect(screen.getByRole('button', { name: 'Close dialog' })).toHaveFocus()
    await userEvent.tab()
    expect(screen.getByLabelText('Full name')).toHaveFocus()
    await userEvent.tab()
    expect(screen.getByRole('button', { name: 'Save' })).toHaveFocus()
    await userEvent.tab()
    expect(screen.getByRole('button', { name: 'Close dialog' })).toHaveFocus()
  })

  it('wraps backwards to the last element', async () => {
    renderModal()
    await userEvent.tab({ shift: true })
    expect(screen.getByRole('button', { name: 'Save' })).toHaveFocus()
  })

  it('never lets Tab reach the page behind the dialog', async () => {
    renderModal()
    const outside = screen.getByRole('button', { name: 'outside trigger' })

    for (let i = 0; i < 6; i++) {
      await userEvent.tab()
      expect(outside).not.toHaveFocus()
    }
  })

  it('restores focus to the trigger when it closes', async () => {
    const trigger = document.createElement('button')
    trigger.textContent = 'open'
    document.body.appendChild(trigger)
    trigger.focus()

    const { rerender } = render(
      <Modal open onClose={vi.fn()} title="Edit user">
        <button type="button">Save</button>
      </Modal>
    )
    expect(screen.getByRole('dialog', { name: 'Edit user' })).toHaveFocus()

    rerender(
      <Modal open={false} onClose={vi.fn()} title="Edit user">
        <button type="button">Save</button>
      </Modal>
    )
    expect(trigger).toHaveFocus()

    trigger.remove()
  })

  it('locks background scrolling while open and releases it after', () => {
    const { rerender } = render(
      <Modal open onClose={vi.fn()} title="Edit user">
        content
      </Modal>
    )
    expect(document.body.style.overflow).toBe('hidden')

    rerender(
      <Modal open={false} onClose={vi.fn()} title="Edit user">
        content
      </Modal>
    )
    expect(document.body.style.overflow).toBe('')
  })
})
