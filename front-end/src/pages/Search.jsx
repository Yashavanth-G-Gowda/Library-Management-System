import React, { useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { assets } from '../assets/assets'; // adjust the path as needed

const Search = () => {
  const { setShowNavbar, navigate } = useContext(UserContext);

  useEffect(() => {
    setShowNavbar(false); // hide navbar when Search mounts
    return () => setShowNavbar(true); // show navbar when Search unmounts
  }, [setShowNavbar]);

  return (
    <div className=" min-h-screen px-4 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <img onClick={()=>navigate(-1)} src={assets.back} alt="back" className="w-5 h-5" />
          <span className="text-lg">Search Books</span>
        </div>
        <img src={assets.mic} alt="mic" className="w-5 h-5" />
      </div>
      <hr />
    </div>
  );
};

export default Search;