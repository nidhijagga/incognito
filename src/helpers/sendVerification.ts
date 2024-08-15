import { resend } from "@/lib/resend";
import VerificationEmailTemp from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/apiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verificationCode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'Incognito <incognito@resend.dev>',
            to: email,
            subject: 'Incognito Verification Code',
            react: VerificationEmailTemp({ userName: username, verificationCode: verificationCode }),
        });
        return {
            success: true,
            message: "Verification Code Send Successfully",
            statusCode: 200
        }
    } catch (error) {
        console.error("Error sending Verification Email : ", error)
        return {
            success: false,
            message: "Failed to send Verification Email",
            statusCode: 5000
        }
    }
}