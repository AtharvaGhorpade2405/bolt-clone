import { Terminal, X } from 'lucide-react'

export default function TerminalPanel() {
  return (
    <div className="terminal-panel">
      <div className="terminal-header">
        <div className="terminal-header-left">
          <button className="terminal-header-tab active">
            <Terminal size={12} />
            Terminal
          </button>
        </div>
        <div className="terminal-header-actions">
          <button title="Close terminal">
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="terminal-body">
        <div>
          <span className="t-green">➜</span>{' '}
          <span className="t-blue">~/todo-app</span>{' '}
          <span className="t-dim">$</span> npm install
        </div>
        <div className="t-dim">
          added 187 packages, and audited 188 packages in 4s
        </div>
        <div>&nbsp;</div>
        <div>
          <span className="t-green">➜</span>{' '}
          <span className="t-blue">~/todo-app</span>{' '}
          <span className="t-dim">$</span> npm run dev
        </div>
        <div>&nbsp;</div>
        <div>
          <span className="t-cyan">VITE v5.4.0</span>{' '}
          <span className="t-dim">ready in</span>{' '}
          <span className="t-green">312 ms</span>
        </div>
        <div>&nbsp;</div>
        <div>
          <span className="t-dim">➜</span>{' '}
          <span className="t-dim">Local:</span>{' '}
          <span className="t-cyan">http://localhost:5173/</span>
        </div>
        <div>
          <span className="t-dim">➜</span>{' '}
          <span className="t-dim">Network:</span>{' '}
          <span className="t-dim">use --host to expose</span>
        </div>
        <div>
          <span className="t-dim">➜</span>{' '}
          <span className="t-dim">press</span>{' '}
          <span className="t-yellow">h + enter</span>{' '}
          <span className="t-dim">to show help</span>
        </div>
      </div>
    </div>
  )
}
