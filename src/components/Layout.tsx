import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/Sidebar'
import { useState } from 'react'

export default function Layout() {
  const [boardType, setBoardType] = useState<'kanban' | 'timeline'>('kanban')

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-hidden p-4">
        <Outlet context={{ boardType, setBoardType }} />
      </main>
    </div>
  )
}
