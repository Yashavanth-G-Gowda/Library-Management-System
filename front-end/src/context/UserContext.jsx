import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { toast } from 'react-toastify';
import axios from 'axios';

const backendURL = import.meta.env.VITE_BACKEND_URL;

export const UserContext = createContext();


const UserContextProvider = (props) => {
  const navigate = useNavigate();

  // State variables
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [token, setToken] = useState('');
  const [loginComp, setLoginComp] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [books, setBooks] = useState([])

  // get book information
  const getAllBooks = async() => {
    try {
      const response = await axios.get(backendURL + '/api/books/allBooks')
      if(response.data.success){
        setBooks(response.data.books)
      }
      else toast.error(response.data.message)
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  } 

  // Department List
  const departments = [
    { code: 'cse', name: 'Computer Science and Engineering', image: assets.cse, temp: 'Engineering' },
    { code: 'ece', name: 'Electronics and Communication Engineering', image: assets.ece, temp: 'Engineering' },
    { code: 'ise', name: 'Information Science and Engineering', image: assets.ise, temp: 'Engineering' },
    { code: 'bt', name: 'Biotechnology', image: assets.bt, temp: 'Engineering' },
    { code: 'ctm', name: 'Construction Technology and Management', image: assets.ctm, temp: 'Engineering' },
    { code: 'cv', name: 'Civil Engineering', image: assets.cv, temp: 'Engineering' },
    { code: 'ev', name: 'Environmental Engineering', image: assets.ev, temp: 'Engineering' },
    { code: 'ip', name: 'Industrial and Production Engineering', image: assets.ip, temp: 'Engineering' },
    { code: 'me', name: 'Mechanical Engineering', image: assets.me, temp: 'Engineering' },
    { code: 'pst', name: 'Polymer Science and Technology', image: assets.pst, temp: 'Engineering' },
    { code: 'eee', name: 'Electrical and Electronic Engineering', image: assets.eee, temp: 'Engineering' },
    { code: 'eie', name: 'Electronics and Instrumentation Engineering', image: assets.eie, temp: 'Engineering' },
    { code: 'csbs', name: 'Computer Science and Business Systems', image: assets.csbs, temp: 'Engineering' },
    { code: 'ca', name: 'Computer Application', image: assets.ca, temp: 'Science and Technology' },
    { code: 'chm', name: 'Chemistry', image: assets.chm, temp: 'Science and Technology' },
    { code: 'maths', name: 'Mathematics', image: assets.maths, temp: 'Science and Technology' },
    { code: 'phy', name: 'Physics', image: assets.phy, temp: 'Science and Technology' },
  ];

  const getOrdinal = (n) => {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    const suffix =
      v >= 11 && v <= 13 ? 'th' : suffixes[n % 10] || 'th';
    return `${n}${suffix}`;
  };

  // Fetch user details from backend using token
  const getUserDetails = async (currentToken) => {
    try {
      if (!currentToken) return;

      const response = await axios.post(
        `${backendURL}/api/user/userDetails`,
        {},
        { headers: { token: currentToken } }
      );

      if (response.data.success) {
        const { name, srn, email, sem, designation, userType, branch, phone, image } = response.data.user;
        setUserInfo({ name, srn, email, sem, designation, userType, branch, phone, image });
      } else {
        toast.error("Failed to fetch user data.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching user: failed");
    }
  };

  // Load token from localStorage on initial mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      getUserDetails(storedToken); // ✅ Immediately fetch user using token
    }
  }, []);

  // Optional: React to token updates (e.g., after login/signup)
  useEffect(() => {
    if (token) {
      getUserDetails(token);
    }
  }, [token]);

  useEffect(()=> {
    getAllBooks();
  },[])

  // Provide all context values
  const value = {
    navigate,
    books,
    isFeedbackVisible, setIsFeedbackVisible,
    feedbackMessage, setFeedbackMessage,
    token, setToken,
    loginComp, setLoginComp,
    showNavbar, setShowNavbar,
    departments, getOrdinal,
    backendURL,
    userInfo, setUserInfo,
  };

  return (
    <UserContext.Provider value={value}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;