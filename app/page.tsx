import ChatHistoryISR from "@/components/ChatHistory/ChatHistoryISR";
import MessageBox from "@/components/ChatHistory/MessageBox";

export default function Home() {
  return (
    <div className="flex w-full max-w-4xl flex-col px-6">
      <div className="h-[70vh] w-full rounded bg-gradient-to-b from-red-500 via-orange-500 to-yellow-500"></div>
      <div className="divider mb-1" />
      <MessageBox
        role="user"
        content="Howdy! Summarize *Large Language Models are Zero-Shot Reasoners*"
      />
      <MessageBox
        role="assistant"
        content="The article proposes a zero-shot template-based prompting for chain of thought reasoning called Zero-shot-CoT. It differs from the original chain of thought prompting by not requiring step-by-step few-shot examples and is task-agnostic. The method uses prompting twice to extract both reasoning and answer. In the first step, the input question is modified into a prompt using a simple template, and in the second step, generated sentences are used to extract the final answer. The language model is fed the prompted text as input to generate sentences and parse the final answer."
      />
      <ChatHistoryISR />
    </div>
  );
}
