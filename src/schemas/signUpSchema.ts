import { z } from 'zod';
import { usernameSchema } from './usernameSchema';

const signUpSchema = z.object({
  username: usernameSchema,
  
  email: z
    .string()
    .email("Invalid email address"),
  
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(100, "Password cannot exceed 100 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
})
// .refine(data => data.password === data.confirmPassword, {
//   path: ["confirmPassword"],
//   message: "Passwords do not match",
// });

export { signUpSchema };

// Example of how to use the schema for validation
// const userData = {
//   username: "user123",
//   email: "user@example.com",
//   password: "Password123!",
//   confirmPassword: "Password123!",
// };

// const result = signUpSchema.safeParse(userData);

// if (result.success) {
//   console.log("Validation passed:", result.data);
// } else {
//   console.log("Validation failed:", result.error.format());
// }
