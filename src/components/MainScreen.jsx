import { useEffect, useMemo, useState } from 'react'
import { createPost, deletePost, getPosts, updatePost } from '../api/postsApi'
import { useUsername } from '../context/UsernameContext'
import { useEngagement } from '../context/EngagementContext'
import { DeletePostModal } from './DeletePostModal'
import { EditPostModal } from './EditPostModal'
import { PostCard } from './PostCard'
import './MainScreen.css'
import './Modal.css'

export function MainScreen() {
  const { username, clearUsername } = useUsername()
  const { getPostEngagement, toggleLike, addComment, deleteComment } =
    useEngagement()
  const [posts, setPosts] = useState([])
  const [usernameFilter, setUsernameFilter] = useState('')
  const [sortOrder, setSortOrder] = useState('newest')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteCommentTarget, setDeleteCommentTarget] = useState(null)
  const [editTarget, setEditTarget] = useState(null)
  const normalizedUsernameFilter = usernameFilter.trim().replace(/^@+/, '')

  const loadPosts = async (filterValue = '') => {
    setIsLoading(true)
    try {
      setError('')
      const data = await getPosts(filterValue)
      setPosts(data)
    } catch {
      setError('Could not load posts.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadPosts(normalizedUsernameFilter)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [normalizedUsernameFilter])

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      const firstDate = new Date(a.created_datetime)
      const secondDate = new Date(b.created_datetime)

      if (sortOrder === 'oldest') {
        return firstDate - secondDate
      }

      return secondDate - firstDate
    })
  }, [posts, sortOrder])

  const canCreate = title.trim() !== '' && content.trim() !== '' && !isSubmitting

  const handleCreate = async (event) => {
    event.preventDefault()
    if (!canCreate) {
      return
    }

    setIsSubmitting(true)
    try {
      await createPost({
        username,
        title: title.trim(),
        content: content.trim(),
      })
      setTitle('')
      setContent('')
      await loadPosts(normalizedUsernameFilter)
    } catch {
      setError('Could not create post.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) {
      return
    }

    setIsSubmitting(true)
    try {
      await deletePost(deleteTarget.id)
      setDeleteTarget(null)
      await loadPosts(normalizedUsernameFilter)
    } catch {
      setError('Could not delete post.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveEdit = async (payload) => {
    if (!editTarget) {
      return
    }

    setIsSubmitting(true)
    try {
      await updatePost(editTarget.id, payload)
      setEditTarget(null)
      await loadPosts(normalizedUsernameFilter)
    } catch {
      setError('Could not update post.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteComment = () => {
    if (!deleteCommentTarget) {
      return
    }

    setIsSubmitting(true)
    try {
      deleteComment(deleteCommentTarget.postId, deleteCommentTarget.commentId)
      setDeleteCommentTarget(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="feed-container">
      <section className="feed-card">
        <header className="feed-header">
          <span>CodeLeap Network</span>
          <button type="button" className="logout-button" onClick={clearUsername}>
            Logout
          </button>
        </header>

        <div className="filter-bar">
          <div className="filter-control">
            <label htmlFor="username-filter">Filtrar por username</label>
            <input
              id="username-filter"
              type="text"
              placeholder="@john ou john"
              value={usernameFilter}
              onChange={(event) => setUsernameFilter(event.target.value)}
            />
          </div>

          <div className="filter-control">
            <label htmlFor="sort-order">Ordenar por data</label>
            <select
              id="sort-order"
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
            >
              <option value="newest">Mais recentes</option>
              <option value="oldest">Mais antigos</option>
            </select>
          </div>
        </div>

        <form onSubmit={handleCreate} className="create-form">
          <h1>What is on your mind?</h1>
          <label className="create-field">
            <span>Title</span>
            <input
              type="text"
              placeholder="Hello world"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </label>
          <label className="create-field">
            <span>Content</span>
            <textarea
              placeholder="Content here"
              value={content}
              onChange={(event) => setContent(event.target.value)}
            />
          </label>
          <div className="create-actions">
            <button type="submit" disabled={!canCreate}>
              Create
            </button>
          </div>
        </form>

        {error && <p className="status-message error">{error}</p>}
        {isLoading && <p className="status-message">Loading posts...</p>}
        {!isLoading && sortedPosts.length === 0 && (
          <p className="status-message">Nenhum post encontrado para esse username.</p>
        )}

        {!isLoading &&
          sortedPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              canManage={post.username === username}
              onDelete={setDeleteTarget}
              onEdit={setEditTarget}
              currentUsername={username}
              engagement={getPostEngagement(post.id)}
              onToggleLike={toggleLike}
              onAddComment={addComment}
              onRequestDeleteComment={(postId, commentId) =>
                setDeleteCommentTarget({ postId, commentId })
              }
            />
          ))}
      </section>

      {deleteTarget && (
        <DeletePostModal
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          isSubmitting={isSubmitting}
        />
      )}

      {deleteCommentTarget && (
        <DeletePostModal
          title="Are you sure you want to delete this comment?"
          onCancel={() => setDeleteCommentTarget(null)}
          onConfirm={handleDeleteComment}
          isSubmitting={isSubmitting}
        />
      )}

      {editTarget && (
        <EditPostModal
          post={editTarget}
          onCancel={() => setEditTarget(null)}
          onSave={handleSaveEdit}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  )
}
