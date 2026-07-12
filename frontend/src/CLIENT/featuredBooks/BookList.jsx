import React from 'react'
import { backend_server } from '../../main'
import { Link } from 'react-router-dom'
import RequestBook from '../requestBooks/RequestBook'
import { useLoginState } from '../../LoginState'

const BookList = (props) => {
  const { books } = props
  const { request_Book } = RequestBook()
  const { requestedBookIds } = useLoginState()

  return (
    <div className='row client-book-grid g-4'>
      {books.map((book) => {
        const { _id, title, image, author, available, quantity, bookFile } = book
        const imgSrc = `${backend_server}/${image}`
        const isRequested = requestedBookIds?.includes(_id)

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
                <h5 className='h5 card-title' title={title}>{title}</h5>
                <p className='card-text'>{author}</p>
                <div className='card-action-group'>
                  {isRequested ? (
                    <button
                      type='button'
                      className='btn-card-primary'
                      disabled
                      style={{ backgroundColor: 'var(--accent)', opacity: 0.65 }}
                    >
                      Requested
                    </button>
                  ) : available ? (
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
  )
}

export default BookList
