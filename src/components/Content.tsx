import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import ProductPage from '../pages/ProductPage'
import ProfilePage from '../pages/ProfilePage'

function Content() {
  return (
    <main className="min-h-0 flex-1 overflow-y-auto">
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </main>
  )
}

export default Content
