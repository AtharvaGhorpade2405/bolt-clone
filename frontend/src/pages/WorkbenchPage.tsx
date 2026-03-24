import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Zap,
  Share2,
  Download,
  Code2,
  Eye,
} from 'lucide-react'
import ChatSidebar from '../components/ChatSidebar'
import FileExplorer from '../components/FileExplorer'
import CodeEditor from '../components/CodeEditor'
import PreviewPanel from '../components/PreviewPanel'
import TerminalPanel from '../components/TerminalPanel'

type ActivePanel = 'code' | 'preview'

export default function WorkbenchPage() {
  const navigate = useNavigate()
  const [activePanel, setActivePanel] = useState<ActivePanel>('code')
  const [activeFile, setActiveFile] = useState('src/App.tsx')
  const [openFiles, setOpenFiles] = useState([
    'src/App.tsx',
    'src/index.css',
    'src/components/TodoList.tsx',
  ])

  const handleFileSelect = (path: string) => {
    setActiveFile(path)
    if (!openFiles.includes(path)) {
      setOpenFiles([...openFiles, path])
    }
  }

  const handleCloseFile = (path: string) => {
    const newOpenFiles = openFiles.filter((f) => f !== path)
    setOpenFiles(newOpenFiles)
    if (activeFile === path && newOpenFiles.length > 0) {
      setActiveFile(newOpenFiles[newOpenFiles.length - 1])
    }
  }

  return (
    <div className="workbench">
      {/* Top Bar */}
      <div className="workbench-topbar">
        <div className="workbench-topbar-left">
          <a
            className="workbench-topbar-logo"
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
          >
            <div className="logo-icon">
              <Zap size={14} color="white" />
            </div>
            <span>bolt</span>
          </a>
        </div>

        <div className="workbench-topbar-center">
          <button
            className={`topbar-btn ${activePanel === 'code' ? 'active' : ''}`}
            onClick={() => setActivePanel('code')}
          >
            <Code2 size={14} />
            Code
          </button>
          <button
            className={`topbar-btn ${activePanel === 'preview' ? 'active' : ''}`}
            onClick={() => setActivePanel('preview')}
          >
            <Eye size={14} />
            Preview
          </button>
        </div>

        <div className="workbench-topbar-right">
          <button className="topbar-btn">
            <Share2 size={14} />
            Share
          </button>
          <button className="btn-primary" style={{ padding: '6px 16px', fontSize: '0.8rem' }}>
            <Download size={14} />
            Deploy
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="workbench-body">
        {/* Chat Sidebar */}
        <ChatSidebar />

        {/* Editor Area */}
        <div className="editor-area">
          {/* Code Panel */}
          <div className={`code-panel ${activePanel !== 'code' ? 'hidden' : ''}`}>
            <FileExplorer
              onFileSelect={handleFileSelect}
              activeFile={activeFile}
            />
            <CodeEditor
              activeFile={activeFile}
              openFiles={openFiles}
              onFileSelect={handleFileSelect}
              onCloseFile={handleCloseFile}
            />
          </div>

          {/* Preview Panel */}
          <div className={activePanel !== 'preview' ? 'hidden' : ''} style={{ flex: 1, display: 'flex' }}>
            <PreviewPanel />
          </div>

          {/* Terminal */}
          <TerminalPanel />
        </div>
      </div>
    </div>
  )
}
