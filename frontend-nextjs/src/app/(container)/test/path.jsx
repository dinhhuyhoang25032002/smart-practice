// "use client";

// import { Button } from "@/components/ui/button";
// import React, { useState, useEffect } from "react";

// // Dữ liệu file .hex của bạn
// const content = `:100000000C9435000C945D000C945D000C945D0024
// :100010000C945D000C945D000C945D000C945D00EC
// :100020000C945D000C945D000C945D000C945D00DC
// :100030000C945D000C945D000C945D000C945D00CC
// :100040000C9491010C945D000C9401020C94DB0162
// :100050000C945D000C945D000C945D000C945D00AC
// :100060000C945D000C945D00EB0211241FBECFEFD9
// :10007000D8E0DEBFCDBF11E0A0E0B1E0E0E4F6E003
// :1000800002C005900D92A432B107D9F721E0A4E295
// :10009000B1E001C01D92AA3CB207E1F710E0C5E350
// :1000A000D0E004C02197FE010E941803C433D10799
// :1000B000C9F70E9433020C941E030C9400003FB752
// :1000C000F8948091C6019091C701A091C801B091A8
// :1000D000C90126B5A89B05C02F3F19F00196A11DA7
// :1000E000B11D3FBFBA2FA92F982F8827BC01CD0182
// :1000F000620F711D811D911D42E0660F771F881FE1
// :10010000991F4A95D1F70895AF92BF92CF92DF928F
// :10011000EF92FF920F931F93CF93DF936C017B01BC
// :100120008B01040F151FEB015E01AE18BF08C0174D
// :10013000D10759F06991D601ED91FC910190F081C0
// :10014000E02DC6010995892B79F7C501DF91CF9183
// :100150001F910F91FF90EF90DF90CF90BF90AF90E5
// :100160000895FC01538D448D252F30E0842F90E0BD
// :10017000821B930B541710F0CF96089501970895A2
// :10018000FC01918D828D981761F0A28DAE0FBF2F6B
// :10019000B11D5D968C91928D9F5F9F73928F90E0C1
// :1001A00008958FEF9FEF0895FC01918D828D981730
// :1001B00031F0828DE80FF11D858D90E008958FEF6D
// :1001C0009FEF0895FC01918D228D892F90E0805C36
// :1001D0009F4F821B91098F739927089584E291E0C4
// :1001E0000E94E20021E0892B09F420E0822F08958B
// :1001F00080E090E0892B29F00E94EE0081110C94A0
// :1002000000000895FC01A48DA80FB92FB11DA35AB9
// :10021000BF4F2C91848D90E001968F739927848F26
// :10022000A689B7892C93A089B1898C918370806449
// :100230008C93938D848D981306C00288F389E02DEA
// :1002400080818F7D80830895EF92FF920F931F939B
// :10025000CF93DF93EC0181E0888F9B8D8C8D981379
// :100260001AC0E889F989808185FF15C09FB7F89485
// :10027000EE89FF896083E889F989808183708064D1
// :1002800080839FBF81E090E0DF91CF911F910F911C
// :10029000FF90EF900895F62E0B8D10E00F5F1F4F2B
// :1002A0000F731127E02E8C8D8E110CC00FB607FC3A
// :1002B000FACFE889F989808185FFF5CFCE010E94C8
// :1002C0000201F1CFEB8DEC0FFD2FF11DE35AFF4F33
// :1002D000F0829FB7F8940B8FEA89FB898081806256
// :1002E000CFCFCF93DF93EC01888D8823B9F0AA8913
// :1002F000BB89E889F9898C9185FD03C0808186FDE1
// :100300000DC00FB607FCF7CF8C9185FFF2CF80812F
// :1003100085FFEDCFCE010E940201E9CFDF91CF91A1
// :1003200008951F920F920FB60F9211242F933F93AF
// :100330008F939F93AF93BF938091C2019091C3011C
// :10034000A091C401B091C5013091C10123E0230FF8
// :100350002D3758F50196A11DB11D2093C101809341
// :10036000C2019093C301A093C401B093C5018091D1
// :10037000C6019091C701A091C801B091C901019631
// :10038000A11DB11D8093C6019093C701A093C80120
// :10039000B093C901BF91AF919F918F913F912F91E0
// :1003A0000F900FBE0F901F90189526E8230F02960E
// :1003B000A11DB11DD2CF1F920F920FB60F92112423
// :1003C0002F933F934F935F936F937F938F939F935D
// :1003D000AF93BF93EF93FF9384E291E00E940201F9
// :1003E000FF91EF91BF91AF919F918F917F916F910D
// :1003F0005F914F913F912F910F900FBE0F901F90E3
// :1004000018951F920F920FB60F9211242F938F936E
// :100410009F93EF93FF93E0913401F0913501808138
// :10042000E0913A01F0913B0182FD1BC090818091E7
// :100430003D018F5F8F7320913E01821741F0E09163
// :100440003D01F0E0EC5DFE4F958F80933D01FF9103
// :10045000EF919F918F912F910F900FBE0F901F9052
// :1004600018958081F4CF789484B5826084BD84B57A
// :10047000816084BD85B5826085BD85B5816085BD9F
// :1004800080916E00816080936E0010928100809157
// :1004900081008260809381008091810081608093DF
// :1004A0008100809180008160809380008091B10004
// :1004B00084608093B1008091B00081608093B0002F
// :1004C00080917A00846080937A0080917A008260C3
// :1004D00080937A0080917A00816080937A00809185
// :1004E0007A00806880937A001092C100E091340114
// :1004F000F091350182E08083E0913001F09131018B
// :100500001082E0913201F09133018FEC80831092E0
// :100510003C01E0913801F091390186E08083E0915F
// :100520003601F0913701808180618083E09136014E
// :10053000F0913701808188608083E0913601F091ED
// :100540003701808180688083E0913601F091370126
// :1005500080818F7D8083C0E0D0E04DE050E062E19B
// :1005600071E084E291E00E94840042E050E060E2A9
// :1005700071E084E291E00E9484000E945F004B01E0
// :100580005C0188EEC82E83E0D82EE12CF12C0E946D
// :100590005F00681979098A099B09683E73408105E3
// :1005A0009105A8F321E0C21AD108E108F10888EE0C
// :1005B000880E83E0981EA11CB11CC114D104E10473
// :1005C000F10429F7209749F20E94EE00882329F2CE
// :1005D0000E940000C2CFE4E2F1E01382128288EEB2
// :1005E00093E0A0E0B0E084839583A683B78384E0A2
// :1005F00091E09183808385EC90E09587848784ECFB
// :1006000090E09787868780EC90E0918B808B81ECDF
// :1006100090E0938B828B82EC90E0958B848B86ECC0
// :1006200090E0978B868B118E128E138E148E089508
// :10063000EE0FFF1F0590F491E02D0994F894FFCF81
// :100640000000000024018400B1007101E200C0003C
// :10065000D40048656C6C6F2C20576F726C6421005D
// :040660000D0A00007F
// :00000001FF`;

