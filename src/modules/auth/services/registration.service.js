import userModel from "../../../DB/model/User.model.js";
import { emailEvent } from "../../../utils/events/sendEmail.event.js";
import { asyncHandler } from "../../../utils/error/error.handling.js";
import { successResponse } from "../../../utils/response/success.response.js";
import { verifyToken } from "../../../utils/token/token.js";
import { generateHash } from "../../../utils/hash/hash.js";
import { generateEncryption } from "../../../utils/hash/encryption.js";

export const signup = asyncHandler(async (req, res, next) => {
  const { userName, email, password, confirmPassword, phone,DOB } = req.body;
  if (password !== confirmPassword) {
    return next(new Error("Passwords do not match confirmPassword", { cause: 400 }));
  }
  const checkUser = await userModel.findOne({ email });
  if (checkUser) {
    return next(new Error("Email exist", { cause: 409 }));
  }
  const encryptPhone = generateEncryption({ plainText: phone });
  const hashPassword = generateHash({ plainText: password, salt: 9 });
  const { _id } = await userModel.create({
    userName,
    email,
    password: hashPassword,
    phone: encryptPhone,
    DOB,
  });
  emailEvent.emit("sendEmail", { email });
  return successResponse({
    res,
    status: 201,
    message: "User created successfully",
    data: { user: _id },
  });
});
export const confirmEmail = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;
  const { email } = verifyToken({
    token: authorization,
    signature: process.env.EMAIL_SIGNATURE,
  });
  const user = await userModel.findOneAndUpdate({ email }, { confirmEmail: true });
  return successResponse({
    res,
    status: 200,
    message: "Done",
    data: { user },
  });
});
