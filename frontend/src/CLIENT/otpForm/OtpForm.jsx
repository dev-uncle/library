import React, { useState } from 'react'
import '../auth/auth-page.css' // Import the beautiful auth page styles
import { backend_server } from '../../main'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { BsShieldLock } from 'react-icons/bs'
import { FaGraduationCap, FaBookOpen } from 'react-icons/fa'

const OtpForm = () => {
  const OTP_VERIFY_API = `${backend_server}/api/v1/signup/verifyEmail`
  const RESEND_OTP_API = `${backend_server}/api/v1/signup/resendOtp`

  const [otp_code, setOtp_code] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const showLoadingToast = () => {
    return toast.loading('Resending OTP code...', {
      position: 'top-center',
    })
  }

  const handleVerifyFormSubmit = async (e) => {
    e.preventDefault()
    if (!otp_code) {
      return toast.error('Please enter your OTP code')
    }

    try {
      const response = await axios.post(OTP_VERIFY_API, { otpCode: otp_code })
      toast.success(response.data.message)
      navigate('/login', { replace: true })
    } catch (error) {
      console.log(error.response)
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Verification failed. Please try again.')
      }
    }
  }

  const handleResendFormSubmit = async () => {
    setLoading(true)
    const loadingToastId = showLoadingToast()
    try {
      const response = await axios.post(RESEND_OTP_API, {})
      toast.dismiss(loadingToastId)
      
      toast(response.data.message || 'OTP resent successfully!', {
        icon: 'ℹ️',
      })
      
      setLoading(false)
    } catch (error) {
      toast.dismiss(loadingToastId)
      console.log(error.response)
      toast.error('Failed to resend OTP. Please try again.')
      setLoading(false)
    }
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <div className='auth-wrapper' data-mode='signup'>
      
      {/* ━━━ PANEL 1: Form (Left) ━━━━━━━━━━━━━━━━━━ */}
      <div className='auth-panel auth-form-panel auth-signup-form'>
        <div className='auth-grid-pattern'></div>
        <div className='auth-ambient-glow'></div>
        <div className='auth-form-container'>
          <div className='mb-4'>
            <span className='auth-kicker'>CdM Library Management System</span>
            <h2 className='auth-title'>Verify OTP</h2>
            <p className='auth-subtitle'>
              Please enter the 4-digit code sent to your registered email to activate your account.
            </p>
          </div>

          <form onSubmit={handleVerifyFormSubmit} method='post'>
            <div className='form-group mb-4'>
              <label className='auth-label' htmlFor='otp-input'>Verification Code</label>
              <div className='auth-input-group'>
                <span className='auth-input-icon'><BsShieldLock size={18} /></span>
                <input
                  id='otp-input'
                  type='text'
                  placeholder='0000'
                  value={otp_code}
                  onChange={(e) => setOtp_code(e.target.value)}
                  maxLength='4'
                  pattern='\d{4}'
                  required
                  autoComplete='off'
                  className='auth-input'
                  style={{
                    letterSpacing: '0.4em',
                    textAlign: 'center',
                    fontWeight: '700',
                    fontSize: '1.25rem',
                    fontFamily: 'monospace',
                    paddingLeft: '14px' // Center align properly
                  }}
                />
              </div>
            </div>

            <div className='d-flex gap-3 mt-4'>
              <button type='submit' className='auth-submit-btn m-0' style={{ flex: 2 }}>
                Verify & Activate
              </button>
              <button 
                type='button' 
                onClick={handleResendFormSubmit}
                disabled={loading}
                className='auth-submit-btn m-0' 
                style={{ 
                  flex: 1.2,
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-hover)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                }}
              >
                {loading ? 'Sending...' : 'Resend OTP'}
              </button>
            </div>
          </form>

          <div className='auth-footer mt-4 pt-3 text-center'>
            <p className='m-0 auth-footer-text'>
              Having trouble?{' '}
              <button type='button' className='auth-switch-link' onClick={handleGoBack}>
                Go Back
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* ━━━ PANEL 2: Hero (Right) ━━━━━━━━━━━━━━━━━ */}
      <div className='auth-panel auth-hero-panel auth-signup-hero'>
        <div className='auth-overlay'></div>
        <div className='auth-hero-content'>
          <div className='auth-hero-badge'>
            <FaGraduationCap size={24} />
            <span>Colegio de Montalban</span>
          </div>
          <h1 className='auth-hero-heading'>
            Confirm Registration
          </h1>
          <p className='auth-hero-subtext'>
            Enter the one-time passcode to verify your identity and finalize your registration with the CdM Library.
          </p>
          <div className='auth-feature-card'>
            <div className='feature-icon'><FaBookOpen /></div>
            <div>
              <h5 className='feature-title'>Activate Library Account</h5>
              <p className='feature-desc'>Unlock full privileges to reserve materials and view personal records.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default OtpForm
