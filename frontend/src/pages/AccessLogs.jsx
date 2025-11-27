import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { CheckCircle, Search, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { logsAPI } from '../services/api'

function AccessLogs() {
  const [logs, setLogs] = useState([])
  const [filteredLogs, setFilteredLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all') 

  useEffect(() => {
    loadLogs()
  }, [])

  useEffect(() => {
    filterLogs()
  }, [logs, searchTerm, filterStatus])

  const loadLogs = async () => {
    try {
      setLoading(true)
      // Logs now include user information from the backend
      const logsResponse = await logsAPI.getAll()
      setLogs(logsResponse.data)
    } catch (error) {
      console.error('Fehler beim Laden der Protokolle:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterLogs = () => {
    let filtered = [...logs]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(log => {
        const userName = log.first_name && log.last_name 
          ? `${log.first_name} ${log.last_name}` 
          : ''
        
        return (
          log.card_uid.toLowerCase().includes(searchTerm.toLowerCase()) ||
          userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (log.note && log.note.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      })
    }

    // Filter by status
    if (filterStatus === 'granted') {
      filtered = filtered.filter(log => log.access_granted)
    } else if (filterStatus === 'denied') {
      filtered = filtered.filter(log => !log.access_granted)
    }

    setFilteredLogs(filtered)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Zugriffsprotokolle</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">Alle RFID-Zugangsversuche im Überblick</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="card bg-blue-50 dark:bg-blue-900/20">
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Gesamt</p>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{logs.length}</p>
        </div>
        <div className="card bg-green-50 dark:bg-green-900/20">
          <p className="text-sm font-medium text-green-600 dark:text-green-400">Gewährt</p>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100">
            {logs.filter(log => log.access_granted).length}
          </p>
        </div>
        <div className="card bg-red-50 dark:bg-red-900/20">
          <p className="text-sm font-medium text-red-600 dark:text-red-400">Verweigert</p>
          <p className="text-2xl font-bold text-red-900 dark:text-red-100">
            {logs.filter(log => !log.access_granted).length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                placeholder="Suche nach Benutzer, UID oder Notiz..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 input-field"
              />
            </div>
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field"
            >
              <option value="all">Alle</option>
              <option value="granted">Gewährt</option>
              <option value="denied">Verweigert</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="overflow-hidden card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">
                  Benutzer
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">
                  Karten-UID
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">
                  Zeitpunkt
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">
                  Notiz
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    Keine Protokolle gefunden
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const userName = log.first_name && log.last_name 
                    ? `${log.first_name} ${log.last_name}` 
                    : 'Unbekannter Benutzer'
                  
                  return (
                    <tr key={log.log_id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {log.access_granted ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Gewährt
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            <XCircle className="w-4 h-4 mr-1" />
                            Verweigert
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap dark:text-white">
                        {userName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <code className="px-2 py-1 font-mono text-sm bg-gray-100 rounded dark:bg-gray-700 dark:text-gray-200">
                          {log.card_uid}
                        </code>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap dark:text-white">
                        {format(new Date(log.access_time + 'Z'), 'dd.MM.yyyy HH:mm:ss', { locale: de })}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {log.note || '-'}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AccessLogs
