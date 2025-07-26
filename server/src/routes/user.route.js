import { Router } from 'express'
import { forgetPasswordUser, loginUser, logoutUser, registerUser,reLoginUser,resetForgetPassword,updateAvatar,updateUserDetails,uploadUserAvatar,verifyEmailUser, verifyOTP , getCurrentUser} from '../controllers/user.controller.js'
import { upload } from '../middlewares/multer.middleware.js'
import { auth } from '../middlewares/auth.middleware.js'

const router = Router()

router.post("/register",upload.single("avatar"),registerUser)
router.put("/upload-avatar",auth,upload.single("avatar"),uploadUserAvatar)
router.get("/verify-email",verifyEmailUser)
router.post("/login",loginUser)
router.put("/logout",auth,logoutUser)
router.put("/update-user-details",auth,updateUserDetails)
router.put("/update-avatar",auth,upload.single("avatar"),updateAvatar)
router.post("/forget-password",forgetPasswordUser)
router.post("/verify-otp",verifyOTP)
router.put("/reset-password",resetForgetPassword)
router.post("/relogin",reLoginUser)
router.get("/current-user",auth, getCurrentUser)
export default router