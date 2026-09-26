import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Reveal } from '@/components/motion/Reveal'
import type { Category } from '@/types'

interface EventFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  category: string
  onCategoryChange: (value: string) => void
  categories: Category[]
}

export function EventFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  categories,
}: EventFiltersProps) {
    // Wrapping the search and the category select separately rather than the
    // row, so they arrive as two deliberate movements instead of one block
    // fading in as a unit.
    return (
      <div className="flex flex-col gap-4 sm:flex-row">
        <Reveal className="relative flex-1" scale="sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-quiet-ink" />
          <Input
            placeholder="Search events..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </Reveal>
        <Reveal className="sm:w-[200px]" scale="sm" delay={0.08}>
          <Select value={category} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Reveal>
      </div>
    )
}
