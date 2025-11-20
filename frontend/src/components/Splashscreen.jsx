import { useEffect, useState } from 'react'
import './Splashscreen.css'

function Splashscreen({ onFinish }) {
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // Display splashscreen for 2 seconds before starting fade out
    const fadeTimer = setTimeout(() => {
      setFadeOut(true)
    }, 2000)

    // Wait for display time (2s) + fade-out animation (0.6s) = 2.6s
    const removeTimer = setTimeout(() => {
      onFinish()
    }, 2600)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(removeTimer)
    }
  }, [onFinish])

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black ${
        fadeOut ? 'splashscreen-bg-fade-out' : ''
      }`}
    >
      <img 
        src="/images/splashscreen.svg" 
        alt="Next-Gen Lock" 
        className={`max-w-md max-h-screen object-contain ${
          fadeOut ? 'splashscreen-fade-out' : 'splashscreen-fade-in'
        }`}
      />
    </div>
  )
}

export default Splashscreen
