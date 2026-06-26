import { useNavigate } from 'react-router-dom'
import iconImg from '../assets/Icon.webp'
import Leaderboard from './Leaderboard'

export default function StartScreen() {
  const navigate = useNavigate()
  return (
    // Äußerer Container – nimmt ganzen Bildschirm, zentriert alles
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#C8B88A]">
      <h1 className="text-4xl font-black text-black mb-6">
        HistoryGuesser
      </h1>
      <img
        src={iconImg}
        alt="History Guessuer Logo"
        className="w-48 mb-10"/>
        <p className="text-xl font-bold text-black text-center mb-16 px-8 max-w-xl">
        Welches geschichtliches Ereignis ist hier dargestellt?<br />
        Errate den Ort und das Jahr!<br />
        Ein Spiel besteht aus 3 Runden.
      </p>
       <button
        onClick={() => navigate('/game')}
        className="bg-[#4B9345] hover:bg-[#4A7A4A] text-white font-bold text-3xl px-12 py-3 rounded-2xl"
      >Start</button>

      <div className="w-full max-w-lg mt-8 px-4 pb-10">
        <Leaderboard />
      </div>
    </div>
  )
}