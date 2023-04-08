"use client";

import React from "react";
import MessageBox from "./MessageBox";
import { useStreamStore } from "@/utils/store";

export default function ChatStream() {
  const content = useStreamStore((state) => state.content);
  const bottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // auto scroll to bottom
    bottomRef.current!.scrollIntoView({ behavior: "instant" });
  }, [content]);

  // if (error) return <div>{error.message}</div>
  return (
    <>
      {content && <MessageBox role="assistant" content={content} />}
      <div ref={bottomRef} />
    </>
  );
}
