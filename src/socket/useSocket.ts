// import { useEffect } from "react";
// import { initSocket } from "./socket";

// type CodeUpdateHandler = (content: string) => void;
// type CursorUpdateHandler = (data: { userId: number; position: number }) => void;

// export const useSocket = (
//   roomId: number,
//   userId: number,
//   onCodeUpdate: CodeUpdateHandler,
//   onCursorUpdate: CursorUpdateHandler
// ) => {
//   useEffect(() => {
//     const socket = initSocket();

//     socket.on("connect", () => {
//       socket.emit("joinRoom", { roomId, userId });
//     });

//     socket.on("code-update", payload => {
//       onCodeUpdate(payload.content);
//     });

//     socket.on("cursor-update", payload => {
//       onCursorUpdate(payload);
//     });

//     socket.on("user-joined", payload => {
//       console.log("User joined:", payload);
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, [roomId, userId, onCodeUpdate, onCursorUpdate]);
// };
