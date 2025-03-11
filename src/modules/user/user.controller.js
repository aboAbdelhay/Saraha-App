import { Router } from "express";
import { freezeAccount, shareProfile, updatePassword, updateProfile, userProfile } from "./services/user.service.js";
import { authentication, authorization } from "../../middleware/auth.middleware.js";
import { endPoint } from "./user.endpoint.js";
import * as validators from "./user.validation.js";
import { validation } from "../../middleware/validation.middleware.js";
const router = Router();

router.get("/profile", authentication(), authorization(endPoint.profile), userProfile);
router.patch("/profile", validation(validators.updateProfile), authentication(), authorization(endPoint.profile), updateProfile);
router.patch("/profile/password", validation(validators.updatePassword), authentication(), authorization(endPoint.profile), updatePassword);
router.delete("/profile", authentication(), authorization(endPoint.profile), freezeAccount);
router.get("/:userId/profile", validation(validators.shareProfile), shareProfile);

export default router;
