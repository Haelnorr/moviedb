import accountMiddleware from "./middleware/accountMiddleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const middlewares = [accountMiddleware];

export function middleware(request: NextRequest) {
  for (const { matcher, handler } of middlewares) {
    if (request.nextUrl.pathname.startsWith(matcher)) {
      return handler(request);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: middlewares.map(({ matcher }) => matcher),
};
