import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { backend_server } from '../../main'
import { Link } from 'react-router-dom'
import './issuedbooks.css'
import {
  HiOutlineClipboardDocumentList,
  HiOutlineBookOpen,
  HiOutlineEnvelope,
  HiOutlinePlusCircle,
} from 'react-icons/hi2'

const IssuedBooks = () => {
  const NOT_RETURNED_API = `${backend_server}/api/v1/requestBooks/notreturnedbooks`
  const [notReturnedBooks, setNotReturnedBooks] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchNotReturnedBooks = async () => {
    try {
      const response = await axios.get(NOT_RETURNED_API)
      setNotReturnedBooks(response.data.data ?? [])
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchNotReturnedBooks() }, [])

  const isOverdue = (returnDate) => {
    if (!returnDate) return false
    return new Date(returnDate) < new Date()
  }

  return (
    <div className='page-content'>
      <div className='ib-page'>

        {/* ── Header ──────────────────────────── */}
        <div className='ib-header'>
          <div>
            <h1 className='ib-title'>Issued Books</h1>
            <p className='ib-subtitle'>All currently borrowed books that have not been returned.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {!loading && notReturnedBooks.length > 0 && (
              <span className='ib-count-badge'>
                {notReturnedBooks.length} active
              </span>
            )}
            <Link to='/admin/issuebooktouser' className='ib-issue-btn'>
              <HiOutlinePlusCircle size={17} />
              Issue Book
            </Link>
          </div>
        </div>

        {/* ── Content ─────────────────────────── */}
        {loading ? (
          <div className='ib-skeleton-wrap'>
            {[...Array(5)].map((_, i) => <div key={i} className='ib-skeleton-row' />)}
          </div>
        ) : notReturnedBooks.length > 0 ? (
          <div className='ib-table-card'>
            <div className='ib-table-wrap'>
              <table className='ib-table'>
                <thead>
                  <tr>
                    <th>#</th>
                    <th><span className='ib-th-inner'><HiOutlineBookOpen size={13} />Book</span></th>
                    <th><span className='ib-th-inner'><HiOutlineEnvelope size={13} />User Email</span></th>
                    <th>Issue Date</th>
                    <th>Return Due</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {notReturnedBooks.map((book, index) => {
                    const { _id, userEmail, bookTitle, isReturned, returnDate, issueDate } = book
                    const overdue = !isReturned && isOverdue(returnDate)
                    return (
                      <tr key={_id} className={overdue ? 'ib-row--overdue' : ''}>
                        <td className='ib-td-num'>{index + 1}</td>
                        <td className='ib-td-book'>
                          <HiOutlineBookOpen size={14} className='ib-book-icon' />
                          {bookTitle}
                        </td>
                        <td className='ib-td-muted'>{userEmail}</td>
                        <td className='ib-td-muted'>{new Date(issueDate).toDateString()}</td>
                        <td className={overdue ? 'ib-td-overdue' : 'ib-td-muted'}>
                          {returnDate ? new Date(returnDate).toDateString() : '—'}
                        </td>
                        <td>
                          {isReturned ? (
                            <span className='ib-badge ib-badge--returned'>Returned</span>
                          ) : overdue ? (
                            <span className='ib-badge ib-badge--overdue'>Overdue</span>
                          ) : (
                            <span className='ib-badge ib-badge--active'>Active</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className='ib-empty'>
            <HiOutlineClipboardDocumentList size={42} />
            <p>No books currently issued</p>
            <Link to='/admin/issuebooktouser' className='ib-issue-btn'>
              <HiOutlinePlusCircle size={16} /> Issue a Book
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default IssuedBooks
