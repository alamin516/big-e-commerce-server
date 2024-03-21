const express = require("express");
const {
  getUsers,
  getUserById,
  deleteUserById,
  processRegister,
  processActivateUser,
  updateUserById,
  handleManageUserStatusById,
  handleUpdatePassword,
  handleForgetPassword,
  handleResetPassword,
} = require("../controllers/userController");
const upload = require("../middlewares/uploadFile");
const { validateUserRegistration, validateNewPassword, validateUserForgetPassword, validateUserResetPassword} = require("../validators/auth");
const runValidation = require("../validators");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middlewares/auth");
const userRouter = express.Router();

userRouter.post(
  "/process-register",
  upload.single("image"),
  isLoggedOut,
  validateUserRegistration,
  runValidation,
  processRegister
); 

userRouter.post("/activate", isLoggedOut, processActivateUser);
userRouter.get("/", isLoggedIn, isAdmin, getUsers);
userRouter.get("/:id([0-9a-fA-F]{24})", isLoggedIn, getUserById);
userRouter.put("/reset-password", validateUserResetPassword, runValidation, handleResetPassword);
userRouter.put("/:id([0-9a-fA-F]{24})", upload.single("image"), isLoggedIn, updateUserById);
userRouter.delete("/:id([0-9a-fA-F]{24})", isLoggedIn, isAdmin, deleteUserById);

userRouter.put("/user-status/:id([0-9a-fA-F]{24})", isLoggedIn, isAdmin, handleManageUserStatusById);
// userRouter.put(
//   "/unbanned-user/:id([0-9a-fA-F]{24})",
//   isLoggedIn,
//   isAdmin,
//   HandleUnbannedUserById
// );

userRouter.put("/update-password/:id([0-9a-fA-F]{24})", validateNewPassword, runValidation, isLoggedIn, handleUpdatePassword);
userRouter.post("/forget-password", validateUserForgetPassword, runValidation, handleForgetPassword);


module.exports = userRouter;
