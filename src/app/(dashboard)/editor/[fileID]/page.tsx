"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { initializeSocket } from "@/socket/socket";
import dynamic from "next/dynamic";
import * as monaco from "monaco-editor";

const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then(mod => mod.Editor),
  { ssr: false }
);

interface Cursor {
  userId: number;
  position: number;
  color: string;
  userName: string;
}

export default function EditorPage() {
  const [fileId, setFileId] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("html");
  const [users, setUsers] = useState<(string | number)[]>([]);
  // const [cursors, setCursors] = useState<Cursor[]>([]);
  const [srcDoc, setSrcDoc] = useState("");
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const decorationsRef = useRef<{ [key: number]: string[] }>({});

  const socket = useMemo(() => initializeSocket(), []);
  let gotSocketUpdate = false;

  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  const userInfo =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};
  const userId = userInfo.id || Math.floor(Math.random() * 1000);
  const color = useMemo(() => getRandomColor(), []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const parts = window.location.pathname.split("/");
      const idFromPath = parts[parts.length - 1];
      setFileId(idFromPath);
    }
  }, []);

  useEffect(() => {
    if (!fileId || !token) return;

    const fetchFile = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/files/single/${fileId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        if (!gotSocketUpdate) setText(data.content || "");
        setTitle(data.title || "Untitled");
        setLanguage(data.language || "html");
      } catch (err) {
        console.error("Error fetching file:", err);
      }
    };

    fetchFile();
  }, [fileId, token]);

  useEffect(() => {
    if (!fileId || !userId) return;

    socket.emit("register_user", { email: userInfo.email });
    socket.emit("joinRoom", { roomId: Number(fileId), userId });

    socket.on("code_update", ({ content }) => {
      setText(content);
      setCode(content);
      setSrcDoc(content);

      gotSocketUpdate = true;
    });

    socket.on("cursor_update", ({ userId: remoteId, position, userName }) => {
      // setCursors(prev => {
      //   const filtered = prev.filter(c => c.userId !== userId);
      //   return [...filtered, { userId, position, color, userName }];
      // });
      if (!editorRef.current || remoteId === userId) return;
      const editor = editorRef.current;
      const pos = new monaco.Position(position.lineNumber, position.column);

      // Remove old decoration
      if (decorationsRef.current[remoteId]) {
        editor.deltaDecorations(decorationsRef.current[remoteId], []);
      }

      const newDec = editor.deltaDecorations(
        [],
        [
          {
            range: new monaco.Range(
              pos.lineNumber,
              pos.column,
              pos.lineNumber,
              pos.column
            ),
            options: {
              className: "remote-cursor",
              afterContentClassName: "remote-cursor-label",
            },
          },
        ]
      );
      decorationsRef.current[remoteId] = newDec;

      // Inject inline styles
      injectCursorStyles(color, userName);
    });

    socket.on("user_joined", ({ userId }) => {
      setUsers(prev => [...new Set([...prev, userId])]);
    });

    socket.on("user_left", ({ userId }) => {
      // setUsers(prev => prev.filter(id => id !== userId));
      // setCursors(prev => prev.filter(c => c.userId !== userId));
      setUsers(prev => prev.filter(id => id !== userId));
      if (editorRef.current && decorationsRef.current[userId]) {
        editorRef.current.deltaDecorations(decorationsRef.current[userId], []);
        delete decorationsRef.current[userId];
      }
    });

    return () => {
      socket.off("code_update");
      socket.off("cursor_update");
      socket.off("user_joined");
      socket.off("user_left");
    };
  }, [socket, fileId, userId]);

  const handleEditorChange = (value: string | undefined) => {
    if (!value) return;
    setText(value);
    setCode(value);
    setSrcDoc(value);
    // handleGoLive();

    if (fileId) {
      socket.emit("code_change", {
        roomId: Number(fileId),
        userId,
        content: value,
      });
    }
  };
  const handleEditorDidMount = (
    editor: monaco.editor.IStandaloneCodeEditor
  ) => {
    editorRef.current = editor;

    editor.onDidChangeCursorPosition(e => {
      const position = e.position;
      socket.emit("cursor_move", {
        roomId: Number(fileId),
        userId,
        position,
        userName: userInfo.firstName || "User",
      });
    });
  };

  const [code, setCode] = useState<string>(`<html>
  <head>
    <style>
      body { background-color: aqua; }
      h1 { color: green; }
    </style>
  </head>
  <body>
    <h1>Hello World</h1>
    <script>
      console.log("Hello from JS");
    </script>
  </body>
</html>`);
  const handleGoLive = () => {
    setSrcDoc(code);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center bg-white shadow px-6 py-3">
        <h2 className="text-xl font-semibold">{title || "Loading..."}</h2>
        <div className="text-sm text-gray-600">
          Users Online: {users.length}
        </div>
        {/* <button
          onClick={handleGoLive}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Go Live
        </button> */}
      </div>

      {/* Editors */}
      <div className="flex-1 grid grid-cols-2  gap-4 p-4">
        <div className="border rounded overflow-hidden shadow">
          <MonacoEditor
            height="100%"
            defaultLanguage="html"
            value={text}
            theme="vs-dark"
            onChange={handleEditorChange}
            options={editorOptions}
            onMount={handleEditorDidMount}
          />
        </div>
        <div className="border rounded shadow bg-white overflow-hidden">
          <iframe
            title="Live Preview"
            srcDoc={srcDoc}
            sandbox="allow-scripts"
            frameBorder="0"
            width="100%"
            height="100%"
          />
        </div>
      </div>
    </div>
  );
}

const editorOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
  fontSize: 14,
  minimap: { enabled: false },
  automaticLayout: true,
  suggestOnTriggerCharacters: true,
  quickSuggestions: true,
  formatOnPaste: true,
  formatOnType: true,
  tabSize: 2,
  wordWrap: "on",
  scrollBeyondLastLine: false,
  renderWhitespace: "all",
  fixedOverflowWidgets: true,
  lineNumbers: "on",
};

function getRandomColor() {
  const colors = ["#e41c44", "#107569", "#ff9900", "#007bff", "#6f42c1"];
  return colors[Math.floor(Math.random() * colors.length)];
}
function injectCursorStyles(color: string, name: string) {
  if (typeof document === "undefined") return;
  const styleId = `cursor-style-${name}`;
  if (document.getElementById(styleId)) return;

  const style = document.createElement("style");
  style.id = styleId;
  style.innerHTML = `
    .remote-cursor {
      border-left: 2px solid ${color};
      height: 100%;
    }
    .remote-cursor-label::after {
      content: "${name}";
      position: absolute;
      background: ${color};
      color: white;
      padding: 2px 4px;
      font-size: 10px;
      top: -1.2em;
      left: 0;
      border-radius: 4px;
      white-space: nowrap;
    }
  `;
  document.head.appendChild(style);
}