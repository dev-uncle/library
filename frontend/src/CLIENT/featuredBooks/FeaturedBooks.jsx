import React, { useEffect, useState } from 'react'
import BookList from './BookList'
import { Row } from 'react-bootstrap'
import axios from 'axios'
import { backend_server } from '../../main'
import { FaBookOpen, FaCode, FaPrayingHands, FaCompass, FaHistory, FaGraduationCap, FaChevronRight } from 'react-icons/fa'

const FeaturedBooks = () => {
  const featuredBooks_API_URL = `${backend_server}/api/v1/books`
  const [allFeaturedBooks, setAllFeaturedBooks] = useState([])
  const [bookCategories, setBookCategories] = useState([])
  const [loading, setLoading] = useState(true)
  
  // State for step tracking: null means Category Grid View, non-null is the selected category string
  const [selectedCategory, setSelectedCategory] = useState(null)

  // Category Pagination States
  const [currentPage, setCurrentPage] = useState(1)
  const categoriesPerPage = 6

  const fetchFeaturedBooks = async () => {
    try {
      setLoading(true)
      const response = await axios.get(featuredBooks_API_URL)
      const books_data = response.data.data || []

      // Extract unique categories dynamically
      const uniqueCategories = [
        ...new Set(
          books_data.map((items) => items.category)
        ),
      ]

      setBookCategories(uniqueCategories)
      setAllFeaturedBooks(books_data)
    } catch (error) {
      console.log('Error fetching featured books:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeaturedBooks()
  }, [])

  // Maps category text to a react-icon
  const getCategoryIcon = (category) => {
    const normalized = category.toUpperCase()
    if (normalized.includes('PROGRAM') || normalized.includes('CODE') || normalized.includes('DEVELOP')) {
      return <FaCode />
    }
    if (normalized.includes('SPIRIT') || normalized.includes('PRAY') || normalized.includes('RELIG')) {
      return <FaPrayingHands />
    }
    if (normalized.includes('HIST')) {
      return <FaHistory />
    }
    if (normalized.includes('EDU') || normalized.includes('STUDY') || normalized.includes('ACADEMIC')) {
      return <FaGraduationCap />
    }
    if (normalized.includes('NOVEL') || normalized.includes('FICTION') || normalized.includes('LIT')) {
      return <FaBookOpen />
    }
    return <FaCompass />
  }

  // Format category names for clean display (e.g. "PROGRAMMING" -> "Programming")
  const formatCategoryName = (category) => {
    if (!category) return ''
    return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()
  }

  // Filter books for the active detail view
  const filteredBooks = selectedCategory
    ? allFeaturedBooks.filter((book) => book.category === selectedCategory)
    : []

  // Category Pagination calculations
  const indexOfLastCategory = currentPage * categoriesPerPage
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage
  const currentCategories = bookCategories.slice(indexOfFirstCategory, indexOfLastCategory)
  const totalPages = Math.ceil(bookCategories.length / categoriesPerPage)

  const handleReturnToCategories = () => {
    setSelectedCategory(null)
    setCurrentPage(1) // Reset to page 1 on return
  }

  return (
    <div className='col-12 featured-discovery-section'>
      {/* 1. Header / Breadcrumbs Area */}
      <div className="discovery-header-container text-center mb-5">
        {!selectedCategory ? (
          <h2 className='home-section-header'>Find your next Read</h2>
        ) : (
          <div className="breadcrumb-discovery">
            <span 
              className="breadcrumb-root-link" 
              onClick={handleReturnToCategories}
              title="Back to Categories"
            >
              Find your next Read
            </span>
            <FaChevronRight className="breadcrumb-separator-icon" />
            <span className="breadcrumb-active-node">
              {formatCategoryName(selectedCategory)}
            </span>
          </div>
        )}
      </div>

      {loading ? (
        <div className='py-5 text-center'>
          <div className='spinner-border text-warning' role='status'>
            <span className='visually-hidden'>Loading...</span>
          </div>
          <p className='p mt-2'>Loading discovery catalog...</p>
        </div>
      ) : allFeaturedBooks.length > 0 ? (
        <div>
          {/* STEP 1: Category Grid View */}
          {!selectedCategory ? (
            <div>
              <Row className="justify-content-center discovery-grid px-2">
                {currentCategories.map((cat, index) => {
                  const count = allFeaturedBooks.filter((b) => b.category === cat).length
                  return (
                    <div 
                      className="col-xxl-4 col-md-6 col-sm-6 col-12 mb-4 d-flex"
                      key={index}
                    >
                      <div 
                        className="category-discovery-card w-100"
                        onClick={() => setSelectedCategory(cat)}
                      >
                        <div className="category-icon-wrapper">
                          {getCategoryIcon(cat)}
                        </div>
                        <h4 className="category-card-title">
                          {formatCategoryName(cat)}
                        </h4>
                        <p className="category-card-count">
                          {count} {count === 1 ? 'Book' : 'Books'} available
                        </p>
                      </div>
                    </div>
                  )
                })}
              </Row>

              {/* Category Grid Pagination Controls */}
              {totalPages > 1 && (
                <nav className="d-flex justify-content-center mt-5">
                  <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                      <li 
                        key={pageNumber} 
                        className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}
                      >
                        <button 
                          className="page-link" 
                          onClick={() => setCurrentPage(pageNumber)}
                        >
                          {pageNumber}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </div>
          ) : (
            /* STEP 2: Category Detail View */
            <Row className='my-3'>
              {filteredBooks.length > 0 ? (
                <BookList books={filteredBooks}></BookList>
              ) : (
                <p className="p text-center w-100">No books currently available in this category.</p>
              )}
            </Row>
          )}
        </div>
      ) : (
        <p className='p text-center'>No books found</p>
      )}
    </div>
  )
}

export default FeaturedBooks
