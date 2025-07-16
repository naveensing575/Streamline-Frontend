'use client'

interface TimelineColumnHeaderProps {
  timeSlots: string[]
}

export default function TimelineColumnHeader({
  timeSlots,
}: TimelineColumnHeaderProps) {
  return (
    <div className="flex w-[max-content] border-l">
      {timeSlots.map((slot) => (
        <div
          key={slot}
          className="w-[100px] h-12 flex items-center justify-center text-sm font-medium border-l last:border-r"
        >
          {slot}
        </div>
      ))}
    </div>
  )
}
