import React from 'react';
import { useNavigate } from 'react-router-dom';

const ShowDepartment = ({ code, name, temp, image }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    sessionStorage.setItem('scrollToDept', scrollY);
    console.log('✅ Saved scroll position:', scrollY);
    navigate(`/books/${code}`);
  };

  return (
    <div
      onClick={handleClick}
      className="relative w-[300px] h-[220px] sm:w-[250px] sm:h-[180px] rounded-xl overflow-hidden shadow-md bg-cover bg-center cursor-pointer my-6"
      style={{ backgroundImage: `url(${image})` }}
    >
      {/* Badge */}
      <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
        <span role="img" aria-label="hat">🎓</span> {temp}
      </div>

      {/* Department Name */}
      <div className="absolute bottom-2 left-2 text-white font-semibold text-lg drop-shadow-md">
        {name}
      </div>
    </div>
  );
};

export default ShowDepartment;