import { useUserContext } from "@/store/context/AuthContext";
import { useSocket } from "@/store/context/SocketContext";
import React, { useEffect, useState } from "react";

import { PiBellRinging } from "react-icons/pi";
import NotificationContent from "./NotificationContent";
// Bạn nên định nghĩa type này ở một file riêng (ví dụ: types/CustomType.ts)
// và import vào thay vì định nghĩa ở cuối file.
export type NotificationData = {
  message: string;
  // Thêm các thuộc tính khác nếu có
  projectId: string;
  notificationId: string;
  link: string;
  type: string;
  // Thêm các thuộc tính khác của notification nếu có
  teamNumber?: string; // Nếu có thể là undefined
  role: string;
};

export default function Notification() {
  const socket = useSocket();
  const { user } = useUserContext();
  const { projects, _id } = user;
  const [isOpenNotification, setOpenNotification] = useState(false);
  const [notifications, setNotifications] = useState<Array<NotificationData>>(
    [],
  );

  // DEBUG: Đặt console.log ở đây để xem giá trị mới mỗi khi component re-render
  console.log("Current notifications state:", notifications);

  useEffect(() => {
    // Guard clause: Chỉ chạy khi có đủ thông tin cần thiết
    if (!socket || !_id) return;

    // --- Logic để join room ---
    const joinRooms = () => {
      console.log("Joining rooms for user:", _id);
      if (projects && projects.length > 0) {
        projects.forEach((item) =>
          socket.emit("joinProjectRoom", { roomId: item }),
        );
      }
      socket.emit("joinProjectRoom", { roomId: _id });
    };

    // --- Logic xử lý khi có notification mới ---
    // 1. Định nghĩa hàm xử lý listener ở một biến riêng
    const handleNotification = (data: NotificationData) => {
      console.log("Received new notification data:", data);
      // Sử dụng functional update, cách này của bạn đã đúng và rất tốt!
      // Nó đảm bảo luôn lấy được state mới nhất để cập nhật.
      setNotifications((prevNotifications) => [data, ...prevNotifications]);
    };

    // Join room ngay khi component mount hoặc dependencies thay đổi
    joinRooms();

    // 2. Gắn listener bằng hàm đã định nghĩa
    socket.on("notification", handleNotification);

    // Tự động join lại khi có kết nối lại (reconnect)
    socket.on("connect", joinRooms);

    // 3. Dọn dẹp: Luôn gỡ đúng hàm listener đã gắn vào
    return () => {
      console.log("Cleaning up listeners...");
      socket.off("notification", handleNotification);
      socket.off("connect", joinRooms);
    };
  }, [socket, projects, _id]); // Dependencies đã chính xác

  return (
    <div className="relative w-fit">
      <h3
        className="w-fit cursor-pointer rounded-full p-2 text-lg font-bold hover:bg-[#eee]"
        onClick={() => setOpenNotification(!isOpenNotification)}
      >
        <PiBellRinging className="text-2xl" />
        {notifications?.length > 0 && (
          <span className="absolute right-1 bottom-2 flex size-3.5 items-center justify-center rounded-full bg-red-500 p-1.5 text-[12px] font-normal text-white">
            {notifications.length}
          </span>
        )}
      </h3>
      {isOpenNotification && (
        <div className="absolute top-10 right-0 -bottom-9 flex min-h-64 w-[450px] items-start overflow-y-auto rounded border bg-white shadow">
          <NotificationContent
            notifications={notifications}
            setNotifications={setNotifications}
            setOpenNotification={setOpenNotification}
          />
        </div>
      )}
    </div>
  );
}
