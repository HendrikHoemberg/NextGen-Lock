import { CreditCard, LayoutDashboard, Lock, Moon, Sun, Users } from 'lucide-react'
import { Link, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom'
import './App.css'
import useDarkMode from './hooks/useDarkMode'
import AccessLogs from './pages/AccessLogs'
import Dashboard from './pages/Dashboard'
import RFIDCards from './pages/RFIDCards'
import UsersPage from './pages/UsersPage'

function Navigation() {
  const location = useLocation()
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  
  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/logs', icon: Lock, label: 'Zugriffsprotokolle' },
    { path: '/users', icon: Users, label: 'Benutzer' },
    { path: '/cards', icon: CreditCard, label: 'RFID-Karten' },
  ]

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg transition-colors duration-200">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex items-center flex-shrink-0">
              <Lock className="w-8 h-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">Next-Gen Lock</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'border-blue-500 text-gray-900 dark:text-white'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-1" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-300">Die Grimmigen</span>
          </div>
        </div>
      </div>
    </nav>
  )
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-200 dark:bg-gray-900 transition-colors duration-200">
        <Navigation />
        <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/logs" element={<AccessLogs />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/cards" element={<RFIDCards />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
