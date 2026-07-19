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

  // Helper to get element id for smooth scrolling
  const getSectionId = (title) => {
    if (title.toLowerCase().includes('story')) return 'section-story'
    if (title.toLowerCase().includes('mission')) return 'section-mission'
    if (title.toLowerCase().includes('team')) return 'section-team'
    return `section-${title.toLowerCase().replace(/\s+/g, '-')}`
  }

  return (
    <div className='about-page-wrapper'>
      {/* Full-width Pure CSS Hero Banner */}
      <AboutUsBanner />

      <Container className='py-4'>
        <h2 className='about-section-heading'>
          Who We Are
        </h2>
        
        <Row className='mt-4 g-4 justify-content-center'>
          {about_data.map((item) => {
            const { id, title, description } = item
            const sectionId = getSectionId(title)
            return (
              <Col lg={4} md={6} sm={12} key={id}>
                <div className='about-glass-card' id={sectionId}>
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
