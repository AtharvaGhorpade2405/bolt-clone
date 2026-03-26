import Editor from '@monaco-editor/react'
import { X } from 'lucide-react'
import { FileItem } from '../types/index'

interface CodeEditorProps {
  activeFile: string
  openFiles: string[]
  onFileSelect: (path: string) => void
  onCloseFile: (path: string) => void
  files?: FileItem[]
}

export default function CodeEditor({
  activeFile,
  openFiles,
  onFileSelect,
  onCloseFile,
  files = [],
}: CodeEditorProps) {

  // Recursively search for the file with the given path
  const findFileContent = (fileList: FileItem[], path: string): string => {
    for (const file of fileList) {
      if (file.path === path) {
        return file.content || '';
      }
      if (file.children) {
        const found = findFileContent(file.children, path);
        if (found) return found;
      }
    }
    return '';
  };

  const content = findFileContent(files, activeFile);

  const extension = activeFile.split('.').pop() || '';
  const languageMap: Record<string, string> = {
    'tsx': 'typescript',
    'ts': 'typescript',
    'jsx': 'javascript',
    'js': 'javascript',
    'css': 'css',
    'html': 'html',
    'json': 'json',
  };
  const language = languageMap[extension] || 'plaintext';

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
        {content ? (
          <Editor
            height="100%"
            language={language}
            value={content}
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
