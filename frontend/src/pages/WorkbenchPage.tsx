import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Code2, Eye, Send, Hammer, FolderArchive } from "lucide-react";
import StepsSidebar from "../components/ChatSidebar";
import FileExplorer from "../components/FileExplorer";
import CodeEditor from "../components/CodeEditor";
import PreviewPanel from "../components/PreviewPanel";
import { BACKEND_URL } from "../config";
import { FileItem, Step, StepType } from "../types/index";
import { parseXml } from "../steps";
import { useWebContainer } from "../hooks/useWebContatiner";

type ActivePanel = "code" | "preview";

// Files/folders to skip when generating ZIP
const IGNORE_LIST = new Set([
  "node_modules",
  ".git",
  ".next",
  "dist",
  "build",
  ".cache",
  ".DS_Store",
  "Thumbs.db",
  ".env",
  ".env.local",
]);

function shouldIgnore(name: string): boolean {
  return IGNORE_LIST.has(name);
}

export default function WorkbenchPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { prompt } = location.state as { prompt: string };
  const [activePanel, setActivePanel] = useState<ActivePanel>("code");
  const [activeFile, setActiveFile] = useState("src/App.tsx");
  const [steps, setSteps] = useState<Step[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const webcontainer = useWebContainer();
  const [openFiles, setOpenFiles] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [llmMessages, setLlmMessages] = useState<
    { role: "user" | "system" | "assistant"; content: string }[]
  >([]);

  useEffect(() => {
    let originalFiles = [...files];
    let updateHappened = false;
    steps
      .filter(({ status }) => status === "pending")
      .map((step) => {
        updateHappened = true;
        if (step?.type === StepType.CreateFile) {
          let parsedPath = step.path?.split("/") ?? [];
          let currentFileStructure = [...originalFiles];
          let finalAnswerRef = currentFileStructure;

          let currentFolder = "";
          while (parsedPath.length) {
            currentFolder =
              currentFolder === ""
                ? parsedPath[0]
                : `${currentFolder}/${parsedPath[0]}`;
            let currentFolderName = parsedPath[0];
            parsedPath = parsedPath.slice(1);

            if (!parsedPath.length) {
              let file = currentFileStructure.find(
                (x) => x.path === currentFolder,
              );
              if (!file) {
                currentFileStructure.push({
                  name: currentFolderName,
                  type: "file",
                  path: currentFolder,
                  content: step.code,
                });
              } else {
                file.content = step.code;
              }
            } else {
              let folder = currentFileStructure.find(
                (x) => x.path === currentFolder,
              );
              if (!folder) {
                currentFileStructure.push({
                  name: currentFolderName,
                  type: "folder",
                  path: currentFolder,
                  children: [],
                });
              }

              currentFileStructure = currentFileStructure.find(
                (x) => x.path === currentFolder,
              )!.children!;
            }
          }
          originalFiles = finalAnswerRef;
        }
      });

    if (updateHappened) {
      setFiles(originalFiles);
      setSteps((steps) =>
        steps.map((s: Step) => {
          return {
            ...s,
            status: "completed",
          };
        }),
      );
    }
  }, [steps, files]);

  useEffect(() => {
    const createMountStructure = (files: FileItem[]): Record<string, any> => {
      const processFile = (file: FileItem): any => {
        if (file.type === "folder") {
          return {
            directory: file.children
              ? Object.fromEntries(
                  file.children.map((child) => [
                    child.name,
                    processFile(child),
                  ]),
                )
              : {},
          };
        } else if (file.type === "file") {
          return {
            file: {
              contents: file.content || "",
            },
          };
        }
        return {};
      };

      return Object.fromEntries(
        files.map((file) => [file.name, processFile(file)]),
      );
    };

    const mountStructure = createMountStructure(files);

    if (webcontainer && files.length > 0) {
      webcontainer.mount(mountStructure).then(() => {
        setIsMounted(true);
      });
    }
  }, [files, webcontainer]);
  async function init() {
    const response = await axios.post(`${BACKEND_URL}/template`, {
      prompt,
    });

    const { prompts, uiPrompts } = response.data;
    const newSteps = parseXml(uiPrompts[0]);
    setSteps(newSteps);

    const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
      messages: [...prompts, prompt].map((content) => ({
        role: "user",
        content: content,
      })),
    });
    setSteps((s) => [
      ...s,
      ...parseXml(stepsResponse.data).map((x) => ({
        ...x,
        status: "pending" as "pending",
      })),
    ]);

    setLlmMessages(
      [...prompts, prompt].map((content) => ({
        role: "user",
        content: content,
      })),
    );

    setLlmMessages((x) => [
      ...x,
      { role: "assistant", content: stepsResponse.data },
    ]);

    setSteps((s) => [
      ...s,
      ...parseXml(stepsResponse.data).map((x) => ({
        ...x,
        status: "pending" as "pending",
      })),
    ]);
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

  // ---- Download ZIP functionality ----
  const handleDownloadZip = useCallback(async () => {
    if (files.length === 0) return;

    // Dynamically import JSZip
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();

    const addFilesToZip = (items: FileItem[], zipFolder: any) => {
      for (const item of items) {
        if (shouldIgnore(item.name)) continue;

        if (item.type === "file") {
          zipFolder.file(item.name, item.content || "");
        } else if (item.type === "folder" && item.children) {
          const folder = zipFolder.folder(item.name);
          addFilesToZip(item.children, folder);
        }
      }
    };

    addFilesToZip(files, zip);

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "project.zip";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [files]);

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
              <Hammer size={14} color="white" />
            </div>
            <span>Forge</span>
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
          <button
            className="topbar-btn"
            onClick={handleDownloadZip}
            title="Download project as ZIP"
            disabled={files.length === 0}
          >
            <FolderArchive size={14} />
            Download ZIP
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="workbench-body">
        {/* Chat Sidebar Area */}
        <aside className="chat-sidebar">
          <StepsSidebar steps={steps} />
          <div className="chat-input-area">
            <div className="chat-input-box">
              <textarea
                placeholder="Message Forge..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                rows={1}
              />
              <button
                onClick={async () => {
                  const newMessage = {
                    role: "user" as "user",
                    content: inputMessage,
                  };
                  const stepsResponse = await axios.post(
                    `${BACKEND_URL}/chat`,
                    {
                      messages: [...llmMessages, newMessage],
                    },
                  );

                  setSteps((s) => [
                    ...s,
                    ...parseXml(stepsResponse.data).map((x) => ({
                      ...x,
                      status: "pending" as "pending",
                    })),
                  ]);

                  setLlmMessages((x) => [...x, newMessage]);
                  setLlmMessages(x=>[...x,{role:"assistant",content:stepsResponse.data}])
                  setInputMessage("");
                }}
                className="chat-send-btn"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </aside>

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
          <div style={{ display: activePanel === "preview" ? "flex" : "none", flex: 1, height: "100%", overflow: "hidden", minHeight: 0 }}>
            <PreviewPanel webcontainer={webcontainer} filesReady={isMounted} />
          </div>
        </div>
      </div>
    </div>
  );
}
