import mongoose, { model, Schema } from "mongoose";
import { roleTypes } from "../../middleware/auth.middleware.js";

export const genderTypes = {
  male: "male",
  female: "female",
};
const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: [true, "please enter your userName"],
      minlength: 2,
      maxlength: 50,
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: String,
    gender: { type: String, enum: Object.values(genderTypes), default: genderTypes.male },
    image: String, // image url
    DOB: Date, // date of birth
    confirmEmail: { type: Boolean, default: false },
    role: { type: String, enum: Object.values(roleTypes), default: "User" },
    changePasswordTime: Date,
    deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    // versionKey: false
  }
);
const userModel = mongoose.models.User || model("User", userSchema);
export default userModel;
