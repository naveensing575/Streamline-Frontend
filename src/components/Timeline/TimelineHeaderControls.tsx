'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { Calendar, Filter, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { DatePicker } from '@/components/DatePicker'

export default function TimelineHeaderControls() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex flex-wrap justify-between items-center w-full mb-4">
      {/* Left side: Date picker + Filter */}
      <div className="flex items-center gap-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {date ? format(date, 'EEEE, dd.MM.yyyy') : 'Pick a date'}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <DatePicker
              value={date}
              onChange={(newDate) => {
                setDate(newDate)
                setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>

        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          <span>Filter</span>
        </Button>
      </div>

      {/* Right side: Add Task */}
      <Button className="flex items-center gap-2 bg-black text-white hover:bg-black/90">
        <Plus className="w-4 h-4" />
        <span>Add task</span>
      </Button>
    </div>
  )
}
