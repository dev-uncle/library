import React, { useState, useEffect } from 'react'
import { Button, Modal, Row, Col, Form } from 'react-bootstrap'
import { backend_server } from '../../main'
import axios from 'axios'
import { Toaster, toast } from 'react-hot-toast'
import { BsEye, BsEyeSlash } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import { useLoginState } from '../../LoginState'
import { HiOutlineUser, HiOutlinePhone, HiOutlineEnvelope, HiOutlineBookOpen } from 'react-icons/hi2'

const ClientDetails = ({ userData, onUpdate }) => {
  const UpdateUser_API_URL = `${backend_server}/api/v1/users`
  const [showEditModal, setShowEditModal] = useState(false)
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const userLoginState = useLoginState()

  const handleEditModalClose = () => {
    setShowEditModal(false)
  }

  const handleEditModalShow = () => {
    setShowEditModal(true)
  }

  const handlePasswordModalClose = () => {
    setShowChangePasswordModal(false)
    setInputFieldPassword({
      old_password: '',
      new_password: '',
      confirm_password: '',
    })
  }

  const handlePasswordModalShow = () => {
    setShowChangePasswordModal(true)
  }

  const [inputFieldPassword, setInputFieldPassword] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  })

  const [inputFieldNormal, setInputFieldNormal] = useState({
    username: '',
    email: '',
    phone: '',
  })

  const handleOnChangeNormal = (e) => {
    setInputFieldNormal({
      ...inputFieldNormal,
      [e.target.name]: e.target.value,
    })
  }

  const handleOnChangePassword = (e) => {
    setInputFieldPassword({
      ...inputFieldPassword,
      [e.target.name]: e.target.value,
    })
  }

  const showLoadingToast = () => {
    return toast.loading('Updating profile...', {
      position: 'top-center',
    })
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    const { username, email, phone } = inputFieldNormal

    // Validate email format
    const emailRegex = /^[A-Za-z0-9._%+-]+@gmail\.com$/
    const isValid = emailRegex.test(email)
    if (!isValid) {
      return toast.error('Invalid Email Format')
    }

    const loadingToastId = showLoadingToast()
    try {
      const response = await axios.patch(UpdateUser_API_URL, {
        username,
        email,
        phone,
      })

      toast.dismiss(loadingToastId)
      if (response.data.ENTER_OTP === true) {
        toast.success(response.data.message)
        userLoginState.logout()
        navigate('/otp', { replace: true })
      } else {
        toast.success('Profile updated successfully')
        if (onUpdate) {
          onUpdate()
        }
        handleEditModalClose()
      }
    } catch (error) {
      toast.dismiss(loadingToastId)
      toast.error(error.response?.data?.message || 'Update failed')
      console.log(error.response)
    }
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    const { confirm_password, new_password, old_password } = inputFieldPassword

    if (new_password === confirm_password) {
      const alphanumericRegex =
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/

      const isPasswordValid = alphanumericRegex.test(new_password)
      if (!isPasswordValid) {
        return toast.error(
          'Password must be alphanumeric and contain at least one special character'
        )
      }

      try {
        const response = await axios.patch(UpdateUser_API_URL, {
          old_password,
          new_password,
        })

        toast.success('Password changed successfully')
        handlePasswordModalClose()
      } catch (error) {
        console.log(error)
        toast.error(error.response?.data?.message || 'Password update failed')
      }
    } else {
      toast.error('New passwords do not match')
    }
  }

  useEffect(() => {
    if (userData) {
      setInputFieldNormal({
        username: userData.username || '',
        email: userData.email || '',
        phone: userData.phone || '',
      })
    }
  }, [userData])

  return (
    <div className='dashboard'>
      <div className='dashboard-header mb-4'>
        <h1 className='dashboard-title'>My Details</h1>
        <p className='dashboard-subtitle'>Manage your profile parameters, credentials, and contact info.</p>
      </div>

      <div className='row g-4'>
        {/* Left Avatar Card */}
        <div className='col-md-4'>
          <div 
            className='chart-card text-center d-flex flex-column align-items-center justify-content-center py-5 h-100'
            style={{ minHeight: '300px' }}
          >
            <div 
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ff9d2b, #eb820a)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                fontWeight: '800',
                color: '#ffffff',
                boxShadow: 'var(--shadow-glow)',
                marginBottom: '1.5rem'
              }}
            >
              {userData.username ? userData.username.charAt(0).toUpperCase() : 'S'}
            </div>
            <h4 style={{ color: 'var(--text-primary)', fontWeight: '700', marginBottom: '0.25rem' }}>
              {userData.username ? userData.username.toUpperCase() : 'STUDENT'}
            </h4>
            <span 
              className='status-badge status-badge--ready'
              style={{ padding: '0.35rem 0.85rem', fontSize: '0.7rem' }}
            >
              Library Member
            </span>
          </div>
        </div>

        {/* Right Info Card */}
        <div className='col-md-8'>
          <div className='chart-card p-4 h-100 d-flex flex-column justify-content-between'>
            <div>
              <h3 className='mb-4' style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>Personal Information</h3>
              
              <div className='d-flex align-items-center mb-3 py-2 border-bottom' style={{ borderColor: 'var(--border-inner)' }}>
                <span style={{ color: 'var(--accent)', marginRight: '1rem', display: 'flex' }}><HiOutlineUser size={20} /></span>
                <div className='d-flex flex-column'>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Username</span>
                  <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{userData.username}</span>
                </div>
              </div>

              <div className='d-flex align-items-center mb-3 py-2 border-bottom' style={{ borderColor: 'var(--border-inner)' }}>
                <span style={{ color: 'var(--accent)', marginRight: '1rem', display: 'flex' }}><HiOutlineEnvelope size={20} /></span>
                <div className='d-flex flex-column'>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email Address</span>
                  <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{userData.email}</span>
                </div>
              </div>

              <div className='d-flex align-items-center mb-3 py-2 border-bottom' style={{ borderColor: 'var(--border-inner)' }}>
                <span style={{ color: 'var(--accent)', marginRight: '1rem', display: 'flex' }}><HiOutlinePhone size={20} /></span>
                <div className='d-flex flex-column'>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Phone Number</span>
                  <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{userData.phone || 'Not Provided'}</span>
                </div>
              </div>

              <div className='d-flex align-items-center mb-3 py-2' style={{ borderColor: 'var(--border-inner)' }}>
                <span style={{ color: 'var(--accent)', marginRight: '1rem', display: 'flex' }}><HiOutlineBookOpen size={20} /></span>
                <div className='d-flex flex-column'>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Accepted Books</span>
                  <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{userData.totalAcceptedBooks}</span>
                </div>
              </div>
            </div>

            <div className='d-flex gap-3 mt-4'>
              <Button
                onClick={handleEditModalShow}
                style={{
                  background: 'var(--accent)',
                  borderColor: 'var(--accent)',
                  fontWeight: '600',
                  padding: '0.6rem 1.5rem',
                  borderRadius: 'var(--radius-md)',
                  flex: 1
                }}
              >
                Edit Profile
              </Button>

              <Button
                variant='secondary'
                onClick={handlePasswordModalShow}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontWeight: '600',
                  padding: '0.6rem 1.5rem',
                  borderRadius: 'var(--radius-md)',
                  flex: 1
                }}
              >
                Change Password
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal show={showEditModal} onHide={handleEditModalClose} centered contentClassName='client-modal-card-override'>
        <Modal.Header closeButton style={{ borderBottom: '1px solid var(--border-color)', background: 'transparent' }}>
          <Modal.Title style={{ color: 'var(--text-primary)', fontWeight: '700', fontSize: '1.25rem' }}>Edit Profile</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ background: 'transparent', padding: '1.5rem' }}>
          <Form onSubmit={handleUpdateProfile}>
            <Form.Group className='mb-3' controlId='username'>
              <Form.Label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Username</Form.Label>
              <Form.Control
                type='text'
                minLength={5}
                placeholder='Enter username'
                name='username'
                onChange={handleOnChangeNormal}
                value={inputFieldNormal.username}
                required
                autoComplete='off'
                className='client-modal-input-override'
              />
            </Form.Group>

            <Form.Group className='mb-3' controlId='email'>
              <Form.Label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Email</Form.Label>
              <Form.Control
                type='email'
                required
                autoComplete='off'
                placeholder='Enter email'
                name='email'
                value={inputFieldNormal.email}
                onChange={handleOnChangeNormal}
                readOnly
                className='client-modal-input-override'
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              />
            </Form.Group>

            <Form.Group className='mb-4' controlId='phone'>
              <Form.Label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Phone</Form.Label>
              <Form.Control
                type='text'
                required
                placeholder='Enter phone number'
                name='phone'
                value={inputFieldNormal.phone}
                onChange={handleOnChangeNormal}
                pattern='9\d{9}'
                minLength='10'
                maxLength='10'
                className='client-modal-input-override'
              />
            </Form.Group>

            <div className='d-flex gap-2 justify-content-end mt-4'>
              <Button 
                variant='secondary' 
                onClick={handleEditModalClose}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.9rem',
                  padding: '0.5rem 1.25rem'
                }}
              >
                Cancel
              </Button>
              <Button 
                type='submit'
                style={{
                  background: 'var(--accent)',
                  border: 'none',
                  color: '#fff',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.9rem',
                  padding: '0.5rem 1.25rem',
                  fontWeight: '600'
                }}
              >
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Change Password Modal */}
      <Modal show={showChangePasswordModal} onHide={handlePasswordModalClose} centered contentClassName='client-modal-card-override'>
        <Modal.Header closeButton style={{ borderBottom: '1px solid var(--border-color)', background: 'transparent' }}>
          <Modal.Title style={{ color: 'var(--text-primary)', fontWeight: '700', fontSize: '1.25rem' }}>Change Password</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ background: 'transparent', padding: '1.5rem' }}>
          <Form onSubmit={handleUpdatePassword}>
            <Form.Group className='mb-3' controlId='old_password'>
              <Form.Label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Old Password</Form.Label>
              <Form.Control
                type='password'
                minLength={5}
                required
                placeholder='Enter old password'
                name='old_password'
                onChange={handleOnChangePassword}
                value={inputFieldPassword.old_password}
                className='client-modal-input-override'
              />
            </Form.Group>

            <Form.Group className='mb-3' controlId='new_password'>
              <Form.Label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>New Password</Form.Label>
              <Form.Control
                required
                minLength={5}
                type='password'
                placeholder='Enter new password'
                name='new_password'
                onChange={handleOnChangePassword}
                value={inputFieldPassword.new_password}
                className='client-modal-input-override'
              />
            </Form.Group>

            <Form.Group className='mb-4' controlId='confirm_password'>
              <Form.Label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Confirm New Password</Form.Label>
              <div className='position-relative d-flex align-items-center'>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={5}
                  placeholder='Re-enter new Password'
                  name='confirm_password'
                  onChange={handleOnChangePassword}
                  value={inputFieldPassword.confirm_password}
                  className='client-modal-input-override w-100'
                  style={{ paddingRight: '2.5rem' }}
                />
                <span
                  onClick={() => setShowPassword((prev) => !prev)}
                  style={{ 
                    cursor: 'pointer',
                    position: 'absolute',
                    right: '1rem',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showPassword ? <BsEye size={18} /> : <BsEyeSlash size={18} />}
                </span>
              </div>
            </Form.Group>

            <div className='d-flex gap-2 justify-content-end mt-4'>
              <Button 
                variant='secondary' 
                onClick={handlePasswordModalClose}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.9rem',
                  padding: '0.5rem 1.25rem'
                }}
              >
                Cancel
              </Button>
              <Button 
                type='submit'
                style={{
                  background: 'var(--accent)',
                  border: 'none',
                  color: '#fff',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.9rem',
                  padding: '0.5rem 1.25rem',
                  fontWeight: '600'
                }}
              >
                Change Password
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default ClientDetails
