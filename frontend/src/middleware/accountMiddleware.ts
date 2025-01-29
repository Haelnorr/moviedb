import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function accountRedirect(request: NextRequest) {
  if (request.nextUrl.pathname === accountMiddleware.matcher) {
    return NextResponse.redirect(new URL("/account/general", request.url));
  }
}

const accountMiddleware = {
  matcher: "/account",
  handler: accountRedirect,
};

export default accountMiddleware;
