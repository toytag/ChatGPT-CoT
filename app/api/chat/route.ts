// @ts-check
import db from "@/utils/sqlite";
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

    chatCompletion.data.on("data", (chunk: Buffer) => {
      // buffer.toString();
      console.log(chunk.toString());

      // .forEach((s) => {
      //   s = s.trim();
      //   if (s == "[DONE]") {
      //     counter.push(null);
      //   } else if (s.indexOf("delta") >= 0) {
      //     const response = JSON.parse(s);
      //     if (response.choices?.length > 0) {
      //       const choice = response.choices[0];
      //       switch (choice.finish_reason) {
      //         case null:
      //           if (choice.delta?.content) {
      //             counter.push(choice.delta.content);
      //           }
      //           break;
      //         case "stop":
      //           counter.push(null);
      //           break;
      //       }
      //     }
      //   }
      // });
    });

    return new NextResponse(chatCompletion.data as ReadableStream);
  } catch (error) {
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
