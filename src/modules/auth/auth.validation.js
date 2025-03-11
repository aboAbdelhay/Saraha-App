import joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";
export const signup = joi
  .object()
  .keys({
    userName: generalFields.userName.required(),
    email: generalFields.email.required(),
    password: generalFields.password.required(),
    confirmPassword: generalFields.confirmPassword
      .valid(joi.ref("password"))
      .required(),
    phone: generalFields.phone.required(),
    DOB: generalFields.DOB,
    "accept-language": generalFields.acceptLanguage,
  })
  .options({ allowUnknown: false })
  .required();

// export const signup_old = {
//   body: joi
//     .object()
//     .keys({
//       userName: joi.string().required(),
//       email: joi.string().email().required(),
//       password: joi.string().required(),
//       confirmPassword: joi.string().valid(joi.ref("password")).required(),
//       phone: joi.string().pattern(new RegExp("^[0-9]{10}$")).required(),
//     })
//     .options({ allowUnknown: false })
//     .required(),
//   query: joi
//     .object()
//     .keys({
//       lang: joi.string().valid("en", "ar").default("en"),
//     })
//     .required(),
//   params: joi
//     .object()
//     .keys({
//       flag: joi.string(),
//     })
//     .required(),
// };

export const login = joi
  .object()
  .keys({
    email: joi.string().email().required(),
    password: joi.string().required(),
  })
  .options({ allowUnknown: false })
  .required();
