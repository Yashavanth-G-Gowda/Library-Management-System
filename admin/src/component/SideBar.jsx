import React from 'react'
import { NavLink } from 'react-router-dom'

const SideBar = () => {
  return (
    <div className='w-[18%] h-[calc(100vh-4rem)] fixed top-16 left-0 border-r-2 bg-white z-30 overflow-y-auto'>
      <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>
        <NavLink className='flex items-center border gap-3 border-gray-300 border-r-0 px-3 py-2 rounded-l' to='/addbooks'>
          <p className='hidden md:block'>Add Books</p>
        </NavLink>
        <NavLink className='flex items-center border gap-3 border-gray-300 border-r-0 px-3 py-2 rounded-l' to='/listbooks'>
          <p className='hidden md:block'>List Books</p>
        </NavLink>
        <NavLink className='flex items-center border gap-3 border-gray-300 border-r-0 px-3 py-2 rounded-l' to='/listusers'>
          <p className='hidden md:block'>List Users</p>
        </NavLink>
        <NavLink className='flex items-center border gap-3 border-gray-300 border-r-0 px-3 py-2 rounded-l' to='/issuebook'>
          <p className='hidden md:block'>Issue Book</p>
        </NavLink>
        <NavLink className='flex items-center border gap-3 border-gray-300 border-r-0 px-3 py-2 rounded-l' to='/borrowed'>
          <p className='hidden md:block'>Borrowed Books</p>
        </NavLink>
      </div>
    </div>
  )
}

export default SideBar