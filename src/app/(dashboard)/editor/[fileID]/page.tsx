"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { initializeSocket } from "@/socket/socket";
import dynamic from "next/dynamic";
import type * as monacoType from "monaco-editor";
import CommonButton from "@/components/CommonButtton";
import CommonDialog from "@/components/CommonDialog/page";
import { toast } from "react-toastify";
import InputField from "@/components/CommonInput";
import { emailValidator } from "@/helper/Validator";
import {
  getFileById,
  shareFileByEmail,
  updateFileContent,
} from "@/services/apiServices";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

export default function EditorPage() {
  const [fileId, setFileId] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [users, setUsers] = useState<(string | number)[]>([]);
  const [shareEmail, setShareEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [srcDoc, setSrcDoc] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const ignoreNextCursorEventRef = useRef(false);
  const [usersCounts, setUsersCount] = useState(0);
  const [mounted, setMounted] = useState(false);
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

  const editorRef = useRef<monacoType.editor.IStandaloneCodeEditor | null>(
    null
  );

  const [remoteCursors, setRemoteCursors] = useState<
    {
      userId: number;
      position: { lineNumber: number; column: number };
      userName: string;
      color: string;
    }[]
  >([]);

  const socket = useMemo(() => initializeSocket(), []);
  const gotSocketUpdateRef = useRef(false);

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
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!fileId) return;

    const fetchFile = async () => {
      try {
        const data = await getFileById(fileId);
        if (!gotSocketUpdateRef.current) setText(data.content || "");
        setTitle(data.title || "Untitled");
      } catch (err) {
        console.error("Error fetching file:", err);
      }
    };

    fetchFile();
  }, [fileId]);

  useEffect(() => {
    if (!fileId || !userId) return;
    socket.emit("register_user", { email: userInfo.email });
    socket.emit("joinRoom", { roomId: Number(fileId), userId });

    socket.on("code_update", ({ content }) => {
      setText(content);
      setCode(content);
      setSrcDoc(content);
      gotSocketUpdateRef.current = true;
    });

    socket.on("cursor_update", ({ userId: remoteId, position, userName }) => {
      if (remoteId === userId) return;

      setRemoteCursors(prev => {
        const existing = prev.find(c => c.userId === remoteId);
        if (existing) {
          return prev.map(c =>
            c.userId === remoteId ? { ...c, position } : c
          );
        }
        return [
          ...prev,
          { userId: remoteId, position, userName, color: getRandomColor() },
        ];
      });
    });
    socket.on("user_joined", ({ userId, usersCount }) => {
      setUsers(prev => [...new Set([...prev, userId])]);
      console.log("user joined new", usersCount);
      setUsersCount(usersCount);
    });

    socket.on("user_left", ({ userId, usersLeft }) => {
      setUsers(prev => prev.filter(id => id !== userId));

      setRemoteCursors(prev => prev.filter(cursor => cursor.userId !== userId));
      setUsersCount(usersLeft);
      console.log("user left new", usersLeft);
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
    if (fileId) {
      socket.emit("code_change", {
        roomId: Number(fileId),
        userId,
        content: value,
      });
    }
  };

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    editor.onDidChangeCursorPosition((e: any) => {
      const position = e.position;
      socket.emit("cursor_move", {
        roomId: Number(fileId),
        userId,
        position,
        userName: userInfo.firstName || "User",
      });
    });
  };
  const handleCopyLink = () => {
    if (typeof window !== "undefined" && navigator?.clipboard) {
      navigator.clipboard
        .writeText(globalThis.location.href)
        .then(() => {
          setCopied(true);
          toast.success("Link copied to clipboard!");
        })
        .catch(err => {
          console.error("Clipboard write failed:", err);
          toast.error("Failed to copy link");
        });
    } else {
      toast.error("Clipboard not supported");
    }
  };
  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setShareEmail(email);
    if (!emailValidator.test(email)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError(null);
    }
  };
  const handleDialogBox = async () => {
    setIsShareOpen(true);
    if (!fileId) {
    } else {
      try {
        await updateFileContent(fileId, text);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleShareEmail = async () => {
    try {
      setIsLoading(!isLoading);
      const fileLink = window.location.href;
      const response = await shareFileByEmail(shareEmail, fileLink);
      toast.success("Email Share Successfully");
    } catch (err: any) {
      console.log(err);
    } finally {
      setIsLoading(false);
      setIsShareOpen(false);
      setShareEmail("");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex justify-between items-center bg-white shadow px-6 py-3">
        <h2 className="text-xl font-semibold ">{title || "Loading..."}</h2>
        <div className="text-sm text-gray-600">Users Online: {usersCounts}</div>
        <div className="text-sm text-gray-600">
          {/* You: {mounted ? userInfo.firstName || "" : ""} */}
        </div>
        <CommonButton
          label="Share "
          type="submit"
          isLoading={false}
          className="w[50px] bg-green-500 text-white font-semibold py-2 rounded-md hover:bg-green-600 transition duration-300 "
          // onClick={() => }
          onClick={handleDialogBox}
        />
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4 p-4">
        <div className="border rounded overflow-hidden shadow relative">
          <MonacoEditor
            defaultLanguage="html"
            value={text}
            theme="vs-dark"
            onChange={handleEditorChange}
            options={editorOptions}
            onMount={handleEditorDidMount}
          />
          {remoteCursors.map(cursor => {
            const top =
              editorRef.current?.getTopForLineNumber(
                cursor.position.lineNumber
              ) || 0;
            const left =
              editorRef.current?.getOffsetForColumn(
                cursor.position.lineNumber,
                cursor.position.column
              ) || 0;

            return (
              <div
                key={cursor.userId}
                style={{
                  position: "absolute",
                  left: `${left}px`,
                  top: `${top}px`,
                  backgroundColor: cursor.color,
                  color: "#fff",
                  fontSize: "10px",
                  padding: "2px 4px",
                  borderRadius: "4px",
                  zIndex: 10,
                  pointerEvents: "none",
                }}
              >
                {cursor.userName}
              </div>
            );
          })}
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

      <CommonDialog
        isOpen={isShareOpen}
        title="Share File"
        onClose={() => {
          setIsShareOpen(false);
          setCopied(false);
          setShareEmail("");
          setEmailError(null);
        }}
      >
        <div>
          <label className="text-sm">Recipient Email</label>
          <InputField
            label=""
            type="email"
            name="shareEmail"
            value={shareEmail}
            placeholder="example@email.com"
            onChange={handleChangeEmail}
            className="mt-1"
            externalError={emailError || ""}
            required
            errorSpace={true}
          />
        </div>

        <div>
          <label className="text-sm">Shareable Link</label>
          <div className="flex items-center justify-between gap-2 mt-1 ">
            <input
              type="text"
              value={typeof window !== "undefined" ? window.location.href : ""}
              readOnly
              className="w-full p-2 bg-[#2A2E33] text-white  border-none focus:outline-none"
            />
            <CommonButton
              label="Copy "
              type="submit"
              isLoading={false}
              className="w[50px] bg-green-500 text-white font-semibold py-2 rounded-md hover:bg-green-600 transition duration-300 "
              onClick={handleCopyLink}
            />
          </div>
        </div>
        <CommonButton
          label="Send Link "
          type="submit"
          isLoading={isLoading}
          className=" bg-green-500 text-white font-semibold py-2 rounded-md hover:bg-green-600 transition duration-300 "
          onClick={handleShareEmail}
          disabled={!emailValidator.test(shareEmail)}
        />
      </CommonDialog>
    </div>
  );
}

const editorOptions: monacoType.editor.IStandaloneEditorConstructionOptions = {
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
