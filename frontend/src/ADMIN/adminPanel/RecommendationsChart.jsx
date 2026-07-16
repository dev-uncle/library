import React, { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { useTheme } from '../context/ThemeContext'
import { backend_server } from '../../main'
import { HiOutlineEye, HiOutlineArrowUpTray, HiOutlineMagnifyingGlass, HiOutlineBookOpen } from 'react-icons/hi2'

const RecommendationsChart = ({ data }) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [activeTab, setActiveTab] = useState('viewed')

  const axisColor = isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(15, 23, 42, 0.5)'
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.06)'
  const cursorColor = isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)'

  // Get active dataset
  let currentData = []
  let metricName = ''
  let tabColor = '#eb820a' // Default

  if (activeTab === 'viewed') {
    currentData = data.mostViewed || []
    metricName = 'views'
    tabColor = '#3b82f6' // Blue
  } else if (activeTab === 'requested') {
    currentData = data.mostRequested || []
    metricName = 'requests'
    tabColor = '#10b881' // Emerald
  } else if (activeTab === 'searched') {
    currentData = data.mostSearched || []
    metricName = 'searches'
    tabColor = '#8b5cf6' // Violet
  }

  // Format data for chart
  const chartData = currentData.map((book) => {
    let value = 0
    if (activeTab === 'viewed') value = book.viewCount || 0
    else if (activeTab === 'requested') value = book.issueQuantity || 0
    else if (activeTab === 'searched') value = book.searchCount || 0

    // Truncate title for chart axis
    const shortTitle = book.title.length > 15 ? book.title.substring(0, 12) + '...' : book.title

    return {
      name: shortTitle,
      fullName: book.title,
      value: value,
      author: book.author || 'Unknown',
    }
  })

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip" style={{ border: `1px solid ${tabColor}40` }}>
          <p className="chart-tooltip-label" style={{ color: tabColor }}>{payload[0].payload.fullName}</p>
          <p className="chart-tooltip-author" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0 4px' }}>
            by {payload[0].payload.author}
          </p>
          <p className="chart-tooltip-value" style={{ color: tabColor }}>
            {payload[0].value} {metricName}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="chart-card recommendations-analytics-card">
      <div className="recs-header">
        <h3 className="chart-title">Popularity & Recommendation Insights</h3>
        
        {/* Dynamic Navigation Tabs */}
        <div className="recs-tabs">
          <button 
            className={`recs-tab recs-tab--viewed ${activeTab === 'viewed' ? 'active' : ''}`}
            onClick={() => setActiveTab('viewed')}
            type="button"
          >
            <HiOutlineEye size={14} />
            <span>Most Viewed</span>
          </button>
          <button 
            className={`recs-tab recs-tab--requested ${activeTab === 'requested' ? 'active' : ''}`}
            onClick={() => setActiveTab('requested')}
            type="button"
          >
            <HiOutlineArrowUpTray size={14} />
            <span>Most Requested</span>
          </button>
          <button 
            className={`recs-tab recs-tab--searched ${activeTab === 'searched' ? 'active' : ''}`}
            onClick={() => setActiveTab('searched')}
            type="button"
          >
            <HiOutlineMagnifyingGlass size={14} />
            <span>Most Searched</span>
          </button>
        </div>
      </div>

      <div className="recs-content-grid">
        {/* Visual Chart Panel */}
        <div className="recs-chart-panel">
          {chartData.length === 0 ? (
            <div className="recs-empty-state">
              <HiOutlineBookOpen size={48} />
              <p>No analytics data available yet.</p>
            </div>
          ) : (
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData} margin={{ top: 15, right: 10, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke={axisColor}
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke={axisColor}
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: cursorColor }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index === 0 ? tabColor : `${tabColor}cc`}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Detailed Book Listing Panel */}
        <div className="recs-list-panel">
          <h4 className="recs-list-title">Top Rankings</h4>
          <div className="recs-list">
            {currentData.length === 0 ? (
              <div className="recs-list-empty">No books listed</div>
            ) : (
              currentData.map((book, idx) => {
                let val = 0
                if (activeTab === 'viewed') val = book.viewCount || 0
                else if (activeTab === 'requested') val = book.issueQuantity || 0
                else if (activeTab === 'searched') val = book.searchCount || 0

                return (
                  <div className="recs-list-item" key={book._id}>
                    <div className="recs-item-rank" style={{ background: idx === 0 ? tabColor : 'rgba(255,255,255,0.05)', color: idx === 0 ? '#fff' : 'var(--text-muted)' }}>
                      {idx + 1}
                    </div>
                    
                    <div className="recs-item-cover">
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
                      <HiOutlineBookOpen className="recs-item-fallback-icon" size={16} />
                    </div>

                    <div className="recs-item-details">
                      <span className="recs-item-title" title={book.title}>{book.title}</span>
                      <span className="recs-item-author">by {book.author || 'Unknown'}</span>
                    </div>

                    <div className="recs-item-stat-badge" style={{ backgroundColor: `${tabColor}15`, color: tabColor, border: `1px solid ${tabColor}25` }}>
                      <span className="recs-item-stat-value">{val}</span>
                      <span className="recs-item-stat-label">{metricName}</span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecommendationsChart
