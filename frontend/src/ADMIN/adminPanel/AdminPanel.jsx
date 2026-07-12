import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { backend_server } from '../../main'
import axios from 'axios'
import './adminpanel.css'
import LibraryOverviewChart from './LibraryOverviewChart'
import BookStatusChart from './BookStatusChart'
import RecommendationsChart from './RecommendationsChart'
import BookInventoryTable from './BookInventoryTable'

import { HiOutlineBookOpen, HiOutlineUsers, HiOutlineInbox, HiOutlineClipboardDocumentList, HiOutlineUserGroup, HiOutlineTag } from 'react-icons/hi2'
import { HiOutlinePlusCircle, HiOutlineArrowUpTray, HiOutlineArrowDownTray } from 'react-icons/hi2'

const stats = (data) => [
  {
    id: 1,
    label: 'Total Books',
    value: data.totalBooks ?? '—',
    icon: HiOutlineBookOpen,
    color: 'amber',
    link: '/admin/managebooks',
  },
  {
    id: 2,
    label: 'Issued Books',
    value: data.totalIssuedBooks ?? '—',
    icon: HiOutlineClipboardDocumentList,
    color: 'blue',
    link: '/admin/issuedbooks',
  },
  {
    id: 3,
    label: 'Book Requests',
    value: data.totalBookRequests ?? '—',
    icon: HiOutlineInbox,
    color: 'violet',
    link: '/admin/booksrequests',
  },
  {
    id: 4,
    label: 'Registered Users',
    value: data.totalRegisteredUsers ?? '—',
    icon: HiOutlineUsers,
    color: 'emerald',
    link: '/admin/viewusers',
  },
  {
    id: 5,
    label: 'Authors Listed',
    value: data.totalAuthors ?? '—',
    icon: HiOutlineUserGroup,
    color: 'rose',
    link: '/admin/managebooks',
  },
  {
    id: 6,
    label: 'Categories',
    value: data.totalCategories ?? '—',
    icon: HiOutlineTag,
    color: 'teal',
    link: '/admin/managebooks',
  },
]

const quickActions = [
  { label: 'Add New Book', icon: HiOutlinePlusCircle, link: '/admin/addnewbook', color: 'amber' },
  { label: 'Issue Book to User', icon: HiOutlineArrowUpTray, link: '/admin/issuebooktouser', color: 'blue' },
  { label: 'Return Due Books', icon: HiOutlineArrowDownTray, link: '/admin/returnedbooks', color: 'emerald' },
  { label: 'View Requests', icon: HiOutlineInbox, link: '/admin/booksrequests', color: 'violet' },
]

const AdminPanel = () => {
  const [homepageData, setHomepageData] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${backend_server}/api/v1/adminHomePageInfo`)
        setHomepageData(response.data.data)
      } catch (error) {
        console.log(error.response)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const statCards = stats(homepageData)

  return (
    <div className='dashboard'>
      {/* ── Welcome header ───────────────────── */}
      <div className='dashboard-header'>
        <div>
          <h1 className='dashboard-title'>Dashboard</h1>
          <p className='dashboard-subtitle'>Welcome back, Admin. Here's what's happening today.</p>
        </div>
      </div>

      {/* ── Stat cards ──────────────────────── */}
      <div className='stat-grid'>
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Link to={stat.link} key={stat.id} className={`stat-card stat-card--${stat.color}`}>
              <div className='stat-card__icon-wrap'>
                <Icon size={22} />
              </div>
              <div className='stat-card__body'>
                <span className='stat-card__value'>
                  {loading ? <span className='stat-skeleton' /> : stat.value}
                </span>
                <span className='stat-card__label'>{stat.label}</span>
              </div>
            </Link>
          )
        })}
      </div>

      {/* ── Charts row ───────────────────────── */}
      {!loading && (
        <>
          <div className="charts-row">
            <LibraryOverviewChart data={homepageData} />
            <BookStatusChart data={homepageData} />
          </div>
          <RecommendationsChart data={homepageData} />
          <BookInventoryTable data={homepageData} />
        </>
      )}

      {/* ── Quick actions ────────────────────── */}
      <div className='dashboard-section'>
        <h2 className='dashboard-section-title'>Quick Actions</h2>
        <div className='quick-actions'>
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link to={action.link} key={action.label} className={`quick-action quick-action--${action.color}`}>
                <span className='quick-action__icon'>
                  <Icon size={20} />
                </span>
                <span className='quick-action__label'>{action.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default AdminPanel
