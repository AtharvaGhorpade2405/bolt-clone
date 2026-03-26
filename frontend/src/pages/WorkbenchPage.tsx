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
import { Step } from "../types/index";
import { parseXml } from "../steps";

type ActivePanel = "code" | "preview";

export default function WorkbenchPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { prompt } = location.state as { prompt: string };
  const [activePanel, setActivePanel] = useState<ActivePanel>("code");
  const [activeFile, setActiveFile] = useState("src/App.tsx");
  const [steps, setSteps] = useState<Step[]>([]);
  const [openFiles, setOpenFiles] = useState([
    "src/App.tsx",
    "src/index.css",
    "src/components/TodoList.tsx",
  ]);

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
            />
            <CodeEditor
              activeFile={activeFile}
              openFiles={openFiles}
              onFileSelect={handleFileSelect}
              onCloseFile={handleCloseFile}
            />
          </div>

          {/* Preview Panel */}
          {/* <div
            className={activePanel !== "preview" ? "hidden" : ""}
            style={{ flex: 1, display: "flex" }}
          > */}
            {activePanel=="preview" && <PreviewPanel/>}
          {/* </div> */}

          {/* Terminal */}
          {/* <TerminalPanel /> */}
        </div>
      </div>
    </div>
  );
}
