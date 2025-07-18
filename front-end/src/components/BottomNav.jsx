import React, { useContext } from 'react'
import { assets } from '../assets/assets';
import {UserContext} from '../context/UserContext'
import Login from './Login';

//this component is only used for sm devices

const BottomNav = () => {

  const {navigate,token,setLoginComp,loginComp} = useContext(UserContext);

  return (
    <div className="sm:hidden fixed bottom-0 left-0 w-full h-[55px] bg-gray-300 z-40 shadow-[0_-2px_8px_rgba(0,0,0,0.1)]">
      <div className="h-full flex items-center justify-around px-6">
        {/* Home */}
        <div onClick={()=>navigate('/')} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center shadow-md border-2 border-black">
          <img src={assets.home_bottom} alt="Home" className="w-6 h-6 object-contain" />
        </div>

        {/* Books - Bigger Circle */}
        <div onClick={()=>navigate('/collection')} className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shadow-md border-2 border-black">
          <img src={assets.books_bottom} alt="Books" className="w-8 h-8 object-contain" />
        </div>


        {/* Profile */}
        <div 
          onClick={() => {
            if (token) {
              navigate('/myprofile');
            } else {
              setLoginComp(true); // show login modal or component
            }
          }}
          className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center shadow-md border-2"
        >
          <img src={assets.profile_bottom} alt="Profile" className="w-10 h-10 object-contain" />
        </div>
      </div>
      {loginComp && <Login/>}
    </div>
  )
}

export default BottomNav
