import { supabase } from '@/lib/supabase'

const BUCKET = 'event-covers'
const MAX_DIMENSION = 1600
const QUALITY = 0.82
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']

const EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
}

export const EVENT_COVER_ACCEPT = ALLOWED_TYPES.join(',')

function slugifyFileName(name: string): string {
  const stem = name
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)

  return stem || 'cover'
}

async function compressImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height))
  const width = Math.max(1, Math.round(bitmap.width * scale))
  const height = Math.max(1, Math.round(bitmap.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')
  if (!context) {
    bitmap.close()
    return file
  }

  context.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/webp', QUALITY)
  )

  return blob ?? file
}

function pathFromPublicUrl(publicUrl: string): string | null {
  const marker = `/storage/v1/object/public/${BUCKET}/`
  const index = publicUrl.indexOf(marker)
  if (index === -1) return null

  return decodeURIComponent(publicUrl.slice(index + marker.length)) || null
}

export async function uploadEventCover(file: File, eventId?: string): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Choose a JPEG, PNG, WebP or AVIF image.')
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error('Image must be under 5 MB.')
  }

  const blob = await compressImage(file)
  if (blob.size > MAX_UPLOAD_BYTES) {
    throw new Error('Image is still too large after compression. Try a smaller photo.')
  }

  const contentType = blob.type || file.type
  const folder = eventId ?? crypto.randomUUID()
  const path = `events/${folder}/${Date.now()}-${slugifyFileName(file.name)}.${EXTENSIONS[contentType] ?? 'webp'}`

  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
    contentType,
    cacheControl: '31536000',
  })

  if (error) throw new Error(error.message)

  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}

// Best effort: only ever touches files inside our own bucket, so an
// admin-pasted external URL is left alone.
export async function deleteEventCover(publicUrl: string): Promise<void> {
  const path = pathFromPublicUrl(publicUrl)
  if (!path) return

  await supabase.storage.from(BUCKET).remove([path])
}
