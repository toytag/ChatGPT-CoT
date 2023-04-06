// import db from "@/utils/database";
import openai from "@/utils/openai";
import { NextRequest, NextResponse } from "next/server";
import { getHistory } from "@/utils/database";

export async function POST(req: NextRequest) {
  // invalid session id will be handled by the middleware
  const sessionToken = req.cookies.get("sessionToken")!.value;
  // get query ?stream=true
  // const stream = req.query.get("stream") === "true";
  const stream = req.nextUrl.searchParams.get("stream") === "true";
  console.log("stream", stream);

  try {
    const chatCompletion = await openai.createChatCompletion(
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Helpful assistant. Prefer concise answers.",
          },
          ...getHistory(sessionToken),
        ],
        stream: false,
      },
      { responseType: stream ? "stream" : "json" }
    );

    if (stream)
      return new NextResponse(chatCompletion.data as unknown as ReadableStream);
    else
      return NextResponse.json(chatCompletion.data);
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
