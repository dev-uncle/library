import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import AboutUsBanner from './AboutUsBanner'
import { about_data } from './aboutusData'
import { FaBookOpen, FaBullseye, FaUsers } from 'react-icons/fa'
import './aboutus.css'

const AboutUsPage = () => {
  // Helper to assign a specific icon based on the section title
  const getIconForTitle = (title) => {
    if (title.toLowerCase().includes('story')) return <FaBookOpen />
    if (title.toLowerCase().includes('mission')) return <FaBullseye />
    if (title.toLowerCase().includes('team')) return <FaUsers />
    return <FaBookOpen />
  }

  return (
    <div className='about-page-wrapper'>
      {/* Full-width Hero Banner */}
      <AboutUsBanner />

      <Container>
        <h2 className='about-section-heading'>
          Who We Are
        </h2>
        
        <Row className='mt-5 g-4 justify-content-center'>
          {about_data.map((item) => {
            const { id, title, description } = item
            return (
              <Col lg={4} md={6} sm={12} key={id}>
                <div className='about-glass-card'>
                  <div className='about-card-icon-wrapper'>
                    {getIconForTitle(title)}
                  </div>
                  <h3 className='about-card-title'>{title}</h3>
                  <p className='about-card-text'>{description}</p>
                </div>
              </Col>
            )
          })}
        </Row>
      </Container>
    </div>
  )
}

export default AboutUsPage
