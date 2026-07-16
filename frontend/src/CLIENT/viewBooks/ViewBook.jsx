import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { backend_server } from '../../main'
import './viewBooks.css'
import useFetch from '../../useFetch'
import RequestBook from '../requestBooks/RequestBook'
import SimilarBooks from './SimilarBooks'
import { FaBook, FaLanguage, FaCheckCircle, FaTimesCircle, FaArrowLeft } from 'react-icons/fa'
import { useLoginState } from '../../LoginState'

const ViewBook = () => {
  const { id } = useParams() //fetching book id from url params
  const API_URL = `${backend_server}/api/v1/books/${id}`

  const { request_Book } = RequestBook()
  const { requestedBookIds } = useLoginState()
  const isRequested = requestedBookIds?.includes(id)
  const navigate = useNavigate()

  const getData = useFetch(API_URL)

  // Destructuring fetched data
  const data = getData.fetched_data?.data || {}
  const imageFullPath = getData.imagePath

  const [bookData, setBookData] = useState({})

  useEffect(() => {
    setBookData({ ...data, image: imageFullPath })
    window.scrollTo(0, 0)
  }, [data, imageFullPath])

  return (
    <div className='view-book-wrapper'>
      <div className='container py-5'>
        {/* Back Button */}
        <button className='back-ghost-btn mb-4' onClick={() => navigate(-1)}>
          <FaArrowLeft className="me-2" /> Back to Catalog
        </button>

        {/* Glassmorphic Detail Card */}
        <div className='glass-detail-card mb-5'>
          <div className='row g-0'>
            
            {/* Left Col: Book Image Section */}
            <div className='col-lg-4 col-md-5 d-flex justify-content-center align-items-start p-4 image-container'>
              <div className='book-cover-wrapper'>
                <img
                  src={bookData.image}
                  alt={bookData.title}
                  className='img-fluid book-cover-img'
                />
              </div>
            </div>

            {/* Right Col: Book Details Section */}
            <div className='col-lg-8 col-md-7 p-4 p-md-5 details-container'>
              <div className='book-header-info'>
                <h1 className='book-detail-title'>{bookData.title}</h1>
                <h4 className='book-detail-author'>by {bookData.author}</h4>
              </div>

              {/* Metadata Badges */}
              <div className='book-meta-badges my-4'>
                <span className='meta-badge category-badge'>
                  <FaBook className='me-2' /> {bookData.category}
                </span>
                <span className='meta-badge language-badge'>
                  <FaLanguage className='me-2' /> {bookData.language}
                </span>
                <span className={`meta-badge status-badge ${bookData.available ? 'in-stock' : 'out-of-stock'}`}>
                  {bookData.available ? <FaCheckCircle className='me-2' /> : <FaTimesCircle className='me-2' />}
                  {bookData.available ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              {/* Synopsis */}
              <div className='book-synopsis-section'>
                <h5 className='synopsis-title'>Synopsis</h5>
                <p className='synopsis-text'>{bookData.description}</p>
              </div>

          {/* Request Books Button */}
          <div className='text-center'>
            {isRequested ? (
              <button
                disabled
                type='button'
                className='btn btn-warning me-2 mt-3'
                style={{ color: '#ffffff' }}
              >
                Requested
              </button>
            ) : bookData.available ? (
              <button
                type='button'
                className='btn btn-primary me-2 mt-3'
                onClick={() => request_Book(bookData._id)}
              >
                Request
              </button>
            ) : (
              <button
                disabled
                type='button'
                className='btn btn-secondary me-2 mt-3'
              >
                Out of Stock
              </button>
            )}

            {bookData.bookFile && (
              <a
                href={`${backend_server}/${bookData.bookFile}`}
                target="_blank"
                rel="noreferrer"
                className='btn btn-success me-2 mt-3'
                style={{ color: '#ffffff' }}
              >
                Read E-Book
              </a>
            )}

            <button
              type='button'
              className='btn btn-secondary me-2 mt-3'
              onClick={() => navigate(-1)}
            >
              Back
            </button>
          </div>
        </div>

        {/* Similar Books Section */}
        <SimilarBooks />
        g
      </div>
    </div>
  )
}

export default ViewBook
