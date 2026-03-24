import { useState } from 'react'
import { Send, MessageSquare, Sparkles } from 'lucide-react'

interface ChatMessage {
  role: 'user' | 'ai'
  content: string
}

const initialMessages: ChatMessage[] = [
  {
    role: 'user',
    content: 'Create a modern todo app with React and a clean UI',
  },
  {
    role: 'ai',
    content:
      "I'll help you build a beautiful todo app! Let me set up the project structure and create all the necessary files.\n\nI've created:\n• `src/App.tsx` — Main app with state management\n• `src/components/TodoList.tsx` — List with animations\n• `src/components/TodoItem.tsx` — Individual todo cards\n• `src/index.css` — Modern dark theme styles",
  },
]

export default function ChatSidebar() {
  const [messages] = useState<ChatMessage[]>(initialMessages)
  const [input, setInput] = useState('')

  return (
    <aside className="chat-sidebar">
      <div className="chat-header">
        <h3>
          <MessageSquare size={14} />
          Chat
        </h3>
        <Sparkles size={14} style={{ color: 'var(--accent-purple)' }} />
      </div>

      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div className="chat-message" key={i}>
            <div className={`chat-message-avatar ${msg.role}`}>
              {msg.role === 'user' ? 'U' : 'AI'}
            </div>
            <div className="chat-message-content">
              {msg.content.split('\n').map((line, j) => (
                <span key={j}>
                  {line}
                  <br />
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input-area">
        <div className="chat-input-box">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Bolt a question..."
            rows={1}
          />
          <button className="chat-send-btn">
            <Send size={14} />
          </button>
        </div>
      </div>
    </aside>
  )
}
