"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { initializeSocket } from "@/socket/socket";
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
  const [users, setUsers] = useState<(string | number)[]>([]);
  const [cursors, setCursors] = useState<Cursor[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  // ✅ Extract fileId from URL after hydration
  useEffect(() => {
    if (typeof window !== "undefined") {
      const parts = window.location.pathname.split("/");
      const idFromPath = parts[parts.length - 1];
      setFileId(idFromPath);
    }
  }, []);

  useEffect(() => {
    if (!fileId || !token) {
      console.log("Waiting for fileId or token...");
      return;
    }

    const fetchFile = async () => {
      try {
        console.log(`Fetching file with ID: ${fileId}`);
        const res = await fetch(
          `http://localhost:4000/files/single/${fileId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error(`Failed to fetch file: ${res.status}`);
        const data = await res.json();
        console.log("File fetched:", data);
        if (!gotSocketUpdate) {
          setText(data.content || "");
        }

        setTitle(data.title || "Untitled");
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
      console.log("code upadte listen", content);
      setText(content);
      gotSocketUpdate = true;
    });

    socket.on("cursor_update", ({ userId, position, userName }) => {
      console.log(
        "cursor update upadte listen",
        position,
        userId,
        color,
        userName
      );
      setCursors(prev => {
        const filtered = prev.filter(c => c.userId !== userId);
        return [...filtered, { userId, position, color, userName }];
      });
    });

    socket.on("user_joined", ({ userId }) => {
      console.log("user joined", userId);
      setUsers(prev => [...new Set([...prev, userId])]);
    });

    socket.on("user_left", ({ userId }) => {
      console.log("user left", userId);
      setUsers(prev => prev.filter(id => id !== userId));
      setCursors(prev => prev.filter(c => c.userId !== userId));
    });

    return () => {
      socket.off("code_update");
      socket.off("cursor_update");
      socket.off("user_joined");
      socket.off("user_left");
    };
  }, [socket, fileId, userId]);

  // ✅ Handle text changes and broadcast
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);

    if (fileId) {
      socket.emit("code_change", {
        roomId: Number(fileId),
        userId,
        content: newText,
      });
    }
  };
  const handleCursorMove = () => {
    const pos = textareaRef.current?.selectionStart || 0;
    socket.emit("cursor_move", {
      roomId: Number(fileId),
      userId,
      position: pos,
      userName: userInfo.firstName,
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex justify-between items-center bg-white shadow px-6 py-3">
        <h2 className="text-xl font-semibold">{title || "Loading..."}</h2>
        <div className="text-sm text-gray-600">
          Users Online: {users.length}
        </div>
      </div>

      <div className="flex-1 p-4 relative">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onSelect={handleCursorMove}
          onKeyUp={handleCursorMove}
          className="w-full h-full p-4 text-lg border rounded-lg shadow focus:outline-none"
          placeholder="Start typing here..."
        />
        {/* Cursor Indicators */}
        {cursors.map(cursor => {
          const position = cursor.position || 0;
          const beforeText = text.slice(0, position);
          const lines = beforeText.split("\n");
          const top = (lines.length - 1) * 34;
          const left = lines[lines.length - 1].length * 10;

          return (
            <div key={cursor.userId} className="absolute" style={{ top, left }}>
              <div
                style={{
                  backgroundColor: cursor.color,
                  width: "2px",
                  height: "24px",
                  position: "absolute",
                }}
              ></div>
              <span
                style={{
                  position: "absolute",
                  top: "-20px",
                  left: "0",
                  backgroundColor: cursor.color,
                  color: "#fff",
                  padding: "2px 4px",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
              >
                {cursor.userName}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
function getRandomColor() {
  const colors = ["#e41c44", "#107569", "#ff9900", "#007bff", "#6f42c1"];
  return colors[Math.floor(Math.random() * colors.length)];
}
