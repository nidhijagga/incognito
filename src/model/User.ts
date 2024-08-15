import mongoose, { Schema, Document } from "mongoose";
import { Message } from "./Msg";

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verificationCode?: string;
    verifyCodeExpiry?: Date | null;
    isVerified: boolean;
    messages: Message[];
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const UserSchema: Schema = new Schema<User>({
    username: {
        type: String,
        required: [true, "UserName is required"],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],  
        unique: true,
        trim: true,
        match : [emailRegex, "Please Enter a valid Email Address"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]  
    },
    verificationCode: {
        type: String,
        default: ""
    },
    isVerified : {
        type: Boolean,
        default : false,
        required : true
    },
    verifyCodeExpiry: {
        type: Date,
        default: null
    },
    messages: [{
        type: Schema.Types.ObjectId,
        ref: "Message"
    }]
});

const UserModel = 
//Model Already Created
mongoose.models.User as mongoose.Model<User> || 
//Created for first Time
mongoose.model<User>("User", UserSchema)


export default UserModel;

