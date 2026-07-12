import React from 'react'
import { backend_server } from '../../main'
import { Link } from 'react-router-dom'
import './card.css'
import RequestBook from '../requestBooks/RequestBook'

const BrowseCollectionBooks = ({ bookData, searchResult }) => {
  const { request_Book } = RequestBook()

  return (
    <div className='row mt-3 client-book-grid' style={{ gap: '24px 0' }}>
      {bookData.length > 0 ? (
        bookData.map((book) => {
          const { _id, title, image, author, available, quantity, bookFile } = book
          const imgSrc = `${backend_server}/${image}`

          return (
            <div className='col-xxl-3 col-lg-3 col-md-4 col-sm-6 col-6' key={_id} style={{ padding: '12px' }}>
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

                    {/* View Books Button */}
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
        <h5 className='p text-center w-100 py-5'>
          {searchResult ? <p>Loading...</p> : <p>0 Results</p>}
        </h5>
      )}
    </div>
  )
}

export default BrowseCollectionBooks
