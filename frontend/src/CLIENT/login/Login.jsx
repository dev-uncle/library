import React, { useEffect, useRef, useState } from 'react'
import './login.css'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { backend_server } from '../../main'
import { BsEye, BsEyeSlash } from 'react-icons/bs'
import { FaGraduationCap, FaEnvelope, FaLock, FaBookOpen } from 'react-icons/fa'
import { useLoginState } from '../../LoginState'

const Login = () => {
  const API_URL = `${backend_server}/api/v1/login`

  const navigate = useNavigate()
  const refUsername = useRef(null)

  const Empty_Field_Object = { email: '', password: '' }
  const [textfield, setTextField] = useState(Empty_Field_Object)
  const [showPassword, setShowPassword] = useState(false)

  const showLoadingToast = () => {
    return toast.loading('Logging in...', {
      position: 'top-center',
      duration: Infinity,
    })
  }

  const userLoginState = useLoginState()

  const HandleSubmit = async (e) => {
    e.preventDefault()
    const loadingToastId = showLoadingToast()
    try {
      const email = textfield.email
      const password = textfield.password

      const response = await axios.post(API_URL, { email, password })
      const userType = await response.data.userType

      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
      }

      toast.dismiss(loadingToastId)

      userLoginState.login(email, userType)
      if (userType === 'normal_user') {
        toast.success('Login Success')
        navigate('/', { replace: true })
      } else if (userType === 'admin_user') {
        window.location.href = '/admin'
      }
    } catch (error) {
      toast.dismiss(loadingToastId)

      if (error.response?.data?.ENTER_OTP === true) {
        navigate('/otp', { replace: true })
      } else if (error.response && error.response.data && error.response.data.message) {
        const error_message = error.response.data.message
        toast.error(error_message)
      } else {
        toast.error('Unable to connect to server. Please try again.')
      }
    }
  }

  const HandleOnChange = (event) => {
    const field_name = event.target.name
    const field_value = event.target.value

    setTextField({ ...textfield, [field_name]: field_value })
  }

  useEffect(() => {
    if (refUsername.current) {
      refUsername.current.focus()
    }
  }, [])

  return (
    <div className='login-split-wrapper'>
      {/* ── LEFT PANEL: Hero Image & Branding ───────────────── */}
      <div className='login-left-panel'>
        <div className='login-left-overlay'></div>
        <div className='login-left-content'>
          <div className='login-left-badge'>
            <FaGraduationCap size={24} />
            <span>Colegio de Montalban</span>
          </div>
          <h1 className='login-left-heading'>
            Gateway to Knowledge <br />& Academic Excellence
          </h1>
          <p className='login-left-subtext'>
            Empowering students and faculty of CdM with instant access to cataloged books, research publications, and e-learning resources.
          </p>

          <div className='login-left-feature-card'>
            <div className='feature-icon'>
              <FaBookOpen />
            </div>
            <div>
              <h5 className='feature-title'>Digital Library Portal</h5>
              <p className='feature-desc'>Browse collections, check availability, and request books online.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL: Login Form ───────────────────────────── */}
      <div className='login-right-panel'>
        {/* Background Grid Pattern */}
        <div className='login-grid-pattern'></div>
        <div className='login-ambient-glow'></div>

        <div className='login-form-container'>
          {/* Header */}
          <div className='login-header'>
            <span className='login-kicker'>CdM Library Management System</span>
            <h2 className='login-title'>Welcome Back</h2>
            <p className='login-subtitle'>Enter your credentials to access your account</p>
          </div>

          {/* Form */}
          <form onSubmit={HandleSubmit} method='post' className='login-form'>
            <div className='form-group mb-3'>
              <label className='login-label' htmlFor='login-email'>Email Address</label>
              <div className='input-with-icon'>
                <span className='input-icon'><FaEnvelope /></span>
                <input
                  id='login-email'
                  type='email'
                  placeholder='student@cdm.edu.ph'
                  value={textfield.email}
                  onChange={HandleOnChange}
                  name='email'
                  autoComplete='off'
                  required
                  ref={refUsername}
                  className='login-input'
                />
              </div>
            </div>

            <div className='form-group mb-4'>
              <div className='d-flex justify-content-between align-items-center mb-1'>
                <label className='login-label' htmlFor='login-password'>Password</label>
                <Link to='/forgotpassword' className='login-forgot-link'>
                  Forgot Password?
                </Link>
              </div>
              <div className='input-with-icon password-field'>
                <span className='input-icon'><FaLock /></span>
                <input
                  id='login-password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Enter your password'
                  value={textfield.password}
                  onChange={HandleOnChange}
                  name='password'
                  autoComplete='off'
                  required
                  className='login-input'
                />
                <button
                  type='button'
                  className='password-toggle-btn'
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <BsEye /> : <BsEyeSlash />}
                </button>
              </div>
            </div>

            <button type='submit' className='login-submit-btn'>
              Sign In
            </button>
          </form>

          {/* Footer */}
          <div className='login-footer mt-4 pt-3 text-center'>
            <p className='m-0 login-footer-text'>
              Don't have an account?{' '}
              <Link to='/signup' className='login-signup-link'>
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
