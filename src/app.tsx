import { ChangeEvent, useEffect, useRef, useState } from "react";
import { WebContainer } from "@webcontainer/api";
import { files } from "./lib/files";
import Editor from "./components/text-editor";
import { Terminal as TerminalComponent } from "./components/terminal";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { FitAddon } from "@xterm/addon-fit";

export default function App() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const webContainerRef = useRef<WebContainer | null>(null);
  const [text, setText] = useState("");

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
    if (!webContainerRef.current) {
      (async () => {
        if (!terminalRef.current) {
          return;
        }
        const fitAddon = new FitAddon();
        const terminal = new Terminal({
          convertEol: true,
        });
        terminal.loadAddon(fitAddon);
        terminal.open(terminalRef.current);
        fitAddon.fit();
        const webContainerInstance = await WebContainer.boot();
        setText(files["index.js"].file.contents);
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
    }
    return () => {
      window.removeEventListener("resize", () => {
        return;
      });
    };
  }, []);

  async function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setText(() => {
      return e.target.value;
    });
    await webContainerRef.current?.fs.writeFile("/index.js", e.target.value);
  }

  return (
    <div className={"h-screen w-full flex "}>
      <div className={"w-1/2 "}>
        <Editor text={text} handleChange={handleChange} />
      </div>
      <div className={"w-1/2 flex flex-col"}>
        <div className={"h-80"}>
          <iframe ref={iframeRef} className={"w-full h-full"}></iframe>
        </div>
        <TerminalComponent ref={terminalRef} className={"flex-grow w-full"} />
      </div>
    </div>
  );
}
