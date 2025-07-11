import React, {useContext} from 'react'
import { assets } from '../assets/assets'
import {Link, NavLink } from 'react-router-dom'
import { UserContext } from '../context/UserContext'
import Search from './SearchBar'
import Login from './Login'
import Feedback from './Feedback'
import Profile from './Profile'

const Navbar = () => {

  const {navigate,isFeedbackVisible,setIsFeedbackVisible,feedback,setFeedback,token,setToken,setLoginComp,loginComp} = useContext(UserContext)

  return (
    <div className='sticky top-0 z-50 flex items-center justify-between py-5 px-2 sm:px-4 sm:h-[70px] h-[60px] font-medium mb-2 bg-white shadow-lg'>
      <a href="https://jssstuniv.in/#/" target="_blank" rel="noopener noreferrer">
        <img
          src={assets.logo}
          alt="JSSSTU"
          className="sm:w-[250px] sm:h-[65px] h-[58px] w-[150px] cursor-pointer"
        />
      </a>
      <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
        <NavLink to='/' className='flex flex-col gap-1 items-center'>
          <p className='font-bold text-base'>HOME</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
        </NavLink>
        <NavLink to='/collection' className='flex flex-col gap-1 items-center'>
          <p className='font-bold text-base'>COLLECTION</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
        </NavLink>
        <NavLink to='/about' className='flex flex-col gap-1 items-center'>
          <p className='font-bold text-base'>ABOUT</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
        </NavLink>
        <NavLink to='/feedback' className='flex flex-col gap-1 items-center'>
          <p className='font-bold text-base'>FEEDBACK</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
        </NavLink>
      </ul>
      <div className='flex flex-row gap-6 mr-6 sm:hidden'>
        <img onClick={()=>navigate('/searchbook')} src={assets.search_icon} className='w-[21px]' alt="" />
        <div className="relative w-fit">
          <img src={assets.notify} className="w-[22px]" alt="Notifications" />
          <p className="absolute -right-1 -top-1 w-4 h-4 flex items-center justify-center bg-red-600 text-white text-[8px] rounded-full">
            7
          </p>
        </div>
      </div>
      <div className='flex items-center gap-4 hidden sm:flex'>
        <Search />
        {
          !token ?
            <div
              onClick={() => setLoginComp(true)} // if you're using setToken
              className="flex items-center w-[140px] gap-2 px-3 py-1 bg-cyan-50 rounded-full shadow-md hover:shadow-lg transition duration-150 cursor-pointer"
            >
              <img
                src={assets.profile_icon}
                alt="User"
                className="w-6 rounded-full object-cover border border-gray-300"
              />
              <span className="text-xs pl-2 font-bold text-gray-700 hidden md:inline">
                LOGIN
              </span>
            </div>
          : 
            <Profile />
        }
      </div>
      {loginComp && <Login/>}
    </div>
  )
}

export default Navbar
