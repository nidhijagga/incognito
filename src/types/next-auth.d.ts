import nextAuth, { DefaultSession } from "next-auth";
import { Message } from "@/model/Msg";

declare module 'next-auth' {
    interface User {
        _id?: string,
        username?: string;
        email?: string;
        isVerified?: boolean;
    }
    interface Session {
        user: User & DefaultSession['user']
    }
}