import axios from 'axios'
import React, { useState } from 'react'
import { backend_server } from '../../main'
import { HiOutlineMagnifyingGlass, HiOutlineXMark } from 'react-icons/hi2'

const ManageSearchBooks = ({ setAllBooks, bookCategories, setFilterActive }) => {
  const API_URL = `${backend_server}/api/v1/filter`

  const empty_field = { title: '', category: '', featured: '', available: '' }
  const [filterFields, setFilterFields] = useState(empty_field)

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    if (JSON.stringify(filterFields) === JSON.stringify(empty_field)) return
    const { title, category, featured, available } = filterFields
    try {
      const response = await axios.get(API_URL, {
        params: { title, category, featured, available },
      })
      setAllBooks(response.data.data)
      setFilterActive && setFilterActive(true)
    } catch (error) {
      console.log(error.response)
    }
  }

  const handleOnChange = (e) => {
    const { name, value } = e.target
    setFilterFields({ ...filterFields, [name]: value })
  }

  const handleClearFilters = () => {
    setFilterFields(empty_field)
    setFilterActive && setFilterActive(false)
    const ids = ['categorySelect', 'featuredSelect', 'availableSelect']
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) el.selectedIndex = 0
    })
  }

  return (
    <form className='mb-filter-form' onSubmit={handleFormSubmit}>
      {/* Search input */}
      <div className='mb-search-wrap'>
        <HiOutlineMagnifyingGlass className='mb-search-icon' size={16} />
        <input
          type='text'
          className='mb-input mb-search-input'
          autoComplete='off'
          placeholder='Search by title...'
          name='title'
          value={filterFields.title}
          onChange={handleOnChange}
        />
      </div>

      {/* Category */}
      <select
        id='categorySelect'
        className='mb-select'
        defaultValue=''
        onChange={(e) => setFilterFields({ ...filterFields, category: e.target.value })}
      >
        <option value=''>All Categories</option>
        {bookCategories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      {/* Featured */}
      <select
        id='featuredSelect'
        className='mb-select'
        defaultValue=''
        onChange={(e) => setFilterFields({ ...filterFields, featured: e.target.value })}
      >
        <option value=''>Featured</option>
        <option value='true'>Yes</option>
        <option value='false'>No</option>
      </select>

      {/* Available */}
      <select
        id='availableSelect'
        className='mb-select'
        defaultValue=''
        onChange={(e) => setFilterFields({ ...filterFields, available: e.target.value })}
      >
        <option value=''>Available</option>
        <option value='true'>Yes</option>
        <option value='false'>No</option>
      </select>

      {/* Actions */}
      <button type='submit' className='mb-filter-btn mb-filter-btn--search'>
        Search
      </button>
      <button type='button' className='mb-filter-btn mb-filter-btn--clear' onClick={handleClearFilters}>
        <HiOutlineXMark size={15} />
        Clear
      </button>
    </form>
  )
}

export default ManageSearchBooks
