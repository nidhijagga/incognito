import { z } from "zod";

const verificationSchema = z.object({
    email: z
      .string()
      .email("Invalid email format"),
      
    verificationCode: z
      .string()
      .length(6, "Verification code must be exactly 6 characters long"),
});

export { verificationSchema };
// Example usage
// const verifyData = {
//     email: "user@example.com",
//     verificationCode: "123456",
// };

// const verifyResult = verifySchema.safeParse(verifyData);

// if (verifyResult.success) {
//     console.log("Verification validation passed:", verifyResult.data);
// } else {
//     console.log("Verification validation failed:", verifyResult.error.format());
// }
