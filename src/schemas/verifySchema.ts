import {z} from "zod"

const verifySchema = z.object({
    userId: z.string().uuid("Invalid user ID format"),
    
    verificationCode: z
      .string()
      .length(6, "Verification code must be exactly 6 characters long"),
  });
  
  export { verifySchema };
  
  // Example usage
  const verifyData = {
    userId: "550e8400-e29b-41d4-a716-446655440000",
    verificationCode: "123456",
  };
  
  const verifyResult = verifySchema.safeParse(verifyData);
  
  if (verifyResult.success) {
    console.log("Verification validation passed:", verifyResult.data);
  } else {
    console.log("Verification validation failed:", verifyResult.error.format());
  }
  