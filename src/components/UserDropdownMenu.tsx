import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import type React from 'react'

interface UserDropdownMenuProps {
  trigger: React.ReactNode
  items: { label: string; href?: string; onClick?: () => void }[]
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'bottom' | 'left' | 'right'
}

export default function UserDropdownMenu({
  trigger,
  items,
  align = 'end',
  side = 'bottom',
}: UserDropdownMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent
        side={side}
        align={align}
        sideOffset={8}
        alignOffset={-4}
      >
        {items.map((item) =>
          item.href ? (
            <DropdownMenuItem asChild key={item.label}>
              <a href={item.href}>{item.label}</a>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem key={item.label} onClick={item.onClick}>
              {item.label}
            </DropdownMenuItem>
          ),
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