// // Khai báo port bên ngoài để có thể truy cập từ nhiều hàm
// let port;

// export default function TestPageComponent() {
//   const [isConnected, setIsConnected] = useState(false);
//   const [portInfo, setPortInfo] = useState(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);

//   // useEffect để lắng nghe sự kiện cắm/rút thiết bị
//   useEffect(() => {
//     const handleConnect = (e) => {
//       console.log("Thiết bị serial đã được cắm vào:", e.target);
//     };

//     const handleDisconnect = async (e) => {
//       if (port && e.target === port) {
//         setIsConnected(false);
//         setPortInfo(null);
//         setIsUploading(false);
//         port = null;
//         alert("Kết nối đã bị ngắt do thiết bị được rút ra.");
//       }
//     };

//     navigator.serial.addEventListener("connect", handleConnect);
//     navigator.serial.addEventListener("disconnect", handleDisconnect);

//     return () => {
//       navigator.serial.removeEventListener("connect", handleConnect);
//       navigator.serial.removeEventListener("disconnect", handleDisconnect);
//     };
//   }, []);

//   const handleConnectSerial = async () => {
//     if (isConnected) return;
//     try {
//       port = await navigator.serial.requestPort();
//       await port.open({ baudRate: 38400 }); // Hoặc 115200, 57600 tùy vào bootloader
//       setIsConnected(true);
//       setPortInfo(port.getInfo());
//       console.log("Đã kết nối thành công đến port:", port);
//     } catch (error) {
//       if (error.name !== "NotFoundError") {
//         console.error("Lỗi khi kết nối đến serial port:", error);
//       }
//     }
//   };

