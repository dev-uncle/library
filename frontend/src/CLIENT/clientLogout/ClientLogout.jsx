import React from 'react'
import './clientlogout.css'
import { backend_server } from '../../main'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useLoginState } from '../../LoginState'
import { BsBoxArrowRight, BsArrowLeft } from 'react-icons/bs'

const ClientLogout = () => {
  const logout_Api_url = `${backend_server}/api/v1/logout`
  const userLoginState = useLoginState()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      // Reset user login state to null
      userLoginState.logout()

      // Clear cookie using API
      await axios.post(logout_Api_url)

      navigate('/', { replace: true })
    } catch (error) {
      console.log(error.response)
    }
  }

  return (
    <div className='logout-container'>
      <div className='logout-card'>
        {/* Warning Icon Wrap */}
        <div className='logout-icon-wrap'>
          <BsBoxArrowRight />
        </div>

        {/* Heading */}
        <h3>Confirm Logout</h3>

        {/* Description */}
        <p className='logout-description'>
          Are you sure you want to end your current session? You will need to sign in again to request books, access your dashboard, and view borrow logs.
        </p>

        <hr className='logout-divider' />

        {/* Actions buttons */}
        <div className='logout-actions'>
          <button className='logout-btn-confirm' onClick={handleLogout}>
            Yes, Logout
          </button>
          
          <button className='logout-btn-cancel' onClick={() => navigate(-1)}>
            <BsArrowLeft style={{ fontSize: '1.1rem' }} /> Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default ClientLogout
