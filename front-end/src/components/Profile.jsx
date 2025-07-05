import React from 'react'
import { assets } from '../assets/assets'
import { UserContext } from '../context/UserContext'
import { useContext } from 'react'

const Profile = () => {

  const logout = () => {
    localStorage.removeItem('token')
    setToken('')
    navigate('/')
  }

  const {navigate,token,setToken} = useContext(UserContext)

  return (
    <div className='group relative'>
      <div className="flex items-center w-[140px] gap-2 px-3 py-1 bg-cyan-100 rounded-full shadow-md hover:shadow-lg transition duration-150">
        <img
          src={assets.profile_icon}
          alt="User"
          className="w-6 rounded-full object-cover border border-gray-300"
        />
        <span className="text-xs font-medium text-gray-800 hidden md:inline">
          Demo User
        </span>
      </div>
      <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
        <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-sm text-gray-500 rounded-md'>
          <p onClick={()=> navigate('/myprofile')} className='cursor-pointer hover:text-black'>My Profile</p>
          <p onClick={()=> logout()} className='cursor-pointer hover:text-black'>Logout</p>
        </div>
      </div>
    </div>
  )
}

export default Profile
