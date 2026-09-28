import { AlertTriangle, Bell, Flame, Info } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PRIORITY, PRIORITY_COLORS } from '@/lib/constants'
import { cn, formatDate } from '@/lib/utils'
import type { Announcement } from '@/types'

const priorityIcons = {
  [PRIORITY.LOW]: Info,
  [PRIORITY.NORMAL]: Bell,
  [PRIORITY.HIGH]: Flame,
  [PRIORITY.URGENT]: AlertTriangle,
}

interface AnnouncementCardProps {
  announcement: Announcement
  compact?: boolean
  className?: string
}

export function AnnouncementCard({ announcement, compact, className }: AnnouncementCardProps) {
  const Icon = priorityIcons[announcement.priority]

  return (
    <Card className={cn('h-full overflow-hidden', className)}>
      <CardContent className={compact ? 'p-4' : 'p-5'}>
        <div className="mb-2 flex items-center gap-2">
          <Badge
            className={cn(
              PRIORITY_COLORS[announcement.priority],
              announcement.priority === PRIORITY.URGENT && 'animate-pulse'
            )}
          >
            <Icon className="mr-1 h-3 w-3" />
            {announcement.priority}
          </Badge>
          {announcement.category && (
            <Badge variant="secondary">{announcement.category.name}</Badge>
          )}
          <span className="ml-auto text-xs text-quiet-ink">
            {formatDate(announcement.published_at)}
          </span>
        </div>
        <h3 className={cn('font-semibold', compact ? 'text-base' : 'text-lg')}>{announcement.title}</h3>
        <p className={cn('mt-1 text-quiet-ink', compact && 'line-clamp-2 text-sm')}>
          {announcement.content}
        </p>
      </CardContent>
    </Card>
  )
}
