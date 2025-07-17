"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Upload, Download, Code, Cpu, Wifi, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

// Types
interface BoardInfo {
  fqbn: string;
  name: string;
  baudRate: number;
  protocol: string;
}

interface BuildInfo {
  buildId: string;
  boardInfo: {
    name: string;
    fqbn: string;
    baudRate: number;
    protocol: string;
    hexExtension: string;
  };
  fileInfo: {
    fileName: string;
    fileSize: number;
    downloadUrl: string;
  };
}

// Board icons mapping
const BOARD_ICONS: Record<string, React.ReactNode> = {
  'arduino:avr:uno': <Cpu className="w-4 h-4" />,
  'arduino:avr:mega': <Cpu className="w-4 h-4" />,
  'esp8266:esp8266:nodemcuv2': <Wifi className="w-4 h-4" />,
  'esp32:esp32:esp32': <Wifi className="w-4 h-4" />,
};

// Board color mapping
const BOARD_COLORS: Record<string, string> = {
  'arduino:avr:uno': 'bg-blue-100 text-blue-800',
  'arduino:avr:mega': 'bg-blue-100 text-blue-800',
  'esp8266:esp8266:nodemcuv2': 'bg-orange-100 text-orange-800',
  'esp32:esp32:esp32': 'bg-green-100 text-green-800',
};

export default function ArduinoUploader() {
  // States cho Firmware Uploader
  const [boards, setBoards] = useState<BoardInfo[]>([]);
  const [selectedBoard, setSelectedBoard] = useState<string>("");
  const [arduinoCode, setArduinoCode] = useState<string>("");
  const [isCompiling, setIsCompiling] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentBuild, setCurrentBuild] = useState<BuildInfo | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [availablePorts, setAvailablePorts] = useState<string[]>([]);
  const [selectedPort, setSelectedPort] = useState<string>('');

  // Load supported boards on mount
  useEffect(() => {
    loadSupportedBoards();
    loadAvailablePorts();
  }, []);

  // Helper functions
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  // API functions cho Firmware Uploader
  const loadSupportedBoards = async () => {
    try {
      const response = await fetch('/api/arduino/boards');
      const data = await response.json();
      if (data.success) {
        setBoards(data.boards);
        if (data.boards.length > 0) {
          setSelectedBoard(data.boards[0].fqbn);
        }
      }
    } catch (error) {
      toast.error("Không thể tải danh sách board");
      addLog("Lỗi khi tải danh sách board: " + error);
    }
  };

  const loadAvailablePorts = async () => {
    try {
      // Danh sách port phổ biến cho Arduino
      const commonPorts = ['/dev/ttyUSB0', '/dev/ttyUSB1', '/dev/ttyACM0', '/dev/ttyACM1', 'COM1', 'COM2', 'COM3', 'COM4'];
      setAvailablePorts(commonPorts);
      if (commonPorts.length > 0) {
        setSelectedPort(commonPorts[0]);
      }
    } catch (error) {
      addLog("Không thể tải danh sách port: " + error);
    }
  };

  const compileCode = async () => {
    if (!selectedBoard || !arduinoCode.trim()) {
      toast.error("Vui lòng chọn board và nhập code");
      return;
    }

    setIsCompiling(true);
    addLog("Bắt đầu biên dịch code...");

    try {
      const response = await fetch('/api/arduino/builds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: arduinoCode,
          board: selectedBoard,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCurrentBuild(data);
        addLog(`Biên dịch thành công! Build ID: ${data.buildId}`);
        addLog(`File: ${data.fileInfo.fileName} (${(data.fileInfo.fileSize / 1024).toFixed(1)} KB)`);
        toast.success("Biên dịch thành công!");
      } else {
        throw new Error(data.message || "Lỗi biên dịch");
      }
    } catch (error: any) {
      addLog("Lỗi biên dịch: " + error.message);
      toast.error("Lỗi biên dịch: " + error.message);
    } finally {
      setIsCompiling(false);
    }
  };

  const uploadFirmware = async () => {
    if (!currentBuild) {
      toast.error("Chưa có firmware để nạp!");
      return;
    }

    if (!selectedPort) {
      toast.error("Chưa chọn port!");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    addLog("Bắt đầu nạp firmware bằng avrdude...");

    try {
      const response = await fetch('/api/arduino/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          buildId: currentBuild.buildId,
          port: selectedPort,
          board: selectedBoard,
        }),
      });

      const data = await response.json();

      if (data.success) {
        addLog("Nạp firmware thành công!");
        addLog("Output: " + data.output);
        toast.success("Nạp firmware thành công!");
        setUploadProgress(100);
      } else {
        throw new Error(data.message || "Lỗi nạp firmware");
      }
    } catch (error: any) {
      addLog("Lỗi nạp firmware: " + error.message);
      toast.error("Lỗi nạp firmware: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Arduino Firmware Uploader</h1>
        <p className="text-gray-600">Nạp firmware trực tiếp từ trình duyệt web sử dụng AVRDUDE</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Code Editor */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              Code Editor
            </CardTitle>
            <CardDescription>Nhập code Arduino của bạn</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Chọn Board:</label>
              <Select value={selectedBoard} onValueChange={(value) => {
                setSelectedBoard(value);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn board" />
                </SelectTrigger>
                <SelectContent>
                  {boards.map((board) => (
                    <SelectItem key={board.fqbn} value={board.fqbn}>
                      <div className="flex items-center gap-2">
                        {BOARD_ICONS[board.fqbn]}
                        {board.name}
                        <Badge variant="outline" className="ml-auto">
                          {board.protocol}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Arduino Code:</label>
              <Textarea
                value={arduinoCode}
                onChange={(e) => setArduinoCode(e.target.value)}
                placeholder="void setup() {&#10;  Serial.begin(9600);&#10;}&#10;&#10;void loop() {&#10;  Serial.println(&quot;Hello World!&quot;);&#10;  delay(1000);&#10;}"
                rows={15}
                className="font-mono text-sm"
              />
            </div>

            <Button 
              onClick={compileCode} 
              disabled={isCompiling || !selectedBoard || !arduinoCode.trim()}
              className="w-full"
            >
              {isCompiling ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang biên dịch...
                </>
              ) : (
                <>
                  <Code className="w-4 h-4 mr-2" />
                  Biên dịch Code
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Upload Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Firmware
            </CardTitle>
            <CardDescription>Nạp firmware sử dụng AVRDUDE</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Port Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Chọn Port Arduino:</label>
              <Select value={selectedPort} onValueChange={(value) => setSelectedPort(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn port" />
                </SelectTrigger>
                <SelectContent>
                  {availablePorts.map((port) => (
                    <SelectItem key={port} value={port}>
                      {port}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Build Info */}
            {currentBuild && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-medium">Firmware sẵn sàng nạp</div>
                  <div className="text-sm text-gray-600">
                    Build ID: {currentBuild.buildId}<br />
                    File: {currentBuild.fileInfo.fileName} ({(currentBuild.fileInfo.fileSize / 1024).toFixed(1)} KB)
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tiến trình nạp firmware</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}

            {/* Upload Button */}
            <Button 
              onClick={uploadFirmware} 
              disabled={isUploading || !currentBuild || !selectedPort}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang nạp firmware...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Nạp Firmware
                </>
              )}
            </Button>

            {/* Logs */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Log:</label>
              <div className="bg-gray-100 p-3 rounded-md h-64 overflow-y-auto text-sm font-mono">
                {logs.length === 0 ? (
                  <span className="text-gray-500">Chưa có log...</span>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="mb-1">{log}</div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 