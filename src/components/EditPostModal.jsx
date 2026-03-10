import { useEffect, useState } from 'react'
import './Modal.css'

export function EditPostModal({ post, onCancel, onSave, isSubmitting }) {
  const [title, setTitle] = useState(post.title)
  const [content, setContent] = useState(post.content)

  useEffect(() => {
    setTitle(post.title)
    setContent(post.content)
  }, [post])

  const disabled = title.trim() === '' || content.trim() === '' || isSubmitting

  const handleSubmit = (event) => {
    event.preventDefault()
    if (disabled) {
      return
    }
    onSave({
      title: title.trim(),
      content: content.trim(),
    })
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2 className="modal-title">Edit item</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <label className="modal-field">
            <span>Title</span>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="modal-input"
            />
          </label>
          <label className="modal-field">
            <span>Content</span>
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className="modal-input modal-textarea"
            />
          </label>
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
              type="submit"
              className="modal-button modal-button-success"
              disabled={disabled}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
