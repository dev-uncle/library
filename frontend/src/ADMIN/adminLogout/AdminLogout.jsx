import React, { useState } from 'react'
import { backend_server } from '../../main'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { HiOutlineArrowRightOnRectangle, HiOutlineArrowLeft, HiOutlineShieldExclamation } from 'react-icons/hi2'
import './adminlogout.css'

const AdminLogout = () => {
  const logout_Api_url = `${backend_server}/api/v1/logout`
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    try {
      localStorage.clear()
      await axios.post(logout_Api_url)
      window.location.href = '/'
    } catch (error) {
      console.log(error.response)
      setLoading(false)
    }
  }

  return (
    <div className='page-content logout-page-content'>
      <div className='lo-card'>

        {/* Icon */}
        <div className='lo-icon-wrap'>
          <HiOutlineShieldExclamation size={38} className='lo-icon' />
        </div>

        {/* Text */}
        <div className='lo-text'>
          <h2 className='lo-title'>Sign Out</h2>
          <p className='lo-subtitle'>
            You're about to sign out of the admin panel.<br />
            Any unsaved changes will be lost.
          </p>
        </div>

        {/* Divider */}
        <div className='lo-divider' />

        {/* Actions */}
        <div className='lo-actions'>
          <button
            className='lo-cancel-btn'
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            <HiOutlineArrowLeft size={16} />
            Go Back
          </button>
          <button
            className='lo-confirm-btn'
            onClick={handleLogout}
            disabled={loading}
          >
            {loading ? (
              <span className='lo-spinner' />
            ) : (
              <HiOutlineArrowRightOnRectangle size={17} />
            )}
            {loading ? 'Signing out…' : 'Yes, Sign Out'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminLogout
