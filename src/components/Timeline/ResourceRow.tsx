'use client'

import TimelineTaskBlock from './TimelineTaskBlock'

interface ResourceRowProps {
  user: {
    id: number
    name: string
    role: string
    tasks: {
      title: string
      start: number
      end: number
    }[]
  }
  timeSlots: string[]
}

export default function ResourceRow({ user, timeSlots }: ResourceRowProps) {
  return (
    <div className="relative border-b flex w-[max-content]">
      {/* Timeline slots background */}
      {timeSlots.map((_, idx) => (
        <div
          key={idx}
          className="w-[100px] h-[80px] border-l last:border-r"
        ></div>
      ))}

      {/* Tasks */}
      {user.tasks.map((task, idx) => (
        <TimelineTaskBlock key={idx} task={task} />
      ))}
    </div>
  )
}
