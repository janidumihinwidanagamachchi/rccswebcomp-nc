import * as React from 'react'
import * as SwitchPrimitives from '@radix-ui/react-switch'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { spring } from '@/components/motion/tokens'

function Switch({
  className,
  checked: checkedProp,
  defaultChecked,
  onCheckedChange,
  ...props
}: React.ComponentProps<typeof SwitchPrimitives.Root>) {
  // Mirrors state so the thumb can animate. The one call site is controlled
  // (checked + onCheckedChange), but the internal fallback keeps the component
  // correct if it is ever used uncontrolled — without it, an uncontrolled
  // switch would have no way to tell Motion where to send the thumb.
  const [internal, setInternal] = React.useState(defaultChecked ?? false)
  const isControlled = checkedProp !== undefined
  const checked = isControlled ? checkedProp : internal

  return (
    <SwitchPrimitives.Root
      checked={checked}
      onCheckedChange={(v) => {
        if (!isControlled) setInternal(v)
        onCheckedChange?.(v)
      }}
      className={cn(
        'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm duration-[var(--motion-uniform)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-brand data-[state=unchecked]:bg-field',
        className
      )}
      {...props}
    >
      {/* asChild so the thumb IS the motion element rather than wrapping it.
          Wrapping would have put a fixed-size element inside Radix's own
          thumb box and left the travel animating the wrong node.

          The travel is Motion's x rather than a CSS translate keyed off
          data-[state], so it overshoots and settles — a toggle is a physical
          throw, not a fade. Radix's data-state still drives the track colour,
          so the two never disagree about which way the switch is. */}
      <SwitchPrimitives.Thumb asChild>
        <motion.span
          className="pointer-events-none block h-4 w-4 rounded-full bg-canvas shadow-lg ring-0 will-change-transform"
          initial={false}
          animate={{ x: checked ? 16 : 0 }}
          transition={spring.snappy}
        />
      </SwitchPrimitives.Thumb>
    </SwitchPrimitives.Root>
  )
}

export { Switch }
