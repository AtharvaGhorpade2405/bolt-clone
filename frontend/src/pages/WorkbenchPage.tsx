import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Zap, Share2, Download, Code2, Eye } from "lucide-react";
import StepsSidebar from "../components/ChatSidebar";
import FileExplorer from "../components/FileExplorer";
import CodeEditor from "../components/CodeEditor";
import PreviewPanel from "../components/PreviewPanel";
import TerminalPanel from "../components/TerminalPanel";
import { BACKEND_URL } from "../config";
import { FileItem, Step, StepType } from "../types/index";
import { parseXml } from "../steps";
import { useWebContainer } from "../hooks/useWebContatiner";
import { WebContainer } from "@webcontainer/api";

type ActivePanel = "code" | "preview";

export default function WorkbenchPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { prompt } = location.state as { prompt: string };
  const [activePanel, setActivePanel] = useState<ActivePanel>("code");
  const [activeFile, setActiveFile] = useState("src/App.tsx");
  const [steps, setSteps] = useState<Step[]>([]);
  const [files,setFiles]=useState<FileItem[]>([]);
  const webcontainer=useWebContainer();
  const [openFiles, setOpenFiles] = useState([
    // "src/App.tsx",
    // "src/index.css",
    // "src/components/TodoList.tsx",
  ]);

  useEffect(() => {
    let originalFiles = [...files];
    let updateHappened = false;
    steps.filter(({status}) => status === "pending").map(step => {
      updateHappened = true;
      if (step?.type === StepType.CreateFile) {
        let parsedPath = step.path?.split("/") ?? []; // ["src", "components", "App.tsx"]
        let currentFileStructure = [...originalFiles]; // {}
        let finalAnswerRef = currentFileStructure;
  
        let currentFolder = ""
        while(parsedPath.length) {
          currentFolder = currentFolder === "" ? parsedPath[0] : `${currentFolder}/${parsedPath[0]}`;
          let currentFolderName = parsedPath[0];
          parsedPath = parsedPath.slice(1);
  
          if (!parsedPath.length) {
            // final file
            let file = currentFileStructure.find(x => x.path === currentFolder)
            if (!file) {
              currentFileStructure.push({
                name: currentFolderName,
                type: 'file',
                path: currentFolder,
                content: step.code
              })
            } else {
              file.content = step.code;
            }
          } else {
            /// in a folder
            let folder = currentFileStructure.find(x => x.path === currentFolder)
            if (!folder) {
              // create the folder
              currentFileStructure.push({
                name: currentFolderName,
                type: 'folder',
                path: currentFolder,
                children: []
              })
            }
  
            currentFileStructure = currentFileStructure.find(x => x.path === currentFolder)!.children!;
          }
        }
        originalFiles = finalAnswerRef;
      }

    })

    if (updateHappened) {

      setFiles(originalFiles)
      setSteps(steps => steps.map((s: Step) => {
        return {
          ...s,
          status: "completed"
        }
        
      }))
    }
  }, [steps, files]);

  useEffect(() => {
    const createMountStructure = (files: FileItem[]): Record<string, any> => {
      const mountStructure: Record<string, any> = {};
  
      const processFile = (file: FileItem, isRootFolder: boolean) => {  
        if (file.type === 'folder') {
          // For folders, create a directory entry
          mountStructure[file.name] = {
            directory: file.children ? 
              Object.fromEntries(
                file.children.map(child => [child.name, processFile(child, false)])
              ) 
              : {}
          };
        } else if (file.type === 'file') {
          if (isRootFolder) {
            mountStructure[file.name] = {
              file: {
                contents: file.content || ''
              }
            };
          } else {
            // For files, create a file entry with contents
            return {
              file: {
                contents: file.content || ''
              }
            };
          }
        }
  
        return mountStructure[file.name];
      };
  
      // Process each top-level file/folder
      files.forEach(file => processFile(file, true));
  
      return mountStructure;
    };
  
    const mountStructure = createMountStructure(files);
  
    // Mount the structure if WebContainer is available
    console.log(mountStructure);
    webcontainer?.mount(mountStructure);
  }, [files, webcontainer]);


  async function init() {
    const response = await axios.post(`${BACKEND_URL}/template`, {
      prompt,
    });

    const { prompts, uiPrompts } = response.data;
    // console.log("uiPrompts:", uiPrompts);
    const newSteps = parseXml(uiPrompts[0]);
    setSteps(newSteps);
    // console.log(newSteps);

    const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
      messages: [...prompts, prompt].map((content) => ({
        role: "user",
        content: content,
      })),
    });
    setSteps(s=>[...s,...parseXml(stepsResponse.data).map(x=>({
      ...x,
      status:"pending" as "pending"
    }))])
  }

  useEffect(() => {
    init();
  }, []);

  const handleFileSelect = (path: string) => {
    setActiveFile(path);
    if (!openFiles.includes(path)) {
      setOpenFiles([...openFiles, path]);
    }
  };

  const handleCloseFile = (path: string) => {
    const newOpenFiles = openFiles.filter((f) => f !== path);
    setOpenFiles(newOpenFiles);
    if (activeFile === path && newOpenFiles.length > 0) {
      setActiveFile(newOpenFiles[newOpenFiles.length - 1]);
    }
  };

  return (
    <div className="workbench">
      {/* Top Bar */}
      <div className="workbench-topbar">
        <div className="workbench-topbar-left">
          <a
            className="workbench-topbar-logo"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          >
            <div className="logo-icon">
              <Zap size={14} color="white" />
            </div>
            <span>bolt</span>
          </a>
        </div>

        <div className="workbench-topbar-center">
          <button
            className={`topbar-btn ${activePanel === "code" ? "active" : ""}`}
            onClick={() => setActivePanel("code")}
          >
            <Code2 size={14} />
            Code
          </button>
          <button
            className={`topbar-btn ${activePanel === "preview" ? "active" : ""}`}
            onClick={() => setActivePanel("preview")}
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
          <button
            className="btn-primary"
            style={{ padding: "6px 16px", fontSize: "0.8rem" }}
          >
            <Download size={14} />
            Deploy
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="workbench-body">
        {/* Steps Sidebar */}
        <StepsSidebar steps={steps} />

        {/* Editor Area */}
        <div className="editor-area">
          {/* Code Panel */}
          <div
            className={`code-panel ${activePanel !== "code" ? "hidden" : ""}`}
          >
            <FileExplorer
              onFileSelect={handleFileSelect}
              activeFile={activeFile}
              files={files}
            />
            <CodeEditor
              activeFile={activeFile}
              openFiles={openFiles}
              onFileSelect={handleFileSelect}
              onCloseFile={handleCloseFile}
              files={files}
            />
          </div>

          {/* Preview Panel */}
          {/* <div
            className={activePanel !== "preview" ? "hidden" : ""}
            style={{ flex: 1, display: "flex" }}
          > */}
            {activePanel=="preview" && <PreviewPanel webcontainer={webcontainer}/>}
          {/* </div> */}

          {/* Terminal */}
          {/* <TerminalPanel /> */}
        </div>
      </div>
    </div>
  );
}
