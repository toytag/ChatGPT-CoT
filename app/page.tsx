import MessageBox from "@/components/MessageBox";

export default function Home() {
  return (
    <div className="mx-8 flex max-w-4xl flex-col place-content-center">
      {/* <div className="h-[500px] w-full rounded bg-gradient-to-b from-red-500 via-orange-500 to-yellow-500"></div> */}
      <MessageBox
        role="User"
        content="Howdy! While fraudulent texts are dangerous scams, authentic notifications from banks can be useful for letting you know when you have a low funds in your checking account or a high credit card balance. How can you tell if a text message from your bank is real? Read on for tips to detect fake text messages and how to report phishing scams if you get hit by one."
      />
      <MessageBox role="ChatGPT" content="Hello World!" />
      {/* <div className="h-[500px] w-full rounded bg-gradient-to-b from-green-500 via-cyan-500 to-blue-500"></div> */}
    </div>
  );
}
