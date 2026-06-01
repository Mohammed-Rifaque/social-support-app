import { Toaster } from 'react-hot-toast'

import { ApplicationProvider } from './context/ApplicationContext'
import { AppRoutes } from './routes/AppRoutes'

function App() {
  return (
    <ApplicationProvider>
      <AppRoutes />
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
    </ApplicationProvider>
  )
}

export default App
