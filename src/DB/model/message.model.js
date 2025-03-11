import mongoose, { model, Schema } from "mongoose";

const messageSchema = new Schema(
  {
    message: {
      type: String,
      required: [true, "please enter your message"],
      minlength: 2,
      maxlength: 50000,
    },
    recipientId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    // versionKey: false
  }
);
export const messageModel = mongoose.models.message || model("message", messageSchema);
