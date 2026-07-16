import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const BookStatusChart = ({ data }) => {
  const totalBooks = data.totalBooks ?? 0
  const issuedBooks = data.totalIssuedBooks ?? 0
  const availableBooks = Math.max(0, totalBooks - issuedBooks)

  const chartData = [
    { name: 'Available', value: availableBooks },
    { name: 'Issued Out', value: issuedBooks },
  ]

  const COLORS = ['#10b881', '#eb820a'] // Emerald/Green for available, Orange for issued

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="chart-tooltip-label">{payload[0].name}</p>
          <p className="chart-tooltip-value" style={{ color: payload[0].payload.fill }}>
            {payload[0].value} Books
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="chart-card">
      <h3 className="chart-title">Book Status</h3>
      <div className="chart-wrapper donut-chart-container" style={{ position: 'relative' }}>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={chartData}
              cx="50%"
              cy="45%"
              innerRadius={65}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span className="chart-legend-text">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
        
        <div className="donut-center-info">
          <span className="donut-center-num">{totalBooks}</span>
          <span className="donut-center-label">Total Books</span>
        </div>
      </div>
    </div>
  )
}

export default BookStatusChart
