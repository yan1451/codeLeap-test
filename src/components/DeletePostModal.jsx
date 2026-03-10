import './Modal.css'

export function DeletePostModal({
  onCancel,
  onConfirm,
  isSubmitting,
  title = 'Are you sure you want to delete this item?',
  confirmLabel = 'Delete',
}) {
  return (
    <div className="modal-overlay">
      <div className="modal-card delete-modal-card">
        <h2 className="modal-title">{title}</h2>
        <div className="modal-actions">
          <button
            type="button"
            onClick={onCancel}
            className="modal-button modal-button-secondary"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="modal-button modal-button-danger"
            disabled={isSubmitting}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
