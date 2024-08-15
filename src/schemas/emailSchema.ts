import { z } from "zod";

const emailSchema = z.object({
    email: z.string().email("Invalid email format"),
});

export { emailSchema };

// Example usage
// const resendData = {
//     email: "user@example.com",
// };

// const resendResult = emailSchema.safeParse(resendData);

// if (resendResult.success) {
//     console.log("Resend code validation passed:", resendResult.data);
// } else {
//     console.log("Resend code validation failed:", resendResult.error.format());
// }
