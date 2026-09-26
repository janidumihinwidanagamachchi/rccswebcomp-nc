import * as React from 'react'
import { ImagePlus, Loader2, Trash2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { deleteEventCover, uploadEventCover, EVENT_COVER_ACCEPT } from '@/lib/uploadImage'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  value: string
  onChange: (value: string) => void
  eventId?: string
  label?: string
  hint?: string
  className?: string
}

export function ImageUpload({
  value,
  onChange,
  eventId,
  label = 'Cover photo',
  hint,
  className,
}: ImageUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [dragging, setDragging] = React.useState(false)

  const handleFile = async (file: File | undefined) => {
    if (!file) return

    setBusy(true)
    setError(null)
    const previous = value

    try {
      const url = await uploadEventCover(file, eventId)
      onChange(url)
      // Replacing a photo: a failed cleanup of the old one is worth saying out
      // loud, otherwise the file is orphaned in the bucket with no sign of it.
      if (previous) {
        try {
          await deleteEventCover(previous)
        } catch {
          setError('New photo uploaded, but the previous one could not be deleted.')
        }
      }
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Upload failed. Try again.')
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleRemove = async () => {
    if (!value) {
      onChange('')
      return
    }

    setError(null)
    try {
      await deleteEventCover(value)
      onChange('')
    } catch (removeError) {
      setError(
        removeError instanceof Error
          ? `Could not delete the photo: ${removeError.message}`
          : 'Could not delete the photo.'
      )
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      <Label>{label}</Label>

      <input
        ref={inputRef}
        type="file"
        accept={EVENT_COVER_ACCEPT}
        className="sr-only"
        onChange={(e) => void handleFile(e.target.files?.[0])}
      />

      {value ? (
        <div className="flex items-center gap-3">
          <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg border bg-quiet">
            <img src={value} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-col items-start gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
            >
              {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
              Replace
            </Button>
            <Button type="button" variant="ghost" size="sm" disabled={busy} onClick={() => void handleRemove()}>
              <Trash2 className="mr-2 h-4 w-4" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragging(false)
            void handleFile(e.dataTransfer.files?.[0])
          }}
          className={cn(
            'flex w-full flex-col items-center justify-center gap-1 rounded-lg border border-dashed px-4 py-8 text-center transition-colors duration-[var(--motion-uniform)] disabled:opacity-60',
            dragging ? 'border-brand bg-brand/5' : 'hover:border-brand/60 hover:bg-quiet/40'
          )}
        >
          {busy ? (
            <Loader2 className="h-5 w-5 animate-spin text-brand" />
          ) : (
            <ImagePlus className="h-5 w-5 text-quiet-ink" />
          )}
          <span className="text-sm font-medium">
            {busy ? 'Uploading...' : 'Click to upload or drop an image'}
          </span>
          <span className="text-xs text-quiet-ink">JPEG, PNG, WebP or AVIF · max 5 MB</span>
        </button>
      )}

      {error && <p className="text-xs text-danger">{error}</p>}
      {error && (
        <p className="text-xs text-quiet-ink">
          You can paste an image link below instead.
        </p>
      )}
      {hint && !error && <p className="text-xs text-quiet-ink">{hint}</p>}

      <div className="space-y-1 pt-1">
        <Label htmlFor="imageUrl" className="text-xs text-quiet-ink">
          Or paste an image link
        </Label>
        <Input id="imageUrl" value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    </div>
  )
}
