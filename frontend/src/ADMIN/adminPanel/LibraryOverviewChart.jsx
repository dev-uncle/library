import React from 'react'
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

const LibraryOverviewChart = ({ data }) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const axisColor = isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(15, 23, 42, 0.5)'
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.06)'
  const cursorColor = isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)'

  const chartData = [
    { name: 'Books', value: data.totalBooks ?? 0 },
    { name: 'Issued', value: data.totalIssuedBooks ?? 0 },
    { name: 'Requests', value: data.totalBookRequests ?? 0 },
    { name: 'Users', value: data.totalRegisteredUsers ?? 0 },
    { name: 'Authors', value: data.totalAuthors ?? 0 },
    { name: 'Categories', value: data.totalCategories ?? 0 },
  ]

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="chart-tooltip-label">{payload[0].name}</p>
          <p className="chart-tooltip-value">{payload[0].value}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="chart-card">
      <h3 className="chart-title">Library Overview</h3>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
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
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: cursorColor }} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={45}>
              {chartData.map((entry, index) => {
                const colors = [
                  '#eb820a', // Orange/Amber
                  '#3b82f6', // Blue
                  '#8b5cf6', // Violet
                  '#10b881', // Emerald
                  '#f43f5e', // Rose
                  '#14b8a6', // Teal
                ]
                return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default LibraryOverviewChart
