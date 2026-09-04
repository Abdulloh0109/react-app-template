import { forwardRef, type InputHTMLAttributes } from 'react'
import { SearchIcon } from '@/assets/icons'
import { cn } from '@/utils'

export type SearchInputProps = InputHTMLAttributes<HTMLInputElement> & {
  classNames?: {
    wrapper?: string
    field?: string
  }
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ classNames, placeholder = 'Search...', ...props }, ref) => {
    return (
      <div className={cn('relative w-full max-w-[264px]', classNames?.wrapper)}>
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-content-subtle" />
        <input
          ref={ref}
          type="search"
          placeholder={placeholder}
          className={cn(
            'h-control w-full rounded border border-line-strong bg-surface pl-9 pr-3 text-sm text-content outline-none transition-colors placeholder:text-content-subtle hover:border-accent focus:border-accent focus:shadow-focus focus-visible:outline-none',
            classNames?.field
          )}
          {...props}
        />
      </div>
    )
  }
)

SearchInput.displayName = 'SearchInput'
