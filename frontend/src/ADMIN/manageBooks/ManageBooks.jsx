import React, { useEffect, useState } from 'react'
import ManageSearchBooks from './ManageSearchBooks'
import axios from 'axios'
import './managebooks.css'
import CustomPagination from '../../CLIENT/pagination/CustomPagination'
import { backend_server } from '../../main'
import { Link } from 'react-router-dom'
import { HiOutlinePencilSquare, HiOutlineBookOpen, HiOutlinePlusCircle } from 'react-icons/hi2'

const ManageBooks = () => {
  const API_URL = `${backend_server}/api/v1/books`
  const API_SKIPFETCH = `${backend_server}/api/v1/book/`

  const [searchResult, setSearchResult] = useState(true)
  const [filterActive, setFilterActive] = useState(false)
  const [allBooks, setAllBooks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = async (pageNumber) => {
    try {
      const resp = await axios.get(`${API_SKIPFETCH}/?page=${pageNumber}`)
      setAllBooks(resp.data.data)
    } catch (error) {
      console.log('Error fetching books', error)
    }
  }

  const fetchBooks = async () => {
    try {
      const response = await axios.get(API_URL)
      const bookCategories = [
        ...new Set(response.data.data.map((item) => item.category)),
      ]
      setCategories(bookCategories)
    } catch (error) {
      console.log(error.response)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
    fetchData()
  }, [])

  return (
    <div className='page-content'>
      <div className='mb-page'>
      {/* ── Header ─────────────────────────────── */}
      <div className='mb-header'>
        <div>
          <h1 className='mb-title'>Manage Books</h1>
          <p className='mb-subtitle'>Browse, filter and edit the library collection.</p>
        </div>
        <Link to='/admin/addnewbook' className='mb-add-btn'>
          <HiOutlinePlusCircle size={18} />
          Add New Book
        </Link>
      </div>

      {/* ── Filter bar ─────────────────────────── */}
      <div className='mb-filter-card'>
        <ManageSearchBooks
          setAllBooks={setAllBooks}
          bookCategories={categories}
          setFilterActive={setFilterActive}
          fetchData={fetchData}
        />
      </div>

      {/* ── Table ──────────────────────────────── */}
      {loading ? (
        <div className='mb-skeleton-wrap'>
          {[...Array(6)].map((_, i) => (
            <div key={i} className='mb-skeleton-row' />
          ))}
        </div>
      ) : allBooks.length > 0 ? (
        <div className='mb-table-card'>
          <div className='mb-table-wrap'>
            <table className='mb-table'>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Featured</th>
                  <th>Available</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {allBooks.map((book, index) => {
                  const { _id, title, category, featured, available, quantity, bookFile } = book
                  return (
                    <tr key={_id}>
                      <td className='mb-td-num'>{index + 1}</td>
                      <td className='mb-td-title'>
                        <span className='mb-book-icon'><HiOutlineBookOpen size={15} /></span>
                        {title}
                      </td>
                      <td>
                        <span className='mb-badge mb-badge--category'>{category}</span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, paddingLeft: '8px' }}>{quantity ?? 0}</span>
                      </td>
                      <td>
                        <span className={`mb-badge ${featured ? 'mb-badge--yes' : 'mb-badge--no'}`}>
                          {featured ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td>
                        <span className={`mb-badge ${available ? 'mb-badge--yes' : 'mb-badge--no'}`}>
                          {available ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <Link to={`/admin/managebooks/${_id}`} className='mb-edit-btn'>
                            <HiOutlinePencilSquare size={15} />
                            Edit
                          </Link>
                          {bookFile && (
                            <a
                              href={`${backend_server}/${bookFile}`}
                              target="_blank"
                              rel="noreferrer"
                              className='mb-edit-btn'
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                background: 'rgba(16, 185, 129, 0.1)',
                                border: '1px solid rgba(16, 185, 129, 0.25)',
                                color: '#10b981',
                              }}
                            >
                              <HiOutlineBookOpen size={14} />
                              View E-Book
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className='mb-pagination'>
            <CustomPagination fetchData={fetchData} filterActive={filterActive} />
          </div>
        </div>
      ) : (
        <div className='mb-empty'>
          <HiOutlineBookOpen size={40} />
          <p>No books found</p>
        </div>
      )}
    </div>
    </div>
  )
}

export default ManageBooks
