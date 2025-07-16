import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  KanbanSquare,
  CalendarDays,
  Target,
  BarChart2,
  Settings,
  LogOut,
} from 'lucide-react'
import logo from '@/assets/logo2.png'
import { toast } from 'sonner'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  const navLinks = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/kanban', icon: KanbanSquare, label: 'Kanban Board' },
    { path: '/calendar', icon: CalendarDays, label: 'Calendar' },
    { path: '/focus', icon: Target, label: 'Focus' },
    { path: '/insights', icon: BarChart2, label: 'Insights' },
  ]

  const handleLogout = () => {
    localStorage.removeItem('token')
    toast.success('Logged out successfully.')
    navigate('/login')
  }

  return (
    <TooltipProvider>
      <aside className="w-24 sm:w-28 flex flex-col justify-between items-center py-6 px-4">
        {/* Logo */}
        <div className="w-full flex justify-center">
          <Link to="/" className="w-full flex justify-center items-center">
            <img
              src={logo}
              alt="Logo"
              className="w-20 h-20 object-contain cursor-pointer"
            />
          </Link>
        </div>

        {/* Center Nav Icons */}
        <nav className="flex flex-col items-center gap-7 flex-1 justify-center">
          {navLinks.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path
            return (
              <Tooltip key={path}>
                <TooltipTrigger asChild>
                  <Link
                    to={path}
                    className={`flex items-center justify-center p-2 rounded-lg ${
                      isActive ? 'bg-black text-white' : 'text-gray-700'
                    } hover:text-black`}
                  >
                    <Icon
                      className={`${
                        isActive ? 'text-white' : 'text-gray-700'
                      } h-4 w-4 sm:h-5 sm:w-5`}
                    />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{label}</TooltipContent>
              </Tooltip>
            )
          })}
        </nav>

        {/* Bottom Settings & Logout */}
        <div className="flex flex-col items-center gap-5 mt-4 pb-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/settings"
                className={`flex items-center justify-center p-2 rounded-lg ${
                  location.pathname === '/settings'
                    ? 'bg-black text-white'
                    : 'text-gray-700'
                } hover:text-black`}
              >
                <Settings
                  className={`${
                    location.pathname === '/settings'
                      ? 'text-white'
                      : 'text-gray-700'
                  } h-4 w-4 sm:h-5 sm:w-5`}
                />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleLogout}
                className="cursor-pointer flex items-center justify-center p-2"
              >
                <LogOut className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700 hover:text-black" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Logout</TooltipContent>
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  )
}
