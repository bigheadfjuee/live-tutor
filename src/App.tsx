import { useState, useRef, useEffect } from 'react'
import { GeminiLiveTutor } from './lib/gemini-live'

function App() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '')
  const [isSettingsOpen, setIsSettingsOpen] = useState(!localStorage.getItem('gemini_api_key'))
  const [sessionState, setSessionState] = useState<'disconnected' | 'connected'>('disconnected')
  const [statusText, setStatusText] = useState(isSettingsOpen ? 'Please set your API Key' : 'Click to begin!')

  const tutorRef = useRef<GeminiLiveTutor | null>(null)

  useEffect(() => {
    return () => {
      if (tutorRef.current) tutorRef.current.stop()
    }
  }, [])

  const toggleListen = async () => {
    if (sessionState === 'connected') {
      tutorRef.current?.stop()
      setSessionState('disconnected')
      setStatusText('Session ended.')
      return
    }

    setStatusText('Connecting...')
    const tutor = new GeminiLiveTutor(apiKey)
    tutorRef.current = tutor

    tutor.onStateChange = (state, reason) => {
      if (state === 'connected') {
        setSessionState('connected')
        setStatusText('Listening! Speak now.')
      } else if (state === 'disconnected') {
        setSessionState('disconnected')
        setStatusText(prev => prev.startsWith('Error') ? prev : 'Click to begin!')
        if (reason && reason !== 'Code: 1000' && reason !== 'Code: 1005') {
          alert(`WebSocket disconnected: ${reason}`);
        }
      } else {
        setStatusText('Error connecting. Check API key.')
        setSessionState('disconnected')
        alert('請檢查你的 VITE_GEMINI_API_KEY 是否設定正確！連線失敗了。')
      }
    }

    // Optional: catch text if the model decides to send transcripts
    tutor.onMessage = (text) => {
      console.log('AI:', text)
    }

    await tutor.start()
  }

  // Define some playful, child-friendly colors
  const primaryColor = '#FFB84D' // Orange/Yellow for general fun learning
  const bgGradient = sessionState === 'connected'
    ? `linear-gradient(135deg, ${primaryColor}40, #FFF)`
    : 'linear-gradient(135deg, #FFF, #F0F0F0)'

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey.trim())
      setIsSettingsOpen(false)
      setStatusText('Click to begin!')
    } else {
      alert('請輸入有效的 Gemini API 金鑰！')
    }
  }

  const handleClearKey = () => {
    localStorage.removeItem('gemini_api_key')
    setApiKey('')
    setIsSettingsOpen(true)
    if (tutorRef.current) tutorRef.current.stop()
  }

  return (
    <div style={{
      textAlign: 'center',
      padding: '2rem',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: bgGradient,
      fontFamily: '"Comic Sans MS", "Chalkboard SE", "Comic Neue", sans-serif',
      transition: 'background 0.5s ease'
    }}>
      <h1 style={{ fontSize: '3rem', color: '#333', marginBottom: '2rem', textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>
        My Friendly Tutor 🌟
      </h1>
      <h2>Tony's 美日語小老師</h2>

      {isSettingsOpen ? (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', maxWidth: '400px', width: '90%' }}>
          <h2 style={{ marginTop: 0, color: '#444' }}>設定你的 API 金鑰 🔑</h2>
          <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            這是你個人的金鑰，它只會安全地儲存到目前的瀏覽器 (Local Storage) 中，不用擔心外洩！完成後，你就可以將這個網址分享給設備使用。
          </p>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIzaSy..."
            style={{ width: '100%', boxSizing: 'border-box', padding: '12px', borderRadius: '8px', border: '2px solid #ddd', marginBottom: '1rem', fontSize: '1rem' }}
          />
          <button
            onClick={handleSaveKey}
            style={{ backgroundColor: '#42D050', color: 'white', border: 'none', padding: '12px 24px', fontSize: '1.1rem', borderRadius: '10px', cursor: 'pointer', width: '100%' }}
          >
            儲存並開始！🚀
          </button>
        </div>
      ) : (
        <>
          <div style={{
            padding: '3rem',
            borderRadius: '50px',
            backgroundColor: 'white',
            boxShadow: sessionState === 'connected' ? `0 0 30px ${primaryColor}` : '0 10px 20px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease'
          }}>
            <button
              onClick={toggleListen}
              style={{
                padding: '2rem',
                fontSize: '3rem',
                borderRadius: '50%',
                width: '180px',
                height: '180px',
                backgroundColor: sessionState === 'connected' ? '#FF5050' : '#42D050',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 10px 0 ' + (sessionState === 'connected' ? '#CC0000' : '#229922'),
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                transform: sessionState === 'connected' ? 'translateY(5px)' : 'none',
                animation: sessionState === 'connected' ? 'pulse 2s infinite' : 'none',
              }}
            >
              {sessionState === 'connected' ? '🛑' : '🎤'}
            </button>
          </div>

          <p style={{
            marginTop: '2rem',
            fontSize: '2rem',
            color: '#444',
            fontWeight: 'bold',
          }}>
            {statusText}
          </p>

          {!isSettingsOpen && sessionState === 'disconnected' && (
            <button
              onClick={handleClearKey}
              style={{ marginTop: '3rem', background: 'transparent', border: 'none', color: '#888', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.9rem' }}
            >
              清除/更換 API 金鑰
            </button>
          )}
        </>
      )}

      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0px rgba(0, 0, 0, 0.2); }
          100% { box-shadow: 0 0 0 30px rgba(0, 0, 0, 0); }
        }
      `}</style>
    </div>
  )
}

export default App
