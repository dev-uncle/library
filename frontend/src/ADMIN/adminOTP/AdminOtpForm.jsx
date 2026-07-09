import React, { useState } from 'react'
import './adminotpform.css'
import { backend_server } from '../../main'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { HiOutlineShieldCheck as ShieldIcon } from 'react-icons/hi2'

const AdminOtpForm = () => {
  const OTP_VERIFY_API = `${backend_server}/api/v1/signup/verifyEmail`
  const RESEND_OTP_API = `${backend_server}/api/v1/signup/resendOtp`

  const navigate = useNavigate()

  const [otp_code, setOtp_code] = useState('')
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)

  const handleVerify = async (e) => {
    e.preventDefault()
    if (!otp_code.trim()) return

    setVerifying(true)
    const loadingToastId = toast.loading('Verifying code...', { position: 'top-center' })

    try {
      const response = await axios.post(OTP_VERIFY_API, { otpCode: otp_code })
      toast.dismiss(loadingToastId)
      toast.success(response.data.message || 'Verification Success!')
      navigate('/admin', { replace: true })
    } catch (error) {
      toast.dismiss(loadingToastId)
      console.log(error.response)
      const msg = error.response?.data?.message || 'Verification Failed'
      toast.error(msg)
    } finally {
      setVerifying(false)
    }
  }

  const handleResend = async () => {
    setLoading(true)
    const loadingToastId = toast.loading('Resending OTP code...', { position: 'top-center' })
    try {
      const response = await axios.post(RESEND_OTP_API, {})
      toast.dismiss(loadingToastId)
      toast.success(response.data.message || 'New OTP sent successfully!')
    } catch (error) {
      toast.dismiss(loadingToastId)
      console.log(error.response)
      toast.error('Failed to resend OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='page-content'>
      <div className='otp-page-wrapper'>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: 'var(--accent)' }}>
          <ShieldIcon size={48} />
        </div>
        <h1 className='otp-title'>Email Verification</h1>
        <p className='otp-subtitle'>
          We have sent a verification code to your email. Please enter the OTP below.
        </p>

        <form className='otp-form' onSubmit={handleVerify}>
          <div className='otp-container'>
            <input
              type='text'
              autoComplete='off'
              required
              className='otp-input'
              placeholder='••••••'
              name='otpCode'
              value={otp_code}
              onChange={(e) => setOtp_code(e.target.value)}
              maxLength='6'
            />
          </div>

          <div className='otp-actions'>
            <button
              type='submit'
              className='otp-verify-btn'
              disabled={verifying}
            >
              {verifying ? 'Verifying...' : 'Verify Email'}
            </button>
            <button
              type='button'
              className='otp-resend-btn'
              disabled={loading || verifying}
              onClick={handleResend}
            >
              {loading ? 'Sending OTP...' : 'Resend Code'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminOtpForm
