"use client";

import React from "react";
import TextareaAutosize from "react-textarea-autosize";
import { isMobile, isTablet } from "react-device-detect";

export default function TextInput() {
  const [text, setText] = React.useState<string>("");
  // const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const bottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    bottomRef.current!.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleSubmit = () => {
    console.log(text);
    setText("");
  };

  return (
    <>
      <div className="sticky inset-x-0 bottom-4 mx-4 mb-4 mt-2 flex place-content-center">
        <div className="rounded-box flex h-fit w-full max-w-4xl border-4 border-l-red-400 border-t-yellow-400 border-r-green-400 border-b-blue-400 bg-base-100/75 shadow-xl backdrop-blur">
          <TextareaAutosize
            placeholder="Ask ChatGPT anything..."
            // ref={textareaRef}
            autoFocus
            onKeyDown={(e) => {
              if (isMobile && !isTablet) return;
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="scrollbar-hide focus:placeholder-hide textarea rounded-box h-16 max-h-[36vh] flex-grow resize-none border-x-0 border-y-[16px] bg-transparent px-[16px] py-[2px] text-lg placeholder:italic focus:outline-none"
          />
          <button
            onClick={handleSubmit}
            className="btn-ghost btn-circle btn m-2 self-end"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          </button>
        </div>
      </div>
      <div ref={bottomRef} />
    </>
  );
}
