import { formatRelativeTime } from '../utils/relativeTime'
import { useState } from 'react'
import TrashIcon from '../assets/trash-2.svg?react'
import EditIcon from '../assets/square-pen.svg?react'

const EMPTY_LIST = []


export function PostCard({
  post,
  canManage,
  onEdit,
  onDelete,
  currentUsername,
  engagement,
  onToggleLike,
  onAddComment,
  onRequestDeleteComment,
}) {
  const createdAt = formatRelativeTime(post.created_datetime)
  const [commentInput, setCommentInput] = useState('')

  const likes = engagement?.likes ?? EMPTY_LIST
  const comments = engagement?.comments ?? EMPTY_LIST
  const likedByMe = likes.includes(currentUsername)
  const canSendComment = commentInput.trim() !== ''

  const handleCommentSubmit = (event) => {
    event.preventDefault()
    const value = commentInput.trim()
    if (!value) {
      return
    }
    onAddComment(post.id, value)
    setCommentInput('')
  }

  return (
    <article className="post-card">
      <header className="post-card-header">
        <h2>{post.title}</h2>
        {canManage && (
          <div className="post-actions">
            <button
              type="button"
              onClick={() => onDelete(post)}
              className="icon-button danger"
              aria-label="Delete post"
            >
              <TrashIcon />
            </button>
            <button
              type="button"
              onClick={() => onEdit(post)}
              className="icon-button"
              aria-label="Edit post"
            >
              <EditIcon />
            </button>
          </div>
        )}
      </header>
      <div className="post-card-meta">
        <span>@{post.username}</span>
        <span>{createdAt}</span>
      </div>
      
      <div className="post-card-content">
        <p>{post.content}</p>
      </div>

      <div className="engagement-row">
        <button
          type="button"
          className={`like-button ${likedByMe ? 'active' : ''}`}
          onClick={() => onToggleLike(post.id)}
        >
          {likedByMe ? 'Curtido' : 'Curtir'} ({likes.length})
        </button>
      </div>

      <div className="comments-block">
        <h3>Comentários ({comments.length})</h3>

        <form onSubmit={handleCommentSubmit} className="comment-form">
          <input
            type="text"
            placeholder="Escreva um comentário... use @usuario para menções"
            value={commentInput}
            onChange={(event) => setCommentInput(event.target.value)}
          />
          <button type="submit" disabled={!canSendComment}>
            Comentar
          </button>
        </form>

        {comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            <div className="comment-meta">
              <span>@{comment.username}</span>
              <div className="comment-meta-right">
                <span>{formatRelativeTime(comment.createdAt)}</span>
                {comment.username === currentUsername && (
                  <button
                    type="button"
                    className="comment-delete-button"
                    aria-label="Excluir comentário"
                    onClick={() => onRequestDeleteComment(post.id, comment.id)}
                  >
                    <TrashIcon />
                  </button>
                )}
              </div>
            </div>
            <p>{comment.content}</p>
          </div>
        ))}
      </div>
    </article>
  )
}
