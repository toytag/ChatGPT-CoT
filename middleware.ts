import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4, validate, version } from "uuid";

const sIDtoCookie = (sessionID: string) => {
  return {
    name: "sessionID",
    value: sessionID,
    maxAge: 7 * 24 * 60 * 60,
    httpOnly: true,
    // secure: true,
  };
};

// This middleware will set a cookie with a session ID if one is not already set.
export function middleware(req: NextRequest) {
  const sessionID = req.cookies.get("sessionID")?.value;
  if (!sessionID || !validate(sessionID) || version(sessionID) !== 4) {
    if (req.nextUrl.pathname === "/") {
      const res = NextResponse.next();
      res.cookies.set(sIDtoCookie(uuidv4()));
      return res;
    }
    return new NextResponse(`Invalid sessionID: ${sessionID}`, { status: 400 });
  } else {
    if (req.nextUrl.pathname === "/") {
      const res = NextResponse.next();
      res.cookies.set(sIDtoCookie(sessionID));
      return res;
    }
    return NextResponse.next();
  }
}
