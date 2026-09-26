import { QRCodeSVG } from 'qrcode.react'
import { motion } from 'motion/react'
import { Card, CardContent } from '@/components/ui/card'
import { dur, ease, spring } from '@/components/motion/tokens'

interface QRCodeDisplayProps {
  value: string
  size?: number
}

export function QRCodeDisplay({ value, size = 200 }: QRCodeDisplayProps) {
  return (
    <motion.div
      // The card settles, then the code draws in. A scannable code appearing
      // fully-formed is fine, but a ticket feels like a reveal, and this is the
      // one screen a user is genuinely looking at rather than passing through.
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: dur.base, ease: ease.gentle }}
      className="inline-flex"
    >
      <Card className="inline-flex overflow-hidden">
        <CardContent className="p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={spring.gentle}
          >
            <QRCodeSVG
              value={value}
              size={size}
              level="M"
              includeMargin
              bgColor="transparent"
              fgColor="currentColor"
              className="text-ink"
            />
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
