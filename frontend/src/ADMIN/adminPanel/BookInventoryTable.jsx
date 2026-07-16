import React from 'react'
import { backend_server } from '../../main'
import { HiOutlineExclamationTriangle, HiOutlineBookOpen, HiOutlineChevronRight } from 'react-icons/hi2'
import { Link } from 'react-router-dom'

const BookInventoryTable = ({ data }) => {
  const lowQuantityBooks = data.lowQuantityBooks || []

  // Color picker based on quantity
  const getStockColor = (qty) => {
    if (qty === 0) return '#ef4444' // Red (Out of Stock)
    if (qty <= 2) return '#f97316'  // Orange (Critical)
    return '#eab308'               // Yellow (Low Stock)
  }

  const getStockStatus = (qty) => {
    if (qty === 0) return 'Out of Stock'
    if (qty <= 2) return 'Critical'
    return 'Low Stock'
  }

  return (
    <div className="chart-card inventory-analytics-card">
      <div className="inventory-header">
        <div className="inventory-title-wrap">
          <HiOutlineExclamationTriangle className="inventory-alert-icon" size={18} />
          <div>
            <h3 className="chart-title" style={{ margin: 0 }}>Inventory & Stock Alerts</h3>
            <p className="dashboard-subtitle" style={{ fontSize: '0.8rem', marginTop: '2px' }}>
              Track books that need replenishment.
            </p>
          </div>
        </div>
        <span className="inventory-subtitle-badge">
          {lowQuantityBooks.length} books need restocking
        </span>
      </div>

      <div className="inventory-table-panel" style={{ overflowX: 'auto', width: '100%' }}>
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Book</th>
              <th>Category</th>
              <th>Author</th>
              <th style={{ textAlign: 'center' }}>Stock Qty</th>
              <th>Status</th>
              <th style={{ width: '80px', textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {lowQuantityBooks.length === 0 ? (
              <tr>
                <td colSpan="6" className="inventory-table-empty">No inventory alerts</td>
              </tr>
            ) : (
              lowQuantityBooks.map((book) => {
                const qty = book.quantity
                const color = getStockColor(qty)
                const status = getStockStatus(qty)

                return (
                  <tr key={book._id}>
                    <td>
                      <div className="inventory-book-cell">
                        <div className="inventory-book-cover">
                          {book.image ? (
                            <img 
                              src={`${backend_server}/${book.image}`} 
                              alt={book.title} 
                              onError={(e) => {
                                e.target.onerror = null
                                e.target.style.display = 'none'
                              }} 
                            />
                          ) : null}
                          <HiOutlineBookOpen className="inventory-fallback-icon" size={14} />
                        </div>
                        <div className="inventory-book-info">
                          <span className="inventory-book-title" title={book.title}>{book.title}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="inventory-category-tag">{book.category}</span>
                    </td>
                    <td>
                      <span className="inventory-book-author" style={{ fontSize: '0.85rem' }}>
                        {book.author}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="inventory-qty-text" style={{ color: color, fontWeight: 700 }}>
                        {qty}
                      </span>
                    </td>
                    <td>
                      <span className="inventory-status-pill" style={{ color: color, backgroundColor: `${color}15`, border: `1px solid ${color}25` }}>
                        <span className="inventory-status-dot" style={{ backgroundColor: color }} />
                        {status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <Link 
                        to={`/admin/managebooks`} 
                        className="quick-action__icon" 
                        style={{ 
                          width: '28px', 
                          height: '28px', 
                          margin: '0 auto',
                          background: `${color}15`, 
                          color: color,
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <HiOutlineChevronRight size={14} />
                      </Link>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default BookInventoryTable
