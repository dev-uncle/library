import {
  HiOutlineHome,
  HiOutlineBookOpen,
  HiOutlinePlusCircle,
  HiOutlineInbox,
  HiOutlineUsers,
  HiOutlineClipboardDocumentList,
  HiOutlineArrowUpTray,
  HiOutlineArrowDownTray,
} from 'react-icons/hi2'

export const sidebarData = [
  {
    group: 'OVERVIEW',
    items: [
      {
        id: 1,
        title: 'Dashboard',
        url: '/admin',
        icon: HiOutlineHome,
        exact: true,
      },
    ],
  },
  {
    group: 'LIBRARY',
    items: [
      {
        id: 2,
        title: 'Manage Books',
        url: '/admin/managebooks',
        icon: HiOutlineBookOpen,
      },
      {
        id: 3,
        title: 'Add New Book',
        url: '/admin/addnewbook',
        icon: HiOutlinePlusCircle,
      },
      {
        id: 4,
        title: "Book Requests",
        url: '/admin/booksrequests',
        icon: HiOutlineInbox,
      },
    ],
  },
  {
    group: 'USERS',
    items: [
      {
        id: 5,
        title: 'View Users',
        url: '/admin/viewusers',
        icon: HiOutlineUsers,
      },
      {
        id: 6,
        title: 'Issued Books',
        url: '/admin/issuedbooks',
        icon: HiOutlineClipboardDocumentList,
      },
      {
        id: 7,
        title: 'Issue Book to User',
        url: '/admin/issuebooktouser',
        icon: HiOutlineArrowUpTray,
      },
      {
        id: 8,
        title: 'Return Due Books',
        url: '/admin/returnedbooks',
        icon: HiOutlineArrowDownTray,
      },
    ],
  },
]
