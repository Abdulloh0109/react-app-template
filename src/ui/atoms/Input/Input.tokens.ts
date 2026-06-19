export const inputTokens = {
  wrapper: 'flex flex-col gap-1.5 w-full',
  label: 'text-sm font-medium text-dark-40/[.7]',
  field: {
    base: 'w-full rounded-[10px] border bg-gray-40 px-4 py-2.5 text-sm text-dark-30 outline-none transition-colors placeholder:text-gray-10',
    default:
      'border-transparent focus:border-primary-10 focus:bg-white',
    error: 'border-danger-10 bg-danger-50/[.3] focus:border-danger-10',
    disabled: 'disabled:cursor-not-allowed disabled:opacity-60',
  },
  error: 'text-xs text-danger-10',
}
