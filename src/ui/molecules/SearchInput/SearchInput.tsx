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
      <div className={cn('relative w-full max-w-xs', classNames?.wrapper)}>
        <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-10" />
        <input
          ref={ref}
          type="search"
          placeholder={placeholder}
          className={cn(
            'w-full rounded-[10px] border border-transparent bg-gray-40 py-2.5 pl-10 pr-4 text-sm text-dark-30 outline-none transition-colors placeholder:text-gray-10 focus:border-primary-10 focus:bg-white',
            classNames?.field
          )}
          {...props}
        />
      </div>
    )
  }
)

SearchInput.displayName = 'SearchInput'
