import React from 'react'
import { backend_server } from '../../main'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './adminlogout.css'

const AdminLogout = () => {
  const logout_Api_url = `${backend_server}/api/v1/logout`
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      localStorage.clear()
      await axios.post(logout_Api_url)
      window.location.href = '/'
    } catch (error) {
      console.log(error.response)
    }
  }

  return (
    <div className='page-content'>
      <div className='logout-page-wrapper'>
        <img
          className='logout-illustration'
          src='/LogoutImage.png'
          alt='Logout illustration'
        />

        <h3 className='logout-title'>Are you sure you want to logout?</h3>

        <div className='logout-actions'>
          <button className='logout-confirm-btn' onClick={handleLogout}>
            Yes, Logout
          </button>
          <button className='logout-back-btn' onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminLogout
