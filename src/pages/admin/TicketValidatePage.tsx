import { useEffect, useRef, useState } from 'react'
import { Camera, CameraOff, CheckCircle2, QrCode, Search } from 'lucide-react'
import { Shell } from '@/components/layout/Shell'
import { AdminShell } from '@/components/layout/AdminShell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCheckInRegistration, useVerifyTicket } from '@/hooks/useRegistrations'

export function TicketValidatePage() {
  const [ticketNumber, setTicketNumber] = useState('')
  const [scanning, setScanning] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const controlsRef = useRef<{ stop: () => void } | null>(null)
  const mountedRef = useRef(true)
  const verify = useVerifyTicket()
  const checkIn = useCheckInRegistration()

  const result = verify.data

  const stopScan = () => {
    controlsRef.current?.stop()
    controlsRef.current = null
    setScanning(false)
  }

  const startScan = async () => {
    if (!videoRef.current) return
    setCameraError(null)
    setScanning(true)
    try {
      const { BrowserMultiFormatReader } = await import('@zxing/browser')
      const reader = new BrowserMultiFormatReader()
      const controls = await reader.decodeFromVideoDevice(undefined, videoRef.current, (scan) => {
        if (!scan || !mountedRef.current) return
        const text = scan.getText()
        let ticket = text
        try {
          const parsed = JSON.parse(text)
          if (parsed?.ticket) ticket = parsed.ticket
        } catch {
          // raw text, not a JSON payload
        }
        setTicketNumber(ticket)
        verify.mutate(ticket)
        stopScan()
      })
      if (!mountedRef.current) {
        controls.stop()
      } else {
        controlsRef.current = controls
      }
    } catch {
      if (mountedRef.current) {
        setCameraError('Could not start the camera. Check browser permissions and try again.')
        setScanning(false)
      }
      const stream = videoRef.current?.srcObject as MediaStream | null
      stream?.getTracks().forEach((track) => track.stop())
    }
  }

  useEffect(() => {
    const video = videoRef.current
    return () => {
      mountedRef.current = false
      controlsRef.current?.stop()
      const stream = video?.srcObject as MediaStream | null
      stream?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  const handleVerify = () => {
    if (!ticketNumber.trim()) return
    verify.mutate(ticketNumber)
  }

  const handleCheckIn = () => {
    if (!result?.registrationId) return
    checkIn.mutate(
      { id: result.registrationId, status: 'attended' },
      { onSuccess: () => verify.mutate(ticketNumber) }
    )
  }

  return (
    <Shell>
      <AdminShell>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Validate Ticket</h1>
          <p className="text-quiet-ink">Scan a QR code or type a ticket number to check someone in.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Ticket number</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={ticketNumber}
                  onChange={(e) => setTicketNumber(e.target.value)}
                  placeholder="EVT-XXXXXX-XXXX"
                  className="font-mono uppercase"
                />
                <Button onClick={handleVerify} disabled={verify.isPending || !ticketNumber.trim()}>
                  <Search className="mr-2 h-4 w-4" />
                  Validate
                </Button>
              </div>

              <Button variant="outline" className="w-full" onClick={scanning ? stopScan : startScan}>
                {scanning ? <CameraOff className="mr-2 h-4 w-4" /> : <Camera className="mr-2 h-4 w-4" />}
                {scanning ? 'Stop camera' : 'Scan with camera'}
              </Button>

              <div className={scanning ? 'overflow-hidden rounded-lg border' : 'hidden'}>
                <video ref={videoRef} className="w-full" muted playsInline />
              </div>

              {cameraError && <p className="text-sm text-danger">{cameraError}</p>}
              {verify.isError && (
                <p className="text-sm text-danger">Could not read that ticket. Check the number and try again.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Result</CardTitle>
            </CardHeader>
            <CardContent>
              {!result ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <QrCode className="mb-3 h-10 w-10 text-quiet-ink" />
                  <p className="font-medium">No ticket checked yet</p>
                  <p className="text-sm text-quiet-ink">Results show up here after a scan or lookup.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant={result.status === 'attended' ? 'default' : 'secondary'}>{result.status}</Badge>
                    <span className="font-mono text-sm text-quiet-ink">{result.ticket_number}</span>
                  </div>
                  <div>
                    <p className="text-sm text-quiet-ink">Attendee</p>
                    <p className="font-semibold">{result.attendee_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-quiet-ink">Event</p>
                    <p className="font-semibold">{result.event_title}</p>
                  </div>

                  {result.status === 'attended' ? (
                    <p className="flex items-center gap-2 text-sm text-emerald-500">
                      <CheckCircle2 className="h-4 w-4" />
                      Already checked in
                    </p>
                  ) : (
                    <Button
                      onClick={handleCheckIn}
                      disabled={checkIn.isPending || !result.registrationId}
                      className="w-full"
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Check in
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </AdminShell>
    </Shell>
  )
}
