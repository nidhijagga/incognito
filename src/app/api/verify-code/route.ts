import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";
import { ApiResponse } from "@/types/apiResponse";
import { z } from "zod";
import { verificationSchema } from "@/schemas/verificationSchema";

export async function POST(request: Request): Promise<NextResponse> {
    await dbConnect();

    try {
        const { email, verificationCode } = await request.json();
        const checkValidation = {
            email,
            verificationCode
        }

        const result = verificationSchema.safeParse(checkValidation)

        if (!result.success) {

            const verificationErrors = result.error.format()

            const errors: Record<string, string[]> = {};

            if (verificationErrors.email && verificationErrors.email._errors.length > 0) {
                errors.email = verificationErrors.email._errors;
            }

            if (verificationErrors.verificationCode && verificationErrors.verificationCode._errors.length > 0) {
                errors.verificationCode = verificationErrors.verificationCode._errors;
            }

            const response: ApiResponse = {
                statusCode: 400,
                message: "Validation Errors.",
                success: false,
                errors : errors
            }

            return NextResponse.json(response)
        }


        // Find the user with the provided email
        const user = await UserModel.findOne({ email });

        // Check if the user exists
        if (!user) {
            const response: ApiResponse = {
                success: false,
                message: "User not found.",
                statusCode: 404,
            };
            return NextResponse.json(response);
        }

        //Check if already verified
        if(user.isVerified){
            const response : ApiResponse = {
                success : false,
                message : "User is already verified.",
                statusCode : 400
            }
            return NextResponse.json(response)
        }

        // Check if the verification code has expired
        const currentDate = new Date();
        if (user.verifyCodeExpiry && user.verifyCodeExpiry <= currentDate) {
            const response: ApiResponse = {
                success: false,
                message: "Verification code has expired. Request a new verification code.",
                statusCode: 400,
            };
            return NextResponse.json(response);
        }

        // Check if the verification code is correct
        if (user.verificationCode !== verificationCode) {
            const response: ApiResponse = {
                success: false,
                message: "Invalid verification code.",
                statusCode: 400,
            };
            return NextResponse.json(response);
        }

        // If the verification code is correct and not expired, update the user's status
        user.isVerified = true;
        user.verificationCode = ""; // Clear the verification code after successful verification
        user.verifyCodeExpiry = null; // Clear the expiry date
        await user.save();

        const response: ApiResponse = {
            success: true,
            message: "Email verified successfully.",
            statusCode: 200,
        };
        return NextResponse.json(response);
    } catch (error) {
        console.error('Error verifying code:', error);
        const response: ApiResponse = {
            success: false,
            message: "Internal Server Error",
            statusCode: 500,
        };
        return NextResponse.json(response);
    }
}
