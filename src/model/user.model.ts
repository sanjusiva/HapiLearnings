import mongoose, { Document, Schema } from "mongoose";

interface User extends Document {
    name: string;
    age: number;
    phoneNumber: number;
    email: string;
  }
  
export const UserModel = mongoose.model<User>(
    "User",
    new Schema<User>(
      {
        name: { type: String, required: true },
        age: { type: Number, required: true },
        phoneNumber: { type: Number, required: true },
        email: { type: String, required: true },
      },
      { versionKey:false,
        collection: "userDetails" }
    )
  );