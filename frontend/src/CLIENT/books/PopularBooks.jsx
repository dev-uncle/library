import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './card.css'
import RequestBook from '../requestBooks/RequestBook'
import { backend_server } from '../../main'
import axios from 'axios'

const PopularBooks = () => {
  const PopularBooks_API_URL = `${backend_server}/api/v1/popularBooks`

  const [popularBooks, setPopularBooks] = useState([])
  const { request_Book } = RequestBook()

  const fetchData = async () => {
    try {
      const response = await axios.get(PopularBooks_API_URL)
      setPopularBooks(response.data.data)
    } catch (error) {
      console.log(error.response)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className='row mt-3 client-book-grid' style={{ gap: '24px 0' }}>
      {popularBooks.length > 0 ? (
        popularBooks.map((book) => {
          const { _id, title, image, author, available, quantity, bookFile } = book
          const imgSrc = `${backend_server}/${image}`

          return (
            <div className='col-lg-3 col-md-4 col-sm-6 col-6' key={_id} style={{ padding: '12px' }}>
              <div className='card h-100'>
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
                      <button type='button' className='btn-card-secondary'>
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
        <p className='text-center w-100 py-5 books-loading-text'>Loading ...</p>
      )}
    </div>
  )
}

export default PopularBooks
