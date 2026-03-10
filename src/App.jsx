import { UsernameProvider, useUsername } from './context/UsernameContext'
import { EngagementProvider } from './context/EngagementContext'
import { SignUpModal } from './components/SignUpModal'
import { MainScreen } from './components/MainScreen'
import './App.css'

function AppContent() {
  const { username } = useUsername()

  if (!username) {
    return <SignUpModal />
  }

  return (
    <div className="app-shell">
      <MainScreen />
    </div>
  )
}

function App() {
  return (
    <UsernameProvider>
      <EngagementProvider>
        <AppContent />
      </EngagementProvider>
    </UsernameProvider>
  )
}

export default App
