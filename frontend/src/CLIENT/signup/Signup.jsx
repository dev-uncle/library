import React, { useRef, useState, useEffect } from 'react'
import axios from 'axios'
import './signup.css'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { BsEye, BsEyeSlash } from 'react-icons/bs'
import { FaGraduationCap, FaUser, FaEnvelope, FaPhone, FaLock, FaBookOpen } from 'react-icons/fa'
import { backend_server } from '../../main'

const Signup = () => {
  const API_URL = `${backend_server}/api/v1/signup`

  const refUsername = useRef(null)

  const Empty_Form_Field = {
    username: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
  }

  const navigate = useNavigate()

  const [textField, setTextField] = useState(Empty_Form_Field)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const showLoadingToast = () => {
    return toast.loading('Registering User...', {
      position: 'top-center',
      duration: Infinity,
    })
  }

  const HandleFormSubmit = async (e) => {
    try {
      e.preventDefault()
      setLoading(true)

      // Validate email format
      const emailRegex = /^[A-Za-z0-9._%+-]+@gmail\.com$/
      const isValid = emailRegex.test(textField.email)
      if (!isValid) {
        setLoading(false)
        return toast('Invalid Email Format (e.g. user@gmail.com)', {
          icon: 'ℹ️',
        })
      }

      // Validate alphanumeric password with a must Special character
      const alphanumericRegex =
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
      const isPasswordValid = alphanumericRegex.test(textField.password)
      if (!isPasswordValid) {
        setLoading(false)
        return toast(
          'Password must be alphanumeric and contain at least one special character',
          {
            icon: 'ℹ️',
          }
        )
      }

      if (textField.password !== textField.confirm_password) {
        setLoading(false)
        return toast("Passwords don't match", {
          icon: 'ℹ️',
        })
      }

      const loadingToastId = showLoadingToast()

      const username = textField.username
      const email = textField.email
      const phone = textField.phone
      const password = textField.password

      const response = await axios.post(API_URL, {
        username,
        email,
        phone,
        password,
      })

      toast.dismiss(loadingToastId)

      setTextField(Empty_Form_Field)
      setLoading(false)

      if (response.data.GOTO_LOGIN === true) {
        navigate('/login', { replace: true })
        toast('Account Already Exists, You can Login!', {
          icon: 'ℹ️',
        })
      } else {
        navigate('/otp', { replace: true })
        toast(response.data.message, {
          icon: 'ℹ️',
        })
      }
    } catch (error) {
      setLoading(false)
      console.log(error)
      toast.error(error.response?.data?.message || 'Error creating account. Please try again.')
    }
  }

  const HandleOnChange = (event) => {
    const field_name = event.target.name
    const field_value = event.target.value

    setTextField({ ...textField, [field_name]: field_value })
  }

  useEffect(() => {
    if (refUsername.current) {
      refUsername.current.focus()
    }
  }, [])

  return (
    <div className='signup-split-wrapper'>
      {/* ── LEFT PANEL: Form ──────────────────────────────────── */}
      <div className='signup-left-panel'>
        <div className='signup-grid-pattern'></div>
        <div className='signup-ambient-glow'></div>

        <div className='signup-form-container'>
          {/* Header */}
          <div className='signup-header'>
            <span className='signup-kicker'>CdM Library Management System</span>
            <h2 className='signup-title'>Create Account</h2>
            <p className='signup-subtitle'>Join the Colegio de Montalban library network</p>
          </div>

          {/* Form */}
          <form onSubmit={HandleFormSubmit} method='post' className='signup-form'>
            <div className='row g-3 mb-3'>
              <div className='col-md-6 col-12'>
                <label className='signup-label' htmlFor='usernamefield'>Username</label>
                <div className='input-with-icon'>
                  <span className='input-icon'><FaUser /></span>
                  <input
                    type='text'
                    placeholder='Enter username'
                    id='usernamefield'
                    value={textField.username}
                    onChange={HandleOnChange}
                    name='username'
                    autoComplete='off'
                    required
                    ref={refUsername}
                    maxLength='20'
                    minLength='5'
                    className='signup-input'
                  />
                </div>
              </div>

              <div className='col-md-6 col-12'>
                <label className='signup-label' htmlFor='emailfield'>Email Address</label>
                <div className='input-with-icon'>
                  <span className='input-icon'><FaEnvelope /></span>
                  <input
                    type='email'
                    placeholder='user@gmail.com'
                    id='emailfield'
                    value={textField.email}
                    onChange={HandleOnChange}
                    name='email'
                    autoComplete='off'
                    required
                    className='signup-input'
                  />
                </div>
              </div>
            </div>

            <div className='mb-3'>
              <label className='signup-label' htmlFor='phonefield'>Phone Number (9XXXXXXXXX)</label>
              <div className='input-with-icon'>
                <span className='input-icon'><FaPhone /></span>
                <input
                  type='text'
                  placeholder='9123456789'
                  id='phonefield'
                  value={textField.phone}
                  onChange={HandleOnChange}
                  name='phone'
                  autoComplete='off'
                  required
                  pattern='9\d{9}'
                  minLength='10'
                  maxLength='10'
                  className='signup-input'
                />
              </div>
            </div>

            <div className='row g-3 mb-4'>
              <div className='col-md-6 col-12'>
                <label className='signup-label' htmlFor='passwordfield'>Password</label>
                <div className='input-with-icon'>
                  <span className='input-icon'><FaLock /></span>
                  <input
                    type='password'
                    placeholder='Create password'
                    id='passwordfield'
                    value={textField.password}
                    onChange={HandleOnChange}
                    name='password'
                    autoComplete='off'
                    required
                    minLength='5'
                    className='signup-input'
                  />
                </div>
              </div>

              <div className='col-md-6 col-12'>
                <label className='signup-label' htmlFor='passwordfield2'>Confirm Password</label>
                <div className='input-with-icon password-field'>
                  <span className='input-icon'><FaLock /></span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Confirm password'
                    id='passwordfield2'
                    value={textField.confirm_password}
                    onChange={HandleOnChange}
                    name='confirm_password'
                    autoComplete='off'
                    required
                    minLength='5'
                    className='signup-input'
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
            </div>

            <button type='submit' disabled={loading} className='signup-submit-btn'>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          {/* Footer */}
          <div className='signup-footer mt-4 pt-3 text-center'>
            <p className='m-0 signup-footer-text'>
              Already have an Account?{' '}
              <Link to='/login' className='signup-login-link'>
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL: cdm2.jpg Hero & Branding ─────────────── */}
      <div className='signup-right-panel'>
        <div className='signup-right-overlay'></div>
        <div className='signup-right-content'>
          <div className='signup-right-badge'>
            <FaGraduationCap size={24} />
            <span>Colegio de Montalban</span>
          </div>
          <h1 className='signup-right-heading'>
            Empowering Minds, <br />Shaping Tomorrow
          </h1>
          <p className='signup-right-subtext'>
            Create your student library account today to access thousands of physical books, digital publications, and academic references.
          </p>

          <div className='signup-right-feature-card'>
            <div className='feature-icon'>
              <FaBookOpen />
            </div>
            <div>
              <h5 className='feature-title'>Instant Catalog Access</h5>
              <p className='feature-desc'>Borrow, request, and manage your library reservations seamless online.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
