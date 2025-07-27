import { io, Socket } from "socket.io-client";

// Define the type for our custom events
interface ServerToClientEvents {
  code_update: (data: { userId: number; content: string }) => void;
  cursor_update: (data: {
    userId: number;
    position: {
      lineNumber: number;
      column: number;
    };
    color: string;
    userName: string;
  }) => void;
  user_joined: (data: { userId: number; usersCount: number }) => void;
  user_left: (data: { userId: number; usersLeft: number }) => void;
}

interface ClientToServerEvents {
  register_user: (data: { email: string }) => void;
  joinRoom: (data: { roomId: number; userId: number }) => void;
  code_change: (data: {
    roomId: number;
    userId: number;
    content: string;
  }) => void;
  cursor_move: (data: {
    roomId: number;
    userId: number;
    position: {
      lineNumber: number;
      column: number;
    };
    userName: string;
  }) => void;
}

let socket: Socket<ServerToClientEvents, ClientToServerEvents>;

export const initializeSocket = (): Socket<
  ServerToClientEvents,
  ClientToServerEvents
> => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      transports: ["websocket"],
      // reconnectionAttempts: 3,
    });

    socket.on("connect", () => {});

    socket.on("disconnect", () => {});
  }
  return socket;
};

export default initializeSocket;
