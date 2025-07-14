'use client'

import TimelineHeaderControls from './TimelineHeaderControls'
import TimelineColumnHeader from './TimelineColumnHeader'
import ResourceRow from './ResourceRow'

export default function TimelineBoard() {
  const dummyUsers = [
    {
      id: 1,
      name: 'Jake Thompson',
      role: 'Warehouse Associate',
      workload: '7h',
      tasks: [
        { title: 'Placing', start: 0, end: 4 },
        { title: 'Packing', start: 4, end: 6.5 },
        { title: 'Dispatching', start: 6.5, end: 7 },
      ],
    },
    {
      id: 2,
      name: 'Emma Carter',
      role: 'Warehouse Associate',
      workload: '10h',
      tasks: [
        { title: 'Picking', start: 0, end: 3 },
        { title: 'Packing', start: 3, end: 6 },
        { title: 'Stock movement', start: 6, end: 10 },
      ],
    },
  ]

  const timeSlots = Array.from({ length: 12 }, (_, i) => `${i}:00`)

  return (
    <div className="flex flex-col w-full h-full">
      {/* Top Controls */}
      <TimelineHeaderControls />

      {/* Gap */}
      <div className="h-4"></div>

      {/* Grid layout for Assignees & Columns */}
      <div className="grid grid-cols-[250px_1fr] grid-rows-[auto_1fr] border rounded overflow-hidden">
        {/* Top Left: Static Cell */}
        <div className="p-4 border-b border-r sticky top-0 bg-white z-10 flex items-center font-medium">
          Assignees & Workload
        </div>

        {/* Top Right: Timeline Columns */}
        <div className="border-b sticky top-0 bg-white z-10 overflow-x-auto">
          <TimelineColumnHeader timeSlots={timeSlots} />
        </div>

        {/* Left: Users */}
        <div className="border-r overflow-y-auto bg-white">
          {dummyUsers.map((user) => (
            <div key={user.id} className="flex items-center border-b p-4">
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
              <div className="ml-auto text-sm bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center">
                {user.workload}
              </div>
            </div>
          ))}
        </div>

        {/* Right: Tasks Grid */}
        <div className="overflow-x-auto overflow-y-auto">
          {dummyUsers.map((user) => (
            <ResourceRow key={user.id} user={user} timeSlots={timeSlots} />
          ))}
        </div>
      </div>
    </div>
  )
}
