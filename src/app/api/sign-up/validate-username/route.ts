import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameSchema } from "@/schemas/usernameSchema";
import { z } from "zod"
import { NextResponse } from "next/server";
import { ApiResponse } from "@/types/apiResponse";

const usernameQuerySchema = z.object({
    username : usernameSchema
})
export async function POST(request: Request): Promise<NextResponse> {
    await dbConnect();
    try {
        const { username } = await request.json();

        //This need to be done because usernameQuerySchema needs object only
        const checkUsername = {
            username : username
        }

        const result = usernameQuerySchema.safeParse(checkUsername)

        if(!result.success){
            const usernameErrors = result.error.format()
            // Prepare individual error messages
            const errors: Record<string, string[]> = {};

            if (usernameErrors.username && usernameErrors.username._errors.length > 0) {
                errors.username = usernameErrors.username._errors;
            }
            const response: ApiResponse = {
                statusCode: 400,
                message: "Invalid username",
                success: false,
                errors: errors
            }
            return NextResponse.json(response);
        }

        const existingUser = await UserModel.findOne({ username });

        const response: ApiResponse = existingUser
            ? {
                statusCode: 200,
                message: "Username is already taken.",
                success: false,
            }
            : {
                statusCode: 200,
                message: "Username is available.",
                success: true,
            };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error checking username:', error);
        const errorResponse: ApiResponse = {
            statusCode: 500,
            message: "Internal Server Error",
            success: false,
        };
        return NextResponse.json(errorResponse);
    }
}
