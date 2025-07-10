import { useUserContext } from "@/store/context/AuthContext";
import { useSocket } from "@/store/context/SocketContext";
import React, { useEffect } from "react";

export default function Notification() {
  const socket = useSocket();
  const { user } = useUserContext();
  const { projects, _id } = user;
  useEffect(() => {
    if (!socket || !_id) return;
    console.log(_id);

    const joinRooms = () => {
      console.log("Đang join lại các room khi (tái)kết nối...");
      projects.forEach((item) =>
        socket.emit("joinProjectRoom", { roomId: item })
      );
      socket.emit("joinProjectRoom", { roomId: _id });
    };

    // 1. Join room ngay lập tức khi có thể
    joinRooms();

    // 2. Thiết lập listener để nhận thông báo
    socket.on("notification", (data) =>
      console.log("Đã nhận notification:", data)
    );
    // 3. Thiết lập listener để TỰ ĐỘNG JOIN LẠI khi có kết nối lại
    socket.on("connect", joinRooms);

    // 4. Dọn dẹp
    return () => {
      socket.off("notification");
      socket.off("connect", joinRooms); // Phải gỡ cả listener này
    };
  }, [socket, projects, _id]);
  return <div>Notification</div>;
}
