// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Loader2, Wifi, WifiOff, Send, RefreshCw, Trash2, Play, Square } from "lucide-react";
// import { toast } from "sonner";

// interface SerialData {
//   timestamp: string;
//   data: string;
// }

// export default function SerialMonitor() {
//   // States
//   const [availablePorts, setAvailablePorts] = useState<string[]>([]);
//   const [selectedPort, setSelectedPort] = useState<string>('');
//   const [baudRate, setBaudRate] = useState<number>(9600);
//   const [isConnected, setIsConnected] = useState(false);
//   const [isConnecting, setIsConnecting] = useState(false);
//   const [serialData, setSerialData] = useState<SerialData[]>([]);
//   const [inputData, setInputData] = useState('');
//   const [isSending, setIsSending] = useState(false);
//   const [isPolling, setIsPolling] = useState(false);
//   const [connectedPorts, setConnectedPorts] = useState<string[]>([]);
//   const [lastDataLength, setLastDataLength] = useState<number>(0);
  
//   const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
//   const dataEndRef = useRef<HTMLDivElement>(null);
//   const lastUpdateRef = useRef<number>(0);
//   const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

//   // Baud rate options
//   const baudRateOptions = [9600, 19200, 38400, 57600, 115200, 230400, 460800, 921600];

//   // Load available ports on mount
//   useEffect(() => {
//     loadAvailablePorts();
//     loadConnectedPorts();
//   }, []);

//   // Auto-scroll to bottom when new data arrives
//   useEffect(() => {
//     if (serialData.length > lastDataLength) {
//       // Chỉ auto-scroll trong vùng dữ liệu serial, không scroll toàn trang
//       const container = dataEndRef.current?.parentElement;
//       if (container) {
//         const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 10;
//         if (isAtBottom) {
//           if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current);
//           updateTimeoutRef.current = setTimeout(() => {
//             container.scrollTop = container.scrollHeight; // Scroll vùng dữ liệu tới cuối
//             setLastDataLength(serialData.length);
//           }, 50);
//         }
//       }
//     }
//   }, [serialData, lastDataLength]);

//   // Cleanup polling on unmount
//   useEffect(() => {
//     return () => {
//       if (pollingIntervalRef.current) {
//         clearInterval(pollingIntervalRef.current);
//       }
//       if (updateTimeoutRef.current) {
//         clearTimeout(updateTimeoutRef.current);
//       }
//     };
//   }, []);

//   // Thêm useEffect để tự động polling khi đã kết nối
//   useEffect(() => {
//     if (isConnected && selectedPort) {
//       startPolling();
//     }
//     return stopPolling;
//   }, [isConnected, selectedPort]);

//   // Helper functions
//   const addLog = (message: string) => {
//     const timestamp = new Date().toLocaleTimeString();
//     setSerialData(prev => [...prev, { timestamp, data: message }]);
//   };

//   // API functions
//   const loadAvailablePorts = async () => {
//     try {
//       // Danh sách port phổ biến cho Arduino
//       const commonPorts = ['/dev/ttyUSB0', '/dev/ttyUSB1', '/dev/ttyACM0', '/dev/ttyACM1', 'COM1', 'COM2', 'COM3', 'COM4'];
//       setAvailablePorts(commonPorts);
//       if (commonPorts.length > 0) {
//         setSelectedPort(commonPorts[0]);
//       }
//     } catch (error) {
//       addLog("Không thể tải danh sách port: " + error);
//     }
//   };

//   const loadConnectedPorts = async () => {
//     try {
//       console.log('[Serial] Loading connected ports...');
//       const response = await fetch('/api/arduino/serial/connected');
//       const data = await response.json();
//       console.log('[Serial] Connected ports response:', data);
      
//       if (data.success) {
//         setConnectedPorts(data.ports);
//         console.log('[Serial] Connected ports:', data.ports);
        
//         // Kiểm tra xem port hiện tại có đang kết nối không
//         if (selectedPort && data.ports.includes(selectedPort)) {
//           console.log('[Serial] Port hiện tại đã được kết nối:', selectedPort);
//           setIsConnected(true);
//           startPolling();
//         } else {
//           console.log('[Serial] Port hiện tại chưa được kết nối:', selectedPort);
//         }
//       }
//     } catch (error) {
//       console.error('[Serial] Lỗi khi tải danh sách port đã kết nối:', error);
//     }
//   };

