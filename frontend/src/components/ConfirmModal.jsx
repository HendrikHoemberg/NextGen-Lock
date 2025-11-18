import { AlertTriangle } from 'lucide-react'

function ConfirmModal({ title, message, confirmText = 'Löschen', cancelText = 'Abbrechen', onConfirm, onCancel, variant = 'danger' }) {
  const variantStyles = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-orange-600 hover:bg-orange-700',
    primary: 'bg-blue-600 hover:bg-blue-700',
  }

  const iconColors = {
    danger: 'text-red-600 bg-red-100',
    warning: 'text-orange-600 bg-orange-100',
    primary: 'text-blue-600 bg-blue-100',
  }

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-full ${iconColors[variant]}`}>
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {title}
            </h2>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <div className="flex gap-3">
              <button
                onClick={onConfirm}
                className={`${variantStyles[variant]} text-white px-4 py-2 rounded-lg font-medium transition-colors flex-1`}
              >
                {confirmText}
              </button>
              <button
                onClick={onCancel}
                className="btn-secondary flex-1"
              >
                {cancelText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
