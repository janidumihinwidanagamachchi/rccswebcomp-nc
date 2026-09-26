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

// Supabase returns terse storage codes that mean nothing to an admin. The
// common ones are all server-side setup problems, so name the fix rather than
// passing "Bucket not found" straight through to the UI.
function describeStorageError(error: { message: string; status?: number }): string {
  const message = error.message.toLowerCase()

  if (message.includes('bucket not found')) {
    return `Image storage is not set up on this project yet. Run supabase/apply_pending_migrations.sql in the Supabase SQL editor, then retry.`
  }
  if (message.includes('row-level security') || error.status === 403 || message.includes('new row violates row-level security policy')) {
    return 'Your account does not have permission to upload cover photos. Ask an admin to check your role.'
  }
  if (message.includes('not allowed') || message.includes('mime') || error.status === 415) {
    return 'That image type was rejected by the server. Use a JPEG, PNG, WebP or AVIF.'
  }
  if (message.includes('exceeded the maximum allowed size') || message.includes('payload too large')) {
    return 'The image is larger than the server allows. Try one under 5 MB.'
  }
  if (error.status === 401 || message.includes('jwt') || message.includes('token')) {
    return 'Your session expired. Sign in again, then retry the upload.'
  }

  return `Upload failed: ${error.message}`
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

  if (error) throw new Error(describeStorageError(error))

  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}

// Best effort: only ever touches files inside our own bucket, so an
// admin-pasted external URL is left alone.
export async function deleteEventCover(publicUrl: string): Promise<void> {
  const path = pathFromPublicUrl(publicUrl)
  if (!path) return

  const { error } = await supabase.storage.from(BUCKET).remove([path])
  if (error) throw new Error(describeStorageError(error))
}
