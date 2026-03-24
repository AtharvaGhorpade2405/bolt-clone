import Editor from '@monaco-editor/react'
import { X } from 'lucide-react'

// Sample file contents for the demo
const fileContents: Record<string, { content: string; language: string }> = {
  'src/App.tsx': {
    language: 'typescript',
    content: `import { useState } from 'react'
import TodoList from './components/TodoList'
import AddTodo from './components/AddTodo'
import Header from './components/Header'
import { Todo } from './types'
import './index.css'

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'Build a todo app', completed: true },
    { id: 2, text: 'Add dark mode support', completed: false },
    { id: 3, text: 'Deploy to production', completed: false },
  ])

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now(),
      text,
      completed: false,
    }
    setTodos([newTodo, ...todos])
  }

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  return (
    <div className="app">
      <Header count={todos.filter((t) => !t.completed).length} />
      <AddTodo onAdd={addTodo} />
      <TodoList
        todos={todos}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
      />
    </div>
  )
}`,
  },
  'src/main.tsx': {
    language: 'typescript',
    content: `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)`,
  },
  'src/index.css': {
    language: 'css',
    content: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  background: #0f0f0f;
  color: #e5e5e5;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 40px 20px;
}

.app {
  width: 100%;
  max-width: 520px;
}

.header {
  margin-bottom: 32px;
}

.header h1 {
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.header p {
  color: #888;
  font-size: 0.9rem;
  margin-top: 4px;
}`,
  },
  'src/types.ts': {
    language: 'typescript',
    content: `export interface Todo {
  id: number
  text: string
  completed: boolean
}`,
  },
  'src/components/TodoList.tsx': {
    language: 'typescript',
    content: `import { Todo } from '../types'
import TodoItem from './TodoItem'

interface Props {
  todos: Todo[]
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}

export default function TodoList({ todos, onToggle, onDelete }: Props) {
  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <p>No todos yet. Add one above!</p>
      </div>
    )
  }

  return (
    <div className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}`,
  },
  'src/components/TodoItem.tsx': {
    language: 'typescript',
    content: `import { Todo } from '../types'

interface Props {
  todo: Todo
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}

export default function TodoItem({ todo, onToggle, onDelete }: Props) {
  return (
    <div className={\`todo-item \${todo.completed ? 'completed' : ''}\`}>
      <button
        className="todo-checkbox"
        onClick={() => onToggle(todo.id)}
      >
        {todo.completed && '✓'}
      </button>
      <span className="todo-text">{todo.text}</span>
      <button
        className="todo-delete"
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>
    </div>
  )
}`,
  },
  'src/components/Header.tsx': {
    language: 'typescript',
    content: `interface Props {
  count: number
}

export default function Header({ count }: Props) {
  return (
    <div className="header">
      <h1>✨ Todo App</h1>
      <p>{count} task{count !== 1 ? 's' : ''} remaining</p>
    </div>
  )
}`,
  },
  'src/components/AddTodo.tsx': {
    language: 'typescript',
    content: `import { useState } from 'react'

interface Props {
  onAdd: (text: string) => void
}

export default function AddTodo({ onAdd }: Props) {
  const [text, setText] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim()) {
      onAdd(text.trim())
      setText('')
    }
  }

  return (
    <form className="add-todo" onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new todo..."
      />
      <button type="submit">Add</button>
    </form>
  )
}`,
  },
  'package.json': {
    language: 'json',
    content: `{
  "name": "todo-app",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0"
  }
}`,
  },
  'tsconfig.json': {
    language: 'json',
    content: `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true
  },
  "include": ["src"]
}`,
  },
  'vite.config.ts': {
    language: 'typescript',
    content: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})`,
  },
  'public/index.html': {
    language: 'html',
    content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Todo App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
  },
  'public/favicon.svg': {
    language: 'xml',
    content: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <text y=".9em" font-size="90">✨</text>
</svg>`,
  },
  '.gitignore': {
    language: 'plaintext',
    content: `node_modules
dist
.DS_Store
*.local`,
  },
}

interface CodeEditorProps {
  activeFile: string
  openFiles: string[]
  onFileSelect: (path: string) => void
  onCloseFile: (path: string) => void
}

export default function CodeEditor({
  activeFile,
  openFiles,
  onFileSelect,
  onCloseFile,
}: CodeEditorProps) {
  const fileData = fileContents[activeFile]

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Tabs */}
      <div className="editor-tabs">
        {openFiles.map((file) => {
          const fileName = file.split('/').pop()
          return (
            <div
              key={file}
              className={`editor-tab ${file === activeFile ? 'active' : ''}`}
              onClick={() => onFileSelect(file)}
            >
              <span>{fileName}</span>
              <button
                className="tab-close"
                onClick={(e) => {
                  e.stopPropagation()
                  onCloseFile(file)
                }}
              >
                <X size={12} />
              </button>
            </div>
          )
        })}
      </div>

      {/* Monaco Editor */}
      <div className="monaco-wrapper">
        {fileData ? (
          <Editor
            height="100%"
            language={fileData.language}
            value={fileData.content}
            theme="vs-dark"
            options={{
              fontSize: 13,
              fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              padding: { top: 12, bottom: 12 },
              lineNumbers: 'on',
              renderLineHighlight: 'line',
              bracketPairColorization: { enabled: true },
              automaticLayout: true,
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: 'on',
              smoothScrolling: true,
              tabSize: 2,
              wordWrap: 'on',
            }}
          />
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'var(--text-tertiary)',
              fontSize: '0.85rem',
            }}
          >
            Select a file to view its content
          </div>
        )}
      </div>
    </div>
  )
}

export { fileContents }
