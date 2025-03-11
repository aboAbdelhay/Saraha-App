import CryptoJS from "crypto-js";
import { successResponse } from "../../../utils/response/success.response.js";
import { decodeEncryption, generateEncryption } from "../../../utils/hash/encryption.js";
import { asyncHandler } from "../../../utils/error/error.handling.js";
import userModel from "../../../DB/model/User.model.js";
import { compareHash, generateHash } from "./../../../utils/hash/hash.js";
import { messageModel } from "../../../DB/model/message.model.js";

// export const listUsers = async (req, res, next) => {
//   try {
//     const users = await userModel.find().toArray();
//     return res.status(200).json({ message: "Done", users });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Error",
//       errMessage: error.message,
//       stack: error.stack,
//     });
//   }
// };

export const shareProfile = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.params.userId).select("userName image gender DOB");
  return user ? successResponse({ res, message: "Done", status: 200, data: { user } }) : next(new Error("In-valid account Id", { cause: 404 }));
});
export const userProfile = asyncHandler(async (req, res, next) => {
  req.user.phone = decodeEncryption({ signature: req.user.phone });
  const messages = await messageModel.find({ recipientId: req.user._id }).populate([
    {
      path: "recipientId",
      select: "-password",
    },
  ]);
  return successResponse({ res, message: "Done", status: 200, data: { user: req.user, messages } });
});
export const updateProfile = asyncHandler(async (req, res, next) => {
  if (req.body.phone) {
    req.body.phone = generateEncryption({ signature: req.body.phone });
  }
  const user = await userModel.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true });
  return successResponse({
    res,
    message: "Done",
    status: 200,
    data: { user },
  });
});
export const updatePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, password } = req.body;
  if (!compareHash({ plainText: oldPassword, hashValue: req.user.password })) {
    return next(new Error("Old password is incorrect", { cause: 400 }));
  }
  const hashPassword = generateHash({ plainText: password });
  const user = await userModel.findByIdAndUpdate(req.user._id, { password: hashPassword, changePasswordTime: Date.now() }, { new: true, runValidators: true });
  return successResponse({
    res,
    message: "Done",
    status: 200,
    data: { user },
  });
});
export const freezeAccount = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(req.user._id, { deleted: true, changePasswordTime: Date.now() }, { new: true, runValidators: true });
  return successResponse({
    res,
    message: "Done",
    status: 200,
    data: { user },
  });
});
