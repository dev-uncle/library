import React, { useEffect, useState } from 'react'
import { backend_server } from '../../main'
import axios from 'axios'
import { Link } from 'react-router-dom'
import RequestBook from '../requestBooks/RequestBook'
import { useLoginState } from '../../LoginState'

const RecommendedBooks = () => {
  const RECOMMENDED_BOOK_API = `${backend_server}/api/v1/recommendedBooks`
  const { userLogState } = useLoginState()
  const [latestBooks, setLatestBooks] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    if (!userLogState) {
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      const response = await axios.get(RECOMMENDED_BOOK_API)
      const fetchedBooks = await response.data.data
      setLatestBooks(fetchedBooks || [])
    } catch (error) {
      console.log('Recommended Books Unable to Fetch !')
    } finally {
      setLoading(false)
    }
  };

  const { request_Book } = RequestBook()

  useEffect(() => {
    fetchData()
  }, [userLogState])

  // If NOT logged in, show a modern glassmorphic Call to Action (CTA) card
  if (!userLogState) {
    return (
      <div className='col-12'>
        <div className='login-cta-container'>
          <h3 className='login-cta-title'>Personalized Recommendations</h3>
          <p className='login-cta-text'>
            Log in to your account to see custom book recommendations tailored to your reading preferences and borrowing history.
          </p>
          <Link to='/login' className='login-cta-button'>
            Log In Now
          </Link>
        </div>
      </div>
    )
  }

  // If loading recommendations
  if (loading) {
    return (
      <div className='col-12 py-5 text-center'>
        <div className='spinner-border text-warning' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </div>
        <p className='p mt-2'>Loading recommendations...</p>
      </div>
    )
  }

  // If logged in and has books, show them
  if (latestBooks.length > 0) {
    return (
      <div className='col-12 my-2'>
        <h2 className='home-section-header'>Recommended Books</h2>
        <div className='row mb-3 client-book-grid g-4'>
          {latestBooks.map((book) => {
            const { _id, title, image, author, available, quantity, bookFile } = book
            const imgSrc = `${backend_server}/${image}`

            return (
              <div
                className='col-xxl-3 col-lg-3 col-md-4 col-sm-6 col-6'
                key={_id}
              >
                <div className='card'>
                  <div className='card-img-container'>
                    {available ? (
                      <span className='status-badge available'>Available ({quantity ?? 1})</span>
                    ) : (
                      <span className='status-badge outofstock'>Out of Stock</span>
                    )}
                    {bookFile && (
                      <span className='status-badge ebook-badge'>E-Book</span>
                    )}
                    <img
                      className='card-img-top'
                      src={imgSrc}
                      alt='book image'
                    />
                    <div className='card-img-overlay-gradient'></div>
                  </div>

                  <div className='card-body'>
                    <h5 className='card-title' title={title}>{title}</h5>
                    <p className='card-text'>{author}</p>
                    <div className='card-action-group'>
                      {available ? (
                        <button
                          type='button'
                          className='btn-card-primary'
                          onClick={() => request_Book(_id)}
                        >
                          Request
                        </button>
                      ) : (
                        <button
                          type='button'
                          className='btn-card-primary'
                          disabled
                        >
                          Out of Stock
                        </button>
                      )}

                      <Link to={`/books/${_id}`}>
                        <button
                          type='button'
                          className='btn-card-secondary'
                        >
                          View
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Fallback if logged in but empty recommendations list
  return null
}

export default RecommendedBooks
