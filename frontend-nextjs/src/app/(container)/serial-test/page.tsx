import SerialTest from "@/components/arduino/SerialTest";

export default function SerialTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Serial Monitor API Test</h1>
          <p className="text-gray-600">Kiểm tra API Serial Monitor</p>
        </div>
        <SerialTest />
      </div>
    </div>
  );
} 