import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { backend_server } from '../../main'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import './addnewbook.css'
import {
  HiOutlineBookOpen,
  HiOutlineUser,
  HiOutlineDocumentText,
  HiOutlineTag,
  HiOutlineLanguage,
  HiOutlinePhoto,
  HiOutlineCheckCircle,
  HiOutlineStar,
  HiOutlineArrowLeft,
  HiOutlinePlusCircle,
} from 'react-icons/hi2'

const AddNewBook = () => {
  const API_URL = `${backend_server}/api/v1/books`
  const API_URL_ALL_BOOK_CATEGORIES = `${backend_server}/api/v1/book_category`
  const navigate = useNavigate()

  const empty_inputfield = {
    title: '',
    author: '',
    description: 'Some description about the book',
    category: '',
    quantity: 1,
    featured: false,
    language: 'ENGLISH',
  }

  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [selectedBookFile, setSelectedBookFile] = useState(null)
  const [inputvalue, setInputValue] = useState(empty_inputfield)
  const [relatedCategories, setRelatedCategories] = useState([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!selectedImage) { setImagePreview(null); return }
    const objectUrl = URL.createObjectURL(selectedImage)
    setImagePreview(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedImage])

  const handleImageChange = (e) => {
    if (e.target.files?.[0]) setSelectedImage(e.target.files[0])
  }

  const handleBookFileChange = (e) => {
    if (e.target.files?.[0]) setSelectedBookFile(e.target.files[0])
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) setSelectedImage(file)
  }

  const handleOnChange = (e) => {
    const { name, value } = e.target
    setInputValue({ ...inputvalue, [name]: value })
  }

  const handleCategoryOnChange = async (e) => {
    const { name, value } = e.target
    setInputValue({ ...inputvalue, [name]: value.toUpperCase() })
    try {
      const data = await axios.post(API_URL_ALL_BOOK_CATEGORIES, { user_input_category: value })
      setRelatedCategories(data.data.book_category)
    } catch (error) {
      console.log(error.response)
    }
  }

  const handleCategorySelection = (category) => {
    setInputValue({ ...inputvalue, category: category.toUpperCase() })
    setRelatedCategories([])
  }

  const handleLanguageOnChange = (e) => {
    setInputValue({ ...inputvalue, language: e.target.value.toUpperCase() })
  }

  const handleOnChangeSelectOptions = (e) => {
    const { name, value } = e.target
    setInputValue({ ...inputvalue, [name]: value === 'true' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedImage) {
      toast.error('Please upload a cover image')
      return
    }
    setSubmitting(true)
    const formData = new FormData()
    formData.append('image', selectedImage)
    if (selectedBookFile) {
      formData.append('bookFile', selectedBookFile)
    }
    formData.append('title', inputvalue.title)
    formData.append('author', inputvalue.author)
    formData.append('description', inputvalue.description)
    formData.append('category', inputvalue.category)
    formData.append('quantity', inputvalue.quantity)
    formData.append('featured', inputvalue.featured)
    formData.append('language', inputvalue.language)
    try {
      await axios.post(API_URL, formData)
      toast.success('Book created successfully!')
      setInputValue(empty_inputfield)
      setSelectedImage(null)
      setSelectedBookFile(null)
    } catch (error) {
      toast.error('Failed to create book.')
      console.error(error.response)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='page-content'>
      <div className='anb-page'>

        {/* ── Header ─────────────────────────── */}
        <div className='anb-header'>
          <button type='button' className='anb-back-btn' onClick={() => navigate(-1)}>
            <HiOutlineArrowLeft size={16} /> Back
          </button>
          <div>
            <h1 className='anb-title'>Add New Book</h1>
            <p className='anb-subtitle'>Fill in the details below to add a book to the library.</p>
          </div>
        </div>

        {/* ── Form card ──────────────────────── */}
        <form className='anb-form-card' onSubmit={handleSubmit}>
          <div className='anb-form-grid'>

            {/* ── LEFT — Image upload ─────────── */}
            <div className='anb-image-col'>
              <span className='anb-section-label'>Book Cover</span>

              <label
                className={`anb-dropzone ${imagePreview ? 'anb-dropzone--has-image' : ''}`}
                htmlFor='anb-image-input'
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt='Preview' className='anb-preview-img' />
                ) : (
                  <div className='anb-dropzone-placeholder'>
                    <HiOutlinePhoto size={36} className='anb-dropzone-icon' />
                    <p className='anb-dropzone-text'>Drop image here or <span>browse</span></p>
                    <p className='anb-dropzone-hint'>PNG, JPG, WEBP accepted</p>
                  </div>
                )}
                <input
                  id='anb-image-input'
                  type='file'
                  accept='image/*'
                  className='anb-file-input'
                  onChange={handleImageChange}
                  required
                />
              </label>

              {imagePreview && (
                <button
                  type='button'
                  className='anb-remove-img-btn'
                  onClick={() => setSelectedImage(null)}
                >
                  Remove image
                </button>
              )}

              {/* ── E-Book File Upload ── */}
              <div style={{ width: "100%", marginTop: "1.5rem", borderTop: "1px solid var(--border-inner)", paddingTop: "1.5rem" }}>
                <span className='anb-section-label' style={{ marginBottom: "0.5rem", display: "block" }}>E-Book Document</span>
                <label className="anb-file-label" htmlFor="anb-file-input">
                  <HiOutlineDocumentText size={18} />
                  {selectedBookFile ? "Change Selected PDF" : "Choose PDF File"}
                </label>
                <input
                  id='anb-file-input'
                  type='file'
                  accept='.pdf,.doc,.docx,.epub'
                  style={{ display: 'none' }}
                  onChange={handleBookFileChange}
                />
                {selectedBookFile && (
                  <p style={{ fontSize: '0.78rem', color: 'var(--accent)', marginTop: '8px', textAlign: 'center', wordBreak: 'break-all' }}>
                    Selected: {selectedBookFile.name}
                  </p>
                )}
              </div>
            </div>

            {/* ── RIGHT — Fields ──────────────── */}
            <div className='anb-fields-col'>
              <span className='anb-section-label'>Book Details</span>

              <div className='anb-fields-grid'>

                {/* Title */}
                <div className='anb-field'>
                  <label className='anb-label' htmlFor='anb-title'>
                    <HiOutlineBookOpen size={14} /> Title
                  </label>
                  <input
                    id='anb-title'
                    type='text'
                    className='anb-input'
                    name='title'
                    value={inputvalue.title}
                    onChange={handleOnChange}
                    placeholder='e.g. The Great Gatsby'
                    autoComplete='off'
                    required
                  />
                </div>

                {/* Author */}
                <div className='anb-field'>
                  <label className='anb-label' htmlFor='anb-author'>
                    <HiOutlineUser size={14} /> Author
                  </label>
                  <input
                    id='anb-author'
                    type='text'
                    className='anb-input'
                    name='author'
                    value={inputvalue.author}
                    onChange={handleOnChange}
                    placeholder='e.g. F. Scott Fitzgerald'
                    autoComplete='off'
                    required
                  />
                </div>

                {/* Category */}
                <div className='anb-field anb-field--category'>
                  <label className='anb-label' htmlFor='anb-category'>
                    <HiOutlineTag size={14} /> Category
                  </label>
                  <input
                    id='anb-category'
                    type='text'
                    className='anb-input'
                    name='category'
                    value={inputvalue.category}
                    onChange={handleCategoryOnChange}
                    placeholder='e.g. FICTION'
                    autoComplete='off'
                    required
                  />
                  {relatedCategories.length > 0 && (
                    <div className='anb-suggestions'>
                      {relatedCategories.map((cat) => (
                        <button
                          key={cat}
                          type='button'
                          className='anb-suggestion-item'
                          onClick={() => handleCategorySelection(cat)}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Language */}
                <div className='anb-field'>
                  <label className='anb-label' htmlFor='anb-language'>
                    <HiOutlineLanguage size={14} /> Language
                  </label>
                  <input
                    id='anb-language'
                    type='text'
                    className='anb-input'
                    name='language'
                    value={inputvalue.language}
                    onChange={handleLanguageOnChange}
                    placeholder='e.g. ENGLISH'
                    autoComplete='off'
                    required
                  />
                </div>

                {/* Quantity */}
                <div className='anb-field'>
                  <label className='anb-label' htmlFor='anb-quantity'>
                    <HiOutlineCheckCircle size={14} /> Quantity (Stock)
                  </label>
                  <input
                    id='anb-quantity'
                    type='number'
                    className='anb-input'
                    name='quantity'
                    value={inputvalue.quantity}
                    onChange={handleOnChange}
                    min='0'
                    required
                  />
                </div>

                {/* Featured */}
                <div className='anb-field'>
                  <label className='anb-label' htmlFor='anb-featured'>
                    <HiOutlineStar size={14} /> Featured
                  </label>
                  <select
                    id='anb-featured'
                    className='anb-input anb-select'
                    name='featured'
                    value={inputvalue.featured.toString()}
                    onChange={handleOnChangeSelectOptions}
                    required
                  >
                    <option value='true'>Yes</option>
                    <option value='false'>No</option>
                  </select>
                </div>

                {/* Description — full width */}
                <div className='anb-field anb-field--full'>
                  <label className='anb-label' htmlFor='anb-description'>
                    <HiOutlineDocumentText size={14} /> Description
                  </label>
                  <textarea
                    id='anb-description'
                    className='anb-input anb-textarea'
                    name='description'
                    value={inputvalue.description}
                    onChange={handleOnChange}
                    placeholder='Write a short description of the book...'
                    rows={4}
                    required
                  />
                </div>

              </div>

              {/* ── Actions ──────────────────── */}
              <div className='anb-actions'>
                <button
                  type='submit'
                  className='anb-submit-btn'
                  disabled={submitting}
                >
                  <HiOutlinePlusCircle size={17} />
                  {submitting ? 'Adding...' : 'Add Book'}
                </button>
              </div>

            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddNewBook
