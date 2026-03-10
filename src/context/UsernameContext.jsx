/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'

const UsernameContext = createContext(null)

export function UsernameProvider({ children }) {
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('codeleap-username') || ''
  })

  const saveUsername = (name) => {
    setUsername(name)
    localStorage.setItem('codeleap-username', name)
  }

  const clearUsername = () => {
    setUsername('')
    localStorage.removeItem('codeleap-username')
  }

  return (
    <UsernameContext.Provider value={{ username, saveUsername, clearUsername }}>
      {children}
    </UsernameContext.Provider>
  )
}

export function useUsername() {
  const context = useContext(UsernameContext)
  if (!context) {
    throw new Error('useUsername must be used within UsernameProvider')
  }
  return context
}
