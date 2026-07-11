import React, { useState, useEffect } from 'react'
import { backend_server } from '../../main'
import axios from 'axios'
import { FiFilter, FiX } from 'react-icons/fi'

import './filterbooksform.css'

const FilterBooksForm = ({ setBookData, setSearchResult, setFilterActive, fetchData }) => {
  const API_URL_FILTER = `${backend_server}/api/v1/filter`
  const API_ALLBOOKS_URL = `${backend_server}/api/v1/books`
  const empty_field = {
    title: '',
    category: '',
    author: '',
    language: '',
  }

  const [filterFields, setFilterFields] = useState(empty_field) //Filter FORM Fields Data
  const [categories, setCategories] = useState([]) //all books CATEGORIES
  const [author, setAuthor] = useState([])
  const [language, setLanguage] = useState([])
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Centralized fetch logic that accepts the updated fields directly
  const fetchFilteredData = async (fields) => {
    // Checking if user falsly hit search without making any changes
    if (JSON.stringify(fields) === JSON.stringify(empty_field)) {
      setFilterActive(false)
      setSearchResult(true)
      if (fetchData) fetchData(1)
      return
    }
    setFilterActive(true)

    const { title, category, author, language } = fields
    try {
      const response = await axios.get(API_URL_FILTER, {
        params: {
          title,
          category,
          author,
          language,
        },
      })

      let totalHits = response.data.total
      if (totalHits == 0) {
        setSearchResult(false)
      } else {
        setSearchResult(true)
      }

      setBookData(response.data.data)
    } catch (error) {
      console.log(error)
      console.log(error.response)
    }
  }

  // Form Submit handle (FILTER data Fetched)
  const handleFormSubmit = async (e) => {
    if (e) e.preventDefault()
    fetchFilteredData(filterFields)
  }

  // FORM INPUT FIELDS On Change Handlers
  const handleSearchTitleOnChange = (e) => {
    const { name, value } = e.target
    setFilterFields({ ...filterFields, [name]: value })
  }
  
  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value
    const newFields = { ...filterFields, category: selectedCategory }
    setFilterFields(newFields)
    fetchFilteredData(newFields) // Auto-submit
  }
  
  const handleAuthorChange = (e) => {
    const selectedAuthor = e.target.value
    const newFields = { ...filterFields, author: selectedAuthor }
    setFilterFields(newFields)
    fetchFilteredData(newFields) // Auto-submit
  }
  
  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value
    const newFields = { ...filterFields, language: selectedLanguage }
    setFilterFields(newFields)
    fetchFilteredData(newFields) // Auto-submit
  }

  // Fetch ALL  Book Categories / Author / Language
  const fetchAllCategories = async () => {
    try {
      const response = await axios.get(API_ALLBOOKS_URL)

      const bookCategories = [
        ...new Set(
          response.data.data.map((category_para) => {
            return category_para.category
          })
        ),
      ]

      const bookAuthor = [
        ...new Set(
          response.data.data.map((author_para) => {
            return author_para.author
          })
        ),
      ]

      const bookLanguage = [
        ...new Set(
          response.data.data.map((language_para) => {
            return language_para.language
          })
        ),
      ]

      setCategories(bookCategories)
      setAuthor(bookAuthor)
      setLanguage(bookLanguage)
    } catch (error) {
      console.log(error.response)
    }
  }

  useEffect(() => {
    fetchAllCategories()
  }, [])

  // Clears the FORM value and Filter
  const handleClearFilter = () => {
    setFilterFields(empty_field)
    setCategories([])
    setAuthor([])
    setLanguage([])

    // After clearing all FORM Field , we have to refetch all Categories,Author's and Language's
    fetchAllCategories()

    // Restore full list
    setFilterActive(false)
    setSearchResult(true)
    if (fetchData) fetchData(1)
  }

  return (
    <div className='books-filter-container'>
      <form method='get' className='form-inline d-flex flex-column'>
        {/* TOP ROW: Primary Search & Actions */}
        <div className='d-flex align-items-center flex-wrap w-100 mb-2'>
          {/* Search Filter */}
          <div className='form-group mx-1 my-1 flex-grow-1' style={{ minWidth: '250px' }}>
            <input
              type='text'
              className='form-control'
              autoComplete='off'
              placeholder='Search by title . . .'
              name='title'
              value={filterFields.title}
              onChange={handleSearchTitleOnChange}
            />
          </div>

          <div className='d-flex text-center align-items-center flex-wrap'>
            <button
              type='button'
              className='btn btn-advanced-filter mx-1 my-1 d-flex justify-content-center align-items-center'
              onClick={() => setShowAdvanced(!showAdvanced)}
              title={showAdvanced ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
              style={{ width: '42px', height: '42px', padding: 0 }}
            >
              {showAdvanced ? <FiX size={20} /> : <FiFilter size={20} />}
            </button>

            <button
              type='submit'
              className='btn btn-filter-search mx-1 my-1'
              onClick={handleFormSubmit}
            >
              Search
            </button>
            <button
              type='button'
              className='btn btn-filter-clear mx-1 my-1'
              onClick={handleClearFilter}
            >
              Clear
            </button>
          </div>
        </div>

        {/* BOTTOM ROW: Advanced Filters */}
        {showAdvanced && (
          <div className='d-flex align-items-center flex-wrap w-100 mt-2 p-3 advanced-filter-panel'>
            {/* Category Filter */}
            <div className='form-group mx-1 my-1 flex-grow-1'>
              <select
                className='form-control'
                value={filterFields.category}
                onChange={handleCategoryChange}
              >
                <option key='' value=''>
                  All Categories
                </option>
                {categories.map((books_category) => {
                  return (
                    <option key={books_category} value={books_category}>
                      {books_category}
                    </option>
                  )
                })}
              </select>
            </div>

            {/* Author Filter */}
            <div className='form-group mx-1 my-1 flex-grow-1'>
              <select
                className='form-control'
                value={filterFields.author}
                onChange={handleAuthorChange}
              >
                <option key='' value=''>
                  All Authors
                </option>
                {author.map((books_author) => {
                  return (
                    <option key={books_author} value={books_author}>
                      {books_author}
                    </option>
                  )
                })}
              </select>
            </div>

            {/* Language Filter */}
            <div className='form-group mx-1 my-1 flex-grow-1'>
              <select
                className='form-control'
                value={filterFields.language}
                onChange={handleLanguageChange}
              >
                <option key='' value=''>
                  All Languages
                </option>
                {language.map((books_language) => {
                  return (
                    <option key={books_language} value={books_language}>
                      {books_language.toUpperCase()}
                    </option>
                  )
                })}
              </select>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

export default FilterBooksForm
