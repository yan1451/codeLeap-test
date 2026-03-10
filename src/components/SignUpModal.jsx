import { useState } from 'react'
import { useUsername } from '../context/UsernameContext'
import './SignUpModal.css'

export function SignUpModal() {
  const [inputValue, setInputValue] = useState('')
  const { saveUsername } = useUsername()

  const isEmpty = inputValue.trim() === ''

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isEmpty) {
      saveUsername(inputValue.trim())
    }
  }

  return (
    <div className="signup-overlay">
      <div className="signup-modal">
        <h1 className="signup-title">Welcome to CodeLeap network!</h1>
        <p className="signup-subtitle">Please enter your username</p>
        <form onSubmit={handleSubmit} className="signup-form">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="john doe"
            className="signup-input"
            autoFocus
          />
          <button
            type="submit"
            disabled={isEmpty}
            className="signup-button"
          >
            ENTER
          </button>
        </form>
      </div>
    </div>
  )
}
