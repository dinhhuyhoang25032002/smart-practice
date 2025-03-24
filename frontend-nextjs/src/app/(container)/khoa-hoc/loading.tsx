"use client"
import { TailSpin } from "react-loader-spinner"

export default function Loading() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center min-h-[500px]">
      <div className="spinner">
        <TailSpin
          height="40"
          width="40"
          color="#F4B324"
          radius="1"
          visible={true}
          ariaLabel="tail-spin-loading"
        />
      </div>
      {/* <!-- Overlay --> */}
      <div className={"absolute inset-0 z-50 bg-black/20 rounded-lg"}></div>
    </div>
  )
}