//   const handleDisconnectSerial = async () => {
//     if (!port) return;
//     try {
//       await port.close();
//       setIsConnected(false);
//       setPortInfo(null);
//       setIsUploading(false);
//       port = null;
//     } catch (error) {
//       console.error("Lỗi khi ngắt kết nối:", error);
//     }
//   };
//   function toHexString(byteArray) {
//     return Array.from(byteArray, function (byte) {
//       return ("0" + (byte & 0xff).toString(16)).slice(-2);
//     }).join("");
//   }
//   // Hàm để nạp file HEX

//   // Phiên bản nâng cao của hàm nạp, có đọc phản hồi
//   const handleUploadHex = async () => {
//     if (!port || !port.readable || !port.writable) {
//       alert("Chưa kết nối hoặc port không hỗ trợ đọc/ghi!");
//       return;
//     }

//     setIsUploading(true);
//     setUploadProgress(0);

//     const writer = port.writable.getWriter();
//     const reader = port.readable.getReader();
//     const encoder = new TextEncoder();
//     const decoder = new TextDecoder(); // Để chuyển byte nhận được thành text

//     // Các hằng số của giao thức STK500v1
//     const STK_OK = 0x10;
//     const STK_INSYNC = 0x14;

//     // Hàm để đọc phản hồi từ bootloader với timeout
//     async function readWithTimeout(timeout = 2000) {
//       const timeoutPromise = new Promise((_, reject) =>
//         setTimeout(
//           () =>
//             reject(new Error("Đã hết thời gian chờ phản hồi từ bootloader.")),
//           timeout
//         )
//       );
//       try {
//         const { value, done } = await Promise.race([
//           reader.read(),
//           timeoutPromise,
//         ]);
//         if (done) {
//           throw new Error("Stream đã bị đóng.");
//         }
//         console.log(`Đã nhận: ${toHexString(value)}`);
//         return value;
//       } catch (error) {
//         throw error;
//       }
//     }

//     // Hàm gửi lệnh và chờ một phản hồi cụ thể
//     async function sendCommandAndWaitForResponse(command, expectedResponse) {
//       await writer.write(command);
//       const response = await readWithTimeout();
//       // Kiểm tra xem byte cuối cùng của phản hồi có khớp không
//       if (response[response.length - 1] !== expectedResponse) {
//         throw new Error(
//           `Phản hồi không mong muốn. Mong đợi ${expectedResponse.toString(
//             16
//           )}, nhận được ${toHexString(response)}`
//         );
//       }
//       return true;
//     }

//     try {
//       // --- BƯỚC 1: BẮT TAY (SYNCHRONIZATION) ---
//       // Cố gắng đồng bộ với bootloader. Gửi '0' (STK_GET_SYNC) và chờ INSYNC+OK
//       console.log("Đang cố gắng đồng bộ với bootloader...");

//       // Gửi lệnh '0 ' (ký tự 0 và dấu cách)
//       // Đây là lệnh STK_GET_SYNC theo giao thức
//       await writer.write(new Uint8Array([0x30, 0x20]));

//       // Đọc phản hồi. Bootloader sẽ trả về 0x14 (INSYNC) và 0x10 (OK)
//       const syncResponse = await readWithTimeout(3000); // Tăng timeout cho lần đầu
//       if (syncResponse[0] !== STK_INSYNC || syncResponse[1] !== STK_OK) {
//         throw new Error(
//           "Không thể đồng bộ với bootloader. Hãy thử reset lại bo mạch."
//         );
//       }
//       console.log("Đồng bộ thành công!");

