import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
export { default } from "next-auth/middleware";

// Middleware function
export async function middleware(request: NextRequest) {
	console.log("middleware");
	const token = await getToken({ req: request });
	const url = request.nextUrl;

	// Handle frontend routes
	if (!url.pathname.startsWith("/api")) {
		// Redirect authenticated users from sign-in/sign-up to dashboard
		if (
			token &&
			(url.pathname.startsWith("/signup") ||
				url.pathname.startsWith("/login") ||
				url.pathname === "/")
		) {
			return NextResponse.redirect(new URL("/dashboard", request.url));
		}

		// Redirect unauthenticated users trying to access protected frontend routes to login
		if (
			!token &&
			(url.pathname === "/" || url.pathname.startsWith("/dashboard"))
		) {
			return NextResponse.redirect(new URL("/login", request.url));
		}
	}

	// Handle backend API routes
	if (url.pathname.startsWith("/api")) {
		// Protect API routes from unauthorized access
		if (
			!token &&
			url.pathname !== "/api/sign-in" &&
			!url.pathname.startsWith("/api/sign-up") &&
			!url.pathname.startsWith("/api/verify-code") &&
			url.pathname !== "/api/message/post"
		) {
			return new NextResponse(
				JSON.stringify({
					error: "Unauthorized access. Please sign in.",
				}),
				{
					status: 401,
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
		}
	}

	return NextResponse.next();
}

// Path to run middleware on
export const config = {
	matcher: [
		"/api/sign-in",
		"/api/sign-up/:path*",
		"/api/verify-code/:path*",
		"/api/message/:path*",
		"/",
		"/dashboard/:path*",
		"/login",
		"/signup",
	],
};
