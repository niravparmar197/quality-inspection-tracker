import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { SnackbarProvider } from './contexts/SnackbarContext'
import { AppRouter } from './routes/AppRouter'
import { OfflineBanner } from './components/OfflineBanner'

function App() {
  return (
    <BrowserRouter>
      <SnackbarProvider>
        <OfflineBanner />
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </SnackbarProvider>
    </BrowserRouter>
  )
}

export default App;