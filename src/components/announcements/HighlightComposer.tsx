import { Send, ImageIcon, Trophy } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuthStore } from '@/stores/authStore'
import { useCreateHighlight } from '@/hooks/useHighlights'
import { HIGHLIGHT_TYPE } from '@/lib/constants'
import type { HighlightType } from '@/lib/constants'

interface HighlightComposerProps {
  eventId: string
}

export function HighlightComposer({ eventId }: HighlightComposerProps) {
  const { user } = useAuthStore()
  const [content, setContent] = useState('')
  const [type, setType] = useState<HighlightType>(HIGHLIGHT_TYPE.TEXT)
  const createHighlight = useCreateHighlight()

  if (!user) return null

  const handleSubmit = async () => {
    if (!content.trim()) return
    await createHighlight.mutateAsync({
      event_id: eventId,
      author_id: user.id,
      content,
      type,
    })
    setContent('')
  }

  return (
    <div className="card-texture rounded-xl border bg-panel/60 p-4 backdrop-blur-md">
      <h4 className="mb-3 text-sm font-semibold">Share a live update</h4>
      <Tabs value={type} onValueChange={(v) => setType(v as HighlightType)}>
        <TabsList className="mb-3">
          <TabsTrigger value={HIGHLIGHT_TYPE.TEXT}>
            <Send className="mr-1 h-3 w-3" />
            Text
          </TabsTrigger>
          <TabsTrigger value={HIGHLIGHT_TYPE.PHOTO}>
            <ImageIcon className="mr-1 h-3 w-3" />
            Photo
          </TabsTrigger>
          <TabsTrigger value={HIGHLIGHT_TYPE.RESULT}>
            <Trophy className="mr-1 h-3 w-3" />
            Result
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <Textarea
        placeholder="What's happening right now?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="mb-3 min-h-[80px]"
      />
      <div className="flex justify-end">
        <Button size="sm" onClick={handleSubmit} disabled={createHighlight.isPending || !content.trim()}>
          <Send className="mr-2 h-4 w-4" />
          Post Update
        </Button>
      </div>
    </div>
  )
}
