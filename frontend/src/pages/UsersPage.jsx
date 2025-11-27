import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { CreditCard, Edit2, Trash2, UserPlus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ConfirmModal from '../components/ConfirmModal'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg">
        <h2 className="mb-4 text-2xl font-bold dark:text-white">
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
            <button type="submit" className="flex-1 btn-primary" disabled={saving}>
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-b-2 border-white rounded-full animate-spin"></div>
                  Speichern...
                </span>
              ) : (
                'Speichern'
              )}
            </button>
            <button type="button" onClick={onClose} className="flex-1 btn-secondary" disabled={saving}>
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
    <div className="transition-shadow card hover:shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {user.first_name} {user.last_name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ID: {user.user_id}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Registriert: {format(new Date(user.created_at), 'dd.MM.yyyy', { locale: de })}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(user)}
            disabled={processing}
            className={`p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors cursor-pointer ${
              processing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="Bearbeiten"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            disabled={processing}
            className={`p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer ${
              processing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="Löschen"
          >
            {processing ? (
              <div className="w-4 h-4 border-b-2 border-red-600 rounded-full animate-spin"></div>
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <div className="pt-4 mt-4 border-t dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <CreditCard className="w-4 h-4" />
            <span>
              {loading ? '...' : `${cards.length} Karte${cards.length !== 1 ? 'n' : ''}`}
            </span>
            {!loading && cards.length > 0 && (
              <span className="ml-2 font-medium text-green-600 dark:text-green-400">
                ({authorizedCount} autorisiert)
              </span>
            )}
          </div>
          <button
            onClick={() => onViewCards(user)}
            className="text-sm font-medium text-blue-600 dark:text-blue-400 cursor-pointer hover:text-blue-700 dark:hover:text-blue-300"
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
  const [confirmDelete, setConfirmDelete] = useState(null)

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
    setConfirmDelete(userId)
  }

  const confirmDeleteUser = async () => {
    const userId = confirmDelete
    setConfirmDelete(null)

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
        <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Benutzer</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">Verwaltung aller registrierten Benutzer</p>
        </div>
        <button
          onClick={() => {
            setEditingUser(null)
            setShowModal(true)
          }}
          className="flex items-center gap-2 btn-primary"
        >
          <UserPlus className="w-5 h-5" />
          Neuer Benutzer
        </button>
      </div>

      {/* Statistics */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Registrierte Benutzer</p>
            <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{users.length}</p>
          </div>
          <div className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      {/* Users Grid */}
      {users.length === 0 ? (
        <div className="py-12 text-center card">
          <UserPlus className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500 dark:text-gray-400">Noch keine Benutzer registriert</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 btn-primary"
          >
            Ersten Benutzer anlegen
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <ConfirmModal
          title="Benutzer löschen"
          message="Möchten Sie diesen Benutzer wirklich löschen? Alle zugehörigen Karten bleiben erhalten. Diese Aktion kann nicht rückgängig gemacht werden."
          confirmText="Löschen"
          cancelText="Abbrechen"
          variant="danger"
          onConfirm={confirmDeleteUser}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  )
}

export default UsersPage
