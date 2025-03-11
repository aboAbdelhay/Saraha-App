import { connectDB } from "./DB/connection.js";
import authController from "./modules/auth/auth.controller.js";
import userController from "./modules/user/user.controller.js";
import messageController from "./modules/message/message.controller.js";
import { globalErrorHandling } from "./utils/error/error.handling.js";
import cors from "cors";
const bootstrap = (app, express) => {
  app.use(cors());
  app.use(express.json());
  app.get("/", (req, res) => res.send("Hello World!"));
  app.use("/auth", authController);
  app.use("/user", userController);
  app.use("/message", messageController);
  app.use(globalErrorHandling);
  app.all("*", (req, res) => {
    return res.status(404).json({ message: "in-valid routing" });
  });
  connectDB();
};
export default bootstrap;
