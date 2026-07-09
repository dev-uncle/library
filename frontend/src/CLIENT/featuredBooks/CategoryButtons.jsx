import React from 'react'

const CategoryButtons = (props) => {
  const { filterFunction, categories, activeCategory } = props
  return (
    <div className='d-flex flex-wrap justify-content-center'>
      {categories.map((map_para, index) => {
        const isActive = activeCategory === map_para
        return (
          <button
            key={index}
            className={`category-pill-btn ${isActive ? 'active' : ''}`}
            onClick={() => filterFunction(map_para)}
          >
            {map_para}
          </button>
        )
      })}
    </div>
  )
}

export default CategoryButtons
