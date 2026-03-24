import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import WorkbenchPage from './pages/WorkbenchPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/workbench" element={<WorkbenchPage />} />
    </Routes>
  )
}

export default App
