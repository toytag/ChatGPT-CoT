// import db from "@/utils/database";
import openai from "@/utils/openai";
import { NextRequest, NextResponse } from "next/server";
import { getHistory } from "@/utils/database";

export async function POST(req: NextRequest) {
  // invalid session id will be handled by the middleware
  const sessionID = req.cookies.get("sessionID")!.value;

  try {
    const chatCompletion = await openai.createChatCompletion(
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible. Knowledge cutoff: ${"Sep 2021"} Current date: ${new Date().toLocaleDateString(
              "en-US",
              { month: "short", year: "numeric" }
            )}`,
          },
          ...getHistory(sessionID),
        ],
        stream: true,
      },
      { responseType: "stream" }
    );
    return new NextResponse(chatCompletion.data as unknown as ReadableStream);
  } catch (error: any) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      return new NextResponse(JSON.stringify(error.response.data), {
        status: error.response.status,
      });
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      return new NextResponse("An error occurred during your request.", {
        status: 500,
      });
    }
  }
}
