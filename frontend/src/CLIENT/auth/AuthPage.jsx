import React, { useEffect, useRef, useState } from 'react'
import './auth-page.css'
import axios from 'axios'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { backend_server } from '../../main'
import { BsEye, BsEyeSlash } from 'react-icons/bs'
import { FaGraduationCap, FaEnvelope, FaLock, FaBookOpen, FaUser, FaPhone } from 'react-icons/fa'
import { useLoginState } from '../../LoginState'

const AuthPage = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // ── Mode: 'login' or 'signup' synced with URL ──────────
  const initialMode = location.pathname === '/signup' ? 'signup' : 'login'
  const [mode, setMode] = useState(initialMode)

  // Sync mode when URL changes externally (e.g. browser back/forward)
  useEffect(() => {
    const newMode = location.pathname === '/signup' ? 'signup' : 'login'
    setMode(newMode)
  }, [location.pathname])

  const switchMode = (newMode) => {
    setMode(newMode)
    navigate(newMode === 'signup' ? '/signup' : '/login', { replace: false })
  }

  // ══════════════════════════════════════════════════════════
  //  LOGIN FORM STATE & LOGIC
  // ══════════════════════════════════════════════════════════
  const LOGIN_API = `${backend_server}/api/v1/login`
  const loginEmailRef = useRef(null)
  const [loginFields, setLoginFields] = useState({ email: '', password: '' })
  const [loginShowPw, setLoginShowPw] = useState(false)
  const userLoginState = useLoginState()

  const handleLoginChange = (e) => {
    setLoginFields({ ...loginFields, [e.target.name]: e.target.value })
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    const loadingId = toast.loading('Logging in...', { position: 'top-center', duration: Infinity })
    try {
      const { email, password } = loginFields
      const response = await axios.post(LOGIN_API, { email, password })
      const userType = response.data.userType

      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
      }

      toast.dismiss(loadingId)
      userLoginState.login(email, userType)

      if (userType === 'normal_user') {
        toast.success('Login Success')
        navigate('/', { replace: true })
      } else if (userType === 'admin_user') {
        window.location.href = '/admin'
      }
    } catch (error) {
      toast.dismiss(loadingId)
      if (error.response?.data?.ENTER_OTP === true) {
        navigate('/otp', { replace: true })
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Unable to connect to server. Please try again.')
      }
    }
  }

  // ══════════════════════════════════════════════════════════
  //  SIGNUP FORM STATE & LOGIC
  // ══════════════════════════════════════════════════════════
  const SIGNUP_API = `${backend_server}/api/v1/signup`
  const signupUsernameRef = useRef(null)
  const emptySignup = { username: '', email: '', phone: '', password: '', confirm_password: '' }
  const [signupFields, setSignupFields] = useState(emptySignup)
  const [signupLoading, setSignupLoading] = useState(false)
  const [signupShowPw, setSignupShowPw] = useState(false)

  const handleSignupChange = (e) => {
    setSignupFields({ ...signupFields, [e.target.name]: e.target.value })
  }

  const handleSignupSubmit = async (e) => {
    try {
      e.preventDefault()
      setSignupLoading(true)

      // Validate email
      const emailRegex = /^[A-Za-z0-9._%+-]+@gmail\.com$/
      if (!emailRegex.test(signupFields.email)) {
        setSignupLoading(false)
        return toast('Invalid Email Format', { icon: 'ℹ️' })
      }

      // Validate password
      const pwRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
      if (!pwRegex.test(signupFields.password)) {
        setSignupLoading(false)
        return toast('Password must be alphanumeric and contain at least one special character', { icon: 'ℹ️' })
      }

      // Confirm match
      if (signupFields.password !== signupFields.confirm_password) {
        setSignupLoading(false)
        return toast("Passwords don't match", { icon: 'ℹ️' })
      }

      const loadingId = toast.loading('Registering User...', { position: 'top-center', duration: Infinity })

      const { username, email, phone, password } = signupFields
      const response = await axios.post(SIGNUP_API, { username, email, phone, password })

      toast.dismiss(loadingId)
      setSignupFields(emptySignup)
      setSignupLoading(false)

      if (response.data.GOTO_LOGIN === true) {
        switchMode('login')
        toast('Account Already Exists, You can Login!', { icon: 'ℹ️' })
      } else {
        navigate('/otp', { replace: true })
        toast(response.data.message, { icon: 'ℹ️' })
      }
    } catch (error) {
      setSignupLoading(false)
      console.log(error)
      toast.error(error.response?.data?.message || 'Error creating account. Please try again.')
    }
  }

  // ── Auto-focus on mode switch ──────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mode === 'login' && loginEmailRef.current) {
        loginEmailRef.current.focus()
      } else if (mode === 'signup' && signupUsernameRef.current) {
        signupUsernameRef.current.focus()
      }
    }, 750) // wait for slide animation to finish
    return () => clearTimeout(timer)
  }, [mode])

  // ══════════════════════════════════════════════════════════
  //  RENDER
  // ══════════════════════════════════════════════════════════
  return (
    <div className='auth-wrapper' data-mode={mode}>

      {/* ━━━ PANEL 1: Login Hero (Left) ━━━━━━━━━━━━━━━━━━━ */}
      <div className='auth-panel auth-hero-panel auth-login-hero'>
        <div className='auth-overlay'></div>
        <div className='auth-hero-content'>
          <div className='auth-hero-badge'>
            <FaGraduationCap size={24} />
            <span>Colegio de Montalban</span>
          </div>
          <h1 className='auth-hero-heading'>
            Gateway to Knowledge <br />& Academic Excellence
          </h1>
          <p className='auth-hero-subtext'>
            Empowering students and faculty of CdM with instant access to cataloged books, research publications, and e-learning resources.
          </p>
          <div className='auth-feature-card'>
            <div className='feature-icon'><FaBookOpen /></div>
            <div>
              <h5 className='feature-title'>Digital Library Portal</h5>
              <p className='feature-desc'>Browse collections, check availability, and request books online.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ━━━ PANEL 2: Login Form (Right) ━━━━━━━━━━━━━━━━━━ */}
      <div className='auth-panel auth-form-panel auth-login-form'>
        <div className='auth-grid-pattern'></div>
        <div className='auth-ambient-glow'></div>
        <div className='auth-form-container'>
          <div className='mb-4'>
            <span className='auth-kicker'>CdM Library Management System</span>
            <h2 className='auth-title'>Welcome Back</h2>
            <p className='auth-subtitle'>Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleLoginSubmit} method='post'>
            <div className='form-group mb-3'>
              <label className='auth-label' htmlFor='login-email'>Email Address</label>
              <div className='auth-input-group'>
                <span className='auth-input-icon'><FaEnvelope /></span>
                <input
                  id='login-email'
                  type='email'
                  placeholder='student@cdm.edu.ph'
                  value={loginFields.email}
                  onChange={handleLoginChange}
                  name='email'
                  autoComplete='off'
                  required
                  ref={loginEmailRef}
                  className='auth-input'
                />
              </div>
            </div>

            <div className='form-group mb-4'>
              <div className='d-flex justify-content-between align-items-center mb-1'>
                <label className='auth-label' htmlFor='login-password'>Password</label>
                <Link to='/forgotpassword' className='auth-forgot-link'>Forgot Password?</Link>
              </div>
              <div className='auth-input-group auth-password-field'>
                <span className='auth-input-icon'><FaLock /></span>
                <input
                  id='login-password'
                  type={loginShowPw ? 'text' : 'password'}
                  placeholder='Enter your password'
                  value={loginFields.password}
                  onChange={handleLoginChange}
                  name='password'
                  autoComplete='off'
                  required
                  className='auth-input'
                />
                <button
                  type='button'
                  className='auth-password-toggle'
                  onClick={() => setLoginShowPw(prev => !prev)}
                  aria-label={loginShowPw ? 'Hide password' : 'Show password'}
                >
                  {loginShowPw ? <BsEye /> : <BsEyeSlash />}
                </button>
              </div>
            </div>

            <button type='submit' className='auth-submit-btn'>Sign In</button>
          </form>

          <div className='auth-footer mt-4 pt-3 text-center'>
            <p className='m-0 auth-footer-text'>
              Don't have an account?{' '}
              <button
                type='button'
                className='auth-switch-link'
                onClick={() => switchMode('signup')}
              >
                Create Account
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* ━━━ PANEL 3: Signup Form (Left) ━━━━━━━━━━━━━━━━━━ */}
      <div className='auth-panel auth-form-panel auth-signup-form'>
        <div className='auth-grid-pattern'></div>
        <div className='auth-ambient-glow'></div>
        <div className='auth-form-container'>
          <div className='mb-3'>
            <span className='auth-kicker'>CdM Library Management System</span>
            <h2 className='auth-title'>Create Account</h2>
            <p className='auth-subtitle'>Join the Colegio de Montalban library network</p>
          </div>

          <form onSubmit={handleSignupSubmit} method='post'>
            <div className='row g-2 mb-2'>
              <div className='col-md-6 col-12'>
                <label className='auth-label' htmlFor='signup-username'>Username</label>
                <div className='auth-input-group'>
                  <span className='auth-input-icon'><FaUser /></span>
                  <input
                    id='signup-username'
                    type='text'
                    placeholder='Enter username'
                    value={signupFields.username}
                    onChange={handleSignupChange}
                    name='username'
                    autoComplete='off'
                    required
                    ref={signupUsernameRef}
                    maxLength='20'
                    minLength='5'
                    className='auth-input'
                  />
                </div>
              </div>
              <div className='col-md-6 col-12'>
                <label className='auth-label' htmlFor='signup-email'>Email Address</label>
                <div className='auth-input-group'>
                  <span className='auth-input-icon'><FaEnvelope /></span>
                  <input
                    id='signup-email'
                    type='email'
                    placeholder='user@gmail.com'
                    value={signupFields.email}
                    onChange={handleSignupChange}
                    name='email'
                    autoComplete='off'
                    required
                    className='auth-input'
                  />
                </div>
              </div>
            </div>

            <div className='mb-2'>
              <label className='auth-label' htmlFor='signup-phone'>Phone Number</label>
              <div className='auth-input-group'>
                <span className='auth-input-icon'><FaPhone /></span>
                <input
                  id='signup-phone'
                  type='text'
                  placeholder='9123456789'
                  value={signupFields.phone}
                  onChange={handleSignupChange}
                  name='phone'
                  autoComplete='off'
                  required
                  pattern='9\d{9}'
                  minLength='10'
                  maxLength='10'
                  className='auth-input'
                />
              </div>
            </div>

            <div className='row g-2 mb-3'>
              <div className='col-md-6 col-12'>
                <label className='auth-label' htmlFor='signup-password'>Password</label>
                <div className='auth-input-group'>
                  <span className='auth-input-icon'><FaLock /></span>
                  <input
                    id='signup-password'
                    type='password'
                    placeholder='Create password'
                    value={signupFields.password}
                    onChange={handleSignupChange}
                    name='password'
                    autoComplete='off'
                    required
                    minLength='5'
                    className='auth-input'
                  />
                </div>
              </div>
              <div className='col-md-6 col-12'>
                <label className='auth-label' htmlFor='signup-confirm'>Confirm Password</label>
                <div className='auth-input-group auth-password-field'>
                  <span className='auth-input-icon'><FaLock /></span>
                  <input
                    id='signup-confirm'
                    type={signupShowPw ? 'text' : 'password'}
                    placeholder='Confirm password'
                    value={signupFields.confirm_password}
                    onChange={handleSignupChange}
                    name='confirm_password'
                    autoComplete='off'
                    required
                    minLength='5'
                    className='auth-input'
                  />
                  <button
                    type='button'
                    className='auth-password-toggle'
                    onClick={() => setSignupShowPw(prev => !prev)}
                    aria-label={signupShowPw ? 'Hide password' : 'Show password'}
                  >
                    {signupShowPw ? <BsEye /> : <BsEyeSlash />}
                  </button>
                </div>
              </div>
            </div>

            <button type='submit' disabled={signupLoading} className='auth-submit-btn'>
              {signupLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className='auth-footer mt-3 pt-3 text-center'>
            <p className='m-0 auth-footer-text'>
              Already have an account?{' '}
              <button
                type='button'
                className='auth-switch-link'
                onClick={() => switchMode('login')}
              >
                Log In
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* ━━━ PANEL 4: Signup Hero (Right) ━━━━━━━━━━━━━━━━━ */}
      <div className='auth-panel auth-hero-panel auth-signup-hero'>
        <div className='auth-overlay'></div>
        <div className='auth-hero-content'>
          <div className='auth-hero-badge'>
            <FaGraduationCap size={24} />
            <span>Colegio de Montalban</span>
          </div>
          <h1 className='auth-hero-heading'>
            Empowering Minds, <br />Shaping Tomorrow
          </h1>
          <p className='auth-hero-subtext'>
            Create your student library account today to access thousands of physical books, digital publications, and academic references.
          </p>
          <div className='auth-feature-card'>
            <div className='feature-icon'><FaBookOpen /></div>
            <div>
              <h5 className='feature-title'>Instant Catalog Access</h5>
              <p className='feature-desc'>Borrow, request, and manage your library reservations seamlessly online.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default AuthPage
