import { getHistory } from "@/utils/database";
import { cookies } from "next/headers";
import ChatHistoryCSR from "./ChatHistoryCSR";

export default function ChatHistoryISR() {
  const sessionToken = cookies().get("sessionToken")?.value;
  const data = sessionToken ? getHistory(sessionToken) : [];

  return <ChatHistoryCSR fallbackData={data} />;
}
