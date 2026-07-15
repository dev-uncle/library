import React from 'react'
import '../login/login.css' // Import login CSS to match the style 1-to-1
import { backend_server } from '../../main'
import axios from 'axios'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

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
    <div className='login-page-wrapper'>
      <div className='login-maindiv'>
        {/* TOP DIV */}
        <div className='login-upperdiv'>
          <h1>Verify OTP</h1>
        </div>

        {/* MIDDLE DIV */}
        <div className='login-middlediv'>
          <p style={{
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.95rem',
            marginBottom: '1.75rem',
            lineHeight: '1.5',
            fontFamily: "'Inter', sans-serif"
          }}>
            Please enter the 4-digit code sent to your registered email to activate your account.
          </p>
          
          <form onSubmit={handleVerifyFormSubmit} method='post'>
            <input
              type='text'
              placeholder='Enter 4-Digit OTP Code'
              value={otp_code}
              onChange={(e) => setOtp_code(e.target.value)}
              maxLength='4'
              pattern='\d{4}'
              required
              autoComplete='off'
              style={{
                letterSpacing: '0.4em',
                textAlign: 'center',
                fontWeight: '700',
                fontSize: '1.35rem',
                fontFamily: 'monospace',
                padding: '12px 16px'
              }}
            />

            <button type='submit'>Verify & Activate</button>
          </form>
        </div>

        {/* LOWER DIV */}
        <div className='login-lowerdiv'>
          <button 
            type='button' 
            onClick={handleResendFormSubmit}
            disabled={loading}
            style={{
              padding: '8px 18px',
              backgroundColor: 'transparent',
              color: 'rgba(255, 255, 255, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(235, 130, 10, 0.1)';
              e.currentTarget.style.borderColor = '#eb820a';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
            }}
          >
            {loading ? 'Sending...' : 'Resend Code'}
          </button>

          <button 
            type='button' 
            onClick={handleGoBack}
            style={{
              padding: '8px 18px',
              backgroundColor: 'transparent',
              color: 'rgba(255, 255, 255, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
            }}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  )
}

export default OtpForm
