import {useEffect, useRef, useState } from "react";
import { WebContainer } from "@webcontainer/api";
import { files } from "./lib/files";
import Editor from "./components/text-editor";
import { Terminal as TerminalComponent } from "./components/terminal";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { FitAddon } from "@xterm/addon-fit";
import { Card } from "./components/card";

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
        convertEol: true,
      });
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
    <div className={"h-screen overflow-hidden w-full flex gap-0.5 p-0.5"}>
      <div className={"w-1/2  "}>
        <Editor text={text} handleChange={handleChange} />
      </div>
      <div className={"w-1/2 flex flex-col gap-0.5"}>
        <Card className={"h-1/2 shadow-none"}>
          <iframe ref={iframeRef} className={"w-full border h-full"}></iframe>
        </Card>

        <TerminalComponent
          ref={terminalRef}
          className={"h-1/2 w-full rounded-md"}
        />
      </div>
    </div>
  );
}
