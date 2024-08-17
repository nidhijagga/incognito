import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import MessageModel from "@/model/Msg";
import { ApiResponse } from "@/types/apiResponse";
import { Message } from "@/model/Msg";

export async function POST(request: Request): Promise<NextResponse> {
	await dbConnect();

	const { username, content } = await request.json();

	try {
		const user = await UserModel.findOne({ username });

		if (!user) {
			const response: ApiResponse = {
				statusCode: 400,
				message: "User Not Found.",
				success: false,
			};
			return NextResponse.json(response);
		}

		// Create a new message and ensure TypeScript understands the type
		const newMessage = (await MessageModel.create({
			content: content,
			createdAt: new Date(),
		})) as Message;

		// Push the entire message object into the user's messages array
		user.messages.push(newMessage); // Directly push the message object
		await user.save();

		const response: ApiResponse = {
			statusCode: 200,
			message: "Message sent successfully.",
			success: true,
			data: newMessage,
		};

		return NextResponse.json(response);
	} catch (error) {
		const response: ApiResponse = {
			statusCode: 500,
			success: false,
			message: "An error occurred while sending the message.",
		};

		return NextResponse.json(response);
	}
}
