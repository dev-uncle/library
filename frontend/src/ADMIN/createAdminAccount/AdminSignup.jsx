import React, { useRef, useState, useEffect } from 'react'
import axios from 'axios'
import './adminsignup.css'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { BsEye, BsEyeSlash } from 'react-icons/bs'

const AdminSignup = () => {
  const API_URL = 'http://localhost:5000/api/v1/signup'

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

  const HandleFormSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Validate email format
    const emailRegex = /^[A-Za-z0-9._%+-]+@gmail\.com$/
    const isValid = emailRegex.test(textField.email)
    if (!isValid) {
      setLoading(false)
      return toast.error('Invalid Email Format')
    }

    // Validate password constraints
    const alphanumericRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    const isPasswordValid = alphanumericRegex.test(textField.password)
    if (!isPasswordValid) {
      setLoading(false)
      return toast.error(
        'Password must be alphanumeric and contain at least one special character'
      )
    }

    if (textField.password !== textField.confirm_password) {
      setLoading(false)
      return toast.error("Passwords do not match")
    }

    const loadingToastId = toast.loading('Registering Admin Account...', { position: 'top-center' })

    const { username, email, phone, password } = textField

    try {
      const response = await axios.post(API_URL, {
        username,
        email,
        phone,
        password,
        userType: 'admin_user',
      })

      toast.dismiss(loadingToastId)
      setTextField(Empty_Form_Field)
      setLoading(false)

      if (response.data.GOTO_LOGIN === true) {
        toast('Account already Exists, Goto LOGIN', { icon: 'ℹ️' })
      } else {
        navigate('/admin/otp', { replace: true })
      }
    } catch (error) {
      toast.dismiss(loadingToastId)
      setLoading(false)
      console.log(error)
      const msg = error.response?.data?.message || 'Error creating account'
      toast.error(msg)
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
    <div className='page-content'>
      <div className='signup-maindiv'>
        {/* TOP DIV */}
        <div className='signup-upperdiv text-center'>
          <h2>Create Admin Account</h2>
        </div>

        {/* MIDDLE DIV */}
        <div className='signup-middlediv'>
          <form onSubmit={HandleFormSubmit}>
            <div className='first-row-form'>
              <div className='username-field-div'>
                <label htmlFor='usernamefield'>Username</label>
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
                />
              </div>

              <div className='email-field-div'>
                <label htmlFor='emailfield'>Email</label>
                <input
                  type='email'
                  placeholder='user@gmail.com'
                  id='emailfield'
                  value={textField.email}
                  onChange={HandleOnChange}
                  name='email'
                  autoComplete='off'
                  required
                />
              </div>
            </div>

            <div className='phone-field-div' style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label htmlFor='phonefield'>Phone No.</label>
              <input
                type='text'
                placeholder='98XXXXXXXX'
                id='phonefield'
                value={textField.phone}
                onChange={HandleOnChange}
                name='phone'
                autoComplete='off'
                required
                pattern='9\d{9}'
                minLength='10'
                maxLength='10'
              />
            </div>

            <div className='password-main-div'>
              <div className='password-div-first'>
                <label htmlFor='passwordfield'>Password</label>
                <div className='password-field'>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Enter Password'
                    id='passwordfield'
                    value={textField.password}
                    onChange={HandleOnChange}
                    name='password'
                    autoComplete='off'
                    required
                    minLength='5'
                  />
                  <span
                    className='password-field-toggle'
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <BsEye size={18} /> : <BsEyeSlash size={18} />}
                  </span>
                </div>
              </div>

              <div className='password-div-second'>
                <label htmlFor='passwordfield2'>Confirm Password</label>
                <div className='password-field'>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Confirm Password'
                    id='passwordfield2'
                    value={textField.confirm_password}
                    onChange={HandleOnChange}
                    name='confirm_password'
                    autoComplete='off'
                    required
                    minLength='5'
                  />
                  <span
                    className='password-field-toggle'
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <BsEye size={18} /> : <BsEyeSlash size={18} />}
                  </span>
                </div>
              </div>
            </div>

            <button type='submit' disabled={loading}>
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminSignup
