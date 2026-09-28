import { Shell } from '@/components/layout/Shell'
import { Megaphone } from 'lucide-react'
import { AnnouncementCard } from '@/components/announcements/AnnouncementCard'
import { Stagger, StaggerItem } from '@/components/motion/Stagger'
import { useAnnouncements } from '@/hooks/useAnnouncements'
import { Skeleton } from '@/components/ui/skeleton'

export function AnnouncementsPage() {
  const { data: announcements, isLoading } = useAnnouncements()

  return (
    <Shell transition>
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
        ) : announcements && announcements.length > 0 ? (
          <Stagger className="grid gap-4 md:grid-cols-2">
            {announcements.map((announcement) => (
              <StaggerItem key={announcement.id}>
                <AnnouncementCard announcement={announcement} />
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
            <Megaphone className="mb-4 h-12 w-12 text-quiet-ink" />
            <h2 className="text-xl font-semibold">No announcements right now</h2>
            <p className="text-quiet-ink">Check back later for updates from staff.</p>
          </div>
        )}
      </div>
    </Shell>
  )
}