//       setUploadProgress(10); // Đánh dấu đã qua bước bắt tay

//       // --- BƯỚC 2: GỬI DỮ LIỆU ---
//       // (Đây là phiên bản đơn giản hóa, thực tế cần gửi lệnh set địa chỉ, v.v.)
//       // Bây giờ chúng ta sẽ gửi từng dòng HEX
//       const lines = content
//         .split("\n")
//         .filter((line) => line.length > 0 && line.startsWith(":"));
//       const totalLines = lines.length;

//       for (let i = 0; i < totalLines; i++) {
//         const line = lines[i];

//         // Gửi dòng HEX, nhưng theo giao thức bootloader thay vì gửi thẳng
//         // Ghi chú: Đây là phần phức tạp nhất và bị đơn giản hóa ở đây.
//         // Một trình nạp thực thụ sẽ phân tích dòng HEX, gửi các lệnh
//         // "Load Address", "Program Page", v.v.

//         // Hiện tại, chúng ta sẽ tạm thời vẫn gửi thẳng dòng HEX để kiểm tra
//         // và chờ phản hồi OK.
//         await writer.write(encoder.encode(line + "\n"));
//         console.log(`Đã gửi: ${line}`);

//         // Chờ phản hồi OK từ bootloader sau mỗi dòng.
//         // Chú ý: Không phải bootloader nào cũng làm điều này. Đây là giả định.
//         // await readWithTimeout(); // Tạm thời comment ra nếu bootloader không phản hồi

//         setUploadProgress(10 + Math.round(((i + 1) / totalLines) * 80));
//       }

//       // --- BƯỚC 3: RỜI KHỎI CHẾ ĐỘ NẠP CODE ---
//       console.log("Rời khỏi chế độ nạp...");
//       // Gửi lệnh 'Q ' (Leave Programming Mode)
//       await sendCommandAndWaitForResponse(new Uint8Array([0x51, 0x20]), STK_OK);

//       console.log("Nạp firmware thành công!");
//       alert("Nạp firmware thành công! Bo mạch sẽ khởi động lại.");
//       setUploadProgress(100);
//     } catch (error) {
//       console.error("Lỗi trong quá trình nạp:", error);
//       alert("Lỗi: " + error.message);
//     } finally {
//       // Luôn luôn giải phóng reader và writer
//       reader.releaseLock();
//       writer.releaseLock();
//       setIsUploading(false);
//     }
//   };
//   // Dán hàm này vào bên trong component TestPageComponent của bạn,
//   // ngang hàng với hàm handleUploadHex

//   async function handleTestSync() {
//     if (!port || !port.readable || !port.writable) {
//       alert("Chưa kết nối hoặc port không hỗ trợ đọc/ghi!");
//       return;
//     }

//     console.log("--- BẮT ĐẦU KIỂM TRA ĐỒNG BỘ ---");
//     alert("Chuẩn bị reset bo mạch và xem Console (F12)!");

//     const writer = port.writable.getWriter();
//     const reader = port.readable.getReader();
//     let keepReading = true;

//     // Lắng nghe liên tục trong một khoảng thời gian
//     const listenPromise = (async () => {
//       try {
//         while (keepReading) {
//           const { value, done } = await reader.read();
//           if (done) {
//             break;
//           }
//           if (value) {
//             console.log(`ĐÃ NHẬN DỮ LIỆU: ${toHexString(value)}`);
//           }
//         }
//       } catch (error) {
//         // Lỗi này thường xảy ra khi port bị đóng, có thể bỏ qua
//         console.warn(
//           "Lỗi khi đang đọc (có thể do port đã đóng):",
//           error.message
//         );
//       }
//     })();

//     try {
//       // Gửi lệnh đồng bộ '0 ' (STK_GET_SYNC)
//       console.log("Đang gửi lệnh đồng bộ (0x30 0x20)...");
//       await writer.write(new Uint8Array([0x30, 0x20]));

