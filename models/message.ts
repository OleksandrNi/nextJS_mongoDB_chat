import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  title: string;
  content: string;
  author: string;
  comments: IComment[];
}

export interface IComment {
  content: string;
  author: string;
}

const CommentSchema = new Schema<IComment>(
  {
    content: { type: String, required: true },
    author: { type: String, required: true },
  },
  { timestamps: true }
);

const MessageSchema = new Schema<IMessage>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    comments: [CommentSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);
