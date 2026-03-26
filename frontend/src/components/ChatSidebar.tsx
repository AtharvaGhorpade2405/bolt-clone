import { CheckCircle2, Circle, Loader2, ListChecks } from 'lucide-react'
import { Step } from '../types/index'

interface StepsSidebarProps {
  steps: Step[]
}

export default function StepsSidebar({ steps }: StepsSidebarProps) {
  const getStatusIcon = (status: Step['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 size={16} style={{ color: '#22c55e' }} />
      case 'in-progress':
        return <Loader2 size={16} className="spin" style={{ color: 'var(--accent-blue)' }} />
      case 'pending':
      default:
        return <Circle size={16} style={{ color: 'var(--text-tertiary)' }} />
    }
  }

  return (
    <aside className="chat-sidebar">
      <div className="chat-header">
        <h3>
          <ListChecks size={14} />
          Steps
        </h3>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
          {steps.filter((s) => s.status === 'completed').length}/{steps.length}
        </span>
      </div>

      <div className="chat-messages" style={{ padding: '8px' }}>
        {steps.length === 0 ? (
          <div style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem', textAlign: 'center', marginTop: '2rem' }}>
            <Loader2 size={20} className="spin" style={{ margin: '0 auto 8px' }} />
            <p>Generating steps…</p>
          </div>
        ) : (
          steps.map((step) => (
            <div
              key={step.id}
              style={{
                display: 'flex',
                gap: '10px',
                padding: '10px',
                borderRadius: '8px',
                marginBottom: '6px',
                background: step.status === 'in-progress' ? 'rgba(59,130,246,0.08)' : 'transparent',
              }}
            >
              <div style={{ flexShrink: 0, marginTop: '2px' }}>
                {getStatusIcon(step.status)}
              </div>
              <p style={{
                margin: 0,
                fontSize: '0.8rem',
                color: step.status === 'completed' ? 'var(--text-tertiary)' : 'var(--text-secondary)',
                lineHeight: 1.5,
              }}>
                {step.title}
              </p>
            </div>
          ))
        )}
      </div>
    </aside>
  )
}
