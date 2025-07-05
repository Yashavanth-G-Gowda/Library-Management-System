import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { UserContext } from '../context/UserContext'

const Search = () => {

  const {navigate} = useContext(UserContext)

  return (
    <div onClick={()=>navigate('/searchbook')} className="cursor-pointer flex items-center w-[230px] max-w-[600px] px-4 py-2 bg-white rounded-full shadow-md hover:shadow-lg transition duration-150">
      <img src={assets.search_icon} className="w-5 h-5 mr-3 cursor-pointer" alt="Search" />
      <p className="w-full outline-none text-sm bg-transparent font-normal text-gray-300">Search ...</p>
    </div>
  )
}

export default Search
