import mongoose, {Schema, Document} from "mongoose";

export interface Message extends Document{
    content : string
    createdAt : Date
}

const MessageSchema : Schema<Message> = new Schema({
    content : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        required : true,
        default : Date.now
    }
})

const MessageModel = 
//Model Already Created
mongoose.models.Message as mongoose.Model<Message> || 
//Created for first Time
mongoose.model<Message>("Message", MessageSchema)


export default MessageModel;
