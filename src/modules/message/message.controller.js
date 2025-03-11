import { Router } from "express";
import * as messageService from "./services/message.service.js";
import * as validators from "./message.validation.js";
import { validation } from "../../middleware/validation.middleware.js";
const router = Router();
router.post("/", validation(validators.sendMessage), messageService.sendMessage);
export default router;
