// import db from "@/utils/database";
import openai from "@/utils/openai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // get cookie session id
  const sessionId = req.cookies.get("sessionId")?.value;
  // if no session id, return error
  if (!sessionId) {
    return new NextResponse("Invalid session", { status: 400 });
  }
  // get message from request body
  const { message } = await req.json();

  try {
    const chatCompletion = await openai.createChatCompletion(
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Helpful assistant. Prefer concise answers.",
          },
          { role: "user", content: message },
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
