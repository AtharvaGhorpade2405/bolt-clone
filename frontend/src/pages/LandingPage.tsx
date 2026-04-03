import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Send,
  Globe,
  ShoppingCart,
  BarChart3,
  Gamepad2,
  Image,
  MessageSquare,
  Hammer,
} from 'lucide-react'

const suggestions = [
  { icon: <Globe size={14} />, text: 'Build a portfolio website' },
  { icon: <ShoppingCart size={14} />, text: 'Create an e-commerce store' },
  { icon: <BarChart3 size={14} />, text: 'Design a dashboard app' },
  { icon: <Gamepad2 size={14} />, text: 'Make a mini game' },
  { icon: <Image size={14} />, text: 'Build an image gallery' },
  { icon: <MessageSquare size={14} />, text: 'Create a chat interface' },
]

export default function LandingPage() {
  const [prompt, setPrompt] = useState('')
  const navigate = useNavigate()

  const handleSubmit = () => {
    if (prompt.trim()) {
      navigate('/workbench', {state:{prompt}})
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="navbar">
        <a href="/" className="navbar-logo">
          <div className="logo-icon">
            <Hammer size={18} color="white" />
          </div>
          <span>
            Forge
          </span>
        </a>
        <div className="navbar-actions">
          {/* Auth buttons removed */}
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <h1>
          What do you want to <span className="gradient-text">build</span>?
        </h1>

        <p className="hero-subtitle">
          Prompt, run, edit, and deploy full-stack web apps directly from your
          browser — no local setup required.
        </p>

        {/* Prompt */}
        <div className="prompt-container">
          <div className="prompt-box">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="How can Forge help you today?"
              rows={2}
            />
            <div className="prompt-actions">
              <div className="prompt-actions-left">
                {/* Attach files button removed */}
              </div>
              <button
                className="prompt-send-btn"
                disabled={!prompt.trim()}
                onClick={handleSubmit}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Suggestions */}
        <div className="suggestions">
          {suggestions.map((s, i) => (
            <button
              key={i}
              className="suggestion-chip"
              onClick={() => setPrompt(s.text)}
            >
              {s.icon}
              {s.text}
            </button>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <span>© 2026 Forge</span>
        <div className="footer-links">
          <a href="https://github.com/YOUR_USERNAME" target="_blank" rel="noopener noreferrer" title="GitHub" className="footer-social-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          <a href="https://linkedin.com/in/YOUR_USERNAME" target="_blank" rel="noopener noreferrer" title="LinkedIn" className="footer-social-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        </div>
      </footer>
    </div>
  )
}
