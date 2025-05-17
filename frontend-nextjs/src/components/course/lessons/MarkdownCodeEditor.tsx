import MarkdownIt from "markdown-it";
import "highlight.js/styles/a11y-light.min.css";
import hljs from "highlight.js";
import { Textarea } from "@/components/ui/textarea";
import arduino from "highlight.js/lib/languages/arduino";
hljs.registerLanguage("arduino", arduino);
// Khởi tạo markdown-it với highlight.js
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
    // Nếu không có lang, tự động detect
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
  // Nếu không có backtick, render toàn bộ như code block
  const code = hljs.highlight(value, {
    language: lang,
    ignoreIllegals: true,
  }).value;
  return `<pre><code class="hljs language-${lang}">${code}</code></pre>`;
}

export default function MarkdownCodeEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Textarea
        className="w-full border rounded p-2 font-mono min-h-[200px] mb-4 overflow-auto bg-white"
        value={value}
        
        onChange={(e) => onChange(e.target.value)}
        placeholder="Gõ code hoặc markdown ở đây..."
      />
      <div dangerouslySetInnerHTML={{ __html: renderMarkdownOrCode(value) }} />
    </div>
  );
}
