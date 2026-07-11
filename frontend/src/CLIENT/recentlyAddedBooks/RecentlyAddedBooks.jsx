import React, { useEffect, useState } from 'react'
import { backend_server } from '../../main'
import axios from 'axios'
import { Link } from 'react-router-dom'
import RequestBook from '../requestBooks/RequestBook'

const RecentlyAddedBooks = () => {
  const recentBooks_Api_URL = `${backend_server}/api/v1/recentBooks`
  const [latestBooks, setLatestBooks] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await axios.get(recentBooks_Api_URL)
      const fetchedBooks = await response.data.data
      setLatestBooks(fetchedBooks || [])
    } catch (error) {
      console.log('Error fetching recent books:', error)
    } finally {
      setLoading(false)
    }
  }

  const { request_Book } = RequestBook()

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className='col-12'>
      <h2 className='home-section-header'>Latest Books</h2>

      <div className='row mb-3 client-book-grid g-4'>
        {loading ? (
          <div className='col-12 py-5 text-center'>
            <div className='spinner-border text-warning' role='status'>
              <span className='visually-hidden'>Loading...</span>
            </div>
            <p className='p mt-2'>Loading latest books...</p>
          </div>
        ) : latestBooks.length > 0 ? (
          latestBooks.map((book) => {
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
          <p className='p text-center w-100'>No books found</p>
        )}
      </div>
    </div>
  )
}

export default RecentlyAddedBooks
