import React,{useContext} from 'react'
import Navbar from './components/Navbar'
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home';
import Collection from './pages/Collection';
import About from './pages/About';
import Search from './pages/Search';
import MyProfile from './pages/MyProfile';
import Books from './pages/Books';
import Feedback from './components/Feedback';
import BorrowedBooks from './pages/BorrowedBooks';
import BorrowingHistory from './pages/BorrowingHistory';

import { UserContext } from './context/UserContext';

const App = () => {

  const { showNavbar } = useContext(UserContext);

  return (
    <div className='bg-gray-100 min-h-screen flex flex-col justify-between'>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar
        toastClassName="my-toast"
        bodyClassName="my-toast-body"
        progressClassName="my-toast-progress"
        closeButton={false}
      />
      {showNavbar && <Navbar />}
      <main className='flex-grow'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/collection' element={<Collection />} />
          <Route path='/about' element={<About />} />
          <Route path='/books/:deptCode' element={<Books />} />
          <Route path='/myprofile' element={<MyProfile />} />
          <Route path='/borrowed-books' element={<BorrowedBooks />} />
          <Route path='/borrowing-history' element={<BorrowingHistory />} />
          <Route path='/searchbook' element={<Search />} />
          <Route path='/feedback' element={<Feedback />} />
        </Routes>
      </main>
      {showNavbar && <Footer />}
      <BottomNav />
    </div>
  )
}

export default App
