import joi from "joi";
import { genderTypes } from "../DB/model/User.model.js";
import { Types } from "mongoose";

export const validateObjectId = (value, helper) => {
  return Types.ObjectId.isValid(value) ? true : helper.message("In-valid ObjectId");
};

export const generalFields = {
  userName: joi.string().min(2).max(25),
  email: joi
    .string()
    .email({ minDomainSegments: 2, maxDomainSegments: 3, tlds: { allow: ["com", "net"] } })
    .message({
      "string.email": "Email must be a valid email",
      "string.empty": "Email cannot be  empty",
      "any.required": "Email is required",
    }),
  password: joi.string().pattern(new RegExp(/^(?=.*d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)),
  confirmPassword: joi.string(),
  phone: joi.string().pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/)),
  acceptLanguage: joi.string().valid("en", "ar").default("en"),
  gender: joi.string().valid(genderTypes.male, genderTypes.female),
  DOB: joi.date(),
  id: joi.string().custom(validateObjectId),
  
};

export const validation = (schema) => {
  return (req, res, next) => {
    const inputDate = { ...req.body, ...req.query, ...req.params };
    if (req.headers["accept-language"]) {
      inputDate["accept-language"] = req.headers["accept-language"];
    }
    const validationError = schema.validate(inputDate, { abortEarly: false });
    if (validationError.error) {
      return res.status(400).json({
        message: "validation Error",
        validationError: validationError.error.details,
      });
    }
    return next();
  };
};

// export const validation_old = (schema) => {
//   return (req, res, next) => {
//     const validationResult = [];
//     for (const key of Object.keys(schema)) {
//       const validationError = schema[key].validate(req[key], {
//         abortEarly: false,
//       });
//       if (validationError.error) {
//         validationResult.push(validationError.error.details);
//       }
//     }
//     if (validationResult.length > 0) {
//       return res.status(400).json({
//         message: "validation Error",
//         validationResult,
//       });
//     }
//     return next();
//   };
// };
