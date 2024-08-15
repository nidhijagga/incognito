import NextAuth from "next-auth";
import { authOptions } from "./options";

const handler = NextAuth(authOptions)

console.log('handler', handler)

export {handler as GET , handler as POST}