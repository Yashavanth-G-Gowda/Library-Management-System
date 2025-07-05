import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import ShowDepartment from '../components/bookComponents/ShowDepartment';

const categories = ['ALL', 'ENGINEERING', 'SCIENCE'];

const Collection = () => {
  const { departments } = useContext(UserContext);
  const [activeCategory, setActiveCategory] = useState('ALL');

  const filteredDepartments =
    activeCategory === 'ALL'
      ? departments
      : departments.filter((dept) =>
          dept.temp.toUpperCase().includes(activeCategory)
        );

  useEffect(() => {
    const savedScroll = sessionStorage.getItem('scrollToDept');
    if (savedScroll !== null) {
      window.scrollTo({ top: parseInt(savedScroll), behavior: 'auto' });
      console.log('🔁 Restored scroll position:', savedScroll);
      sessionStorage.removeItem('scrollToDept');
    }
  }, []);

  return (
    <div className="px-4 py-6 max-w-screen-xl mx-auto">
      {/* Centered Category Section */}
      <div className="w-full flex justify-center mb-6">
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 items-center justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`relative px-4 py-3 text-center border rounded-sm w-[240px] font-medium
                ${activeCategory === category ? 'bg-yellow-50 text-black' : 'bg-white text-gray-700'}
                hover:bg-yellow-100 transition`}
            >
              {category.charAt(0) + category.slice(1).toLowerCase()}
              {/* Triangle corner */}
              <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[48px] rotate-180 border-b-[48px] border-l-[#004d66] border-b-transparent" />
            </button>
          ))}
        </div>
      </div>

      {/* Filtered Department Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
        {filteredDepartments.map((dept) => (
          <ShowDepartment
            key={dept.code}
            code={dept.code}
            name={dept.name}
            temp={dept.temp}
            image={dept.image}
          />
        ))}
      </div>
    </div>
  );
};

export default Collection;
