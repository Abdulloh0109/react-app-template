import { Toaster as SonnerToaster, toast } from 'sonner'

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
          toast: 'rounded-xl border border-gray-40 text-sm',
        },
      }}
    />
  )
}

export { toast }