//   const connectSerial = async () => {
//     if (!selectedPort) {
//       toast.error("Vui lòng chọn port!");
//       return;
//     }

//     setIsConnecting(true);
//     addLog(`Đang kết nối Serial Monitor với port ${selectedPort} (${baudRate} baud)...`);
//     console.log('[Serial] Bắt đầu kết nối port:', selectedPort, 'baudRate:', baudRate);

//     try {
//       const response = await fetch('/api/arduino/serial/connect', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           port: selectedPort,
//           baudRate: baudRate,
//         }),
//       });

//       const data = await response.json();
//       console.log('[Serial] Kết quả kết nối:', data);

//       if (data.success) {
//         setIsConnected(true);
//         addLog(data.message);
//         toast.success("Kết nối Serial Monitor thành công!");
//         console.log('[Serial] Kết nối thành công, bắt đầu polling');
//         startPolling();
//         loadConnectedPorts();
//       } else {
//         throw new Error(data.message || "Lỗi kết nối");
//       }
//     } catch (error: any) {
//       addLog("Lỗi kết nối: " + error.message);
//       toast.error("Lỗi kết nối: " + error.message);
//       console.error('[Serial] Lỗi kết nối:', error);
//     } finally {
//       setIsConnecting(false);
//     }
//   };

//   const disconnectSerial = async () => {
//     if (!selectedPort) {
//       toast.error("Chưa chọn port!");
//       return;
//     }

//     addLog(`Đang ngắt kết nối Serial Monitor với port ${selectedPort}...`);

//     try {
//       const response = await fetch('/api/arduino/serial/disconnect', {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           port: selectedPort,
//         }),
//       });

//       const data = await response.json();

//       if (data.success) {
//         setIsConnected(false);
//         addLog(data.message);
//         toast.success("Ngắt kết nối thành công!");
//         stopPolling();
//         loadConnectedPorts();
//       } else {
//         throw new Error(data.message || "Lỗi ngắt kết nối");
//       }
//     } catch (error: any) {
//       addLog("Lỗi ngắt kết nối: " + error.message);
//       toast.error("Lỗi ngắt kết nối: " + error.message);
//     }
//   };

//   const sendData = async () => {
//     if (!inputData.trim()) {
//       toast.error("Vui lòng nhập dữ liệu để gửi!");
//       return;
//     }

//     if (!isConnected) {
//       toast.error("Chưa kết nối Serial Monitor!");
//       return;
//     }

//     setIsSending(true);
//     addLog(`Gửi: ${inputData}`);

//     try {
//       const response = await fetch('/api/arduino/serial/send', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           port: selectedPort,
//           data: inputData,
//         }),
//       });

//       const data = await response.json();

//       if (data.success) {
//         setInputData('');
//         addLog("Đã gửi dữ liệu thành công!");
//       } else {
//         throw new Error(data.message || "Lỗi gửi dữ liệu");
//       }
//     } catch (error: any) {
//       addLog("Lỗi gửi dữ liệu: " + error.message);
//       toast.error("Lỗi gửi dữ liệu: " + error.message);
//     } finally {
//       setIsSending(false);
//     }
//   };

//   const startPolling = () => {
//     if (pollingIntervalRef.current) {
//       clearInterval(pollingIntervalRef.current);
//     }

//     setIsPolling(true);
//     setLastDataLength(0);
//     lastUpdateRef.current = 0;
    
//     console.log('[Serial] Bắt đầu polling cho port:', selectedPort);

//     pollingIntervalRef.current = setInterval(async () => {
//       if (isConnected && selectedPort) {
//         try {
//           console.log('[Serial] Polling dữ liệu từ port:', selectedPort);
//           const response = await fetch(`/api/arduino/serial/data/${encodeURIComponent(selectedPort)}`);
//           const data = await response.json();
          
//           console.log('[Serial] Response:', data);
          
//           if (data.success && data.data.length > 0) {
//             console.log('[Serial] Có dữ liệu, length:', data.data.length, 'lastUpdate:', lastUpdateRef.current);
//             // Chỉ cập nhật nếu có dữ liệu mới
//             if (data.data.length > lastUpdateRef.current) {
//               const newData = data.data.slice(lastUpdateRef.current);
              
