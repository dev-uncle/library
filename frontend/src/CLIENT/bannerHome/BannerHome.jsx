import React from 'react'
import './banner.css'
import { Link } from 'react-router-dom'
import { FaCompass, FaArrowRight } from 'react-icons/fa'

const BannerHome = () => {
  return (
    <div className='hero-section'>
      {/* Decorative background grid and glowing circles */}
      <div className='hero-grid-pattern'></div>
      <div className='hero-glow-circle-1'></div>
      <div className='hero-glow-circle-2'></div>

      <div className='container hero-content-container'>
        <div className='row align-items-center justify-content-between min-vh-70 py-4'>
          <div className='col-lg-7 col-12 text-lg-start text-center'>
            <span className='hero-kicker'>
              Colegio de Montalban
            </span>
            <h1 className='hero-title'>
              Gateway to <br />
              <span className='highlight-green'>Knowledge & Discovery</span>
            </h1>
            <p className='hero-lead'>
              Explore a vast repository of books, research materials, and digital resources. Empowering the students and faculty of CdM with instant access to learning.
            </p>
            
            <div className='hero-actions d-flex flex-wrap gap-3 justify-content-lg-start justify-content-center'>
              <Link to='/books' className='hero-btn-primary'>
                Explore Catalog <FaArrowRight className='ms-2' />
              </Link>
              <Link to='/about' className='hero-btn-outline'>
                About LMS
              </Link>
            </div>
          </div>

          <div className='col-lg-4 col-12 mt-lg-0 mt-5 d-flex justify-content-center'>
            {/* Visual Glassmorphic Widget showing Library Stats or Info */}
            <div className='hero-stats-card'>
              <div className='stats-header d-flex align-items-center gap-3'>
                <div className='stats-icon'>
                  <FaCompass />
                </div>
                <div>
                  <h5 className='m-0 stats-title'>CDM LMS Portal</h5>
                  <p className='m-0 stats-subtitle'>Active Sessions</p>
                </div>
              </div>
              <div className='stats-divider'></div>
              <div className='stats-body'>
                <div className='stats-row d-flex justify-content-between mb-3'>
                  <span>Resource Types:</span>
                  <strong>Books & E-Books</strong>
                </div>
                <div className='stats-row d-flex justify-content-between mb-3'>
                  <span>Access Mode:</span>
                  <strong>Online & Borrowing</strong>
                </div>
                <div className='stats-row d-flex justify-content-between'>
                  <span>Portal Status:</span>
                  <span className='status-indicator-active'>
                    <span className='dot'></span> Online
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BannerHome
