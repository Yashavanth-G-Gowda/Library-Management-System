import React, { useContext, useEffect, useState } from 'react'
import { FaBook, FaCalendarAlt, FaRupeeSign, FaExternalLinkAlt, FaGraduationCap, FaLightbulb, FaArrowRight } from 'react-icons/fa'
import { UserContext } from '../context/UserContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Feedback from '../components/Feedback'
import { useNavigate } from 'react-router-dom';
import ShowBookDetails from '../components/bookComponents/ShowBookDetails';

const Home = () => {
  const { token, userInfo, backendURL, navigate } = useContext(UserContext)
  const [newlyArrivedBooks, setNewlyArrivedBooks] = useState([])
  const [recommendedBooks, setRecommendedBooks] = useState([])
  const [borrowedBooks, setBorrowedBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedBook, setSelectedBook] = useState(null)

  // Fetch newly arrived books
  const fetchNewlyArrivedBooks = async () => {
    try {
      const response = await axios.get(`${backendURL}/api/books/newly-arrived`)
      if (response.data.success) {
        setNewlyArrivedBooks(response.data.books)
      }
    } catch (error) {
      console.error('Error fetching newly arrived books:', error)
    }
  }

  // Fetch book recommendations
  const fetchRecommendations = async () => {
    if (!token) return
    
    try {
      const response = await axios.get(`${backendURL}/api/books/recommendations`, {
        headers: { token }
      })
      if (response.data.success) {
        setRecommendedBooks(response.data.books)
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error)
    }
  }

  // Fetch user's borrowed books
  const fetchBorrowedBooks = async () => {
    if (!token) return
    
    try {
      const response = await axios.post(`${backendURL}/api/user/userWithBooks`, {}, {
        headers: { token }
      })
      
      if (response.data.success && response.data.user.borrowedBooks) {
        // Fetch book details for each borrowed book
        const booksWithDetails = await Promise.all(
          response.data.user.borrowedBooks.map(async (borrowedBook) => {
            try {
              const bookRes = await axios.get(`${backendURL}/api/books/isbn/${borrowedBook.isbn}`)
              if (bookRes.data.success) {
                return {
                  ...borrowedBook,
                  bookDetails: bookRes.data.book
                }
              }
              return borrowedBook
            } catch (err) {
              console.error('Error fetching book details:', err)
              return borrowedBook
            }
          })
        )
        setBorrowedBooks(booksWithDetails)
      }
    } catch (error) {
      console.error('Error fetching borrowed books:', error)
    }
  }

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true)
      await Promise.all([
        fetchNewlyArrivedBooks(),
        fetchRecommendations(),
        fetchBorrowedBooks()
      ])
      setLoading(false)
    }
    
    fetchAllData()
  }, [token])

  const isOverdue = (returnDate) => {
    const today = new Date()
    const [month, day, year] = returnDate.split('-').map(Number)
    const dueDate = new Date(year, month - 1, day)
    return today > dueDate
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    let d, m, y;
    if (dateStr.includes('-')) {
      const parts = dateStr.split('-');
      if (parts[0].length === 4) {
        // yyyy-mm-dd
        [y, m, d] = parts;
      } else if (parts[2].length === 4) {
        // mm-dd-yyyy or dd-mm-yyyy
        [m, d, y] = parts;
        if (Number(m) > 12) [d, m] = [m, d];
      } else {
        [d, m, y] = parts;
      }
      return `${d.padStart(2, '0')}-${m.padStart(2, '0')}-${y}`;
    }
    // If ISO or other format
    const dateObj = new Date(dateStr);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const calculateTotalFine = () => {
    return borrowedBooks.reduce((total, book) => total + (book.fine || 0), 0)
  }

  const BookCard = ({ book, type = "default" }) => {
    const handleClick = () => {
      setSelectedBook(book);
    };
    return (
      <div
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
        onClick={handleClick}
        tabIndex={0}
        role="button"
        aria-label={`View details for ${book.title}`}
      >
        <div className="relative">
          <img 
            src={book.image} 
            alt={book.title}
            className="w-full h-48 object-cover"
          />
          {type === "new" && (
            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              NEW
            </div>
          )}
          {type === "recommended" && (
            <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              RECOMMENDED
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">
            {book.title}
          </h3>
          <p className="text-gray-600 text-xs mb-2">by {book.author}</p>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">
              {book.availableBookNumbers?.length || 0} available
            </span>
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
              {book.branch?.[0] || 'General'}
            </span>
          </div>
        </div>
      </div>
    )
  }

  const BorrowedBookCard = ({ book }) => (
    <div className="bg-white rounded-lg shadow-sm border p-3">
      <div className="flex items-start gap-3">
        <img
          src={book.bookDetails?.image || 'https://via.placeholder.com/60x80'}
          alt={book.bookDetails?.title || 'Book'}
          className="w-12 h-16 object-cover rounded"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-gray-800 truncate">
            {book.bookDetails?.title || 'Unknown Book'}
          </h4>
          <p className="text-xs text-gray-600">
            <span className="font-medium">Book Number:</span> {book.bookNumber}
          </p>
          <p className="text-xs text-gray-600">
            <span className="font-medium">Author:</span> {book.bookDetails?.author || 'Unknown'}
          </p>
          <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
            <div className="flex items-center gap-1">
              <FaCalendarAlt className="text-blue-500" />
              <span className="text-gray-600">
                <span className="font-medium">Issued:</span> {book.issuedDate ? formatDate(book.issuedDate) : 'N/A'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <FaCalendarAlt className={`${isOverdue(book.returnDate) ? 'text-red-500' : 'text-orange-500'}`} />
              <span className={`font-medium ${isOverdue(book.returnDate) ? 'text-red-600' : 'text-orange-600'}`}>
                {isOverdue(book.returnDate) ? 'OVERDUE' : 'Due'}: {formatDate(book.returnDate)}
              </span>
            </div>
          </div>
          {book.fine > 0 && (
            <div className="flex items-center gap-1 mt-1">
              <FaRupeeSign className="text-red-500 text-xs" />
              <span className="text-xs text-red-600 font-medium">
                Fine: ₹{book.fine}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome to SJCE Library</h1>
          <p className="text-lg opacity-90">Discover, Learn, and Explore the World of Knowledge</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* E-Resources Section */}
        <section>
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
                  <FaGraduationCap />
                  E-Resources Portal
                </h2>
                <p className="text-lg opacity-90 mb-4">
                  Access thousands of digital books, research papers, and academic resources. 
                  Expand your knowledge beyond physical boundaries with our comprehensive e-library.
                </p>
                <button 
                  onClick={() => window.open('https://ieeexplore.ieee.org/Xplore/home.jsp', '_blank') }
                  className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                  Explore E-Resources
                  <FaExternalLinkAlt />
                </button>
              </div>
              <div className="hidden lg:block">
                <FaGraduationCap className="text-6xl opacity-20" />
              </div>
            </div>
          </div>
        </section>

        {/* Newly Arrived Books Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FaBook className="text-blue-600" />
              Newly Arrived Books
            </h2>
          </div>
          {newlyArrivedBooks.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {newlyArrivedBooks.slice(0, 5).map((book, index) => (
                <BookCard key={index} book={book} type="new" />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FaBook className="text-4xl mx-auto mb-4 text-gray-300" />
              <p>No newly arrived books at the moment</p>
            </div>
          )}
          {/* Book Details Modal */}
          {selectedBook && (
            <ShowBookDetails book={selectedBook} onClose={() => setSelectedBook(null)} />
          )}
        </section>

        {/* Book Recommendations Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FaLightbulb className="text-yellow-500" />
              Recommended for You
            </h2>
            <button
              onClick={fetchRecommendations}
              className="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 text-sm font-medium"
            >
              Refresh
            </button>
          </div>
          {recommendedBooks.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {recommendedBooks.slice(0, 5).map((book, index) => (
                <BookCard key={index} book={book} type="recommended" />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FaLightbulb className="text-4xl mx-auto mb-4 text-gray-300" />
              <p>No recommendations yet. Borrow or return books to get personalized suggestions!</p>
            </div>
          )}
        </section>

        {/* Borrowed Books Section */}
        {token && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FaBook className="text-blue-600" />
                <p className=''>My Borrowed Books</p>
                {calculateTotalFine() > 0 && (
                  <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded-full">
                    Fine: ₹{calculateTotalFine()}
                  </span>
                )}
              </h2>
            </div>
            {borrowedBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {borrowedBooks.map((book, index) => (
                  <div key={index} className="flex justify-center">
                    <div className="w-full max-w-xs">
                      <BorrowedBookCard book={book} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FaBook className="text-4xl mx-auto mb-4 text-gray-300" />
                <p>No books currently borrowed</p>
              </div>
            )}
          </section>
        )}
        
        {/* Show All Books Section */}
        <section>
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-3">Explore Our Complete Collection</h2>
                <p className="text-lg opacity-90 mb-4">
                  Discover our vast collection of books across all departments. 
                  From engineering to arts, find the perfect book for your academic journey.
                </p>
                <button 
                  onClick={() => navigate('/collection')}
                  className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                  Browse All Books
                  <FaArrowRight />
                </button>
              </div>
              <div className="hidden lg:block">
                <FaBook className="text-6xl opacity-20" />
              </div>
            </div>
          </div>
        </section>
      </div>

          

      {/* Feedback Component
      <Feedback /> */}
    </div>
  )
}

export default Home
