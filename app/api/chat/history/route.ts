import { NextRequest, NextResponse } from "next/server";
import { getHistory, addHistory, clearHistory } from "@/utils/database";

export async function GET(req: NextRequest) {
  // invalid session id will be handled by the middleware
  const sessionToken = req.cookies.get("sessionToken")!.value;
  try {
    // get history from database
    const history = getHistory(sessionToken);
    // return history as JSON
    return NextResponse.json(history);
  } catch (error: any) {
    // if error, return error
    return new NextResponse(error.message, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  // invalid session id will be handled by the middleware
  const sessionToken = req.cookies.get("sessionToken")!.value;
  try {
    // get message from request body
    const { role, content } = await req.json();
    // add message to database
    addHistory(sessionToken, role, content);
    // return success
    return new NextResponse("OK", { status: 201 });
  } catch (error: any) {
    // if error, return error
    return new NextResponse(error.message, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  // invalid session id will be handled by the middleware
  const sessionToken = req.cookies.get("sessionToken")!.value;
  try {
    // clear history from database
    clearHistory(sessionToken);
    // return success
    return new NextResponse("OK");
  } catch (error: any) {
    // if error, return error
    return new NextResponse(error.message, { status: 500 });
  }
}
