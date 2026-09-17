import { BrowserRouter } from 'react-router-dom'
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
