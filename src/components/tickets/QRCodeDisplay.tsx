import { QRCodeSVG } from 'qrcode.react'
import { Card, CardContent } from '@/components/ui/card'

interface QRCodeDisplayProps {
  value: string
  size?: number
}

export function QRCodeDisplay({ value, size = 200 }: QRCodeDisplayProps) {
  return (
    <Card className="inline-flex overflow-hidden">
      <CardContent className="p-4">
        <QRCodeSVG
          value={value}
          size={size}
          level="M"
          includeMargin
          bgColor="transparent"
          fgColor="currentColor"
          className="text-foreground"
        />
      </CardContent>
    </Card>
  )
}
