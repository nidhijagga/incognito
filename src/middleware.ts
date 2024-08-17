import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
export { default } from "next-auth/middleware";

// Middleware function
export async function middleware(request: NextRequest) {
	console.log("middleware");
	const token = await getToken({ req: request });
	const url = request.nextUrl;
	console.log("url.pathname", url.pathname);

	// Redirect authenticated users from sign-in/sign-up to home

	// (For a while commenting this code because, at this path sign-up/validate-username, this code will work which can create issues)

	// if (token && (url.pathname.startsWith('/sign-up') || url.pathname.startsWith('/sign-in'))) {
	//     return NextResponse.redirect(new URL('/home', request.url));
	// }

	// Redirect unauthenticated users trying to access protected routes
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

	return NextResponse.next();
}

// Path to run middleware on
export const config = {
	matcher: [
		"/api/sign-in",
		"/api/sign-up/:path*",
		"/api/verify-code/:path*",
		"/api/message/:path*",
	],
};
