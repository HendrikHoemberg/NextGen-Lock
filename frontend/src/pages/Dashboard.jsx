import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { CheckCircle, CreditCard, Users, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { cardsAPI, logsAPI, usersAPI } from '../services/api'

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
      </div>
    </div>
  )
}

function RecentAccessLog({ log }) {
  const isGranted = log.access_granted
  const userName = log.first_name && log.last_name 
    ? `${log.first_name} ${log.last_name}` 
    : 'Unbekannter Benutzer'
  
  return (
    <div className={`p-4 border-l-4 ${isGranted ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20'} rounded-r-lg mb-3`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          {isGranted ? (
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
          ) : (
            <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
          )}
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {isGranted ? 'Zugriff gewährt' : 'Zugriff verweigert'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Benutzer: {userName}</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">Karte: {log.card_uid}</p>
            {log.note && <p className="text-sm text-gray-500 dark:text-gray-400 italic">{log.note}</p>}
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {format(new Date(log.access_time), 'dd.MM.yyyy', { locale: de })}
          </p>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {format(new Date(log.access_time), 'HH:mm:ss', { locale: de })}
          </p>
        </div>
      </div>
    </div>
  )
}

function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCards: 0,
  })
  const [recentLogs, setRecentLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
    
    // Poll for new logs every 2 seconds
    const pollInterval = setInterval(async () => {
      try {
        const response = await logsAPI.getRecent(5)
        setRecentLogs(response.data)
      } catch (error) {
        console.error('Error polling for logs:', error)
      }
    }, 2000)
    
    // Cleanup on unmount
    return () => {
      clearInterval(pollInterval)
    }
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Load users and cards to calculate stats
      const [usersResponse, cardsResponse, logsResponse] = await Promise.all([
        usersAPI.getAll(),
        cardsAPI.getAll(),
        logsAPI.getRecent(5)
      ])
      
      // Calculate stats from the data
      setStats({
        totalUsers: usersResponse.data.length,
        totalCards: cardsResponse.data.length,
      })
      
      setRecentLogs(logsResponse.data)
      
    } catch (error) {
      console.error('Fehler beim Laden der Dashboard-Daten:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Übersicht über das RFID-Zugangssystem</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          title="Registrierte Benutzer"
          value={stats.totalUsers}
          icon={Users}
          color="bg-blue-600"
        />
        <StatCard
          title="RFID-Karten"
          value={stats.totalCards}
          icon={CreditCard}
          color="bg-green-600"
        />
      </div>

      {/* Recent Access Logs */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Letzte Zugriffe</h2>
          <Link to="/logs" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium">
            Alle anzeigen →
          </Link>
        </div>
        
        {recentLogs.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">Keine Zugriffe vorhanden</p>
        ) : (
          <div>
            {recentLogs.map((log) => (
              <RecentAccessLog key={log.log_id} log={log} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
