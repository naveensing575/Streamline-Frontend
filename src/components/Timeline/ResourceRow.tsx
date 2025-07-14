'use client'

import TimelineTaskBlock from './TimelineTaskBlock'

interface ResourceRowProps {
  user: {
    id: number
    name: string
    role: string
  }
  tasks: any[] // Replace with proper type
}

export default function ResourceRow({ user, tasks }: ResourceRowProps) {
  return (
    <div className="flex items-center border-b py-2">
      <div className="w-48 flex-shrink-0 pr-4">
        <p className="font-semibold">{user.name}</p>
        <p className="text-xs text-gray-500">{user.role}</p>
      </div>
      <div className="flex-1 relative border-l pl-4">
        {/* Example dummy task */}
        {tasks.map((task, idx) => (
          <TimelineTaskBlock key={idx} task={task} />
        ))}
      </div>
    </div>
  )
}
