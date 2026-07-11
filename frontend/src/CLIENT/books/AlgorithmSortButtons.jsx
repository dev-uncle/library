import React from 'react'
import { FiGrid, FiHeart, FiTrendingUp, FiClock } from 'react-icons/fi'
import './algorithm-sort-buttons.css'

const ALGORITHMS = [
  {
    key: 'recommended',
    label: 'Recommended',
    icon: <FiHeart />,
  },
  {
    key: 'mostVisited',
    label: 'Most Visited',
    icon: <FiTrendingUp />,
  },
  {
    key: 'newlyAcquired',
    label: 'Newly Acquired',
    icon: <FiClock />,
  },
]

const AlgorithmSortButtons = ({ activeAlgorithm, onAlgorithmChange, loading }) => {
  return (
    <div className='algo-sort-container'>
      {/* All Books — resets to default paginated view */}
      <button
        type='button'
        className={`algo-sort-btn${activeAlgorithm === null ? ' active' : ''}${loading ? ' loading' : ''}`}
        onClick={() => onAlgorithmChange(null)}
      >
        <span className='algo-icon'><FiGrid /></span>
        All Books
      </button>

      {ALGORITHMS.map((algo) => (
        <button
          key={algo.key}
          type='button'
          className={`algo-sort-btn${activeAlgorithm === algo.key ? ' active' : ''}${loading ? ' loading' : ''}`}
          onClick={() => onAlgorithmChange(algo.key)}
        >
          <span className='algo-icon'>{algo.icon}</span>
          {algo.label}
        </button>
      ))}
    </div>
  )
}

export default AlgorithmSortButtons

