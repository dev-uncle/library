import React from 'react'
import './banner.css'
import Carousel from 'react-bootstrap/Carousel'
import bannerData from './bannerdata'
import { Link } from 'react-router-dom'

const BannerHome = () => {
  return (
    <div className='banner-container'>
      <Carousel controls={false} interval={5000} fade>
        {bannerData.map((items) => {
          const { id, image, heading, paragraph } = items
          return (
            <Carousel.Item key={id}>
              <img
                className='img-fluid d-block w-100'
                id='banner-image'
                src={image}
                alt='Banner slide'
              />
              <div className='banner-overlay'></div>
              
              {/* Modern Glassmorphic Hero Card */}
              <div className='hero-glass-card'>
                <h1 className='hero-heading'>{heading}</h1>
                <p className='hero-paragraph'>{paragraph}</p>
                <Link to='/books' className='hero-btn'>
                  Explore Catalog
                </Link>
              </div>
            </Carousel.Item>
          )
        })}
      </Carousel>
    </div>
  )
}

export default BannerHome