//       // Chờ 3 giây để xem có nhận được gì không
//       await new Promise((resolve) => setTimeout(resolve, 3000));

//       console.log("--- KẾT THÚC KIỂM TRA ĐỒNG BỘ ---");
//       alert("Đã kết thúc kiểm tra. Hãy xem kết quả trong Console.");
//     } catch (error) {
//       console.error("Lỗi khi gửi lệnh đồng bộ:", error);
//       alert("Lỗi khi gửi lệnh: " + error.message);
//     } finally {
//       // Ngừng vòng lặp đọc và giải phóng tài nguyên
//       keepReading = false;
//       reader.releaseLock();
//       writer.releaseLock();
//     }
//   }
//   return (
//     <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
//       <p>Nhấn nút bên dưới để chọn và kết nối với một thiết bị Serial.</p>
//       <div style={{ display: "flex", gap: "10px" }}>
//         {!isConnected ? (
//           <Button onClick={handleConnectSerial}>Kết nối Serial Port</Button>
//         ) : (
//           <Button onClick={handleDisconnectSerial} variant="destructive">
//             Ngắt kết nối
//           </Button>
//         )}

//         {isConnected && (
//           <Button onClick={handleUploadHex} disabled={isUploading}>
//             {isUploading
//               ? `Đang nạp... ${uploadProgress}%`
//               : "Nạp Firmware (Toàn bộ)"}
//           </Button>
//         )}

//         {/* THÊM NÚT NÀY VÀO */}
//         {isConnected && (
//           <Button
//             onClick={handleTestSync}
//             variant="outline"
//             style={{ marginLeft: "10px" }}
//           >
//             Kiểm tra Đồng bộ
//           </Button>
//         )}
//       </div>

//       {isUploading && (
//         <div style={{ marginTop: "10px" }}>
//           <p>Tiến trình nạp:</p>
//           <progress
//             value={uploadProgress}
//             max="100"
//             style={{ width: "100%" }}
//           ></progress>
//         </div>
//       )}

//       {isConnected && portInfo && (
//         <div
//           style={{
//             marginTop: "20px",
//             border: "1px solid #ccc",
//             padding: "10px",
//             borderRadius: "8px",
//           }}
//         >
//           <h3>Thông tin kết nối:</h3>
//           <p>Đã kết nối!</p>
//           <p>USB Vendor ID: {portInfo.usbVendorId || "N/A"}</p>
//           <p>USB Product ID: {portInfo.usbProductId || "N/A"}</p>
//         </div>
//       )}
//     </div>
//   );
// }

// // import React, { useEffect, useState } from "react";
// // import intelHex from "intel-hex";
// // import { Button } from "@/components/ui/button";

// // let port: SerialPort | null = null;

// // const BOARD_IDENTIFIERS: Record<string, string> = {
// //   "2341:43": "Arduino Uno (Chính hãng)",
// //   "1a86:7523": "Arduino Uno Clone (CH340)",
// //   "10c4:ea60": "Arduino Uno Clone (CP2102)"
// // };

// // function identifyBoard(vendorId?: number, productId?: number): string {
// //   if (!vendorId || !productId) return "Không rõ board";
// //   const key = `${vendorId.toString(16)}:${productId.toString(16)}`;
// //   return BOARD_IDENTIFIERS[key] ?? "Không rõ board";
// // }

// // export default function ArduinoUploader() {
// //   const [isConnected, setIsConnected] = useState(false);
// //   const [isUploading, setIsUploading] = useState(false);
// //   const [progress, setProgress] = useState(0);
// //   const [portInfo, setPortInfo] = useState<any>(null);
// //   const [hexData, setHexData] = useState<string>("");
// //   const [logs, setLogs] = useState<string[]>([]);
// //   const [baudRate, setBaudRate] = useState<number>(115200);
// //   const [availablePorts, setAvailablePorts] = useState<any[]>([]);
// //   const [serialOutput, setSerialOutput] = useState<string>("");

