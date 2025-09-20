// "use client";

// import React, { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { Badge } from "@/components/ui/badge";
// import {
//   Loader2,
//   Upload,
//   Code,
//   Cpu,
//   Wifi,
// } from "lucide-react";
// import { toast } from "sonner";

// // Types
// interface BoardInfo {
//   fqbn: string;
//   name: string;
//   baudRate: number;
//   protocol: string;
// }

// interface BuildInfo {
//   buildId: string;
//   boardInfo: {
//     name: string;
//     fqbn: string;
//     baudRate: number;
//     protocol: string;
//     hexExtension: string;
//   };
//   fileInfo: {
//     fileName: string;
//     fileSize: number;
//     downloadUrl: string;
//   };
// }

// // Board icons mapping
// const BOARD_ICONS: Record<string, React.ReactNode> = {
//   "arduino:avr:uno": <Cpu className="h-4 w-4" />,
//   "arduino:avr:mega": <Cpu className="h-4 w-4" />,
//   "esp8266:esp8266:nodemcuv2": <Wifi className="h-4 w-4" />,
//   "esp32:esp32:esp32": <Wifi className="h-4 w-4" />,
// };

// // Board color mapping
// const BOARD_COLORS: Record<string, string> = {
//   "arduino:avr:uno": "bg-blue-100 text-blue-800",
//   "arduino:avr:mega": "bg-blue-100 text-blue-800",
//   "esp8266:esp8266:nodemcuv2": "bg-orange-100 text-orange-800",
//   "esp32:esp32:esp32": "bg-green-100 text-green-800",
// };

// export default function ArduinoUploader() {
//   // States cho Firmware Uploader
//   const [boards, setBoards] = useState<BoardInfo[]>([]);
//   const [selectedBoard, setSelectedBoard] = useState<string>("");
//   const [arduinoCode, setArduinoCode] = useState<string>("");
//   const [isCompiling, setIsCompiling] = useState(false);
//   const [currentBuild, setCurrentBuild] = useState<BuildInfo | null>(null);
//   const [logs, setLogs] = useState<string[]>([]);

//   // Load supported boards on mount
//   useEffect(() => {
//     loadSupportedBoards();
//   }, []);

//   // Helper functions
//   const addLog = (message: string) => {
//     const timestamp = new Date().toLocaleTimeString();
//     setLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
//   };

//   // API functions cho Firmware Uploader
//   const loadSupportedBoards = async () => {
//     try {
//       const response = await fetch("/api/arduino/boards");
//       const data = await response.json();
//       if (data.success) {
//         setBoards(data.boards);
//         if (data.boards.length > 0) {
//           setSelectedBoard(data.boards[0].fqbn);
//         }
//       }
//     } catch (error) {
//       toast.error("Không thể tải danh sách board");
//       addLog("Lỗi khi tải danh sách board: " + error);
//     }
//   };

//   const compileCode = async () => {
//     if (!selectedBoard || !arduinoCode.trim()) {
//       toast.error("Vui lòng chọn board và nhập code");
//       return;
//     }

//     setIsCompiling(true);
//     addLog("Bắt đầu biên dịch code...");

//     try {
//       const response = await fetch("/api/arduino/builds", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           code: arduinoCode,
//           board: selectedBoard,
//         }),
//       });

//       const data = await response.json();

//       if (data.success) {
//         setCurrentBuild(data);
//         addLog(`Biên dịch thành công! Build ID: ${data.buildId}`);
//         addLog(
//           `File: ${data.fileInfo.fileName} (${(data.fileInfo.fileSize / 1024).toFixed(1)} KB)`,
//         );
//         toast.success("Biên dịch thành công!");
//       } else {
//         throw new Error(data.message || "Lỗi biên dịch");
//       }
//     } catch (error: any) {
//       addLog("Lỗi biên dịch: " + error.message);
//       toast.error("Lỗi biên dịch: " + error.message);
//     } finally {
//       setIsCompiling(false);
//     }
//   };

//   // Sau khi biên dịch thành công, hiển thị nút tải file hex/bin về
//   // Thêm nút 'Nạp Firmware qua WebSerial' cho phép chọn file hex và nạp trực tiếp qua WebSerial API
//   // Xóa toàn bộ logic upload firmware qua backend

//   return (
//     <div className="mx-auto max-w-6xl space-y-6 p-6">
//       <div className="text-center">
//         <h1 className="mb-2 text-3xl font-bold">Arduino Firmware Uploader</h1>
//         <p className="text-gray-600">
//           Nạp firmware trực tiếp từ trình duyệt web sử dụng AVRDUDE
//         </p>
//       </div>

//       <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
//         {/* Code Editor */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Code className="h-5 w-5" />
//               Code Editor
//             </CardTitle>
//             <CardDescription>Nhập code Arduino của bạn</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div>
//               <label className="mb-2 block text-sm font-medium">
//                 Chọn Board:
//               </label>
//               <Select
//                 value={selectedBoard}
//                 onValueChange={(value) => {
//                   setSelectedBoard(value);
//                 }}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Chọn board" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {boards.map((board) => (
//                     <SelectItem key={board.fqbn} value={board.fqbn}>
//                       <div className="flex items-center gap-2">
//                         {BOARD_ICONS[board.fqbn]}
//                         {board.name}
//                         <Badge variant="outline" className="ml-auto">
//                           {board.protocol}
//                         </Badge>
//                       </div>
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <label className="mb-2 block text-sm font-medium">
//                 Arduino Code:
//               </label>
//               <Textarea
//                 value={arduinoCode}
//                 onChange={(e) => setArduinoCode(e.target.value)}
//                 placeholder='void setup() {&#10;  Serial.begin(9600);&#10;}&#10;&#10;void loop() {&#10;  Serial.println("Hello World!");&#10;  delay(1000);&#10;}'
//                 rows={15}
//                 className="font-mono text-sm"
//               />
//             </div>

