import React from 'react'
import { FaGraduationCap, FaBookOpen, FaBullseye, FaUsers } from 'react-icons/fa'

const AboutUsBanner = () => {
  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className='about-hero-mesh'>
      {/* Pure CSS background grid & ambient glow */}
      <div className='about-mesh-grid'></div>
      <div className='about-mesh-glow'></div>

      <div className='about-hero-container'>
        <div className='about-badge-pill'>
          <FaGraduationCap className='about-badge-icon' />
          <span>Colegio de Montalban</span>
        </div>

        <h1 className='about-hero-main-title'>
          Empowering Minds, <br />
          <span className='about-title-highlight'>Shaping the Future</span>
        </h1>

        <p className='about-hero-description'>
          Dedicated to providing technology-driven, accessible, and value-oriented 
          education for the youth of Rodriguez, Rizal and nearby communities.
        </p>

        <div className='about-hero-chips'>
          <button className='about-chip-btn' onClick={() => scrollToSection('section-story')}>
            <FaBookOpen /> Our Story
          </button>
          <button className='about-chip-btn' onClick={() => scrollToSection('section-mission')}>
            <FaBullseye /> Our Mission
          </button>
          <button className='about-chip-btn' onClick={() => scrollToSection('section-team')}>
            <FaUsers /> Our Team
          </button>
        </div>
      </div>
    </div>
  )
}

export default AboutUsBanner
