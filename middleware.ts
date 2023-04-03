import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4, validate, version } from "uuid";

// This middleware will set a cookie with a session ID if one is not already set.
export function middleware(req: NextRequest) {
  const sessionId = req.cookies.get("sessionId")?.value;
  if (!sessionId || !validate(sessionId) || version(sessionId) !== 4) {
    if (req.nextUrl.pathname === "/") {
      const res = NextResponse.next();
      res.cookies.set({
        name: "sessionId",
        value: uuidv4(),
        maxAge: 3 * 24 * 60 * 60,
        httpOnly: true,
        // secure: true,
      });
      return res;
    }
    return new NextResponse("Invalid session", { status: 400 });
  }
  return NextResponse.next();
}

// export const config = {
//   matcher: [ "/", "/(api.*)" ],
// };
