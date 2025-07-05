// Hàm setup() chỉ chạy một lần khi board Arduino khởi động hoặc được reset
void setup() {
 // Khởi tạo giao tiếp Serial với tốc độ 9600 bits mỗi giây (bps)
 // Đây là tốc độ phổ biến nhất
 Serial.begin(9600);
}

// Hàm loop() sẽ chạy lặp đi lặp lại mãi mãi sau khi hàm setup() hoàn thành
void loop() {
 // In dòng chữ "Hello, World!" ra Serial Monitor,
 // println sẽ tự động thêm một ký tự xuống dòng ở cuối
 Serial.println("Hello, World!");

 // Dừng chương trình trong 1000 mili giây (tương đương 1 giây)
 delay(1000);
}