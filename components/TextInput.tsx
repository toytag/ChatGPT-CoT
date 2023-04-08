"use client";

import React from "react";
import TextareaAutosize from "react-textarea-autosize";
import useSWRMutation from "swr/mutation";
import type { Message, Role } from "@/utils/types";
import { useRouter } from "next/navigation";
import { useStreamStore } from "@/utils/store";
import { streamAsyncIterator } from "@/utils/stream";

async function sendMessage(url: RequestInfo, { arg }: { arg: Message }) {
  return fetch(url, {
    method: "PUT",
    body: JSON.stringify(arg),
  });
}

export default function TextInput() {
  const router = useRouter();
  const { trigger, isMutating } = useSWRMutation(
    "/api/chat/history",
    sendMessage
  );
  const [text, setText] = React.useState<string>("");
  const [content, setContent, appendContent] = useStreamStore((state) => [
    state.content,
    state.setContent,
    state.appendContent,
  ]);
  const [streaming, setStreaming] = React.useState<boolean>(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleSend = async () => {
    if (isMutating) return;
    if (text.trim().length === 0) return;

    // send message to server
    trigger(
      { role: "user", content: text },
      {
        optimisticData: (data: Message[] | undefined) =>
          data ? [...data, { role: "user" as Role, content: text }] : [],
        rollbackOnError: true,
      }
    );
    setText("");

    // streaming
    const stream = await fetch("/api/chat/completion", { method: "POST" });
    if (stream.body === null) return;
    let tmpContent = "";
    for await (const chunk of streamAsyncIterator(stream.body)) {
      (new TextDecoder()).decode(chunk).split("data: ").forEach((data) => {
        if (data.trim() === "[DONE]") return;
        // parse data json
        try {
          const { delta, finish_reason } = JSON.parse(data).choices[0];
          if (delta.content) {
            tmpContent += delta.content;
            appendContent(delta.content);
          }
        } catch (e: any) {
          console.log("data: ", data);
          console.log(e);
        }
      });
    }

    // upload stream response to server
    trigger(
      { role: "assistant", content: tmpContent },
      {
        optimisticData: (data: Message[] | undefined) =>
          data
            ? [...data, { role: "assistant" as Role, content: tmpContent }]
            : [],
        rollbackOnError: true,
      }
    );

    setContent("");
  };

  const handleStop = () => {
    console.log("stop");
  };

  return (
    <div className="sticky inset-x-0 bottom-4 z-50 mx-4 mb-4 mt-2 flex place-content-center">
      <div
        className="rounded-box flex h-fit w-full max-w-4xl border-4
        border-b-blue-400 border-l-red-400 border-r-green-400 border-t-yellow-400
        bg-base-100/75 shadow-xl backdrop-blur"
      >
        <TextareaAutosize
          // placeholder="Ask ChatGPT anything..."
          autoFocus
          ref={textareaRef}
          onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            // if (isMobile && !isTablet) return;
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (streaming) return;
              handleSend();
              // setStreaming(true);
            }
          }}
          value={text}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setText(e.target.value);
          }}
          className="scrollbar-hide focus:placeholder-hide textarea
            rounded-box h-16 max-h-[36vh] flex-grow resize-none border-x-0
            border-y-[16px] bg-transparent px-[16px] py-[2px] text-lg
            placeholder:italic focus:outline-none"
        />
        <label className="swap-rotate swap btn-ghost no-animation btn-circle btn m-2 self-end">
          <input
            type="checkbox"
            checked={streaming}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (streaming) {
                // stop receiving messages
                handleStop();
                // setStreaming(false);
              } else {
                // send message
                handleSend();
                // setStreaming(true);
              }
            }}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
            className="swap-off h-9 w-9"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
            className="swap-on h-9 w-9"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 019 14.437V9.564z"
            />
          </svg>
        </label>
      </div>
    </div>
  );
}
