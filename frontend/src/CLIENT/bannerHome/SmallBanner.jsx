import React, { useEffect, useState } from 'react'
import './smallbanner.css'

const SmallBanner = () => {
  const images = ['/cdm1.jpg', '/cdm2.jpg']
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === 0 ? 1 : 0))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className='div-with-background mt-5'>
      {images.map((img, index) => (
        <div
          key={index}
          className={`small-banner-slide ${index === currentIndex ? 'active' : ''}`}
          style={{
            backgroundImage: `url(${img})`,
          }}
        />
      ))}
    </div>
  )
}

export default SmallBanner
