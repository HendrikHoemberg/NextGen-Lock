import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { CreditCard, Edit2, Trash2, UserPlus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cardsAPI, usersAPI } from '../services/api'

function UserModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (saving) return
    setSaving(true)
    try {
      await onSave(formData)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">
          {user ? 'Benutzer bearbeiten' : 'Neuer Benutzer'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="label">Vorname</label>
              <input
                type="text"
                required
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="input-field"
                placeholder="Max"
                disabled={saving}
              />
            </div>
            <div>
              <label className="label">Nachname</label>
              <input
                type="text"
                required
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="input-field"
                placeholder="Mustermann"
                disabled={saving}
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button type="submit" className="btn-primary flex-1" disabled={saving}>
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Speichern...
                </span>
              ) : (
                'Speichern'
              )}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary flex-1" disabled={saving}>
              Abbrechen
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function UserCard({ user, onEdit, onDelete, onViewCards }) {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    loadUserCards()
  }, [user.user_id])

  const loadUserCards = async () => {
    try {
      const response = await cardsAPI.getByUserId(user.user_id)
      setCards(response.data)
    } catch (error) {
      console.error('Fehler beim Laden der Karten:', error)
    } finally {
      setLoading(false)
    }
  }

  const authorizedCount = cards.filter(card => card.authorized).length

  const handleDelete = async () => {
    if (processing) return
    setProcessing(true)
    try {
      await onDelete(user.user_id)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {user.first_name} {user.last_name}
          </h3>
          <p className="text-sm text-gray-500">
            ID: {user.user_id}
          </p>
          <p className="text-sm text-gray-500">
            Registriert: {format(new Date(user.created_at), 'dd.MM.yyyy', { locale: de })}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(user)}
            disabled={processing}
            className={`p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer ${
              processing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="Bearbeiten"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            disabled={processing}
            className={`p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer ${
              processing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="Löschen"
          >
            {processing ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <div className="border-t pt-4 mt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CreditCard className="h-4 w-4" />
            <span>
              {loading ? '...' : `${cards.length} Karte${cards.length !== 1 ? 'n' : ''}`}
            </span>
            {!loading && cards.length > 0 && (
              <span className="ml-2 text-green-600 font-medium">
                ({authorizedCount} autorisiert)
              </span>
            )}
          </div>
          <button
            onClick={() => onViewCards(user)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
          >
            Karten anzeigen →
          </button>
        </div>
      </div>
    </div>
  )
}

function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const response = await usersAPI.getAll()
      setUsers(response.data)
    } catch (error) {
      console.error('Fehler beim Laden der Benutzer:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveUser = async (userData) => {
    if (editingUser) {
      await usersAPI.update(editingUser.user_id, userData)
    } else {
      await usersAPI.create(userData)
    }
    await loadUsers()
    setShowModal(false)
    setEditingUser(null)
  }

  const handleDeleteUser = async (userId) => {
    if (!confirm('Möchten Sie diesen Benutzer wirklich löschen?')) return

    try {
      await usersAPI.delete(userId)
      await loadUsers()
    } catch (error) {
      console.error('Fehler beim Löschen:', error)
      alert('Fehler beim Löschen des Benutzers')
    }
  }

  const handleEditUser = (user) => {
    setEditingUser(user)
    setShowModal(true)
  }

  const handleViewCards = (user) => {
    window.location.href = `/cards?user=${user.user_id}`
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Benutzer</h1>
          <p className="text-gray-600 mt-1">Verwaltung aller registrierten Benutzer</p>
        </div>
        <button
          onClick={() => {
            setEditingUser(null)
            setShowModal(true)
          }}
          className="btn-primary flex items-center gap-2"
        >
          <UserPlus className="h-5 w-5" />
          Neuer Benutzer
        </button>
      </div>

      {/* Statistics */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Registrierte Benutzer</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{users.length}</p>
          </div>
          <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>

      {/* Users Grid */}
      {users.length === 0 ? (
        <div className="card text-center py-12">
          <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Noch keine Benutzer registriert</p>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary mt-4"
          >
            Ersten Benutzer anlegen
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <UserCard
              key={user.user_id}
              user={user}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
              onViewCards={handleViewCards}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <UserModal
          user={editingUser}
          onClose={() => {
            setShowModal(false)
            setEditingUser(null)
          }}
          onSave={handleSaveUser}
        />
      )}
    </div>
  )
}

export default UsersPage
