import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { sendVerificationEmail } from "@/helpers/sendVerification";
import { NextResponse } from "next/server";
import { ApiResponse } from "@/types/apiResponse";
import {z} from "zod";
import { emailSchema } from "@/schemas/emailSchema";

export async function POST(request: Request): Promise<NextResponse> {
    await dbConnect();

    try {
        const { email } = await request.json();

        const checkValidation = {email}

        const result = emailSchema.safeParse(checkValidation)

        if(!result.success){
            const response : ApiResponse = {
                success : false,
                statusCode : 400,
                message : "Invalid email format"
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

        // Check if the user is already verified
        if (user.isVerified) {
            const response: ApiResponse = {
                success: false,
                message: "User is already verified.",
                statusCode: 400,
            };
            return NextResponse.json(response);
        }

        let verificationCode = user.verificationCode || "";
        const currentDate = new Date();

        // Check if the existing verification code is expired
        if (!user.verifyCodeExpiry || user.verifyCodeExpiry <= currentDate) {
            // Generate a new verification code
            verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

            // Set a new expiry date for the verification code (e.g., 1 hour from now)
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            // Update the user's verification code and expiry date
            user.verificationCode = verificationCode;
            user.verifyCodeExpiry = expiryDate;
            await user.save();
        }

        // Send the verification email with the existing or new verification code
        const emailRes = await sendVerificationEmail(email, user.username, verificationCode);

        if (emailRes.success) {
            const response: ApiResponse = {
                success: true,
                message: "Verification code sent successfully.",
                statusCode: 200,
            };
            return NextResponse.json(response);
        } else {
            const response: ApiResponse = {
                success: false,
                message: emailRes.message,
                statusCode: 500,
            };
            return NextResponse.json(response);
        }
    } catch (error) {
        console.error('Error resending code:', error);
        const response: ApiResponse = {
            success: false,
            message: "Internal Server Error",
            statusCode: 500,
        };
        return NextResponse.json(response);
    }
}
