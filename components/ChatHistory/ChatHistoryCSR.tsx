"use client";

import React from "react";
import type { Message } from "@/utils/types";
import MessageBox from "./MessageBox";
import useSWR from "swr";

const fetcher = async (url: RequestInfo): Promise<Message[]> =>
  await fetch(url).then((res) => res.json());

export default function ChatHistoryCSR({
  fallbackData,
}: {
  fallbackData: Message[];
}) {
  const { data, error } = useSWR<Message[]>("/api/chat/history", fetcher, {
    suspense: true,
    fallbackData: fallbackData,
  });
  const bottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // auto scroll to bottom
    bottomRef.current!.scrollIntoView({ behavior: "smooth" });
  }, [data]);

  // if (error) return <div>Error: {error.message}</div>;
  // if (isLoading) return <div>Loading...</div>;
  return (
    <>
      {data!.map(({ role, content }: Message, idx: number) => (
        <MessageBox key={idx} role={role} content={content} />
      ))}
      <div ref={bottomRef} />
    </>
  );
}
