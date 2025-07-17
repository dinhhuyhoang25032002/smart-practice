import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(`http://localhost:3001/v1/api/arduino/boards`);
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Không thể kết nối đến server" },
      { status: 500 }
    );
  }
}