//               console.log('[Serial] Dữ liệu mới:', newData.length, 'dòng');
              
//               if (newData.length > 0) {
//                 const parsedData = newData.map((item: string) => {
//                   const match = item.match(/\[(.*?)\]\s*(.*)/);
//                   return {
//                     timestamp: match?.[1] || new Date().toLocaleTimeString(),
//                     data: match?.[2] || item
//                   };
//                 });
                
//                 console.log('[Serial] Parsed data:', parsedData);
                
//                 // Batch update để tránh re-render liên tục
//                 setSerialData(prev => {
//                   const newSerialData = [...prev, ...parsedData];
//                   // Giữ tối đa 2000 dòng để tránh memory leak
//                   if (newSerialData.length > 2000) {
//                     return newSerialData.slice(-2000);
//                   }
//                   return newSerialData;
//                 });
                
//                 lastUpdateRef.current = data.data.length;
//                 console.log('[Serial] Cập nhật lastUpdateRef thành:', lastUpdateRef.current);
//               }
//             }
//           }
//         } catch (error) {
//           console.error('[Serial] Lỗi khi polling dữ liệu:', error);
//         }
//       } else {
//         console.log('[Serial] Không polling - isConnected:', isConnected, 'selectedPort:', selectedPort);
//       }
//     }, 200); // Tăng lên 200ms để giảm tải
//   };

//   const stopPolling = () => {
//     if (pollingIntervalRef.current) {
//       clearInterval(pollingIntervalRef.current);
//       pollingIntervalRef.current = null;
//     }
//     setIsPolling(false);
//     setLastDataLength(0);
//     lastUpdateRef.current = 0;
//   };

