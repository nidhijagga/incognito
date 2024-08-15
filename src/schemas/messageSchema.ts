import { z } from 'zod';

const messageSchema = z.object({
  senderId: z.string().uuid("Invalid sender ID format"),
  receiverId: z.string().uuid("Invalid receiver ID format"),
  message: z
    .string()
    .min(1, "Message cannot be empty")
    .max(1000, "Message cannot exceed 1000 characters"),
});

export { messageSchema };

// Example usage
const messageData = {
  senderId: "550e8400-e29b-41d4-a716-446655440000",
  receiverId: "550e8400-e29b-41d4-a716-446655440001",
  message: "Hello, how are you?",
};

const messageResult = messageSchema.safeParse(messageData);

if (messageResult.success) {
  console.log("Message validation passed:", messageResult.data);
} else {
  console.log("Message validation failed:", messageResult.error.format());
}
