import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { backend_server } from '../../main'
import './forgot.css'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { 
  BsEnvelope, 
  BsPhone, 
  BsLock, 
  BsEye, 
  BsEyeSlash, 
  BsArrowLeft, 
  BsCheckCircleFill, 
  BsShieldLock 
} from 'react-icons/bs'

const ForgotPassword = () => {
  const ForgotPassword_API = `${backend_server}/api/v1/forgotpassword`

  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const [isEmailPhoneValid, setIsEmailPhoneValid] = useState(false)
  const [userId, setUserId] = useState(null)
  const [otpCode, setOtpCode] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const validateEmailPhone = await axios.post(ForgotPassword_API, {
        email,
        phone,
      })

      toast.success('Credentials validation Success')
      setIsEmailPhoneValid(true)
      setUserId(validateEmailPhone.data.userId)

      setEmail('')
      setPhone('')
    } catch (error) {
      console.log(error.response)
      toast.error(error.response.data.message)
    }
  }

  const handleGoBack = () => {
    navigate(-1) // Navigate back one page
  }

  // Updating Password
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMatch, setPasswordMatch] = useState(true)

  const handlePasswordFormSubmit = async (e) => {
    e.preventDefault()
    if (password === confirmPassword) {
      // Validate alphanumeric password with a must Special character
      const alphanumericRegex =
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/

      const isPasswordValid = alphanumericRegex.test(password)
      if (!isPasswordValid) {
        return toast(
          'Password must be alphanumeric and contain at least one special character',
          {
            icon: 'ℹ️',
          }
        )
      }

      try {
        const response = await axios.patch(ForgotPassword_API, {
          userId,
          newPassword: password,
          otpCode,
        })

        toast.success(response.data.message)

        setPassword('')
        setConfirmPassword('')
        setOtpCode('')
        setPasswordMatch(true)

        navigate('/login', { replace: true })
      } catch (error) {
        console.log(error.response)
        toast.error(error.response.data.message)
      }
    } else {
      setPasswordMatch(false)
      setTimeout(() => {
        setPasswordMatch(true)
      }, 3000)
    }
  }

  return (
    <div className='forgot-page-wrapper'>
      <div className='forgot-maindiv'>
        {/* Header */}
        <div className='forgot-upperdiv'>
          <h1>{isEmailPhoneValid ? 'Reset Password' : 'Recover Account'}</h1>
          <p className='forgot-subtitle'>
            {isEmailPhoneValid
              ? 'Create a strong, secure new password for your account.'
              : 'Enter your credentials to verify your account identity.'}
          </p>
        </div>

        {/* Stepper indicator */}
        <div className='forgot-stepper'>
          <div className={`step-item ${!isEmailPhoneValid ? 'active' : 'completed'}`}>
            <span className='step-number'>
              {isEmailPhoneValid ? <BsCheckCircleFill className='step-check-icon' /> : '1'}
            </span>
            <span className='step-label'>Verify</span>
          </div>
          <div className='step-line'></div>
          <div className={`step-item ${isEmailPhoneValid ? 'active' : ''}`}>
            <span className='step-number'>2</span>
            <span className='step-label'>Reset</span>
          </div>
        </div>

        {/* Body content */}
        <div className='forgot-middlediv'>
          {!isEmailPhoneValid ? (
            <form onSubmit={handleSubmit}>
              <div className='input-group-custom'>
                <label htmlFor='email'>Email Address</label>
                <div className='input-with-icon'>
                  <span className='input-icon'><BsEnvelope /></span>
                  <input
                    id='email'
                    type='email'
                    placeholder='name@example.com'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    name='email'
                    autoComplete='off'
                  />
                </div>
              </div>

              <div className='input-group-custom'>
                <label htmlFor='phone'>Phone Number</label>
                <div className='input-with-icon'>
                  <span className='input-icon'><BsPhone /></span>
                  <input
                    id='phone'
                    type='text'
                    placeholder='9XXXXXXXXX'
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    name='phone'
                    pattern='9\d{9}'
                    minLength='10'
                    maxLength='10'
                    autoComplete='off'
                  />
                </div>
                <span className='input-hint'>Must start with 9 and be 10 digits</span>
              </div>

              <button type='submit' className='forgot-btn-submit'>
                Verify Credentials
              </button>
            </form>
          ) : (
            <form onSubmit={handlePasswordFormSubmit}>
              <div className='input-group-custom'>
                <label htmlFor='otpCode'>Verification OTP Code</label>
                <div className='input-with-icon'>
                  <span className='input-icon'><BsShieldLock /></span>
                  <input
                    id='otpCode'
                    type='text'
                    placeholder='Enter 4-digit code'
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    required
                    maxLength='4'
                    pattern='\d{4}'
                    autoComplete='off'
                  />
                </div>
                <span className='input-hint'>Enter the 4-digit code sent to your email</span>
              </div>

              <div className='input-group-custom'>
                <label htmlFor='password'>New Password</label>
                <div className='input-with-icon'>
                  <span className='input-icon'><BsLock /></span>
                  <input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='••••••••'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete='off'
                  />
                  <span
                    className='password-toggle-icon'
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <BsEyeSlash /> : <BsEye />}
                  </span>
                </div>
                <span className='input-hint'>Alphanumeric with at least 1 special char</span>
              </div>

              <div className='input-group-custom'>
                <label htmlFor='confirmPassword'>Confirm Password</label>
                <div className='input-with-icon'>
                  <span className='input-icon'><BsShieldLock /></span>
                  <input
                    id='confirmPassword'
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder='••••••••'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete='off'
                  />
                  <span
                    className='password-toggle-icon'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <BsEyeSlash /> : <BsEye />}
                  </span>
                </div>
              </div>

              {!passwordMatch && (
                <div className='forgot-alert-error' role='alert'>
                  Passwords do not match. Please check and try again.
                </div>
              )}

              <button type='submit' className='forgot-btn-submit'>
                Update Password
              </button>
            </form>
          )}
        </div>

        {/* Footer/Go Back */}
        <div className='forgot-lowerdiv'>
          <button type='button' className='forgot-btn-back' onClick={handleGoBack}>
            <BsArrowLeft className='back-icon' /> Back
          </button>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword

