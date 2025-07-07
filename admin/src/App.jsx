import React,{useState, useEffect} from 'react'
import { ToastContainer } from 'react-toastify';
import Login from './component/Login';
import Navbar from './component/Navbar';
import SideBar from './component/SideBar';
import AddBooks from './pages/AddBooks';
import ListBooks from './pages/ListBooks';
import Orders from './pages/Orders';
import {Routes,Route} from 'react-router-dom'

export const backendURL = import.meta.env.VITE_BACKEND_URL

const App = () => {

  const [token,setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):'');

  useEffect(()=> {
    localStorage.setItem('token',token)
  },[token])

  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar
        toastClassName="my-toast"
        bodyClassName="my-toast-body"
        progressClassName="my-toast-progress"
        closeButton={false}
      />
      {token === '' ? 
        <Login setToken={setToken}/> : 
        <>
          <Navbar setToken={setToken}/>
          <div className='flex'>
            <SideBar />
            
            {/* Content Area */}
            <div className='ml-[18%] w-[82%] px-6 py-8 text-gray-600 text-base'>
              <Routes>
                <Route path='/addbooks' element={<AddBooks token={token} />} />
                <Route path='/listbooks' element={<ListBooks token={token} />} />
                <Route path='/removebooks' element={<Orders token={token} />} />
                <Route path='/' />
              </Routes>
            </div>
          </div>

        </>
      }
    </div>
  )
}

export default App