// //   useEffect(() => {
// //     const handleConnect = (e: any) => {
// //       refreshPorts();
// //     };
// //     const handleDisconnect = async (e: any) => {
// //       if (port && e.target === port) {
// //         appendLog("Thiết bị đã ngắt kết nối.");
// //         setIsConnected(false);
// //         port = null;
// //         refreshPorts();
// //       }
// //     };
// //     navigator.serial.addEventListener("connect", handleConnect);
// //     navigator.serial.addEventListener("disconnect", handleDisconnect);
// //     refreshPorts();
// //     return () => {
// //       navigator.serial.removeEventListener("connect", handleConnect);
// //       navigator.serial.removeEventListener("disconnect", handleDisconnect);
// //     };
// //   }, []);

// //   const refreshPorts = async () => {
// //     try {
// //       const ports = await navigator.serial.getPorts();
// //       setAvailablePorts(ports.map((p) => p.getInfo()));
// //       if (ports.length === 1 && !isConnected) {
// //         port = ports[0];
// //         const info = port.getInfo();
// //         setPortInfo(info);
// //         const boardName = identifyBoard(info.usbVendorId, info.usbProductId);
// //         if (!boardName.includes("Arduino Uno")) return;
// //         await port.open({ baudRate });
// //         setIsConnected(true);
// //         appendLog(`Tự động kết nối với thiết bị: ${boardName}`);
// //         readSerial();
// //       }
// //     } catch (e) {
// //       appendLog("Không thể lấy danh sách ports: " + e);
// //     }
// //   };

// //   const connectPort = async () => {
// //     try {
// //       port = await navigator.serial.requestPort();
// //       const info = port.getInfo();
// //       setPortInfo(info);

// //       const boardName = identifyBoard(info.usbVendorId, info.usbProductId);
// //       if (!boardName.includes("Arduino Uno")) {
// //         return alert("Thiết bị không phải Arduino Uno. Vui lòng kết nối đúng board.");
// //       }

// //       await port.open({ baudRate });
// //       setIsConnected(true);
// //       appendLog(`Đã kết nối với thiết bị: ${boardName}`);
// //       readSerial();
// //       refreshPorts();
// //     } catch (e) {
// //       appendLog("Lỗi khi kết nối: " + e.message);
// //     }
// //   };

// //   const disconnectPort = async () => {
// //     if (port) {
// //       await port.close();
// //       setIsConnected(false);
// //       port = null;
// //       appendLog("Đã ngắt kết nối.");
// //       refreshPorts();
// //     }
// //   };

// //   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const file = e.target.files?.[0];
// //     if (!file) return;
// //     const reader = new FileReader();
// //     reader.onload = (event) => {
// //       const text = event.target?.result as string;
// //       setHexData(text);
// //       appendLog("Đã tải file HEX thành công.");
// //     };
// //     reader.readAsText(file);
// //   };

// //   const appendLog = (text: string) => {
// //     setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${text}`]);
// //   };

// //   const autoResetBoard = async () => {
// //     if (!port) return;
// //     appendLog("Đang thực hiện reset board qua DTR...");
// //     try {
// //       // @ts-ignore: experimental feature
// //       await port.setSignals({ dataTerminalReady: false });
// //       await new Promise((resolve) => setTimeout(resolve, 100));
// //       // @ts-ignore: experimental feature
// //       await port.setSignals({ dataTerminalReady: true });
// //       await new Promise((resolve) => setTimeout(resolve, 100));
// //       appendLog("Reset thành công. Đợi bo mạch khởi động lại...");
// //       await new Promise((resolve) => setTimeout(resolve, 1500));
// //     } catch (err: any) {
// //       appendLog("Không thể reset bo mạch: " + err.message);
// //     }
// //   };

// //   const readSerial = async () => {
// //     if (!port?.readable) return;
// //     const textDecoder = new TextDecoderStream();
// //     const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
// //     const reader = textDecoder.readable.getReader();

// //     try {
// //       while (true) {
// //         const { value, done } = await reader.read();
// //         if (done) break;
// //         if (value) setSerialOutput((prev) => prev + value);
// //       }
// //     } catch (err) {
// //       appendLog("Lỗi khi đọc Serial: " + err);
// //     } finally {
// //       reader.releaseLock();
// //     }
// //   };

