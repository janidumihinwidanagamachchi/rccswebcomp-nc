import { Shell } from '@/components/layout/Shell'
import { AnnouncementCard } from '@/components/announcements/AnnouncementCard'
import { useAnnouncements } from '@/hooks/useAnnouncements'
import { Skeleton } from '@/components/ui/skeleton'

export function AnnouncementsPage() {
  const { data: announcements, isLoading } = useAnnouncements()

  return (
    <Shell>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold md:text-4xl">Announcements</h1>
          <p className="text-quiet-ink">Stay informed with the latest school news.</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {announcements?.map((announcement) => (
              <AnnouncementCard key={announcement.id} announcement={announcement} />
            ))}
          </div>
        )}
      </div>
    </Shell>
  )
}
