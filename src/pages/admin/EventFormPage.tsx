import { useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Shell } from '@/components/layout/Shell'
import { AdminShell } from '@/components/layout/AdminShell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useCategories, useEventById, useCreateEvent, useUpdateEvent } from '@/hooks/useEvents'
import { useAuthStore } from '@/stores/authStore'
import { eventSchema, type EventFormData } from '@/lib/validators'
import { formatDateTimeLocal, slugify } from '@/lib/utils'
import { EVENT_STATUS } from '@/lib/constants'

export function EventFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { profile } = useAuthStore()
  const isEdit = Boolean(id)

  const { data: categories, isLoading: categoriesLoading } = useCategories()
  const { data: event, isLoading: eventLoading } = useEventById(id)
  const createEvent = useCreateEvent()
  const updateEvent = useUpdateEvent()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      status: 'draft',
      featured: false,
      capacity: undefined,
      imageUrl: '',
    },
  })

  useEffect(() => {
    if (event) {
      reset({
        title: event.title,
        shortDescription: event.short_description,
        description: event.description,
        categoryId: event.category_id,
        location: event.location,
        startDate: formatDateTimeLocal(event.start_date),
        endDate: formatDateTimeLocal(event.end_date),
        registrationOpensAt: formatDateTimeLocal(event.registration_opens_at),
        registrationClosesAt: formatDateTimeLocal(event.registration_closes_at),
        capacity: event.capacity || undefined,
        featured: event.featured,
        status: event.status,
        imageUrl: event.image_url || '',
      })
    }
  }, [event, reset])

  const onSubmit = async (data: EventFormData) => {
    const payload = {
      title: data.title,
      slug: slugify(data.title),
      short_description: data.shortDescription,
      description: data.description,
      category_id: data.categoryId,
      location: data.location,
      start_date: new Date(data.startDate).toISOString(),
      end_date: new Date(data.endDate).toISOString(),
      registration_opens_at: new Date(data.registrationOpensAt).toISOString(),
      registration_closes_at: new Date(data.registrationClosesAt).toISOString(),
      capacity: data.capacity || null,
      featured: data.featured,
      status: data.status,
      image_url: data.imageUrl || null,
      organizer_id: profile?.id,
    }

    if (isEdit && id) {
      await updateEvent.mutateAsync({ id, ...payload })
    } else {
      await createEvent.mutateAsync(payload)
    }
    navigate('/admin/events')
  }

  if (isEdit && eventLoading) {
    return (
      <Shell>
        <AdminShell>
          <Skeleton className="h-96 rounded-xl" />
        </AdminShell>
      </Shell>
    )
  }

  return (
    <Shell>
      <AdminShell>
        <Button variant="ghost" className="mb-4" asChild>
          <Link to="/admin/events">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to events
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>{isEdit ? 'Edit Event' : 'Create Event'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1 md:col-span-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input id="title" {...register('title')} />
                  {errors.title && <p className="text-xs text-danger">{errors.title.message}</p>}
                </div>
                <div className="space-y-1 md:col-span-2">
                  <Label htmlFor="shortDescription">Short Description</Label>
                  <Input id="shortDescription" {...register('shortDescription')} />
                  {errors.shortDescription && (
                    <p className="text-xs text-danger">{errors.shortDescription.message}</p>
                  )}
                </div>
                <div className="space-y-1 md:col-span-2">
                  <Label htmlFor="description">Full Description</Label>
                  <Textarea id="description" rows={6} {...register('description')} />
                  {errors.description && (
                    <p className="text-xs text-danger">{errors.description.message}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="categoryId">Category</Label>
                  <Select
                    value={watch('categoryId')}
                    onValueChange={(v) => setValue('categoryId', v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriesLoading ? (
                        <SelectItem value="loading">Loading...</SelectItem>
                      ) : (
                        categories?.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {errors.categoryId && (
                    <p className="text-xs text-danger">{errors.categoryId.message}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" {...register('location')} />
                  {errors.location && <p className="text-xs text-danger">{errors.location.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" type="datetime-local" {...register('startDate')} />
                  {errors.startDate && <p className="text-xs text-danger">{errors.startDate.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" type="datetime-local" {...register('endDate')} />
                  {errors.endDate && <p className="text-xs text-danger">{errors.endDate.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="registrationOpensAt">Registration Opens</Label>
                  <Input id="registrationOpensAt" type="datetime-local" {...register('registrationOpensAt')} />
                  {errors.registrationOpensAt && (
                    <p className="text-xs text-danger">{errors.registrationOpensAt.message}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="registrationClosesAt">Registration Closes</Label>
                  <Input id="registrationClosesAt" type="datetime-local" {...register('registrationClosesAt')} />
                  {errors.registrationClosesAt && (
                    <p className="text-xs text-danger">{errors.registrationClosesAt.message}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="capacity">Capacity (leave empty for unlimited)</Label>
                  <Input id="capacity" type="number" {...register('capacity')} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="imageUrl">Image URL (optional)</Label>
                  <Input id="imageUrl" {...register('imageUrl')} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="status">Status</Label>
                  <Select value={watch('status')} onValueChange={(v) => setValue('status', v as EventFormData['status'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(EVENT_STATUS).map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    id="featured"
                    checked={watch('featured')}
                    onCheckedChange={(v) => setValue('featured', v)}
                  />
                  <Label htmlFor="featured">Featured event</Label>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" asChild>
                  <Link to="/admin/events">Cancel</Link>
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isEdit ? 'Update Event' : 'Create Event'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </AdminShell>
    </Shell>
  )
}


