'use client'

import TimelineHeader from './TimelineHeader'
import ResourceRow from './ResourceRow'

export default function TimelineBoard() {
  const dummyUsers = [
    { id: 1, name: 'Jake Thompson', role: 'Warehouse Associate' },
    { id: 2, name: 'Emma Carter', role: 'Warehouse Associate' },
  ]

  return (
    <div className="w-full flex flex-col gap-4">
      <TimelineHeader />

      <div className="overflow-x-auto">
        {dummyUsers.map((user) => (
          <ResourceRow key={user.id} user={user} tasks={[]} />
        ))}
      </div>
    </div>
  )
}
