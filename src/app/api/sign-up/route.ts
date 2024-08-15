import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { z } from "zod"
import { signUpSchema } from "@/schemas/signUpSchema";
import { sendVerificationEmail } from "@/helpers/sendVerification";
import { NextResponse } from "next/server";
import { ApiResponse } from "@/types/apiResponse"; // Assuming this is your custom type

export async function POST(request: Request): Promise<NextResponse> {
    await dbConnect();

    try {
        const { username, email, password } = await request.json();

        const signUpValidation = {
            username,
            email,
            password,
        }

        const result = signUpSchema.safeParse(signUpValidation)
        if (!result.success) {

            const signUpErrors = result.error.format();

            // Prepare individual error messages
            const errors: Record<string, string[]> = {};

            if (signUpErrors.username && signUpErrors.username._errors.length > 0) {
                errors.username = signUpErrors.username._errors;
            }
            if (signUpErrors.email && signUpErrors.email._errors.length > 0) {
                errors.email = signUpErrors.email._errors;
            }
            if (signUpErrors.password && signUpErrors.password._errors.length > 0) {
                errors.password = signUpErrors.password._errors;
            }


            const response: ApiResponse = {
                statusCode: 400,
                message: "Validation Errors",
                success: false,
                errors: errors
            }

            return NextResponse.json(response)
        }
        // Find any user with the given email, whether verified or not
        const existingUser = await UserModel.findOne({ email });

        let response: ApiResponse;

        // If a verified user exists with this email, return an error
        if (existingUser?.isVerified) {
            response = {
                statusCode: 400,
                message: "User already exists.",
                success: false,
            };
            return NextResponse.json(response);
        }

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedPassword = await bcrypt.hash(password, 10);
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);
        const currentDate = new Date()

        // If an unverified user exists & Verification Code not expired, update their verification code and expiry date
        if (existingUser) {
            if (existingUser.verifyCodeExpiry && existingUser.verifyCodeExpiry <= currentDate) {
                existingUser.verificationCode = verificationCode;
                existingUser.verifyCodeExpiry = expiryDate;
                await existingUser.save();
            }
        } else {
            // If no user exists with this email, create a new user
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verificationCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                messages: [],
            });
            await newUser.save();
        }

        // Send the verification email
        const emailRes = await sendVerificationEmail(
            email,
            username,
            existingUser?.verificationCode || verificationCode
        );

        if (emailRes.success) {
            response = {
                statusCode: 200,
                message: "Verification code sent.",
                success: true,
            };
        } else {
            response = {
                statusCode: 500,
                message: emailRes.message,
                success: false,
            };
        }

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error in registration:', error);
        const response: ApiResponse = {
            statusCode: 500,
            message: "Error in Registering User",
            success: false,
        };
        return NextResponse.json(response);
    }
}
