import type { Message } from "@/utils/types";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

export default function MessageBox({ role, content }: Message) {
  return (
    <>
      <div
        className={`flex flex-col hyphens-auto break-words ${
          role === "user" ? "text-right" : "text-left"
        }`}
        lang="en"
      >
        <p
          className={`mb-1 font-bold underline decoration-2  ${
            role === "user" ? "text-orange-400" : "text-cyan-400"
          }`}
        >
          {role === "user" ? "USER" : "GPT"}
        </p>
        <ReactMarkdown
          className="text-lg"
          remarkPlugins={[remarkGfm]}
          // rehypePlugins={[rehypeHighlight]}
        >
          {content}
        </ReactMarkdown>
      </div>
      <div className="divider my-1" />
    </>
  );
}
