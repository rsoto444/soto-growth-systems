import { NextResponse, type NextRequest } from "next/server";

// growthleak.sotogrowthsystems.com used to be a separate app. Its home page is
// now the Growth Leak Score on this site; anything else on that address goes to
// the main site. Requests to the main domain pass straight through.
export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  if (!host.startsWith("growthleak.")) return NextResponse.next();
  const url = request.nextUrl.clone();
  if (url.pathname === "/") {
    url.pathname = "/growth-leak-score/";
    return NextResponse.rewrite(url);
  }
  return NextResponse.redirect(new URL(`${url.pathname}${url.search}`, "https://sotogrowthsystems.com"), 308);
}

export const config = {
  matcher: ["/((?!_next/|api/|fonts/|images/|favicon|icon|apple-icon|robots|sitemap|llms).*)"],
};
