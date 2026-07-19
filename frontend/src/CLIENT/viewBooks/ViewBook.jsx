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
    <div className='view-book-wrapper py-5'>
      <div className='container'>
        {/* Back button */}
        <div className='mb-4 text-start'>
          <button
            type='button'
            className='back-ghost-btn'
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft className='me-2' /> Back to Catalog
          </button>
        </div>

        {/* Premium Glass Details Card */}
        <div className='glass-detail-card p-4 p-md-5'>
          <div className='row g-5 align-items-center'>
            <div className='col-lg-4 col-md-5 col-12 d-flex justify-content-center'>
              <div className='book-cover-wrapper'>
                <img
                  src={bookData.image}
                  alt={bookData.title}
                  className='book-cover-img img-fluid'
                />
              </div>
            </div>

            <div className='col-lg-8 col-md-7 col-12 text-md-start text-center'>
              <h1 className='book-detail-title'>{bookData.title}</h1>
              <p className='book-detail-author'>by {bookData.author}</p>

              <div className='book-meta-badges my-4 justify-content-md-start justify-content-center'>
                <span className='meta-badge category-badge'>
                  <FaBook className='me-2' /> {bookData.category}
                </span>
                <span className='meta-badge language-badge'>
                  <FaLanguage className='me-2' /> {bookData.language}
                </span>
                {bookData.available ? (
                  <span className='meta-badge status-badge in-stock'>
                    <FaCheckCircle className='me-2' /> In Stock
                  </span>
                ) : (
                  <span className='meta-badge status-badge out-of-stock'>
                    <FaTimesCircle className='me-2' /> Out of Stock
                  </span>
                )}
              </div>

              <div className='stats-divider my-4'></div>

              <h5 className='synopsis-title'>Synopsis</h5>
              <p className='synopsis-text'>{bookData.description || 'No description available for this book.'}</p>

              <div className='mt-4 pt-2 text-md-start text-center d-flex flex-wrap gap-3 justify-content-md-start justify-content-center align-items-center'>
                {isRequested ? (
                  <button
                    type='button'
                    className='request-action-btn disabled'
                    disabled
                  >
                    Requested
                  </button>
                ) : bookData.available ? (
                  <button
                    type='button'
                    className='request-action-btn'
                    onClick={() => request_Book(bookData._id)}
                  >
                    Request Copy
                  </button>
                ) : (
                  <button
                    type='button'
                    className='request-action-btn disabled'
                    disabled
                  >
                    Out of Stock
                  </button>
                )}

                {bookData.bookFile && (
                  <a
                    href={`${backend_server}/${bookData.bookFile}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='ebook-action-btn'
                  >
                    Read E-Book
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Similar Books Section */}
        <SimilarBooks />
      </div>
    </div>
  )
}

export default ViewBook
