import { useState } from "react";
import { Check, Copy } from "lucide-react";
export function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  return (
    <div className="code-block">
      <div className="row spread">
        <span>TSX / TypeScript</span>
        <button
          aria-label="코드 복사"
          className="row"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(code);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            } catch {
              setError("복사할 수 없습니다. 코드를 직접 선택해 주세요.");
            }
          }}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}{" "}
          {copied ? "복사됨" : "복사"}
        </button>
      </div>
      <pre tabIndex={0}>
        <code>{code}</code>
      </pre>
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
