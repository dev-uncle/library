import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import axios from 'react-hot-toast' // Wait, check the original imports: import axios from 'axios'
import axiosActual from 'axios' // We should import axios from 'axios'
import { backend_server } from '../../main'
import './returnedbooks.css'
import {
  HiOutlineInbox,
  HiOutlineEnvelope,
  HiOutlineBookOpen,
  HiOutlineCalendar,
  HiOutlineCurrencyRupee,
  HiOutlineCheckCircle,
} from 'react-icons/hi2'

const ReturnedBooks = () => {
  const NOT_RETURNED_API = `${backend_server}/api/v1/requestBooks/notreturnedbooks`
  const Update_Return_Status_API = `${backend_server}/api/v1/requestBooks`

  const [notReturnedBooks, setNotReturnedBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAnyBooksPending, setIsAnyBooksPending] = useState(false)

  // Per-row state tracking to fix global state updates bug
  const [rowStatus, setRowStatus] = useState({})
  const [updating, setUpdating] = useState({})

  const fetchNotReturnedBooks = async () => {
    try {
      const response = await axiosActual.get(NOT_RETURNED_API)
      const books = response.data.data ?? []
      setNotReturnedBooks(books)

      if (books.length > 0) {
        setIsAnyBooksPending(true)
        // Seed initial states per-row
        const initial = {}
        books.forEach((b) => {
          initial[b._id] = b.isReturned ? 'true' : 'false'
        })
        setRowStatus(initial)
      } else {
        setIsAnyBooksPending(false)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotReturnedBooks()
  }, [])

  const handleSelectChange = (id, value) => {
    setRowStatus((prev) => ({ ...prev, [id]: value }))
  }

  const handleFormUpdate = async (transactionId) => {
    const updateReturnStatus = rowStatus[transactionId] === 'true'
    setUpdating((prev) => ({ ...prev, [transactionId]: true }))

    try {
      await axiosActual.patch(Update_Return_Status_API, {
        id: transactionId,
        isReturned: updateReturnStatus,
      })
      toast.success('Update Success')
      fetchNotReturnedBooks()
    } catch (error) {
      console.log(error)
      toast.error('Error updating status')
    } finally {
      setUpdating((prev) => ({ ...prev, [transactionId]: false }))
    }
  }

  const isOverdue = (returnDate) => {
    if (!returnDate) return false
    return new Date(returnDate) < new Date()
  }

  return (
    <div className='page-content'>
      <div className='rt-page'>
        {/* ── Header ──────────────────────────── */}
        <div className='rt-header'>
          <div>
            <h1 className='rt-title'>Return Due Books</h1>
            <p className='rt-subtitle'>Monitor return deadlines and update returned status for active loans.</p>
          </div>
          {!loading && isAnyBooksPending && (
            <span className='rt-count-badge'>
              {notReturnedBooks.length} pending
            </span>
          )}
        </div>

        {/* ── Content ─────────────────────────── */}
        {loading ? (
          <div className='rt-skeleton-wrap'>
            {[...Array(5)].map((_, i) => (
              <div key={i} className='rt-skeleton-row' />
            ))}
          </div>
        ) : isAnyBooksPending && notReturnedBooks.length > 0 ? (
          <div className='rt-table-card'>
            <div className='rt-table-wrap'>
              <table className='rt-table'>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>
                      <span className='rt-th-inner'>
                        <HiOutlineEnvelope size={13} />
                        Email
                      </span>
                    </th>
                    <th>
                      <span className='rt-th-inner'>
                        <HiOutlineBookOpen size={13} />
                        Book
                      </span>
                    </th>
                    <th>
                      <span className='rt-th-inner'>
                        <HiOutlineCalendar size={13} />
                        Return Due
                      </span>
                    </th>
                    <th>Return Status</th>
                    <th>
                      <span className='rt-th-inner'>
                        <HiOutlineCurrencyRupee size={13} />
                        Charge
                      </span>
                    </th>
                    <th>Update Status</th>
                  </tr>
                </thead>

                <tbody>
                  {notReturnedBooks.map((book, index) => {
                    const {
                      _id,
                      userEmail,
                      bookTitle,
                      isReturned,
                      returnDate,
                      extraCharge,
                    } = book

                    const overdue = !isReturned && isOverdue(returnDate)

                    return (
                      <tr key={_id} className={overdue ? 'rt-row--overdue' : ''}>
                        <td className='rt-td-num'>{index + 1}</td>
                        <td className='rt-td-muted'>{userEmail}</td>
                        <td className='rt-td-book'>
                          <HiOutlineBookOpen size={14} className='rt-book-icon' />
                          {bookTitle}
                        </td>
                        <td className={overdue ? 'rt-td-overdue' : 'rt-td-muted'}>
                          {new Date(returnDate).toDateString()}
                        </td>
                        <td>
                          <span className={`rt-badge ${isReturned ? 'rt-badge--returned' : 'rt-badge--notreturned'}`}>
                            {isReturned ? 'Returned' : 'Not Returned'}
                          </span>
                        </td>
                        <td className='rt-td-bold'>
                          {extraCharge > 0 ? (
                            <span className='rt-charge--due'>Nrs. {extraCharge}/-</span>
                          ) : (
                            <span className='rt-charge--none'>Nrs. 0/-</span>
                          )}
                        </td>

                        <td>
                          <div className='rt-action-row'>
                            <select
                              className='rt-select'
                              value={rowStatus[_id] || 'false'}
                              onChange={(e) => handleSelectChange(_id, e.target.value)}
                            >
                              <option value='false'>Not Returned</option>
                              <option value='true'>Returned</option>
                            </select>
                            <button
                              className='rt-update-btn'
                              onClick={() => handleFormUpdate(_id)}
                              disabled={updating[_id]}
                            >
                              <HiOutlineCheckCircle size={15} />
                              {updating[_id] ? 'Saving…' : 'Update'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className='rt-empty'>
            <HiOutlineInbox size={42} />
            <p>0 Book's left to RETURN</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReturnedBooks
