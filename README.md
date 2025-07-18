# 🚀 Arduino Development Studio

Hệ thống phát triển Arduino toàn diện với **nạp firmware AVRDUDE** và **Serial Monitor realtime**.

## ✨ Tính năng

### 🔧 Firmware Uploader
- ✅ **Biên dịch code Arduino** thành file hex
- ✅ **Nạp firmware** sử dụng AVRDUDE (chuẩn và ổn định)
- ✅ **Hỗ trợ nhiều board**: Arduino Uno, Mega, ESP8266, ESP32
- ✅ **Giao diện web** thân thiện
- ✅ **Log chi tiết** quá trình nạp
- ✅ **Tự động xử lý bootloader** - không cần nhấn RESET

### 📡 Serial Monitor
- ✅ **Kết nối Serial realtime** với Arduino
- ✅ **Hiển thị dữ liệu** với timestamp
- ✅ **Gửi dữ liệu** đến Arduino
- ✅ **Auto-scroll** và **debounced updates**
- ✅ **Hỗ trợ nhiều baud rate**: 9600, 19200, 38400, 57600, 115200, 230400, 460800, 921600
- ✅ **Tối ưu hiệu suất** với polling 200ms và giới hạn 2000 dòng

### 🧪 API Testing
- ✅ **Test API Serial Monitor** trực tiếp từ giao diện
- ✅ **Kiểm tra kết nối** và **debug** dễ dàng

## 🏗️ Kiến trúc

```
Frontend (Next.js) → Backend (NestJS) → AVRDUDE/SerialPort → Arduino
     Port 3101           Port 3001
```

## 🚀 Cách sử dụng

### 1. Khởi động hệ thống

```bash
# Terminal 1: Backend
cd backend-nestjs
npm install
npm run start:dev

# Terminal 2: Frontend  
cd frontend-nextjs
npm install
npm run dev
```

### 2. Truy cập giao diện

Mở trình duyệt: `http://localhost:3101/arduino-uploader`

### 3. Sử dụng các tính năng

#### 🔧 Firmware Uploader Tab
1. **Chọn board** Arduino của bạn
2. **Nhập code** Arduino vào editor
3. **Biên dịch** code thành firmware
4. **Chọn port** Arduino (thường là `/dev/ttyUSB0`)
5. **Nạp firmware** bằng AVRDUDE

#### 📡 Serial Monitor Tab
1. **Chọn port** Arduino đã kết nối
2. **Chọn baud rate** (thường là 9600)
3. **Kết nối** Serial Monitor
4. **Xem dữ liệu realtime** từ Arduino
5. **Gửi dữ liệu** đến Arduino

#### 🧪 API Test Tab
1. **Test kết nối** Serial Monitor
2. **Kiểm tra API** endpoints
3. **Debug** các vấn đề kết nối

## 📋 Yêu cầu hệ thống

### Backend (Linux)
- Node.js 18+
- AVRDUDE đã cài đặt
- Quyền truy cập port USB
- Thư viện `serialport` cho Serial Monitor

### Frontend
- Node.js 18+
- Trình duyệt hiện đại

## 🔧 Cài đặt dependencies

```bash
# Ubuntu/Debian - AVRDUDE
sudo apt update
sudo apt install avrdude

# Kiểm tra cài đặt
avrdude -v

# Backend dependencies
cd backend-nestjs
npm install serialport
```

## 📁 Cấu trúc dự án

```
smart-practice/
├── backend-nestjs/          # Backend NestJS
│   ├── src/arduino/        # Module Arduino & Serial Monitor
│   ├── builds/             # Thư mục lưu firmware
│   └── arduino-cli         # Arduino CLI
├── frontend-nextjs/        # Frontend Next.js
│   ├── src/components/arduino/
│   │   ├── ArduinoUploader.tsx    # Component nạp firmware
│   │   ├── SerialMonitor.tsx      # Component Serial Monitor
│   │   └── SerialTest.tsx         # Component test API
│   └── src/app/(container)/arduino-uploader/
│       └── page.tsx               # Trang chính với tabs
└── nginx/                  # Reverse proxy
```

## 🔌 Các board được hỗ trợ

| Board | FQBN | Protocol | Baud Rate |
|-------|------|----------|-----------|
| Arduino Uno | `arduino:avr:uno` | STK500v1 | 115200 |
| Arduino Mega | `arduino:avr:mega` | STK500v1 | 115200 |
| NodeMCU ESP8266 | `esp8266:esp8266:nodemcuv2` | ESP8266 | 115200 |
| ESP32 DevKit | `esp32:esp32:esp32` | ESP32 | 115200 |

## 📡 Serial Monitor Features

### Tối ưu hiệu suất
- **Polling interval**: 200ms để giảm tải server
- **Batch updates**: Tránh re-render liên tục
- **Memory management**: Tự động giữ tối đa 2000 dòng dữ liệu
- **Debounced scroll**: Tránh lag khi scroll

### Giao diện thông minh
- **Auto-scroll**: Tự động cuộn xuống dòng mới
- **Real-time status**: Hiển thị trạng thái kết nối
- **Port detection**: Tự động phát hiện port đã kết nối
- **Error handling**: Xử lý lỗi và hiển thị thông báo

## 🐛 Xử lý lỗi thường gặp

### Lỗi "Device or resource busy"
```bash
# Kiểm tra process chiếm port
sudo lsof /dev/ttyUSB0

# Kill process
sudo kill -9 <PID>
```

### Lỗi "Permission denied"
```bash
# Thêm user vào group dialout
sudo usermod -a -G dialout $USER

# Logout và login lại
```

### Lỗi Serial Monitor không kết nối
- Kiểm tra Arduino đã cắm đúng port
- Thử port khác: `/dev/ttyACM0`, `/dev/ttyUSB1`
- Kiểm tra baud rate khớp với code Arduino
- Restart backend nếu cần

### Lỗi "avrdude done" nhưng backend báo lỗi
- Backend đã được cập nhật để xử lý đúng output của avrdude
- Kiểm tra log backend để debug
- Restart backend nếu cần

## 📝 API Endpoints

### Backend (Port 3001)

#### Firmware Uploader
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/arduino/boards` | Lấy danh sách board |
| POST | `/api/arduino/builds` | Biên dịch code |
| GET | `/api/arduino/builds/:id/hex` | Tải file hex |
| POST | `/api/arduino/upload` | Nạp firmware |

#### Serial Monitor
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/arduino/serial/connect` | Kết nối Serial Monitor |
| DELETE | `/api/arduino/serial/disconnect` | Ngắt kết nối Serial |
| POST | `/api/arduino/serial/send` | Gửi dữ liệu |
| GET | `/api/arduino/serial/data/:port` | Lấy dữ liệu realtime |
| GET | `/api/arduino/serial/connected` | Lấy danh sách port đã kết nối |

### Frontend (Port 3101)
- Proxy `/api/*` → `http://localhost:3001/api/*`

## 🎯 Ưu điểm của hệ thống

### AVRDUDE
- ✅ **Chuẩn công nghiệp** - được sử dụng rộng rãi
- ✅ **Tự động xử lý bootloader** - không cần nhấn RESET
- ✅ **Xác minh firmware** sau khi nạp
- ✅ **Hỗ trợ mọi board Arduino**
- ✅ **Log chi tiết** và debug dễ dàng
- ✅ **Không xung đột port** với ứng dụng khác

### Serial Monitor
- ✅ **Realtime data** - dữ liệu realtime từ Arduino
- ✅ **Multi-port support** - hỗ trợ nhiều port cùng lúc
- ✅ **Performance optimized** - tối ưu hiệu suất
- ✅ **User-friendly** - giao diện thân thiện
- ✅ **Error handling** - xử lý lỗi tốt

## 🔄 Luồng hoạt động

### Firmware Upload
1. **User nhập code** → Frontend
2. **Frontend gửi code** → Backend
3. **Backend biên dịch** → Arduino CLI
4. **Tạo file hex** → Lưu trong `/builds/`
5. **User chọn port** → Frontend
6. **Frontend gọi API** → Backend
7. **Backend chạy AVRDUDE** → Nạp firmware
8. **Trả về kết quả** → Frontend hiển thị

### Serial Monitor
1. **User chọn port** → Frontend
2. **Frontend gọi API connect** → Backend
3. **Backend mở SerialPort** → Kết nối Arduino
4. **Backend nhận dữ liệu** → Lưu vào buffer
5. **Frontend polling** → Lấy dữ liệu mới
6. **Frontend hiển thị** → Realtime data

## 🎉 Kết quả

Hệ thống đã được **hoàn thiện** với đầy đủ tính năng:
- ✅ **Firmware Uploader** với AVRDUDE (ổn định)
- ✅ **Serial Monitor** realtime (hiệu suất cao)
- ✅ **API Testing** (debug dễ dàng)
- ✅ **Giao diện thống nhất** với tabs
- ✅ **Tối ưu hiệu suất** và **memory management**
- ✅ **Error handling** toàn diện

---

**🎯 Mục tiêu đạt được**: Hệ thống phát triển Arduino hoàn chỉnh với nạp firmware và Serial Monitor realtime! 