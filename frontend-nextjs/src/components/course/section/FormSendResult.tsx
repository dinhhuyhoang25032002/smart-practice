import { SyntheticEvent, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { IoCloudUploadOutline } from "react-icons/io5";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IoMdClose } from "react-icons/io";
import { fetchPrivateData } from "@/utils/fetcher/fetch-api";

import {
  toastNotiFail,
  toastNotiSuccess,
} from "@/components/custom/ToastNotification";
import { useSearchParams } from "next/navigation";
type ImgInfo = {
  name: string;
  type: string;
  size: number;
  src: string | ArrayBuffer | null;
};

export default function FormSendResult() {
  const [imgInfor, setImgInfo] = useState<ImgInfo>();
  const [file, setFile] = useState<File>();
  const [isSubmit, setSubmit] = useState(false);
  const id = useSearchParams().get("id");
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;
    const file = acceptedFiles[0];
    console.log(acceptedFiles[0]);

    setFile(acceptedFiles[0]);
    const reader = new FileReader();
    reader.onload = () => {
      setImgInfo({
        name: file.name,
        type: file.type,
        size: Math.round(file.size / 1024),
        src: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  async function onSubmit(e: SyntheticEvent) {
    e.preventDefault();
    if (!file || !id) return;
    setSubmit(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("lessonId", id);
    formData.append("submissionTime", Date.now().toString());

    const res = await fetchPrivateData("result", {
      body: formData,
      method: "POST",
    });
    console.log(res);
    if (res && res.status === 400) {
      toastNotiFail(res.message);
      return;
    }

    if (res && res.status === 403) {
      toastNotiFail(res.message);
      return;
    }

    toastNotiSuccess(res.message);
    setFile(undefined);
    setImgInfo(undefined);
  }

  const handleDeleteImg = () => {
    if (!file) return;
    if (!imgInfor) return;
    setFile(undefined);
    setImgInfo(undefined);
  };

  return (
    <form className=" flex flex-col w-full bg-[#eee] items-center justify-center p-5 space-y-5 rounded-sm">
      <div
        {...getRootProps()}
        className="rounded-md w-28 h-28 flex justify-center items-center bg-blue-400 cursor-pointer"
      >
        <label>
          <IoCloudUploadOutline className="text-3xl text-white cursor-pointer" />
        </label>
        <input className="hidden" {...getInputProps()} />
      </div>
      {isDragActive ? (
        <p>Thả tập tin tại đây...</p>
      ) : (
        <p>Kéo thả hoặc nhấp để thêm tập tin</p>
      )}
      {imgInfor ? (
        <div className="flex flex-col bg-gray-300 p-3 rounded-sm w-[80%] items-end shadow-xl">
          <Button
            onClick={() => handleDeleteImg()}
            type="button"
            className="w-8 h-8 bg-transparent hover:bg-transparent hover:text-gray-500 text-black "
          >
            <IoMdClose />
          </Button>

          <div className="flex flex-col w-full  ">
            <span className="truncate ">Tên tệp: {imgInfor?.name}</span>
            <span>Kích thước: {imgInfor?.size} kB</span>
            <div className="flex justify-between items-center">
              <span>Kiểu: {imgInfor?.type}</span>
              <a
                href={file ? URL.createObjectURL(file) : "#"}
                target="_blank"
                rel="noopener noreferrer"
                className=" rounded-md hover:text-blue-500 visited:text-purple-500"
              >
                Xem chi tiết
              </a>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex justify-center w-full px-10 pt-3">
        <Button
          type="button"
          effect="expandIcon"
          icon={ArrowRightIcon}
          disabled={isSubmit ? true : false}
          onClick={onSubmit}
          iconPlacement="right"
          className=" w-full"
        >
          Submit
        </Button>
      </div>
    </form>
  );
}
