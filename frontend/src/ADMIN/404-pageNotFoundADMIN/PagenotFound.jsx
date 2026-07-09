import React from 'react'
import './pagenotfound.css'
import { Link } from 'react-router-dom'

const PagenotFound = () => {
  return (
    <div className='page-content'>
      <div className='not-found-container'>
        <h1>404</h1>
        <p>The page you are looking for does not exist or has been moved.</p>

        <Link to='/admin' style={{ textDecoration: 'none' }}>
          <button className='btn' id='admin-pagenotfound-btn'>
            Go back to Dashboard
          </button>
        </Link>
      </div>
    </div>
  )
}

export default PagenotFound
