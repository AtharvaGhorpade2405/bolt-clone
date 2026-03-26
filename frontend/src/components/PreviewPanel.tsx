import { WebContainer } from "@webcontainer/api";
import { ArrowLeft, ArrowRight, RotateCw, Lock } from "lucide-react";
import { useEffect, useState } from "react";

interface PreviewPanelProps {
  webcontainer: WebContainer;
}

export default function PreviewPanel({ webcontainer }: PreviewPanelProps) {
  const [url, setUrl] = useState("");

  async function main() {
    const installProcess = await webcontainer.spawn("npm", ["install"]);

    installProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          console.log(data);
        },
      }),
    );

    await webcontainer.spawn("npm", ["run", "dev"]);

    // Wait for `server-ready` event
    webcontainer.on("server-ready", (port, url) => {
      setUrl(url);
      console.log(url);
      console.log(port);
    });
  }

  useEffect(() => {
    main();
  }, []);
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
          <span>{url}</span>
        </div>
      </div>

      {/* Preview Content */}
      <div className="preview-iframe-container">
        {!url && (
          <div className="preview-placeholder">
            <div className="preview-loader" />
            <span>Loading preview...</span>
          </div>
        )}
        {url && <iframe src={url}/>}
      </div>
    </div>
  );
}
