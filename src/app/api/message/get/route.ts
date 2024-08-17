import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import MessageModel from "@/model/Msg";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { ApiResponse } from "@/types/apiResponse";

export async function POST(request: Request): Promise<NextResponse> {
	await dbConnect();

	const { page = 1, limit = 10 } = await request.json();

	// Get the session to check if the user is authenticated
	const session = await getServerSession(authOptions);

	if (!session || !session.user) {
		const response: ApiResponse = {
			statusCode: 401,
			message: "Unauthorized. Please log in.",
			success: false,
		};
		return NextResponse.json(response);
	}

	try {
		// Retrieve the user from the database
		const user = await UserModel.findOne({
			email: session.user.email,
		});

		if (!user) {
			const response: ApiResponse = {
				statusCode: 404,
				message: "User not found.",
				success: false,
			};
			return NextResponse.json(response);
		}

		// Use MongoDB aggregation to fetch the messages details with pagination
		const [totalMessages, messages] = await Promise.all([
			MessageModel.countDocuments({ _id: { $in: user.messages } }),
			MessageModel.aggregate([
				{
					$match: {
						_id: { $in: user.messages },
					},
				},
				{
					$sort: { createdAt: -1 },
				},
				{
					$skip: (page - 1) * limit,
				},
				{
					$limit: limit,
				},
				{
					$project: {
						_id: 1,
						content: 1,
						createdAt: 1,
					},
				},
			]),
		]);

		// Calculate total pages
		const totalPages = Math.ceil(totalMessages / limit);

		// Return the messages with total pages
		const response: ApiResponse = {
			statusCode: 200,
			message: "Messages retrieved successfully.",
			success: true,
			data: {
				messages,
				totalPages,
			},
		};

		return NextResponse.json(response);
	} catch (error) {
		const response: ApiResponse = {
			statusCode: 500,
			message: "An error occurred while retrieving messages.",
			success: false,
		};
		return NextResponse.json(response);
	}
}
