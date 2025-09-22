"use client";
import CodeMirror from "@uiw/react-codemirror";
import { abcdef, githubLight } from "@uiw/codemirror-themes-all";
import { MdContentCopy } from "react-icons/md";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Headers, Languages, Themes } from "@/constant/constant";
import { langs } from "@uiw/codemirror-extensions-langs";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { fetchPrivateData, fetchPublicData } from "@/utils/fetcher/fetch-api";
import { set } from "lodash";
const themes = [
  { name: "Tối", theme: abcdef, value: "dark" },
  { name: "Sáng", theme: githubLight, value: "light" },
];
const languageExtension = (language: string) => {
  switch (language) {
    case "javascript":
      return langs.javascript();
    case "python":
      return langs.python();
    case "java":
      return langs.java();
    case "c":
      return langs.c();
    case "cpp":
      return langs.cpp();
    default:
      return langs.javascript();
  }
};
type CodeEditorProps = {
  readOnly?: boolean;
  code: string;
};
type Terminal = {
  status: boolean;
  message: string;
  output: string;
} | null;
export default function CodeEditor({
  readOnly = false,
  code,
}: CodeEditorProps) {
  const [language, setLanguage] = useState<string>(Languages[0].value);
  const [theme, setTheme] = useState(themes[0].value);
  const [newCode, setNewCode] = useState(code);
  const [terminal, setTerminal] = useState<Terminal>(null);
  const boardName = "arduino:avr:uno";
  const handleComplieCode = async () => {
    if (!newCode || !boardName) {
      toast.error("Vui lòng nhập mã nguồn và chọn board");
      return;
    }
    try {
      const res = await fetchPrivateData("/arduino/builds", {
        method: "POST",
        body: JSON.stringify({
          code: newCode,
          board: boardName,
        }),
        headers: Headers,
      });
      setTerminal({
        status: res.success,
        message: res.message,
        output: res.output,
      });
    } catch (error) {
      toast.error("Lỗi khi biên dịch mã nguồn");
    }
  };
  return (
    <div className="flex w-full flex-col items-center justify-center gap-5 rounded bg-gray-100 px-10 py-10">
      {readOnly ? null : (
        <div className="flex h-fit w-full justify-between">
          <div className="flex justify-end gap-2">
            <Button className="rounded-md border border-gray-200 bg-white text-black hover:bg-gray-300">
              Chạy
            </Button>
            <Button
              className="rounded-md border border-gray-200 bg-white text-black hover:bg-gray-300"
              onClick={handleComplieCode}
            >
              Nạp code
            </Button>

            <Button
              className="rounded-md border border-gray-200 bg-white text-black hover:bg-gray-300"
              onClick={handleComplieCode}
            >
              Chụp Ảnh KIT
            </Button>
          </div>
          <div className="flex justify-end gap-2">
            <Select
              onValueChange={(value) => setLanguage(value)}
              defaultValue={language}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Chọn ngôn ngữ" />
              </SelectTrigger>
              <SelectContent>
                {Languages.map((language) => (
                  <SelectItem key={language.value} value={language.value}>
                    {language.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value) =>
                setTheme(
                  themes.find((item) => item.value === value)?.value ?? "light",
                )
              }
              defaultValue={theme}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Chọn chủ đề" />
              </SelectTrigger>
              <SelectContent>
                {themes.map((item, index) => (
                  <SelectItem key={index} value={item.value}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      <div className="relative w-full">
        {readOnly ? (
          <div
            className="absolute top-6 right-2 z-20 flex cursor-pointer rounded-xs bg-gray-400 p-2 active:opacity-70"
            onClick={async () => {
              await navigator.clipboard.writeText(code);
            }}
          >
            <MdContentCopy className="text-xl text-gray-600" />
          </div>
        ) : null}
        <CodeMirror
          className="h-full w-full rounded-2xl"
          theme={theme === Themes.DARK ? abcdef : githubLight}
          height="490px"
          autoFocus
          readOnly={readOnly}
          basicSetup={{
            foldGutter: true,
            dropCursor: true,
            allowMultipleSelections: true,
            indentOnInput: true,
            autocompletion: true,
          }}
          extensions={[languageExtension(language)]}
          onChange={(value: string) => {
            setNewCode(value);
          }}
          value={code ?? ""}
        />
      </div>
      {readOnly ? null : (
        <div
          className={`flex h-[300px] w-full flex-col gap-2 overflow-y-auto rounded-md p-5 font-mono font-medium ${
            theme === Themes.DARK
              ? "bg-black text-white"
              : "bg-white text-gray-900"
          }`}
        >
          <div>OUTPUT</div>
          <div>
            {terminal?.status && (
              <div>Trạng thái: {terminal?.status ? "Thành công" : "Lỗi"}!</div>
            )}
            <div className="whitespace-pre-wrap">{terminal?.output}</div>
            <div className="">{terminal?.message}</div>
          </div>
        </div>
      )}
    </div>
  );
}
