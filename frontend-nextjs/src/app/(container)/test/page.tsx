"use client";

import React, { useState } from "react";
import MarkdownIt from "markdown-it";
import "highlight.js/styles/a11y-light.min.css";
import hljs from "highlight.js";
import { Textarea } from "@/components/ui/textarea";
import arduino from "highlight.js/lib/languages/arduino";
hljs.registerLanguage("arduino", arduino);

const mdParser = MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str: string, lang: string): string {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre><code class="hljs language-${lang}">${
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
        }</code></pre>`;
      } catch (__) {
        console.log(__);
      }
    }
    const auto = hljs.highlightAuto(str);
    return `<pre><code class="hljs ${
      auto.language ? "language-" + auto.language : ""
    }">${auto.value}</code></pre>`;
  },
});

function renderMarkdownOrCode(value: string, lang = "cpp") {
  if (/```/.test(value)) {
    return mdParser.render(value);
  }
  const code = hljs.highlight(value, {
    language: lang,
    ignoreIllegals: true,
  }).value;
  return `<pre><code class="hljs language-${lang}">${code}</code></pre>`;
}
const App = () => {
  const [showComponent, setShowComponent] = useState(true);
  const [isCode, setCode] = useState("");
  return (
    <div>
      <button onClick={() => setShowComponent((prev) => !prev)}>
        {showComponent ? "Ẩn Component" : "Hiện Component"}
      </button>

      <Textarea
        className="w-full border rounded p-2 font-mono min-h-[200px] mb-4 overflow-auto bg-white"
        value={isCode}
        onChange={(e) => setCode(e.target.value)}
        dangerouslySetInnerHTML={{ __html: renderMarkdownOrCode(isCode) }}
        placeholder="Gõ code hoặc markdown ở đây..."
      />
    </div>
  );
};

export default App;
