import joi from "joi";
import { generalFields, validateObjectId } from "../../middleware/validation.middleware.js";

export const updateProfile = joi
  .object()
  .keys({
    userName: generalFields.userName,
    phone: generalFields.phone,
    gender: generalFields.gender,
    DOB: joi.date().less("now"),
  })
  .required();
export const updatePassword = joi
  .object()
  .keys({
    oldPassword: generalFields.password.required(),
    password: generalFields.password.not(joi.ref("oldPassword")).required(),
    confirmationPassword: generalFields.confirmPassword.valid(joi.ref("password")).required(),
  })
  .required();
export const shareProfile = joi
  .object()
  .keys({
    userId: generalFields.id.required(),
  })
  .required();
