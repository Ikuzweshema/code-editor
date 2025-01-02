import { useEffect, useRef, useState } from "react";
import { WebContainer } from "@webcontainer/api";
import { files } from "./lib/files";
import Editor from "./components/code-editor";
import { Terminal as TerminalComponent } from "./components/terminal";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { FitAddon } from "@xterm/addon-fit";
import { Card, CardContent, CardFooter, CardHeader } from "./components/card";
import Options from "./components/options";
import Directory from "./components/directory";
import "@fontsource/ubuntu/400.css";
import "@fontsource/ubuntu/700.css";

export default function App() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const webContainerRef = useRef<WebContainer | null>(null);
  const [text, setText] = useState(() => {
    return files["index.js"].file.contents;
  });

  const iframeRef = useRef<HTMLIFrameElement>(null);

  async function startShell(terminal: Terminal) {
    const shell = await webContainerRef.current?.spawn("jsh", {
      terminal: {
        cols: terminal.cols,
        rows: terminal.rows,
      },
    });
    shell?.output.pipeTo(
      new WritableStream({
        write: (chunk) => {
          terminal.write(chunk);
        },
      })
    );

    const input = shell?.input.getWriter();
    terminal.onData((data) => {
      input?.write(data);
    });
    return shell;
  }

  useEffect(() => {
    (async () => {
      if (!terminalRef.current) {
        return;
      }
      const fitAddon = new FitAddon();
      const terminal = new Terminal({
        fontFamily: "Ubuntu, monospace",
        convertEol: true,
        cursorBlink: true,
        cursorStyle: "block",

        theme: {
          background: "#1e1e1e",
          foreground: "#dcdcdc",
          cursor: "#ffffff",
          selectionBackground: "rgba(255, 255, 255, 0.3)",
        },
      });
       terminal.onData(()=>{
        terminalRef.current?.scrollIntoView({ behavior: "smooth" });
       })
      terminal.loadAddon(fitAddon);
      terminal.open(terminalRef.current);
      fitAddon.fit();
      const webContainerInstance = await WebContainer.boot();

      webContainerRef.current = webContainerInstance;
      await webContainerInstance.mount(files);
      webContainerRef.current?.on("server-ready", (_, url) => {
        if (!iframeRef.current) return;
        iframeRef.current.src = url;
      });
      const shell = await startShell(terminal);
      window.addEventListener("resize", () => {
        shell?.resize({
          cols: terminal.cols,
          rows: terminal.rows,
        });
      });
    })();
  }, []);

  async function handleChange(text: string | undefined) {
    setText(() => {
      return text as string;
    });
    await webContainerRef.current?.fs.writeFile("/index.js", text!);
  }

  return (
    <div className="min-h-screen w-full p-4 sm:p-4 md:p-3 flex items-center justify-center bg-muted/40">
      <Card className="w-full max-w-4xl md:max-w-4xl h-[92vh] flex flex-col rounded-lg overflow-hidden">
        <CardHeader className="p-2 sm:p-3 bg-muted/50 shrink-0">
          <Options />
        </CardHeader>
        <CardContent className="flex-grow flex flex-col sm:flex-row p-0 overflow-hidden">
          <div className="w-full sm:w-1/3 h-1/3 sm:h-full  border-b sm:border-b-0 sm:border-r border-muted">
            <Directory />
          </div>
          <div className="w-full sm:w-2/3 h-2/3 sm:h-full overflow-y-auto">
            <Editor text={text} handleChange={handleChange} />
          </div>
        </CardContent>
        <CardFooter className="p-0 sm:p-3 bg-muted/50  shrink-0">
          <TerminalComponent ref={terminalRef} />
        </CardFooter>
      </Card>
    </div>
  );
}
