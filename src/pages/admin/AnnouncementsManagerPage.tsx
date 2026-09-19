import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Shell } from '@/components/layout/Shell'
import { AdminShell } from '@/components/layout/AdminShell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useAnnouncements, useCreateAnnouncement, useUpdateAnnouncement, useDeleteAnnouncement } from '@/hooks/useAnnouncements'
import { useCategories } from '@/hooks/useEvents'
import { useAuthStore } from '@/stores/authStore'
import { announcementSchema, type AnnouncementFormData } from '@/lib/validators'
import { PRIORITY } from '@/lib/constants'
import { formatDateTimeLocal } from '@/lib/utils'

export function AnnouncementsManagerPage() {
  const { profile } = useAuthStore()
  const { data: announcements, isLoading } = useAnnouncements()
  const { data: categories } = useCategories()
  const createAnnouncement = useCreateAnnouncement()
  const updateAnnouncement = useUpdateAnnouncement()
  const deleteAnnouncement = useDeleteAnnouncement()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      priority: 'normal',
      publishedAt: formatDateTimeLocal(new Date()),
    },
  })

  const openNew = () => {
    setEditingId(null)
    reset({
      title: '',
      content: '',
      priority: 'normal',
      categoryId: undefined,
      eventId: undefined,
      publishedAt: formatDateTimeLocal(new Date()),
      expiresAt: '',
    })
    setDialogOpen(true)
  }

  const openEdit = (announcement: any) => {
    setEditingId(announcement.id)
    reset({
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority,
      categoryId: announcement.category_id || undefined,
      eventId: announcement.event_id || undefined,
      publishedAt: formatDateTimeLocal(announcement.published_at),
      expiresAt: announcement.expires_at ? formatDateTimeLocal(announcement.expires_at) : '',
    })
    setDialogOpen(true)
  }

  const onSubmit = async (data: AnnouncementFormData) => {
    const payload = {
      title: data.title,
      content: data.content,
      priority: data.priority,
      category_id: data.categoryId || null,
      event_id: data.eventId || null,
      published_at: new Date(data.publishedAt).toISOString(),
      expires_at: data.expiresAt ? new Date(data.expiresAt).toISOString() : null,
      author_id: profile?.id,
    }

    if (editingId) {
      await updateAnnouncement.mutateAsync({ id: editingId, ...payload })
    } else {
      await createAnnouncement.mutateAsync(payload)
    }
    setDialogOpen(false)
  }

  return (
    <Shell>
      <AdminShell>
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold">Announcements</h1>
            <p className="text-muted-foreground">Publish and manage school announcements.</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openNew}>
                <Plus className="mr-2 h-4 w-4" />
                New Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingId ? 'Edit Announcement' : 'New Announcement'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" {...register('title')} />
                  {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="content">Content</Label>
                  <Textarea id="content" rows={4} {...register('content')} />
                  {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={watch('priority')} onValueChange={(v) => setValue('priority', v as AnnouncementFormData['priority'])}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(PRIORITY).map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="categoryId">Category</Label>
                    <Select value={watch('categoryId')} onValueChange={(v) => setValue('categoryId', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="None" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {categories?.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label htmlFor="publishedAt">Publish At</Label>
                    <Input id="publishedAt" type="datetime-local" {...register('publishedAt')} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="expiresAt">Expires At (optional)</Label>
                    <Input id="expiresAt" type="datetime-local" {...register('expiresAt')} />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {editingId ? 'Update' : 'Publish'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="space-y-4 p-6">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="divide-y">
                {announcements?.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="flex flex-col items-start justify-between gap-4 p-4 sm:flex-row sm:items-center"
                  >
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <h3 className="font-semibold">{announcement.title}</h3>
                        <Badge variant="secondary">{announcement.priority}</Badge>
                      </div>
                      <p className="line-clamp-1 text-sm text-muted-foreground">{announcement.content}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEdit(announcement)}>
                        <Pencil className="mr-2 h-3.5 w-3.5" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (confirm('Delete this announcement?')) {
                            deleteAnnouncement.mutate(announcement.id)
                          }
                        }}
                      >
                        <Trash2 className="mr-2 h-3.5 w-3.5" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </AdminShell>
    </Shell>
  )
}
