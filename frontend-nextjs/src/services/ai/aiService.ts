import { toastNotiFail } from "@/components/custom/ToastNotification";
import { Headers } from "@/constant/constant";
import { ChatResponse, IoTResponse, UploadResponse } from "@/types/CustomType";

export const sendNormalQuestionToAi = async (
  message: string,
  sessionId?: string
): Promise<ChatResponse | undefined> => {
  const body = {
    human_input: message,
    session_id: sessionId,
  };

  try {
    const res = await (
      await fetch(`${process.env.AI_ENDPOINT_URL}/chat`, {
        method: "POST",
        headers: Headers,
        body: JSON.stringify(body),
      })
    ).json();
    return res;
  } catch (error) {
    console.log(error);
    toastNotiFail("Có lỗi khi gọi api sendNormalQuestionToAi");
  }
};

export const sendIoTQuestionToAi = async (
  message: string,
  sessionId?: string
): Promise<IoTResponse | undefined> => {
  const body = {
    question: message,
    session_id: sessionId,
  };
  try {
    const res = await (
      await fetch(`http://192.168.1.222:8090/IoT`, {
        method: "POST",
        headers: Headers,
        body: JSON.stringify(body),
      })
    ).json();
    return res;
  } catch (error) {
    console.log(error);
    toastNotiFail("Có lỗi khi gọi api sendIoTQuestionToAi");
  }
};

export const uploadDocument = async (
  file: File
): Promise<UploadResponse | undefined> => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const res = await (
      await fetch(`${process.env.AI_ENDPOINT_URL}/upload-doc`, {
        method: "POST",
        body: formData,
      })
    ).json();
    return res;
  } catch (error) {
    console.log(error);
    toastNotiFail("Có lỗi khi gọi api uploadDocument");
  }
};

export const deleteDocument = async (fileId: number) => {
  const body = {
    file_id: fileId,
  };

  try {
    await fetch(`${process.env.AI_ENDPOINT_URL}/delete-doc`, {
      body: JSON.stringify(body),
      method: "POST",
    });
  } catch (error) {
    console.log(error);
    toastNotiFail("Có lỗi khi gọi api uploadDocument");
  }
};
