import type { Message } from "@/utils/types";
import ReactMarkdown from "react-markdown";
import RemarkMath from "remark-math";
import RemarkBreaks from "remark-breaks";
import RehypeKatex from "rehype-katex";
import RemarkGfm from "remark-gfm";
import RehypeHighlight from "rehype-highlight";

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
          remarkPlugins={[RemarkMath, RemarkGfm, RemarkBreaks]}
          rehypePlugins={[
            RehypeKatex,
            [
              RehypeHighlight,
              {
                detect: false,
                ignoreMissing: true,
              },
            ],
          ]}
        >
          {content}
        </ReactMarkdown>
        {/* <p className="text-lg">{String.raw`${content}`}</p> */}
      </div>
      <div className="divider my-1" />
    </>
  );
}
