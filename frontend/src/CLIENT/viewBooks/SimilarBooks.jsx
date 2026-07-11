import React from 'react'
import { backend_server } from '../../main'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom'
import RequestBook from '../requestBooks/RequestBook'
import '../books/card.css'

const SimilarBooks = () => {
  const { id } = useParams()

  const FetchSimilarBooks_API = `${backend_server}/api/v1/similarBooks/${id}`

  const [similarBooks, setSimilarBooks] = useState([])

  const { request_Book } = RequestBook()

  const fetchSimilarBooks = async () => {
    try {
      const response = await axios.get(FetchSimilarBooks_API)
      // console.log(response.data.data)
      setSimilarBooks(response.data.data)
    } catch (error) {
      console.log(error)
      console.log(error.response)
    }
  }

  useEffect(() => {
    fetchSimilarBooks()
  }, [])

  return (
    <div className='similar-books-section mt-5'>
      <h3 className='synopsis-title mb-4'>Similar Books You Might Like</h3>
      <div className='row client-book-grid g-4'>
        {similarBooks.length > 0 ? (
          similarBooks.map((book) => {
            const { _id, title, image, author, available } = book
            const imgSrc = `${backend_server}/${image}`

            return (
              <div
                className='col-xxl-3 col-lg-3 col-md-4 col-sm-6 col-6'
                key={_id}
              >
                <div className='card'>
                  <div className='card-img-container'>
                    {available ? (
                      <span className='status-badge available'>Available</span>
                    ) : (
                      <span className='status-badge outofstock'>Out of Stock</span>
                    )}
                    <img
                      className='card-img-top'
                      src={imgSrc}
                      alt='book image'
                    />
                    <div className='card-img-overlay-gradient'></div>
                  </div>

                  <div className='card-body'>
                    <h5 className='h5 card-title' title={title}>{title}</h5>
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
          })
        ) : (
          <p className='p text-center' style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Loading ...</p>
        )}
      </div>
    </div>
  )
}

export default SimilarBooks
