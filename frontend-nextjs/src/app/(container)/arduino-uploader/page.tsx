"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Monitor, Code, Settings, TestTube } from "lucide-react";
import ArduinoUploader from "@/components/arduino/ArduinoUploader";
import SerialMonitor from "@/components/arduino/SerialMonitor";
import SerialTest from "@/components/arduino/SerialTest";
 
export default function ArduinoUploaderPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Arduino Development Studio</h1>
          <p className="text-gray-600">Biên dịch, nạp firmware và theo dõi Serial với Arduino</p>
        </div>

        <Tabs defaultValue="uploader" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="uploader" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Firmware Uploader
            </TabsTrigger>
            <TabsTrigger value="monitor" className="flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              Serial Monitor
            </TabsTrigger>
            <TabsTrigger value="test" className="flex items-center gap-2">
              <TestTube className="w-4 h-4" />
              API Test
            </TabsTrigger>
          </TabsList>

          <TabsContent value="uploader" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Arduino Firmware Uploader
                </CardTitle>
                <CardDescription>
                  Viết code Arduino, biên dịch và nạp firmware sử dụng AVRDUDE
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ArduinoUploader />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitor" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="w-5 h-5" />
                  Serial Monitor
                </CardTitle>
                <CardDescription>
                  Theo dõi và gửi dữ liệu qua Serial với Arduino
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SerialMonitor />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="test" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="w-5 h-5" />
                  API Test
                </CardTitle>
                <CardDescription>
                  Kiểm tra API Serial Monitor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SerialTest />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
