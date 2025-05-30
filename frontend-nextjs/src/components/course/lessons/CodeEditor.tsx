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
import { Languages, Themes } from "@/constant/constant";
import { langs } from "@uiw/codemirror-extensions-langs";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
export default function CodeEditor({
  readOnly = false,
  code,
}: CodeEditorProps) {
  const [language, setLanguage] = useState<string>(Languages[0].value);
  const [theme, setTheme] = useState(themes[0].value);

  return (
    <div className="w-full flex justify-center items-center gap-5 flex-col py-10 px-10 bg-gray-100">
      {readOnly ? null : (
        <div className="w-full h-fit flex justify-between">
          <div className="flex justify-end gap-2">
            <Button className="bg-green-500 text-white">Chạy</Button>
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
                  themes.find((item) => item.value === value)?.value ?? "light"
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
      <div className="w-full relative">
        {readOnly ? (
          <div
            className=" absolute top-6 active:opacity-70 cursor-pointer right-2 p-2 bg-gray-400 z-20 flex rounded-xs"
            onClick={async () => {
              await navigator.clipboard.writeText(code);
            }}
          >
            <MdContentCopy className=" text-xl text-gray-600" />
          </div>
        ) : null}
        <CodeMirror
          className="w-full h-full rounded-2xl"
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
          onChange={(value) => {
            console.log(value);
          }}
          value={code}
        />
      </div>
      {readOnly ? null : (
        <div
          className={`w-full h-[300px] flex p-5 gap-2 overflow-y-auto rounded-md font-mono font-medium
           ${
             theme === Themes.DARK
               ? " bg-black text-white"
               : " bg-white text-gray-900"
           }`}
        >
          GET /test 200 in 525ms ✓ Compiled in 510ms |
        </div>
      )}
    </div>
  );
}
