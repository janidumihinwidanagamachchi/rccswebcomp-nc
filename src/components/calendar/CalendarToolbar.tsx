import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { CalendarView } from '@/lib/calendar'
import type { Category } from '@/types'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

interface CalendarToolbarProps {
  currentDate: Date
  view: CalendarView
  onViewChange: (view: CalendarView) => void
  onPrev?: () => void
  onNext?: () => void
  onToday: () => void
  onJumpToDate?: (date: Date) => void
  category: string
  categories: Category[]
  onCategoryChange: (slug: string) => void
}

const views: { label: string; value: CalendarView }[] = [
  { label: 'Month', value: 'month' },
  { label: 'Week', value: 'week' },
  { label: 'Agenda', value: 'agenda' },
]

export function CalendarToolbar({
  currentDate,
  view,
  onViewChange,
  onPrev,
  onNext,
  onToday,
  onJumpToDate,
  category,
  categories,
  onCategoryChange,
}: CalendarToolbarProps) {
  const heading = view === 'agenda' ? 'Agenda' : format(currentDate, 'MMMM yyyy')
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const startYear = year - 2
  const endYear = year + 5

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-2xl font-bold md:text-3xl">{heading}</h2>
        <div className="flex flex-wrap items-center gap-2">
          {view !== 'agenda' && onJumpToDate && (
            <div className="flex items-center gap-2">
              <Select
                value={String(month)}
                onValueChange={(value) => onJumpToDate(new Date(year, Number(value), 1))}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((label, index) => (
                    <SelectItem key={label} value={String(index)}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={String(year)}
                onValueChange={(value) => onJumpToDate(new Date(Number(value), month, 1))}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: endYear - startYear + 1 }, (_, index) => startYear + index).map(
                    (y) => (
                      <SelectItem key={y} value={String(y)}>
                        {y}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex rounded-lg border bg-panel p-1">
            {views.map((v) => (
              <button
                key={v.value}
                onClick={() => onViewChange(v.value)}
                className={cn(
                  'rounded-md px-3 py-1 text-sm font-medium transition-colors',
                  view === v.value
                    ? 'bg-brand text-canvas'
                    : 'text-quiet-ink hover:bg-highlight hover:text-ink'
                )}
              >
                {v.label}
              </button>
            ))}
          </div>

          <Button variant="outline" size="sm" onClick={onToday}>
            Today
          </Button>
          {(onPrev || onNext) && (
            <div className="flex">
              <Button
                variant="outline"
                size="icon"
                onClick={onPrev}
                disabled={!onPrev}
                aria-label="Previous"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={onNext}
                disabled={!onNext}
                aria-label="Next"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge
          variant={category === 'all' ? 'default' : 'secondary'}
          className="cursor-pointer"
          onClick={() => onCategoryChange('all')}
        >
          All
        </Badge>
        {categories.map((cat) => (
          <Badge
            key={cat.slug}
            variant={category === cat.slug ? 'default' : 'secondary'}
            className="cursor-pointer"
            style={category === cat.slug ? { backgroundColor: cat.color } : undefined}
            onClick={() => onCategoryChange(cat.slug)}
          >
            {cat.name}
          </Badge>
        ))}
      </div>
    </div>
  )
}
