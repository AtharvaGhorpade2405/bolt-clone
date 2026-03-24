import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Zap,
  Send,
  Paperclip,
  Globe,
  ShoppingCart,
  BarChart3,
  Gamepad2,
  Image,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Code2,
  Layers,
  Box,
  Cpu,
  Database,
} from 'lucide-react'

const suggestions = [
  { icon: <Globe size={14} />, text: 'Build a portfolio website' },
  { icon: <ShoppingCart size={14} />, text: 'Create an e-commerce store' },
  { icon: <BarChart3 size={14} />, text: 'Design a dashboard app' },
  { icon: <Gamepad2 size={14} />, text: 'Make a mini game' },
  { icon: <Image size={14} />, text: 'Build an image gallery' },
  { icon: <MessageSquare size={14} />, text: 'Create a chat interface' },
]

const techFeatures = [
  {
    icon: '⚛️',
    name: 'React',
    desc: 'Component-based UI',
    bg: 'rgba(97,218,251,0.08)',
  },
  {
    icon: '🟢',
    name: 'Node.js',
    desc: 'Server runtime',
    bg: 'rgba(34,197,94,0.08)',
  },
  {
    icon: '🐍',
    name: 'Python',
    desc: 'Backend & AI',
    bg: 'rgba(59,130,246,0.08)',
  },
  {
    icon: '🎨',
    name: 'Tailwind',
    desc: 'Utility-first CSS',
    bg: 'rgba(56,189,248,0.08)',
  },
  {
    icon: '📦',
    name: 'Vite',
    desc: 'Lightning build tool',
    bg: 'rgba(189,147,249,0.08)',
  },
  {
    icon: '🗄️',
    name: 'PostgreSQL',
    desc: 'SQL database',
    bg: 'rgba(99,102,241,0.08)',
  },
]

export default function LandingPage() {
  const [prompt, setPrompt] = useState('')
  const navigate = useNavigate()

  const handleSubmit = () => {
    if (prompt.trim()) {
      navigate('/workbench')
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
            <Zap size={18} color="white" />
          </div>
          <span>
            bolt<span className="gradient-text">.new</span>
          </span>
        </a>
        <div className="navbar-actions">
          <button className="btn-secondary">Sign In</button>
          <button className="btn-primary">
            Get Started <ArrowRight size={16} />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">
          <Sparkles size={14} />
          Now with GPT-4o & Claude 3.5 Sonnet
        </div>

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
              placeholder="How can Bolt help you today?"
              rows={2}
            />
            <div className="prompt-actions">
              <div className="prompt-actions-left">
                <button className="prompt-attach-btn" title="Attach file">
                  <Paperclip size={18} />
                </button>
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

      {/* Features */}
      <section className="features-section">
        <h2>Supported Technologies</h2>
        <div className="features-grid">
          {techFeatures.map((f, i) => (
            <div className="feature-card" key={i}>
              <div
                className="feature-card-icon"
                style={{ background: f.bg }}
              >
                {f.icon}
              </div>
              <h3>{f.name}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <span>© 2026 Bolt. Built with ⚡ by StackBlitz.</span>
        <div className="footer-links">
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
          <a href="#">GitHub</a>
          <a href="#">Docs</a>
        </div>
      </footer>
    </div>
  )
}
