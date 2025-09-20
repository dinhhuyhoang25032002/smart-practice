// src/context/SocketContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import { handleGetUserInfor } from "../localStorage";

// Hàm lấy token từ localStorage hoặc cookie

// Định nghĩa kiểu cho context, có thể là Socket hoặc undefined
const SocketContext = createContext<Socket | undefined>(undefined);

// Hook tiện lợi để sử dụng context
export const useSocket = (): Socket | undefined => useContext(SocketContext);

// Định nghĩa kiểu props cho Provider
interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | undefined>(undefined);

  useEffect(() => {
    const { act } = handleGetUserInfor();
    console.log(act);

    if (act) {
      const newSocket = io("http://localhost:3001/notification", {
        auth: {
          token: `Bearer ${act}`, // hoặc chỉ token tuỳ backend xử lý
        },
      });

      newSocket.on("connect", () => {
        console.log("Connected to WebSocket server with ID:", newSocket.id);
      });

      newSocket.on("connect_error", (err) => {
        console.error("Connection failed:", err.message);
        // Xử lý lỗi xác thực, ví dụ logout hoặc thông báo người dùng
      });

      setSocket(newSocket);

      // Cleanup khi component unmount hoặc token thay đổi
      return () => {
        newSocket.close();
      };
    }
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
