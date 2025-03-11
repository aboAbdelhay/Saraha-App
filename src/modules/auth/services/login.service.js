import userModel from "../../../DB/model/User.model.js";
import { roleTypes } from "../../../middleware/auth.middleware.js";
import * as bcrypt from "bcrypt";
import { successResponse } from "../../../utils/response/success.response.js";
import { generateToken } from "../../../utils/token/token.js";
import { asyncHandler } from "../../../utils/error/error.handling.js";
import { compareHash } from "../../../utils/hash/hash.js";

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new Error("In-Valid Account", { cause: 404 }));
  }
  if (!user.confirmEmail) {
    return next(new Error("please confirm your email first", { cause: 400 }));
  }
  if (!compareHash({ plainText: password, hashValue: user.password })) {
    return next(new Error("In-Valid Account credential", { cause: 404 }));
  }
  user.deleted = false;
  await user.save();
  const token = generateToken({
    payload: { _id: user._id, isLoggedIn: true },
    signature: user.role == roleTypes.User ? process.env.TOKEN_SIGNATURE : process.env.TOKEN,
    Option: {
      expiresIn: "1h",
      // "algorithm": "HS256",
    },
  });
  return successResponse({
    message: "Done",
    res,
    status: 200,
    data: { token },
  });
});
