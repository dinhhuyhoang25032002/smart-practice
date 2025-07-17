"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SerialTest() {
  const [connectedPorts, setConnectedPorts] = useState<string[]>([]);
  const [serialData, setSerialData] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const testConnectedPorts = async () => {
    setIsLoading(true);
    try {
      console.log('Testing connected ports API...');
      const response = await fetch('/api/arduino/serial/connected');
      const data = await response.json();
      console.log('Connected ports response:', data);
      setConnectedPorts(data.ports || []);
    } catch (error) {
      console.error('Error testing connected ports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const testSerialData = async () => {
    if (connectedPorts.length === 0) {
      alert('Không có port nào được kết nối');
      return;
    }

    setIsLoading(true);
    try {
      const port = connectedPorts[0];
      console.log('Testing serial data API for port:', port);
      const response = await fetch(`/api/arduino/serial/data/${encodeURIComponent(port)}`);
      const data = await response.json();
      console.log('Serial data response:', data);
      setSerialData(data.data || []);
    } catch (error) {
      console.error('Error testing serial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    testConnectedPorts();
  }, []);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Serial Monitor API Test</CardTitle>
        <CardDescription>Kiểm tra API Serial Monitor</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Connected Ports:</h3>
          <div className="bg-gray-100 p-3 rounded">
            {connectedPorts.length > 0 ? (
              <ul>
                {connectedPorts.map((port, index) => (
                  <li key={index} className="font-mono">{port}</li>
                ))}
              </ul>
            ) : (
              <span className="text-gray-500">Không có port nào được kết nối</span>
            )}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Serial Data:</h3>
          <div className="bg-black text-green-400 p-3 rounded h-64 overflow-y-auto font-mono text-sm">
            {serialData.length > 0 ? (
              serialData.map((item, index) => (
                <div key={index} className="mb-1">{item}</div>
              ))
            ) : (
              <span className="text-gray-500">Chưa có dữ liệu</span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={testConnectedPorts} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Refresh Connected Ports'}
          </Button>
          <Button onClick={testSerialData} disabled={isLoading || connectedPorts.length === 0}>
            {isLoading ? 'Loading...' : 'Get Serial Data'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 