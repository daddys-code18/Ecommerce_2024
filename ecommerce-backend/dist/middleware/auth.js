import { TryCatch } from "./error.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { User } from "../models/user-model.js";
export const adminOnly = TryCatch(async (req, res, next) => {
    const { id } = req.query;
    if (!id)
        return next(new ErrorHandler("Please Login First", 401));
    const user = await User.findById(id);
    if (!user)
        return next(new ErrorHandler("Invliad Id  ", 401));
    if (user.role !== "admin")
        return next(new ErrorHandler("Admin only access", 403));
    next();
});
