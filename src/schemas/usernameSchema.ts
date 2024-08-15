import { z } from 'zod';

const usernameSchema = z
  .string()
  .min(4, "Username must be at least 4 characters long")
  .regex(/[a-zA-Z]/, "Username must contain at least one alphabet")
  .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores");

export { usernameSchema };
