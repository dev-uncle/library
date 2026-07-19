import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { backend_server } from '../../main'
import '../auth/auth-page.css'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { BsEye, BsEyeSlash, BsShieldLock } from 'react-icons/bs'
import { FaGraduationCap, FaEnvelope, FaLock, FaBookOpen, FaPhone } from 'react-icons/fa'

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
    const loadingId = toast.loading('Validating credentials...', { position: 'top-center', duration: Infinity })
    try {
      const validateEmailPhone = await axios.post(ForgotPassword_API, {
        email,
        phone,
      })

      toast.dismiss(loadingId)
      toast.success('Credentials validation Success')
      setIsEmailPhoneValid(true)
      setUserId(validateEmailPhone.data.userId)

      setEmail('')
      setPhone('')
    } catch (error) {
      toast.dismiss(loadingId)
      console.log(error.response)
      toast.error(error.response?.data?.message || 'Validation failed')
    }
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

      const loadingId = toast.loading('Updating password...', { position: 'top-center', duration: Infinity })
      try {
        const response = await axios.patch(ForgotPassword_API, {
          userId,
          newPassword: password,
          otpCode,
        })

        toast.dismiss(loadingId)
        toast.success(response.data.message)

        setPassword('')
        setConfirmPassword('')
        setOtpCode('')
        setPasswordMatch(true)

        navigate('/login', { replace: true })
      } catch (error) {
        toast.dismiss(loadingId)
        console.log(error.response)
        toast.error(error.response?.data?.message || 'Password update failed')
      }
    } else {
      setPasswordMatch(false)
      setTimeout(() => {
        setPasswordMatch(true)
      }, 3000)
    }
  }

  return (
    <div className='auth-wrapper' data-mode='login'>
      
      {/* ━━━ PANEL 1: Hero (Left) ━━━━━━━━━━━━━━━━━━━ */}
      <div className='auth-panel auth-hero-panel auth-login-hero'>
        <div className='auth-overlay'></div>
        <div className='auth-hero-content'>
          <div className='auth-hero-badge'>
            <FaGraduationCap size={24} />
            <span>Colegio de Montalban</span>
          </div>
          <h1 className='auth-hero-heading'>
            Account Recovery Portal
          </h1>
          <p className='auth-hero-subtext'>
            Verify your registration details to securely reset your password and regain access to the CdM Library system.
          </p>
          <div className='auth-feature-card'>
            <div className='feature-icon'><FaBookOpen /></div>
            <div>
              <h5 className='feature-title'>Safe & Secure Reset</h5>
              <p className='feature-desc'>Your credentials are encrypted and verified using multi-factor identity checks.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ━━━ PANEL 2: Form (Right) ━━━━━━━━━━━━━━━━━━ */}
      <div className='auth-panel auth-form-panel auth-login-form'>
        <div className='auth-grid-pattern'></div>
        <div className='auth-ambient-glow'></div>
        <div className='auth-form-container'>
          <div className='mb-4'>
            <span className='auth-kicker'>CdM Library Management System</span>
            <h2 className='auth-title'>
              {isEmailPhoneValid ? 'Reset Password' : 'Recover Account'}
            </h2>
            <p className='auth-subtitle'>
              {isEmailPhoneValid
                ? 'Create a strong, secure new password for your account.'
                : 'Enter your credentials to verify your account identity.'}
            </p>
          </div>

          {!isEmailPhoneValid ? (
            <form onSubmit={handleSubmit}>
              <div className='form-group mb-3'>
                <label className='auth-label' htmlFor='forgot-email'>Email Address</label>
                <div className='auth-input-group'>
                  <span className='auth-input-icon'><FaEnvelope /></span>
                  <input
                    id='forgot-email'
                    type='email'
                    placeholder='student@cdm.edu.ph'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    name='email'
                    autoComplete='off'
                    required
                    className='auth-input'
                  />
                </div>
              </div>

              <div className='form-group mb-4'>
                <label className='auth-label' htmlFor='forgot-phone'>Phone Number</label>
                <div className='auth-input-group'>
                  <span className='auth-input-icon'><FaPhone /></span>
                  <input
                    id='forgot-phone'
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
                    className='auth-input'
                  />
                </div>
                <span className='form-text text-muted' style={{ fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                  Must start with 9 and be 10 digits
                </span>
              </div>

              <button type='submit' className='auth-submit-btn'>Verify Credentials</button>
            </form>
          ) : (
            <form onSubmit={handlePasswordFormSubmit}>
              <div className='form-group mb-3'>
                <label className='auth-label' htmlFor='otpCode'>Verification OTP Code</label>
                <div className='auth-input-group'>
                  <span className='auth-input-icon'><BsShieldLock size={18} /></span>
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
                    className='auth-input'
                  />
                </div>
                <span className='form-text text-muted' style={{ fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                  Enter the 4-digit code sent to your email
                </span>
              </div>

              <div className='form-group mb-3'>
                <label className='auth-label' htmlFor='password'>New Password</label>
                <div className='auth-input-group auth-password-field'>
                  <span className='auth-input-icon'><FaLock /></span>
                  <input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Enter new password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete='off'
                    className='auth-input'
                  />
                  <button
                    type='button'
                    className='auth-password-toggle'
                    onClick={() => setShowPassword(prev => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <BsEye /> : <BsEyeSlash />}
                  </button>
                </div>
                <span className='form-text text-muted' style={{ fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                  Alphanumeric with at least 1 special char
                </span>
              </div>

              <div className='form-group mb-4'>
                <label className='auth-label' htmlFor='confirmPassword'>Confirm Password</label>
                <div className='auth-input-group auth-password-field'>
                  <span className='auth-input-icon'><FaLock /></span>
                  <input
                    id='confirmPassword'
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder='Confirm new password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete='off'
                    className='auth-input'
                  />
                  <button
                    type='button'
                    className='auth-password-toggle'
                    onClick={() => setShowConfirmPassword(prev => !prev)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <BsEye /> : <BsEyeSlash />}
                  </button>
                </div>
              </div>

              {!passwordMatch && (
                <div className='alert alert-danger py-2 px-3 mb-3' style={{ fontSize: '0.8rem' }} role='alert'>
                  Passwords do not match. Please check and try again.
                </div>
              )}

              <button type='submit' className='auth-submit-btn'>Update Password</button>
            </form>
          )}

          <div className='auth-footer mt-4 pt-3 text-center'>
            <p className='m-0 auth-footer-text'>
              Remembered your password?{' '}
              <Link to='/login' className='auth-switch-link'>Sign In</Link>
            </p>
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default ForgotPassword
