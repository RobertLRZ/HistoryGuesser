import { Routes, Route } from 'react-router-dom'
import StartScreen from './components/StartScreen'
import GameScreen from './components/GameScreen'

function App() {
  return (
    <Routes>
      <Route path="/" element={<StartScreen />} />
      <Route path="/game" element={<GameScreen />} />
    </Routes>
  )
}

export default App
