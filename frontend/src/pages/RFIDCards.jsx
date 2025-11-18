import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { Check, CreditCard as CreditCardIcon, Edit2, Plus, Search, Trash2, User, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { cardsAPI, usersAPI } from '../services/api'

function CardModal({ card, users, onClose, onSave }) {
  const [formData, setFormData] = useState({
    card_id: card?.card_id || '',
    user_id: card?.user_id || '',
    authorized: card?.authorized ?? true,
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">
          {card ? 'Karte bearbeiten' : 'Neue RFID-Karte'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="label">Karten-UID</label>
              <input
                type="text"
                required
                value={formData.card_id}
                onChange={(e) => setFormData({ ...formData, card_id: e.target.value })}
                className="input-field font-mono"
                placeholder="A1 B2 C3 D4"
                disabled={!!card || saving}
              />
              {card && (
                <p className="text-xs text-gray-500 mt-1">UID kann nicht geändert werden</p>
              )}
            </div>
            <div>
              <label className="label">Benutzer</label>
              <select
                value={formData.user_id}
                onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                className="input-field"
                required
                disabled={saving}
              >
                <option value="">Benutzer auswählen...</option>
                {users.map((user) => (
                  <option key={user.user_id} value={user.user_id}>
                    {user.first_name} {user.last_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="authorized"
                checked={formData.authorized}
                onChange={(e) => setFormData({ ...formData, authorized: e.target.checked })}
                className="h-4 w-4 text-blue-600 rounded"
                disabled={saving}
              />
              <label htmlFor="authorized" className="text-sm font-medium text-gray-700">
                Karte autorisieren
              </label>
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

function CardItem({ card, users, onEdit, onDelete, onToggleAuth }) {
  const [processing, setProcessing] = useState(false)
  const user = users.find(u => u.user_id === card.user_id)

  const handleToggleAuth = async () => {
    if (processing) return
    setProcessing(true)
    try {
      await onToggleAuth(card)
    } finally {
      setProcessing(false)
    }
  }

  const handleDelete = async () => {
    if (processing) return
    setProcessing(true)
    try {
      await onDelete(card.card_id)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className={`card ${card.authorized ? 'border-l-4 border-green-500' : 'border-l-4 border-gray-300'}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <code className="text-sm font-mono bg-gray-100 px-3 py-1 rounded font-semibold">
              {card.card_id}
            </code>
            {card.authorized ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <Check className="h-3 w-3 mr-1" />
                Autorisiert
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                <X className="h-3 w-3 mr-1" />
                Nicht autorisiert
              </span>
            )}
          </div>

          {user && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <User className="h-4 w-4" />
              <span>{user.first_name} {user.last_name}</span>
            </div>
          )}

          <p className="text-sm text-gray-500">
            Hinzugefügt: {format(new Date(card.added_on), 'dd.MM.yyyy HH:mm', { locale: de })}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleToggleAuth}
            disabled={processing}
            className={`p-2 rounded-lg transition-colors ${
              processing ? 'opacity-50 cursor-not-allowed' : ''
            } ${
              card.authorized
                ? 'text-orange-600 hover:bg-orange-50'
                : 'text-green-600 hover:bg-green-50'
            }`}
            title={card.authorized ? 'Autorisierung widerrufen' : 'Autorisieren'}
          >
            {processing ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            ) : card.authorized ? (
              <X className="h-4 w-4" />
            ) : (
              <Check className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={() => onEdit(card)}
            disabled={processing}
            className={`p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors ${
              processing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="Bearbeiten"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            disabled={processing}
            className={`p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors ${
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
    </div>
  )
}

function RFIDCards() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [cards, setCards] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCard, setEditingCard] = useState(null)
  const [filter, setFilter] = useState('all')
  const [userFilter, setUserFilter] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    // Check for user parameter in URL
    const userId = searchParams.get('user')
    if (userId && users.length > 0) {
      const user = users.find(u => u.user_id === parseInt(userId))
      if (user) {
        setUserFilter(`${user.first_name} ${user.last_name}`)
      }
    }
  }, [searchParams, users])

  const loadData = async () => {
    try {
      setLoading(true)
      const [cardsResponse, usersResponse] = await Promise.all([
        cardsAPI.getAll(),
        usersAPI.getAll(),
      ])
      setCards(cardsResponse.data)
      setUsers(usersResponse.data)
    } catch (error) {
      console.error('Fehler beim Laden der Daten:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveCard = async (cardData) => {
    if (editingCard) {
      await cardsAPI.update(editingCard.card_id, cardData)
    } else {
      await cardsAPI.create(cardData)
    }
    await loadData()
    setShowModal(false)
    setEditingCard(null)
  }

  const handleDeleteCard = async (cardId) => {
    if (!confirm('Möchten Sie diese Karte wirklich löschen?')) return

    try {
      await cardsAPI.delete(cardId)
      await loadData()
    } catch (error) {
      console.error('Fehler beim Löschen:', error)
      alert('Fehler beim Löschen der Karte')
    }
  }

  const handleToggleAuth = async (card) => {
    try {
      if (card.authorized) {
        await cardsAPI.revoke(card.card_id)
      } else {
        await cardsAPI.authorize(card.card_id)
      }
      await loadData()
    } catch (error) {
      console.error('Fehler beim Ändern der Autorisierung:', error)
      alert('Fehler beim Ändern der Autorisierung')
    }
  }

  const filteredCards = cards.filter(card => {
    // Filter by authorization status
    if (filter === 'authorized' && !card.authorized) return false
    if (filter === 'unauthorized' && card.authorized) return false
    
    // Filter by user name
    if (userFilter) {
      const user = users.find(u => u.user_id === card.user_id)
      if (!user) return false
      const fullName = `${user.first_name} ${user.last_name}`.toLowerCase()
      if (!fullName.includes(userFilter.toLowerCase())) return false
    }
    
    return true
  })

  const authorizedCount = cards.filter(card => card.authorized).length

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
          <h1 className="text-3xl font-bold text-gray-900">RFID-Karten</h1>
          <p className="text-gray-600 mt-1">Verwaltung aller RFID-Zugangs karten</p>
        </div>
        <button
          onClick={() => {
            setEditingCard(null)
            setShowModal(true)
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Neue Karte
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-blue-50">
          <p className="text-sm text-blue-600 font-medium">Gesamt</p>
          <p className="text-2xl font-bold text-blue-900">{cards.length}</p>
        </div>
        <div className="card bg-green-50">
          <p className="text-sm text-green-600 font-medium">Autorisiert</p>
          <p className="text-2xl font-bold text-green-900">{authorizedCount}</p>
        </div>
        <div className="card bg-red-50">
          <p className="text-sm text-red-600 font-medium">Nicht autorisiert</p>
          <p className="text-2xl font-bold text-gray-900">{cards.length - authorizedCount}</p>
        </div>
      </div>

      {/* User Filter */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Nach Benutzer filtern..."
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="input-field pl-10"
          />
          {userFilter && (
            <button
              onClick={() => {
                setUserFilter('')
                setSearchParams({})
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Status Filter */}
      <div className="card">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Alle ({cards.length})
          </button>
          <button
            onClick={() => setFilter('authorized')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'authorized'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Autorisiert ({authorizedCount})
          </button>
          <button
            onClick={() => setFilter('unauthorized')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'unauthorized'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Nicht autorisiert ({cards.length - authorizedCount})
          </button>
        </div>
      </div>

      {/* Cards List */}
      {filteredCards.length === 0 ? (
        <div className="card text-center py-12">
          <CreditCardIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            {filter === 'all' 
              ? 'Noch keine RFID-Karten registriert'
              : `Keine ${filter === 'authorized' ? 'autorisierten' : 'nicht autorisierten'} Karten gefunden`
            }
          </p>
          {filter === 'all' && (
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary mt-4"
            >
              Erste Karte anlegen
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCards.map((card) => (
            <CardItem
              key={card.card_id}
              card={card}
              users={users}
              onEdit={(card) => {
                setEditingCard(card)
                setShowModal(true)
              }}
              onDelete={handleDeleteCard}
              onToggleAuth={handleToggleAuth}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <CardModal
          card={editingCard}
          users={users}
          onClose={() => {
            setShowModal(false)
            setEditingCard(null)
          }}
          onSave={handleSaveCard}
        />
      )}
    </div>
  )
}

export default RFIDCards
