'use client'

interface TimelineTaskBlockProps {
  task: {
    title: string
    start: number
    end: number
  }
}

export default function TimelineTaskBlock({ task }: TimelineTaskBlockProps) {
  const slotWidth = 100
  const left = task.start * slotWidth
  const width = (task.end - task.start) * slotWidth

  return (
    <div
      className="absolute top-2 h-[60px] rounded-md bg-green-200 text-sm shadow flex items-center justify-center"
      style={{
        left: `${left}px`,
        width: `${width}px`,
      }}
    >
      {task.title}
    </div>
  )
}
