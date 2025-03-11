import { messageModel } from "../../../DB/model/message.model.js";
import userModel from "../../../DB/model/User.model.js";
import { asyncHandler } from "../../../utils/error/error.handling.js";
import { successResponse } from "../../../utils/response/success.response.js";

export const sendMessage = asyncHandler(async (req, res, next) => {
  const { message, recipientId } = req.body;
  const user = await userModel.findOne({ _id: recipientId, deleted: false });
  if (!user) {
    return next(new Error("in-valid recipient", { cause: 404 }));
  }
  const newMessage = await messageModel.create({ message, recipientId });
  return successResponse({
    res,
    status: 201,
    message: "done",
  });
});
