import { useUserContext } from "@/store/context/AuthContext";
import { useSocket } from "@/store/context/SocketContext";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { fetchPrivateData } from "@/utils/fetcher/fetch-api";
import { Headers, HttpStatus } from "@/constant/constant";
import { toast } from "sonner";

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
  const handleJoinProject = async (data: NotificationData) => {
    const { projectId, teamNumber, role } = data;
    const res = await fetchPrivateData(`steam/access-steam-project`, {
      method: "POST",
      body: JSON.stringify({ projectId, teamNumber, role }),
      headers: Headers,
    });

    if (res.status !== HttpStatus.OK) {
      toast.error("Đã xảy ra lỗi khi tham gia dự án.");
      return;
    }

    toast.success("Tham gia dự án thành công!");
    // Cập nhật lại danh sách notifications sau khi tham gia dự án
    setNotifications((prevNotifications) =>
      prevNotifications.filter(
        (notification) =>
          notification.projectId !== projectId &&
          notification.teamNumber !== teamNumber
      )
    );
    // Có thể thêm logic để chuyển hướng người dùng đến trang dự án hoặc cập nhật giao diện
  };
  return (
    <div className="w-fit min-h-32 p-4">
      <h3 className="text-lg font-bold mb-2">
        Thông báo ({notifications.length})
      </h3>
      {notifications.length > 0 ? (
        <div className="flex flex-col-reverse">
          {notifications.map((item, index) => (
            <div
              key={index}
              className="p-2 border-b border-gray-300 flex items-center gap-5"
            >
              <p className="font-semibold">{item.message}</p>
              <Button onClick={() => handleJoinProject(item)}>Tham gia</Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Chưa có thông báo nào.</p>
      )}
    </div>
  );
}
