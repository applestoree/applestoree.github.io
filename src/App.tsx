import { BrowserRouter } from 'react-router-dom'
import Header from './components/Header'
import Content from './components/Content'
import BottomNav from './components/BottomNav'

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-full flex-col overflow-hidden">
        <Header />
        <Content />
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}

export default App
