import { formatDistanceToNow } from 'date-fns'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { toDate } from '@/lib/utils'
import type { Highlight } from '@/types'

interface HighlightCardProps {
  highlight: Highlight
  showEvent?: boolean
}

export function HighlightCard({ highlight, showEvent }: HighlightCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="mb-3 flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">
              {highlight.author?.full_name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium">{highlight.author?.full_name || 'Anonymous'}</p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(toDate(highlight.created_at), { addSuffix: true })}
            </p>
          </div>
          <Badge variant="secondary">{highlight.type}</Badge>
        </div>
        <p className="text-sm text-foreground">{highlight.content}</p>
        {highlight.media_url && (
          <img
            src={highlight.media_url}
            alt="Highlight"
            className="mt-3 max-h-64 w-full rounded-lg object-cover"
          />
        )}
        {showEvent && highlight.event && (
          <p className="mt-2 text-xs text-muted-foreground">#{highlight.event.title}</p>
        )}
      </CardContent>
    </Card>
  )
}
