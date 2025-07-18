// Ví dụ code Arduino để test Serial Monitor
// Code này sẽ in "Hello World!" mỗi giây và phản hồi khi nhận được dữ liệu

void setup() {
  // Khởi tạo Serial với baud rate 9600
  Serial.begin(9600);
  
  // Đợi Serial sẵn sàng
  while (!Serial) {
    ; // Đợi cho đến khi Serial sẵn sàng
  }
  
  // In thông báo khởi động
  Serial.println("Arduino Serial Monitor Test");
  Serial.println("==========================");
  Serial.println("Arduino đã sẵn sàng nhận và gửi dữ liệu!");
  Serial.println("Gửi bất kỳ dữ liệu nào để Arduino sẽ phản hồi.");
  Serial.println();
}

void loop() {
  // In "Hello World!" mỗi giây
  Serial.print("Hello World! - Thời gian: ");
  Serial.println(millis());
  
  // Kiểm tra xem có dữ liệu từ Serial Monitor không
  if (Serial.available() > 0) {
    // Đọc dữ liệu từ Serial
    String receivedData = Serial.readStringUntil('\n');
    receivedData.trim(); // Loại bỏ khoảng trắng và ký tự xuống dòng
    
    // Phản hồi lại
    Serial.print("Arduino nhận được: \"");
    Serial.print(receivedData);
    Serial.println("\"");
    
    // Xử lý một số lệnh đặc biệt
    if (receivedData.equalsIgnoreCase("led_on")) {
      Serial.println("Bật LED (nếu có)");
    } else if (receivedData.equalsIgnoreCase("led_off")) {
      Serial.println("Tắt LED (nếu có)");
    } else if (receivedData.equalsIgnoreCase("status")) {
      Serial.println("Trạng thái Arduino: Hoạt động bình thường");
      Serial.print("Uptime: ");
      Serial.print(millis() / 1000);
      Serial.println(" giây");
    } else if (receivedData.equalsIgnoreCase("help")) {
      Serial.println("Các lệnh có sẵn:");
      Serial.println("- led_on: Bật LED");
      Serial.println("- led_off: Tắt LED");
      Serial.println("- status: Xem trạng thái");
      Serial.println("- help: Hiển thị trợ giúp");
    } else {
      Serial.print("Echo: ");
      Serial.println(receivedData);
    }
    
    Serial.println(); // Dòng trống để dễ đọc
  }
  
  // Đợi 1 giây trước khi lặp lại
  delay(1000);
} 