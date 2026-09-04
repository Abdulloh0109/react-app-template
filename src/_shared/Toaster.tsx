import { Toaster as SonnerToaster } from 'sonner'

/**
 * App-wide toast outlet. Mounted once in `App.tsx`. Trigger toasts anywhere
 * with the re-exported `toast` helper, e.g. `toast.success('Saved')`.
 */
export const Toaster = () => {
  return (
    <SonnerToaster
      position="top-right"
      duration={4000}
      toastOptions={{
        classNames: {
          toast:
            'rounded-lg border border-line bg-surface text-content text-sm shadow-modal',
        },
      }}
    />
  )
}
