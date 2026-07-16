import React, { useEffect, useState } from 'react'
import { backend_server } from '../../main'
import axios from 'axios'
import './clientprofile.css' // Reuse client-profile core typography/spacing
import '../../ADMIN/activityLog/activitylog.css' // Import the beautiful activity log table styling

import {
  HiOutlineInbox,
  HiOutlineBookOpen,
  HiOutlineMagnifyingGlass,
  HiOutlineArrowPath
} from 'react-icons/hi2'

const ClientArchive = () => {
  const API_URL = `${backend_server}/api/v1/requestBooks/my-activity-log`

  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const response = await axios.get(API_URL, {
        params: {
          search: search || undefined
        }
      })
      setLogs(response.data.data ?? [])
    } catch (error) {
      console.error('Error fetching student activity logs:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    fetchLogs()
  }

  return (
    <div className='al-page' style={{ padding: '0.5rem' }}>
      {/* ── Header ───────────────────────────── */}
      <div className='al-header'>
        <div>
          <h1 className='al-title'>My Archive</h1>
          <p className='al-subtitle'>View the complete historical log of your archived book transactions.</p>
        </div>
        <button className='al-refresh-btn' onClick={fetchLogs} title="Refresh History">
          <HiOutlineArrowPath size={18} />
        </button>
      </div>

      {/* ── Filter Bar ────────────────────────── */}
      <div className='al-filter-card'>
        <form onSubmit={handleSearchSubmit} className='al-filter-form'>
          <div className='al-search-box'>
            <HiOutlineMagnifyingGlass className='al-search-icon' />
            <input
              type='text'
              placeholder='Search by book title...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='al-search-input'
            />
            <button type='submit' className='al-search-btn'>Search</button>
          </div>
        </form>
      </div>

      {/* ── Table / Content ───────────────────── */}
      {loading ? (
        <div className='al-skeleton-wrap'>
          {[...Array(4)].map((_, i) => <div key={i} className='al-skeleton-row' />)}
        </div>
      ) : logs.length === 0 ? (
        <div className='al-empty'>
          <HiOutlineInbox size={42} />
          <p>No past activities in your archive</p>
        </div>
      ) : (
        <div className='al-table-card'>
          <div className='al-table-wrap'>
            <table className='al-table'>
              <thead>
                <tr>
                  <th><span className='al-th-inner'><HiOutlineBookOpen size={13} />Book Title</span></th>
                  <th>Archive Date</th>
                  <th>Requested Date</th>
                  <th>Returned Date</th>
                  <th>Status</th>
                  <th>Charges Fine</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => {
                  const { _id, timestamp, requestedDate, returnedDate, bookTitle, fineAmount } = log
                  return (
                    <tr key={_id}>
                      <td className='al-td-book'>
                        <HiOutlineBookOpen size={14} className='al-book-icon' />
                        {bookTitle}
                      </td>
                      <td className='al-td-date'>
                        {new Date(timestamp).toLocaleString(undefined, {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </td>
                      <td className='al-td-date'>
                        {requestedDate ? new Date(requestedDate).toLocaleDateString() : '—'}
                      </td>
                      <td className='al-td-date'>
                        {returnedDate ? new Date(returnedDate).toLocaleDateString() : '—'}
                      </td>
                      <td>
                        <span className="al-badge al-badge--archived">
                          Archived
                        </span>
                      </td>
                      <td className='al-td-bold'>
                        {fineAmount > 0 ? (
                          <span className='al-charge--due'>Nrs. {fineAmount}/-</span>
                        ) : (
                          <span className='al-charge--none'>—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClientArchive
