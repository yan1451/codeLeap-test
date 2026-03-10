/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'
import { useUsername } from './UsernameContext'

const EngagementContext = createContext(null)
const STORAGE_KEY = 'codeleap-post-engagement'

function readStoredEngagement() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return {}
    }
    const parsed = JSON.parse(raw)
    return typeof parsed === 'object' && parsed !== null ? parsed : {}
  } catch {
    return {}
  }
}

export function EngagementProvider({ children }) {
  const { username } = useUsername()
  const [engagementByPost, setEngagementByPost] = useState(readStoredEngagement)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(engagementByPost))
  }, [engagementByPost])

  const getPostEngagement = (postId) => {
    return engagementByPost[postId] || { likes: [], comments: [] }
  }

  const toggleLike = (postId) => {
    setEngagementByPost((previous) => {
      const current = previous[postId] || { likes: [], comments: [] }
      const alreadyLiked = current.likes.includes(username)
      const likes = alreadyLiked
        ? current.likes.filter((item) => item !== username)
        : [...current.likes, username]

      return {
        ...previous,
        [postId]: {
          ...current,
          likes,
        },
      }
    })
  }

  const addComment = (postId, text) => {
    setEngagementByPost((previous) => {
      const current = previous[postId] || { likes: [], comments: [] }
      const nextComment = {
        id: `${postId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        username,
        content: text,
        createdAt: new Date().toISOString(),
      }

      return {
        ...previous,
        [postId]: {
          ...current,
          comments: [...current.comments, nextComment],
        },
      }
    })
  }

  const deleteComment = (postId, commentId) => {
    setEngagementByPost((previous) => {
      const current = previous[postId] || { likes: [], comments: [] }
      const targetComment = current.comments.find((comment) => comment.id === commentId)

      if (!targetComment || targetComment.username !== username) {
        return previous
      }

      return {
        ...previous,
        [postId]: {
          ...current,
          comments: current.comments.filter((comment) => comment.id !== commentId),
        },
      }
    })
  }

  return (
    <EngagementContext.Provider
      value={{
        getPostEngagement,
        toggleLike,
        addComment,
        deleteComment,
      }}
    >
      {children}
    </EngagementContext.Provider>
  )
}

export function useEngagement() {
  const context = useContext(EngagementContext)
  if (!context) {
    throw new Error('useEngagement must be used within EngagementProvider')
  }
  return context
}
