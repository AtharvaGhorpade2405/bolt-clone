import { useState } from 'react'
import {
  ChevronRight,
  File,
  Folder,
  FolderOpen,
  FilePlus,
  FolderPlus,
} from 'lucide-react'
import { FileItem } from '../types'

export interface FileNode {
  name: string
  type: 'file' | 'folder'
  children?: FileNode[]
}

const sampleTree: FileNode[] = [
  {
    name: 'src',
    type: 'folder',
    children: [
      {
        name: 'components',
        type: 'folder',
        children: [
          { name: 'TodoList.tsx', type: 'file' },
          { name: 'TodoItem.tsx', type: 'file' },
          { name: 'Header.tsx', type: 'file' },
          { name: 'AddTodo.tsx', type: 'file' },
        ],
      },
      { name: 'App.tsx', type: 'file' },
      { name: 'main.tsx', type: 'file' },
      { name: 'index.css', type: 'file' },
      { name: 'types.ts', type: 'file' },
    ],
  },
  {
    name: 'public',
    type: 'folder',
    children: [
      { name: 'index.html', type: 'file' },
      { name: 'favicon.svg', type: 'file' },
    ],
  },
  { name: 'package.json', type: 'file' },
  { name: 'tsconfig.json', type: 'file' },
  { name: 'vite.config.ts', type: 'file' },
  { name: '.gitignore', type: 'file' },
]

function getFileIcon(name: string) {
  const ext = name.split('.').pop()?.toLowerCase()
  const colorMap: Record<string, string> = {
    tsx: '#61dafb',
    ts: '#3178c6',
    jsx: '#f7df1e',
    js: '#f7df1e',
    css: '#264de4',
    html: '#e34f26',
    json: '#f5a623',
    svg: '#ffb13b',
    md: '#ffffff',
  }
  return colorMap[ext || ''] || 'var(--text-tertiary)'
}

interface FileExplorerProps {
  onFileSelect: (path: string) => void
  activeFile: string
  files:FileItem[]
}

export default function FileExplorer({
  onFileSelect,
  activeFile,
  files
}: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(['src', 'src/components', 'public'])
  )

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev)
      if (next.has(path)) {
        next.delete(path)
      } else {
        next.add(path)
      }
      return next
    })
  }

  const renderTree = (nodes: FileItem[], parentPath = '', depth = 0) => {
    return nodes.map((node) => {
      const currentPath = parentPath
        ? `${parentPath}/${node.name}`
        : node.name
      const isExpanded = expandedFolders.has(currentPath)
      const isActive = activeFile === currentPath

      return (
        <div key={currentPath}>
          <div
            className={`file-tree-item ${isActive ? 'active' : ''}`}
            style={{ paddingLeft: `${12 + depth * 16}px` }}
            onClick={() => {
              if (node.type === 'folder') {
                toggleFolder(currentPath)
              } else {
                onFileSelect(currentPath)
              }
            }}
          >
            {node.type === 'folder' && (
              <span
                className={`tree-icon chevron ${isExpanded ? 'open' : ''}`}
              >
                <ChevronRight size={14} />
              </span>
            )}
            <span className={`tree-icon ${node.type === 'folder' ? 'folder' : ''}`}>
              {node.type === 'folder' ? (
                isExpanded ? (
                  <FolderOpen size={15} />
                ) : (
                  <Folder size={15} />
                )
              ) : (
                <File
                  size={14}
                  style={{ color: getFileIcon(node.name) }}
                />
              )}
            </span>
            <span className="file-name">{node.name}</span>
          </div>

          {node.type === 'folder' &&
            isExpanded &&
            node.children &&
            renderTree(node.children, currentPath, depth + 1)}
        </div>
      )
    })
  }

  return (
    <div className="file-explorer">
      <div className="file-explorer-header">
        <span>Files</span>
        <div className="file-explorer-header-actions">
          <button title="New File">
            <FilePlus size={14} />
          </button>
          <button title="New Folder">
            <FolderPlus size={14} />
          </button>
        </div>
      </div>
      <div className="file-tree">{renderTree(files)}</div>
    </div>
  )
}
