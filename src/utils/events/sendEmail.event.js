import { EventEmitter } from "node:events";
import { generateEmailTemplate, sendEmail } from "../email/email.js";
import { generateToken } from "../token/token.js";
export const emailEvent = new EventEmitter();
emailEvent.on("sendEmail", async (data) => {
  console.log("email event", data);
  const { email } = data;
  const emailToken = generateToken({
    payload: { email },
    signature: process.env.EMAIL_SIGNATURE,
  });
  const emailLink = `${process.env.FE_URL}/confirmEmail/${emailToken}`;
  const html = generateEmailTemplate(emailLink);
  await sendEmail({ to: email, subject: "Confirm-Email", html });
});
