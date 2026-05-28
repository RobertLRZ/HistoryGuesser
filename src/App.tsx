import { Routes, Route } from 'react-router-dom'
import StartScreen from './screens/StartScreen'
import GameScreen from './screens/GameScreen'

function App() {
  return (
    <Routes>
      <Route path="/" element={<StartScreen />} />
      <Route path="/game" element={<GameScreen />} />
    </Routes>
  )
}

export default App