//   const clearData = () => {
//     setSerialData([]);
//     setLastDataLength(0);
//     lastUpdateRef.current = 0;
//     addLog("Đã xóa dữ liệu Serial Monitor");
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       sendData();
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 space-y-6">
//       <div className="text-center">
//         <h1 className="text-3xl font-bold mb-2">Serial Monitor</h1>
//         <p className="text-gray-600">Theo dõi và gửi dữ liệu qua Serial với Arduino</p>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Wifi className="w-5 h-5" />
//             Kết nối Serial
//           </CardTitle>
//           <CardDescription>Thiết lập kết nối Serial Monitor</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {/* Port Selection */}
//             <div>
//               <label className="block text-sm font-medium mb-2">Port:</label>
//               <Select value={selectedPort} onValueChange={(value) => setSelectedPort(value)}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Chọn port" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {availablePorts.map((port) => (
//                     <SelectItem key={port} value={port}>
//                       <div className="flex items-center gap-2">
//                         {connectedPorts.includes(port) ? (
//                           <Wifi className="w-4 h-4 text-green-500" />
//                         ) : (
//                           <WifiOff className="w-4 h-4 text-gray-400" />
//                         )}
//                         {port}
//                         {connectedPorts.includes(port) && (
//                           <Badge variant="outline" className="ml-auto text-green-600">
//                             Đã kết nối
//                           </Badge>
//                         )}
//                       </div>
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Baud Rate */}
//             <div>
//               <label className="block text-sm font-medium mb-2">Baud Rate:</label>
//               <Select value={baudRate.toString()} onValueChange={(value) => setBaudRate(parseInt(value))}>
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {baudRateOptions.map((rate) => (
//                     <SelectItem key={rate} value={rate.toString()}>
//                       {rate}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Connection Status */}
//             <div>
//               <label className="block text-sm font-medium mb-2">Trạng thái:</label>
//               <div className="flex items-center gap-2">
//                 {isConnected ? (
//                   <>
//                     <Wifi className="w-4 h-4 text-green-500" />
//                     <span className="text-green-600">Đã kết nối</span>
//                   </>
//                 ) : (
//                   <>
//                     <WifiOff className="w-4 h-4 text-gray-400" />
//                     <span className="text-gray-500">Chưa kết nối</span>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Connection Buttons */}
//           <div className="flex gap-2">
//             {!isConnected ? (
//               <Button 
//                 onClick={connectSerial} 
//                 disabled={isConnecting || !selectedPort}
//                 className="flex-1"
//               >
//                 {isConnecting ? (
//                   <>
//                     <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                     Đang kết nối...
//                   </>
//                 ) : (
//                   <>
//                     <Play className="w-4 h-4 mr-2" />
//                     Kết nối
//                   </>
//                 )}
//               </Button>
//             ) : (
//               <Button 
//                 onClick={disconnectSerial} 
//                 variant="destructive"
//                 className="flex-1"
//               >
//                 <Square className="w-4 h-4 mr-2" />
//                 Ngắt kết nối
//               </Button>
//             )}
            
//             <Button 
//               onClick={loadConnectedPorts} 
//               variant="outline"
//               size="icon"
//             >
//               <RefreshCw className="w-4 h-4" />
//             </Button>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Serial Data Display */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center justify-between">
//             <span>Dữ liệu Serial</span>
//             <div className="flex items-center gap-2">
//               {isPolling && (
//                 <Badge variant="secondary" className="flex items-center gap-1">
//                   <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                   Đang nhận dữ liệu
//                 </Badge>
//               )}
//               <Button 
//                 onClick={clearData} 
//                 variant="outline" 
//                 size="sm"
//               >
//                 <Trash2 className="w-4 h-4 mr-1" />
//                 Xóa
//               </Button>
//             </div>
//           </CardTitle>
//           <CardDescription>
//             Dữ liệu nhận được từ Arduino qua Serial ({serialData.length} dòng)
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="bg-black text-green-400 p-4 rounded-md h-96 overflow-y-auto font-mono text-sm relative">
//             {serialData.length === 0 ? (
//               <span className="text-gray-500">Chưa có dữ liệu...</span>
//             ) : (
//               <div className="space-y-0">
//                 {serialData.map((item, index) => (
//                   <div 
//                     key={`${item.timestamp}-${index}`} 
//                     className="mb-0 leading-relaxed"
//                   >
//                     <span className="text-gray-400">[{item.timestamp}]</span> {item.data}
//                   </div>
//                 ))}
//               </div>
//             )}
//             <div ref={dataEndRef} />
//           </div>
//         </CardContent>
//       </Card>

//       {/* Send Data */}
//       {isConnected && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Gửi dữ liệu</CardTitle>
//             <CardDescription>Gửi dữ liệu đến Arduino qua Serial</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="flex gap-2">
//               <Input
//                 value={inputData}
//                 onChange={(e) => setInputData(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 placeholder="Nhập dữ liệu để gửi..."
//                 className="flex-1"
//               />
//               <Button 
//                 onClick={sendData} 
//                 disabled={isSending || !inputData.trim()}
//               >
//                 {isSending ? (
//                   <>
//                     <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                     Đang gửi...
//                   </>
//                 ) : (
//                   <>
//                     <Send className="w-4 h-4 mr-2" />
//                     Gửi
//                   </>
//                 )}
//               </Button>
//             </div>
//             <p className="text-sm text-gray-500 mt-2">
//               Nhấn Enter để gửi, Shift+Enter để xuống dòng
//             </p>
//           </CardContent>
//         </Card>
//       )}

//       {/* Connection Info */}
//       {isConnected && (
//         <Alert>
//           <Wifi className="h-4 w-4" />
//           <AlertDescription>
//             <div className="font-medium">Đã kết nối Serial Monitor</div>
//             <div className="text-sm text-gray-600">
//               Port: {selectedPort} | Baud Rate: {baudRate} | 
//               Dữ liệu nhận được: {serialData.length} dòng | 
//               Trạng thái: {isPolling ? 'Đang nhận dữ liệu' : 'Đã ngừng'}
//             </div>
//           </AlertDescription>
//         </Alert>
//       )}

//       {/* Performance Tips */}
//       <Card className="bg-blue-50 border-blue-200">
//         <CardHeader className="pb-3">
//           <CardTitle className="text-sm text-blue-800">💡 Mẹo tối ưu hiệu suất</CardTitle>
//         </CardHeader>
//         <CardContent className="pt-0">
//           <ul className="text-xs text-blue-700 space-y-1">
//             <li>• Polling interval: 200ms để giảm tải server</li>
//             <li>• Tự động giữ tối đa 2000 dòng dữ liệu</li>
//             <li>• Debounced scroll để tránh lag</li>
//             <li>• Batch updates để tối ưu re-render</li>
//           </ul>
//         </CardContent>
//       </Card>
//     </div>
//   );
// } 