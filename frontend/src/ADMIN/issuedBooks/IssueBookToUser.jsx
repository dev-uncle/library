import React, { useState } from 'react'
import { backend_server } from '../../main'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import './issuedbooks.css'
import {
  HiOutlineArrowLeft,
  HiOutlineMagnifyingGlass,
  HiOutlineBookOpen,
  HiOutlineClipboardDocumentCheck,
  HiOutlineEnvelope,
  HiOutlineIdentification,
  HiOutlineDocumentDuplicate,
} from 'react-icons/hi2'
import { useNavigate } from 'react-router-dom'

const IssueBookToUser = () => {
  const API_URL     = `${backend_server}/api/v1/filter`
  const IssueBOOK_URL = `${backend_server}/api/v1/requestBooks/issuebook`
  const navigate    = useNavigate()

  const [searchTitle, setSearchTitle] = useState('')
  const [allBooks, setAllBooks]       = useState([])
  const [searching, setSearching]     = useState(false)

  const [bookId, setBookId] = useState('')
  const [email, setEmail]   = useState('')
  const [issuing, setIssuing] = useState(false)

  const handleSearch = async (e) => {
    e?.preventDefault()
    if (!searchTitle.trim()) return
    setSearching(true)
    try {
      const response = await axios.get(API_URL, { params: { title: searchTitle } })
      setAllBooks(response.data.data ?? [])
    } catch (error) {
      console.log(error.response)
    } finally {
      setSearching(false)
    }
  }

  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id).then(() => {
      setBookId(id)
      toast('Book ID copied & pasted into form', { icon: '📋' })
    }).catch(() => toast.error('Copy failed'))
  }

  const handleIssueSubmit = async (e) => {
    e.preventDefault()
    setIssuing(true)
    try {
      await axios.post(IssueBOOK_URL, { bookId, userEmail: email })
      toast.success('Book issued successfully!')
      setBookId('')
      setEmail('')
    } catch (error) {
      const msg = error.response?.data?.message
      const isEmpty = !msg || Object.keys(msg).length === 0
      toast.error(isEmpty ? 'Invalid Book ID' : msg)
    } finally {
      setIssuing(false)
    }
  }

  return (
    <div className='page-content'>
      <div className='ib-page'>

        {/* ── Header ──────────────────────────── */}
        <div className='ib-header'>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <button className='ib-back-btn' onClick={() => navigate(-1)}>
              <HiOutlineArrowLeft size={16} /> Back
            </button>
            <div>
              <h1 className='ib-title'>Issue Book to User</h1>
              <p className='ib-subtitle'>Search a book, copy its ID, then fill the form to issue it.</p>
            </div>
          </div>
        </div>

        {/* ── Two-panel layout ────────────────── */}
        <div className='ibu-grid'>

          {/* LEFT — Book search ─────────────── */}
          <div className='ibu-panel'>
            <div className='ibu-panel-header'>
              <HiOutlineMagnifyingGlass size={16} />
              <span>Search Book</span>
            </div>
            <form className='ibu-search-row' onSubmit={handleSearch}>
              <div className='ibu-search-wrap'>
                <HiOutlineMagnifyingGlass className='ibu-search-icon' size={15} />
                <input
                  type='text'
                  className='ibu-input ibu-search-input'
                  placeholder='Search by title...'
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  autoComplete='off'
                />
              </div>
              <button type='submit' className='ibu-search-btn' disabled={searching}>
                {searching ? 'Searching…' : 'Search'}
              </button>
            </form>

            {allBooks.length > 0 ? (
              <div className='ibu-results-table-wrap'>
                <table className='ib-table'>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Title</th>
                      <th>Copy ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allBooks.map((book, index) => (
                      <tr key={book._id}>
                        <td className='ib-td-num'>{index + 1}</td>
                        <td className='ib-td-book'>
                          <HiOutlineBookOpen size={13} className='ib-book-icon' />
                          {book.title}
                        </td>
                        <td>
                          <button
                            type='button'
                            className='ibu-copy-btn'
                            onClick={() => handleCopyId(book._id)}
                            title={book._id}
                          >
                            <HiOutlineDocumentDuplicate size={14} />
                            Copy ID
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className='ibu-no-results'>
                <HiOutlineBookOpen size={28} />
                <p>Search for a book above to see results</p>
              </div>
            )}
          </div>

          {/* RIGHT — Issue form ─────────────── */}
          <div className='ibu-panel'>
            <div className='ibu-panel-header'>
              <HiOutlineClipboardDocumentCheck size={16} />
              <span>Issue Details</span>
            </div>
            <form className='ibu-issue-form' onSubmit={handleIssueSubmit}>
              <div className='ibu-field'>
                <label className='ibu-label' htmlFor='ibu-bookId'>
                  <HiOutlineIdentification size={14} /> Book ID
                </label>
                <input
                  id='ibu-bookId'
                  type='text'
                  className='ibu-input'
                  placeholder='Paste or copy Book ID from search'
                  value={bookId}
                  onChange={(e) => setBookId(e.target.value)}
                  autoComplete='off'
                  required
                />
                {bookId && (
                  <span className='ibu-id-preview' title={bookId}>
                    {bookId.slice(0, 24)}…
                  </span>
                )}
              </div>

              <div className='ibu-field'>
                <label className='ibu-label' htmlFor='ibu-email'>
                  <HiOutlineEnvelope size={14} /> User Email
                </label>
                <input
                  id='ibu-email'
                  type='email'
                  className='ibu-input'
                  placeholder='Enter user email address'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete='off'
                  required
                />
              </div>

              <div className='ibu-actions'>
                <button type='submit' className='ibu-submit-btn' disabled={issuing}>
                  <HiOutlineClipboardDocumentCheck size={17} />
                  {issuing ? 'Issuing…' : 'Issue Book'}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  )
}

export default IssueBookToUser
