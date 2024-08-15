import {z} from "zod"

const signInSchema = z.object({
    email: z
      .string()
      .email("Invalid email address"),
    
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(100, "Password cannot exceed 100 characters"),
  });
  
  export { signInSchema };
  
  // Example usage
  const signInData = {
    email: "user@example.com",
    password: "Password123!",
  };
  
  const signInResult = signInSchema.safeParse(signInData);
  
  if (signInResult.success) {
    console.log("Sign-in validation passed:", signInResult.data);
  } else {
    console.log("Sign-in validation failed:", signInResult.error.format());
  }
  