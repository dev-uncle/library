// Handles forgot password using EMAIL and PHONE
const bcrpyt = require('bcrypt')
const UserModel = require('../models/signUpModel')
const UserOtpVerificationModel = require('../models/userOtpVerificationModel')
const { sendPasswordResetOtpEmail, sendPasswordResetSuccessEmail } = require('../utils/emailService')

// First we check email and phone then generate and email an OTP code, returning the UserId for Step 2
const postForgotPassword = async (req, res) => {
  const { email, phone } = req.body

  const checkEmailPhone = await UserModel.find({ email, phone })

  if (checkEmailPhone.length <= 0) {
    return res
      .status(400)
      .json({ success: false, message: `Invalid Email or Phone` })
  }

  const userId = checkEmailPhone[0]._id.toString()

  // Generate 4-digit OTP code for password reset
  const otp_Code = Math.floor(Math.random() * 9000 + 1000)
  const hashed_otpCode = await bcrpyt.hash(String(otp_Code), 10)

  // Upsert OTP verification entry with 5-minute expiration
  await UserOtpVerificationModel.findOneAndUpdate(
    { userId },
    {
      userId,
      userEmail: email,
      otpCode: hashed_otpCode,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    },
    { upsert: true, new: true }
  )

  // Send the password reset OTP code
  await sendPasswordResetOtpEmail(email, otp_Code)

  res.status(200).json({ 
    success: true, 
    userId, 
    message: `Verification code has been sent to your email.` 
  })
}

const patchUpdatePassword = async (req, res) => {
  const { userId, newPassword, otpCode } = req.body

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: `No User id to recover password` })
  }

  if (!otpCode) {
    return res
      .status(400)
      .json({ success: false, message: `OTP Code is required to reset password` })
  }

  const checkUser = await UserModel.findById(userId)
  if (!checkUser) {
    return res
      .status(400)
      .json({ success: false, message: `User doesn't exist` })
  }

  // Find OTP record
  const otpRecord = await UserOtpVerificationModel.findOne({ userId })
  if (!otpRecord) {
    return res
      .status(400)
      .json({ success: false, message: `No active password reset request found. Please request a new OTP.` })
  }

  // Validate OTP code
  const isOtpValid = await bcrpyt.compare(otpCode, otpRecord.otpCode)
  if (!isOtpValid) {
    return res
      .status(400)
      .json({ success: false, message: `Invalid OTP verification code` })
  }

  // Check expiration
  if (new Date() > otpRecord.expiresAt) {
    return res
      .status(400)
      .json({ success: false, message: `OTP code has expired. Please request a new one.` })
  }

  // Validate alphanumeric password with a must Special character
  const alphanumericRegex =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/

  const isPasswordValid = alphanumericRegex.test(newPassword)
  if (!isPasswordValid) {
    return res.status(400).json({
      success: false,
      message: 'Password must be alphanumeric and contain at least one special character',
    })
  }

  const updatedPassword = await bcrpyt.hash(newPassword, 10)

  // Update password
  await UserModel.findByIdAndUpdate(userId, {
    password: updatedPassword,
  })

  // Delete the OTP record to prevent reuse
  await UserOtpVerificationModel.deleteOne({ userId })

  // Send success confirmation email
  await sendPasswordResetSuccessEmail(checkUser.email, checkUser.username)

  res
    .status(200)
    .json({ success: true, message: `Password Changed Successfully` })
}

module.exports = { patchUpdatePassword, postForgotPassword }

