import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import './smallbanner.css'

const SmallBanner = () => {
  return (
    <div className='div-with-background mt-5'>
      <Container>
        <Row className='quote-container me-1'>
          <h1>"Happiness is only real when shared"</h1>
          <p>― Jon Krakauer, Into the Wild</p>
        </Row>
      </Container>
    </div>
  )
}

export default SmallBanner
