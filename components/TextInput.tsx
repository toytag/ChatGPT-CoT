"use client";

import React from "react";
import TextareaAutosize from "react-textarea-autosize";
import { isMobile, isTablet } from "react-device-detect";
import { useRouter } from "next/navigation";

import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import type { Message, Role } from "@/utils/types";

async function sendMessage(url: RequestInfo, { arg }: { arg: Message }) {
  return fetch(url, {
    method: "PUT",
    body: JSON.stringify(arg),
  });
}

export default function TextInput() {
  const { trigger, isMutating } = useSWRMutation(
    "/api/chat/history",
    sendMessage
  );
  const [text, setText] = React.useState<string>("");
  const [streaming, setStreaming] = React.useState<boolean>(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // React.useEffect(() => {
  //   textareaRef.current!.scrollIntoView({ behavior: "instant" });
  // }, [text]);

  const handleSend = () => {
    if (isMutating) return;
    if (text.trim().length > 0) {
      trigger(
        { role: "user", content: text },
        {
          optimisticData: (data: Message[] | undefined) =>
            data ? [...data, { role: "user" as Role, content: text }] : [],
          rollbackOnError: true,
        }
      );
    }
    setText("");
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
          placeholder="Ask ChatGPT anything..."
          autoFocus
          ref={textareaRef}
          onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (isMobile && !isTablet) return;
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
        <label className="swap-rotate swap btn-ghost btn-circle btn m-2 self-end">
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
            strokeWidth={1.5}
            stroke="currentColor"
            className="swap-off h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="swap-on h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z"
            />
          </svg>
        </label>
      </div>
    </div>
  );
}
