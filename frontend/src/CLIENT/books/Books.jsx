import React, { useEffect, useState } from 'react'
import axios from 'axios'
import CustomPagination from '../pagination/CustomPagination'
import SmallBanner from '../bannerHome/SmallBanner'
import PopularBooks from './PopularBooks'
import { backend_server } from '../../main'
import BrowseCollectionBooks from './BrowseCollectionBooks'
import { Toaster } from 'react-hot-toast'
import FilterBooksForm from './FilterBooksForm'
import AlgorithmSortButtons from './AlgorithmSortButtons'
import './books-page.css'

const Books = () => {
  const API_URL = `${backend_server}/api/v1/book/`

  const [bookData, setBookData] = useState([])

  // If 0 results then display false , true = results found , false = 0 search results
  const [searchResult, setSearchResult] = useState(true)

  // if filterForm is active , disbale pagination else allow paginations
  const [filterActive, setFilterActive] = useState(false)

  // Algorithm sort state
  const [activeAlgorithm, setActiveAlgorithm] = useState(null)
  const [algoLoading, setAlgoLoading] = useState(false)

  const fetchData = async (pageNumber) => {
    try {
      const resp = await axios.get(`${API_URL}/?page=${pageNumber}`)
      const data = resp.data.data
      // console.log(data)
      setBookData(data)
    } catch (error) {
      console.log('Error fetching books collections')
    }
  }

  // Algorithm endpoints mapping
  const algorithmEndpoints = {
    recommended: `${backend_server}/api/v1/popularBooks`,
    mostVisited: `${backend_server}/api/v1/mostVisitedBooks`,
    newlyAcquired: `${backend_server}/api/v1/recentBooks`,
  }

  const handleAlgorithmChange = async (algoKey) => {
    // Reset to default view if "All Books" clicked or same button toggled off
    if (algoKey === null || activeAlgorithm === algoKey) {
      setActiveAlgorithm(null)
      setFilterActive(false)
      setSearchResult(true)
      fetchData(1)
      return
    }

    setActiveAlgorithm(algoKey)
    setAlgoLoading(true)
    setFilterActive(true) // Hide pagination when algorithm is active

    try {
      const resp = await axios.get(algorithmEndpoints[algoKey], {
        withCredentials: true,
      })
      const data = resp.data.data
      if (data && data.length > 0) {
        setBookData(data)
        setSearchResult(true)
      } else {
        setBookData([])
        setSearchResult(false)
      }
    } catch (error) {
      console.log(`Error fetching ${algoKey} books:`, error)
      setBookData([])
      setSearchResult(false)
    } finally {
      setAlgoLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className='books-page-wrapper'>
      <div className='container'>
        {/* Popular Books Section */}
        <h2 className='modern-popular-heading'>Popular Books</h2>
        <p className='books-section-subtitle'>
          Most requested titles by our readers
        </p>
        <PopularBooks></PopularBooks>
      </div>

      {/* Quote Banner — Full Width */}
      <SmallBanner></SmallBanner>

      <div className='container'>
        {/* Browse Collections Section */}
        <h1 className='books-section-header'>Browse Collections</h1>
        <p className='books-section-subtitle'>
          Explore our complete library catalog
        </p>

        {/* FILTER BOOKS SECTION */}
        <FilterBooksForm
          setBookData={setBookData}
          setSearchResult={setSearchResult}
          setFilterActive={setFilterActive}
          fetchData={fetchData}
        ></FilterBooksForm>

        {/* ALGORITHM SORT BUTTONS */}
        <AlgorithmSortButtons
          activeAlgorithm={activeAlgorithm}
          onAlgorithmChange={handleAlgorithmChange}
          loading={algoLoading}
        />

        {/* BROWSE COLLECTIONS BOOKS */}
        <BrowseCollectionBooks
          bookData={bookData}
          searchResult={searchResult}
        ></BrowseCollectionBooks>

        {/* Pagination */}
        <div className='my-4 d-flex justify-content-center'>
          <CustomPagination
            fetchData={fetchData}
            filterActive={filterActive}
          ></CustomPagination>
        </div>
      </div>
    </div>
  )
}

export default Books