//             <Button
//               onClick={compileCode}
//               disabled={isCompiling || !selectedBoard || !arduinoCode.trim()}
//               className="w-full"
//             >
//               {isCompiling ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Đang biên dịch...
//                 </>
//               ) : (
//                 <>
//                   <Code className="mr-2 h-4 w-4" />
//                   Biên dịch Code
//                 </>
//               )}
//             </Button>
//           </CardContent>
//         </Card>

//         {/* Upload Panel */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Upload className="h-5 w-5" />
//               Upload Firmware
//             </CardTitle>
//             <CardDescription>Nạp firmware sử dụng AVRDUDE</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {/* Build Info */}
//             {currentBuild && (
//               <div className="mt-4 flex flex-col gap-2">
//                 <a
//                   href={currentBuild.fileInfo.downloadUrl}
//                   download={currentBuild.fileInfo.fileName}
//                   style={{
//                     padding: "8px 16px",
//                     background: "#2563eb",
//                     color: "#fff",
//                     borderRadius: 4,
//                     textAlign: "center",
//                     textDecoration: "none",
//                     display: "inline-block",
//                     marginBottom: 8,
//                   }}
//                 >
//                   Tải file {currentBuild.fileInfo.fileName}
//                 </a>
//                 <WebSerialUploader hexUrl={currentBuild.fileInfo.downloadUrl} />
//               </div>
//             )}

//             {/* Logs */}
//             <div className="space-y-2">
//               <label className="block text-sm font-medium">Log:</label>
//               <div className="h-64 overflow-y-auto rounded-md bg-gray-100 p-3 font-mono text-sm">
//                 {logs.length === 0 ? (
//                   <span className="text-gray-500">Chưa có log...</span>
//                 ) : (
//                   logs.map((log, index) => (
//                     <div key={index} className="mb-1">
//                       {log}
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

// function WebSerialUploader({ hexUrl }: { hexUrl: string }) {
//   const [log, setLog] = useState<string[]>([]);
//   const [isUploading, setIsUploading] = useState(false);
//   const [progress, setProgress] = useState(0);

//   const addLog = (msg: string) => {
//     setLog((l) => [...l, `[${new Date().toLocaleTimeString()}] ${msg}`]);
//     console.log('[WebSerialUploader]', msg);
//   };

//   const handleUpload = async () => {
//     try {
//       setIsUploading(true);
//       setProgress(0);
//       addLog(`Bắt đầu fetch file hex: ${hexUrl}`);
//       console.log('[WebSerialUploader] [START] Người dùng nhấn nút nạp code');
//       const res = await fetch(hexUrl);
//       if (!res.ok) {
//         addLog(`Lỗi fetch file hex: HTTP ${res.status}`);
//         console.log('[WebSerialUploader] Lỗi fetch file hex:', res.status);
//         throw new Error(`Không thể tải file hex: HTTP ${res.status}`);
//       }
//       addLog('Đã fetch file hex thành công.');
//       console.log('[WebSerialUploader] Đã fetch file hex thành công.');
//       const hexContent = await res.text();
//       addLog('Đã nhận nội dung file hex, bắt đầu chọn cổng USB...');
//       console.log('[WebSerialUploader] Đã nhận nội dung file hex, bắt đầu chọn cổng USB...');
//       // Yêu cầu chọn cổng serial
//       // @ts-ignore
//       const port = await navigator.serial.requestPort();
//       console.log('[WebSerialUploader] Đã chọn cổng USB thành công:', port);
//       await port.open({ baudRate: 115200 });
//       addLog('Đã mở cổng serial, bắt đầu nạp...');
//       console.log('[WebSerialUploader] Đã mở cổng serial, bắt đầu nạp...');
//       const writer = port.writable.getWriter();
//       const lines = hexContent.split("\n").filter((line) => line.trim());
//       for (let i = 0; i < lines.length; i++) {
//         if (i % 20 === 0) {
//           addLog(`Đã gửi ${i + 1}/${lines.length} dòng...`);
//           console.log(`[WebSerialUploader] Đã gửi ${i + 1}/${lines.length} dòng...`);
//         }
//         await writer.write(new TextEncoder().encode(lines[i] + "\n"));
//       }
//       writer.releaseLock();
//       await port.close();
//       addLog('Nạp firmware thành công!');
//       console.log('[WebSerialUploader] [DONE] Nạp firmware thành công!');
//       setProgress(100);
//     } catch (err: any) {
//       addLog('Lỗi: ' + err.message);
//       console.error('[WebSerialUploader] Lỗi:', err);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   return (
//     <div className="mt-2">
//       <button
//         style={{
//           padding: "8px 16px",
//           background: "#22c55e",
//           color: "#fff",
//           borderRadius: 4,
//           border: "none",
//           fontWeight: 600,
//           fontSize: 16,
//         }}
//         onClick={handleUpload}
//         disabled={isUploading}
//       >
//         {isUploading
//           ? "Đang nạp firmware..."
//           : "Nạp Firmware qua WebSerial (trực tiếp từ trình duyệt)"}
//       </button>
//       <div className="mt-2">Tiến trình: {progress}%</div>
//       <div className="mt-2 h-32 overflow-y-auto rounded bg-gray-100 p-2 text-xs">
//         {log.map((l, i) => (
//           <div key={i}>{l}</div>
//         ))}
//       </div>
//     </div>
//   );
// }
