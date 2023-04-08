import { getHistory } from "@/utils/database";
import { cookies } from "next/headers";
import ChatHistoryCSR from "./ChatHistoryCSR";
import ChatStream from "./ChatStream";
import MessageBox from "./MessageBox";

export default function ChatHistory() {
  // initial request will have no sessionID, empty array will be returned
  const sessionID = cookies().get("sessionID")?.value;
  const data = sessionID ? getHistory(sessionID) : [];

  return (
    <>
      <MessageBox role="assistant" content="Hello, I'm ChatGPT. Ask me anything." />
      <ChatHistoryCSR fallbackData={data} />
      <ChatStream />
    </>
  );
}