// //   const flashHex = async () => {
// //     if (!port || !port.readable || !port.writable) return alert("Chưa kết nối port");
// //     if (!hexData) return alert("Chưa có file HEX nào được tải lên.");

// //     setIsUploading(true);
// //     await autoResetBoard();
// //     appendLog("Bắt đầu nạp firmware...");

// //     try {
// //       const writer = port.writable.getWriter();
// //       const bytes = intelHex.parse(hexData).data;
// //       for (let i = 0; i < bytes.length; i += 64) {
// //         const chunk = bytes.slice(i, i + 64);
// //         await writer.write(chunk);
// //         setProgress(Math.floor((i / bytes.length) * 100));
// //         await new Promise((r) => setTimeout(r, 30));
// //       }
// //       writer.releaseLock();
// //       appendLog("Nạp firmware thành công!");
// //     } catch (err: any) {
// //       appendLog("Lỗi khi nạp firmware: " + err.message);
// //     } finally {
// //       setIsUploading(false);
// //     }
// //   };

// //   return (
// //     <div className="max-w-xl mx-auto p-6 bg-white shadow rounded space-y-4">
// //       <h1 className="text-xl font-bold">Nạp Firmware cho Arduino Uno</h1>

// //       <div className="space-y-2">
// //         <label className="block text-sm font-medium">Chọn baud rate:</label>
// //         <select
// //           className="border rounded p-2 w-full"
// //           value={baudRate}
// //           onChange={(e) => setBaudRate(parseInt(e.target.value))}
// //         >
// //           <option value={9600}>9600</option>
// //           <option value={57600}>57600</option>
// //           <option value={115200}>115200</option>
// //           <option value={250000}>250000</option>
// //         </select>
// //       </div>

// //       <div className="space-y-2">
// //         <label className="block text-sm font-medium">Tải file HEX:</label>
// //         <input type="file" accept=".hex" onChange={handleFileUpload} />
// //       </div>

// //       {!isConnected ? (
// //         <Button onClick={connectPort}>Kết nối Serial</Button>
// //       ) : (
// //         <div className="space-x-4">
// //           <Button onClick={flashHex} disabled={isUploading || !hexData}>
// //             {isUploading ? `Đang nạp... ${progress}%` : "Nạp Firmware"}
// //           </Button>
// //           <Button variant="destructive" onClick={disconnectPort}>Ngắt kết nối</Button>
// //         </div>
// //       )}

// //       {isConnected && portInfo && (
// //         <div className="text-sm text-gray-600">
// //           <p>USB Vendor ID: {portInfo.usbVendorId}</p>
// //           <p>USB Product ID: {portInfo.usbProductId}</p>
// //           <p>Loại thiết bị: {identifyBoard(portInfo.usbVendorId, portInfo.usbProductId)}</p>
// //         </div>
// //       )}

// //       {availablePorts.length > 0 && (
// //         <div className="text-sm text-gray-600">
// //           <p className="font-semibold">Danh sách cổng kết nối hiện có:</p>
// //           <ul className="list-disc list-inside">
// //             {availablePorts.map((p, idx) => (
// //               <li key={idx}>
// //                 Vendor ID: {p.usbVendorId ?? "N/A"}, Product ID: {p.usbProductId ?? "N/A"}
// //               </li>
// //             ))}
// //           </ul>
// //         </div>
// //       )}

// //       {serialOutput && (
// //         <div className="bg-black text-green-400 font-mono p-2 rounded max-h-40 overflow-y-auto text-xs">
// //           <p><strong>Serial Output:</strong></p>
// //           <pre>{serialOutput}</pre>
// //         </div>
// //       )}

// //       {isUploading && (
// //         <progress className="w-full" value={progress} max={100}></progress>
// //       )}

// //       {logs.length > 0 && (
// //         <div className="bg-gray-100 p-2 rounded mt-4 max-h-60 overflow-y-auto text-xs">
// //           {logs.map((log, idx) => (
// //             <div key={idx}>{log}</div>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

