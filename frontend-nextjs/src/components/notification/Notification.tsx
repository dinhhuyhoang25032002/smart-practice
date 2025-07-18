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
    []
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
          socket.emit("joinProjectRoom", { roomId: item })
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
    <div className="w-fit  relative">
      <h3
        className="text-lg font-bold cursor-pointer w-fit hover:bg-[#eee] p-2 rounded-full"
        onClick={() => setOpenNotification(!isOpenNotification)}
      >
        <PiBellRinging className="text-2xl " />
        {/* <span className="absolute right-0 bottom-0 size-3 text-white p-1 flex justify-center items-center font-normal bg-red-500 rounded-full">
          {notifications.length}
        </span> */}
      </h3>
      {isOpenNotification && (
        <div className="absolute -bottom-9 right-0  bg-white w-96 min-h-32 top-10 flex justify-center items-center rounded shadow border ">
          <NotificationContent
            notifications={notifications}
            setNotifications={setNotifications}
          />
        </div>
      )}
    </div>
  );
}
