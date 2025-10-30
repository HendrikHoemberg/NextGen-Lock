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
      const response = await logsAPI.getAll()
      setLogs(response.data)
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
      filtered = filtered.filter(log =>
        log.card_uid.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.note && log.note.toLowerCase().includes(searchTerm.toLowerCase()))
      )
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Zugriffsprotokolle</h1>
        <p className="text-gray-600 mt-1">Alle RFID-Zugangsversuche im Überblick</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-blue-50">
          <p className="text-sm text-blue-600 font-medium">Gesamt</p>
          <p className="text-2xl font-bold text-blue-900">{filteredLogs.length}</p>
        </div>
        <div className="card bg-green-50">
          <p className="text-sm text-green-600 font-medium">Gewährt</p>
          <p className="text-2xl font-bold text-green-900">
            {filteredLogs.filter(log => log.access_granted).length}
          </p>
        </div>
        <div className="card bg-red-50">
          <p className="text-sm text-red-600 font-medium">Verweigert</p>
          <p className="text-2xl font-bold text-red-900">
            {filteredLogs.filter(log => !log.access_granted).length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Suche nach UID oder Notiz..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
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
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Karten-UID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Zeitpunkt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notiz
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    Keine Protokolle gefunden
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.log_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {log.access_granted ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Gewährt
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <XCircle className="h-4 w-4 mr-1" />
                          Verweigert
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                        {log.card_uid}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(log.access_time), 'dd.MM.yyyy HH:mm:ss', { locale: de })}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {log.note || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AccessLogs
