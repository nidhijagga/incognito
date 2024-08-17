import { Message } from "@/model/Msg";

export interface ApiResponse {
	success: boolean;
	message: string;
	statusCode: number;
	messages?: Array<Message>;
	errors?: object; // For Validation Errors
	data?: object;
}
