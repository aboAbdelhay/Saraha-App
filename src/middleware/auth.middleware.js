import jwt from "jsonwebtoken";
import userModel from "../DB/model/User.model.js";
import { asyncHandler } from "../utils/error/error.handling.js";
import { verifyToken } from "../utils/token/token.js";
export const roleTypes = {
  User: "User",
  Admin: "Admin",
  HR: "HR",
};
export const authentication = () => {
  return asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;

    const [Bearer, token] = authorization?.split(" ") || [];
    if (!Bearer || !token) {
      return next(new Error("Authentication required", { cause: 400 }));
    }
    let TOKEN_SIGNATURE = undefined;
    switch (Bearer) {
      case "Bearer":
        TOKEN_SIGNATURE = process.env.TOKEN_SIGNATURE;
        break;
      case "admin":
        TOKEN_SIGNATURE = process.env.TOKEN_SIGNATURE_ADMIN;
        break;
      default:
        break;
    }
    const decoded = verifyToken({ token, signature: TOKEN_SIGNATURE });

    if (!decoded?._id) {
      return next(new Error("Invalid token", { cause: 400 }));
    }
    const user = await userModel.findById(decoded._id);
    if (!user) {
      return next(new Error("User not found", { cause: 404 }));
    }
    if (parseInt((user.changePasswordTime?.getTime() || 0) / 1000) >= decoded.iat) {
      return next(new Error("expired credential", { cause: 400 }));
    }
    req.user = user;
    next();
  });
};

export const authorization = (accessRoles = []) => {
  return asyncHandler(async (req, res, next) => {
    if (!accessRoles.includes(req.user.role)) {
      return next(new Error("Access denied", { cause: 403 }));
    }
    next();
  });
};
