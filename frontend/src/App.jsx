import { CreditCard, LayoutDashboard, Lock, Moon, Sun, Users } from 'lucide-react'
import { useState } from 'react'
import { Link, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Splashscreen from './components/Splashscreen'
import useDarkMode from './hooks/useDarkMode'
import AccessLogs from './pages/AccessLogs'
import Dashboard from './pages/Dashboard'
import RFIDCards from './pages/RFIDCards'
import UsersPage from './pages/UsersPage'

function Navigation() {
  const location = useLocation()
  const { isDarkMode, toggleDarkMode, syncWithSystem } = useDarkMode()
  const [showMenu, setShowMenu] = useState(false)
  
  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/logs', icon: Lock, label: 'Zugriffsprotokolle' },
    { path: '/users', icon: Users, label: 'Benutzer' },
    { path: '/cards', icon: CreditCard, label: 'RFID-Karten' },
  ]

  const handleSyncWithSystem = () => {
    syncWithSystem()
    setShowMenu(false)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg transition-colors duration-200 z-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex items-center flex-shrink-0">
              <img src="/images/favicon.png" alt="Next-Gen Lock" className="w-8 h-8" />
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
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Toggle Dark Mode"
                title="Theme settings"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg z-50">
                  <button
                    onClick={toggleDarkMode}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-t-lg transition-colors"
                  >
                    {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  </button>
                  <button
                    onClick={handleSyncWithSystem}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-b-lg border-t border-gray-200 dark:border-gray-600 transition-colors"
                  >
                    Sync with System
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

function App() {
  const [showSplash, setShowSplash] = useState(true)

  return (
    <>
      {showSplash && <Splashscreen onFinish={() => setShowSplash(false)} />}
      <Router>
        <div className="min-h-screen bg-gray-200 dark:bg-gray-900 transition-colors duration-200">
          <Navigation />
          <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8 pt-16">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/logs" element={<AccessLogs />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/cards" element={<RFIDCards />} />
            </Routes>
          </main>
          <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg z-50 p-2 text-center text-sm text-gray-600 dark:text-gray-300">
            <a href="https://github.com/HendrikHoemberg/NextGen-Lock" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">
              © Die Grimmigen - Julian Naumann & Hendrik Hömberg
            </a>
          </footer>
        </div>
      </Router>
    </>
  )
}

export default App
