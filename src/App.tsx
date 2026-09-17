import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Content from './components/Content'
import BottomNav from './components/BottomNav'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Content />
      <BottomNav />
    </BrowserRouter>
  )
}

export default App

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/home" element={<HomeRoute />} />
      <Route path="/product" element={<ProductRoute />} />
      <Route path="/profile" element={<ProfileRoute />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  )
}

function HomeRoute() {
  return null
}

function ProductRoute() {
  return null
}

function ProfileRoute() {
  return null
}
