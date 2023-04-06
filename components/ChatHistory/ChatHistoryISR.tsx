import { getHistory } from "@/utils/database";
import { cookies } from "next/headers";
import ChatHistoryCSR from "./ChatHistoryCSR";

export default function ChatHistoryISR() {
  const sessionId = cookies().get("sessionId")?.value;
  const data = sessionId ? getHistory(sessionId) : [];

  return (
    <ChatHistoryCSR fallbackData={data} />
  );
}
