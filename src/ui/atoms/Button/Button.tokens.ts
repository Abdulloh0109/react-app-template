export const buttonTokens = {
  base: 'group inline-flex items-center justify-center gap-2 transition-colors rounded-[10px] border outline-none disabled:cursor-not-allowed',
  sizes: {
    medium: {
      padding: 'px-5 py-2.5',
      fontSize: 'text-sm font-medium font-mono',
    },
    small: {
      padding: 'px-3.5 py-1.5',
      fontSize: 'text-xs font-medium font-mono',
    },
  },
  variants: {
    primary: {
      base: 'bg-primary-10 text-white border-transparent',
      hover: 'hover:bg-primary-20',
      active: 'active:bg-primary-30',
      focus:
        'focus-visible:outline-[3px] focus-visible:outline-primary-10/[.25] focus-visible:outline-offset-0',
      disabled: 'disabled:bg-secondary-10/[.25] disabled:border-gray-30',
    },
    secondary: {
      base: 'bg-transparent text-dark-30 border-gray-30',
      hover: 'hover:border-primary-20 hover:text-primary-20',
      active: 'active:border-primary-30',
      focus:
        'focus-visible:outline-[3px] focus-visible:outline-primary-10/[.25] focus-visible:outline-offset-0',
      disabled: 'disabled:text-secondary-10/[.5] disabled:border-gray-30',
    },
    text: {
      base: 'bg-transparent text-primary-10 border-transparent',
      hover: 'hover:text-primary-20',
      active: 'active:text-primary-30',
      focus: 'focus-visible:underline',
      disabled: 'disabled:text-secondary-10/[.5]',
    },
  },
  icon: {
    primary: 'fill-white',
    secondary: 'fill-dark-30 group-hover:fill-primary-20',
    text: 'fill-primary-10 group-hover:fill-primary-20',
  },
}
