import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Lock,
} from 'lucide-react'

export default function PreviewPanel() {
  return (
    <div className="preview-panel">
      {/* Preview Toolbar */}
      <div className="preview-toolbar">
        <div className="preview-nav-btns">
          <button title="Back">
            <ArrowLeft size={14} />
          </button>
          <button title="Forward">
            <ArrowRight size={14} />
          </button>
          <button title="Reload">
            <RotateCw size={14} />
          </button>
        </div>
        <div className="preview-url-bar">
          <Lock size={12} className="lock-icon" />
          <span>localhost:5173</span>
        </div>
      </div>

      {/* Preview Content */}
      <div className="preview-iframe-container">
        <div className="preview-placeholder">
          <div className="preview-loader" />
          <span>Loading preview...</span>
        </div>
      </div>
    </div>
  )
}
