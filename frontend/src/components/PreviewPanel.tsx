import { WebContainer } from "@webcontainer/api";
import { ArrowLeft, ArrowRight, RotateCw, Lock } from "lucide-react";
import { useEffect, useState } from "react";

interface PreviewPanelProps {
  webcontainer: WebContainer | undefined;
  filesReady: boolean;
}

export default function PreviewPanel({ webcontainer, filesReady }: PreviewPanelProps) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (!webcontainer || !filesReady) return;

    let cancelled = false;

    // Register listener BEFORE starting the dev server to avoid missing the event
    webcontainer.on("server-ready", (port, url) => {
      if (!cancelled) {
        console.log("server-ready:", port, url);
        setUrl(url);
      }
    });

    async function main() {
      const installProcess = await webcontainer!.spawn("npm", ["install"]);

      installProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            console.log(data);
          },
        }),
      );

      // Wait for install to finish before starting dev server
      await installProcess.exit;

      const devProcess = await webcontainer!.spawn("npm", ["run", "dev"]);
      devProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            console.log("DEV SERVER PWD:", data);
          },
        }),
      );
    }

    main();

    return () => {
      cancelled = true;
    };
  }, [webcontainer, filesReady]);

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
            <span>{webcontainer ? "Loading preview..." : "Booting environment..."}</span>
          </div>
        )}
        {url && <iframe src={url} allow="cross-origin-isolated" />}
      </div>
    </div>
  );
}
