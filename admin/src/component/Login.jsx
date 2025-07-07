import React, { useState } from 'react';
import axios from 'axios';
import { backendURL } from '../App';
import { toast } from 'react-toastify';

const Login = ({ setToken }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(backendURL + '/api/user/admin', { userId, password });
      if (response.data.success) {
        setToken(response.data.token);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center px-4'>
      <div className='bg-white shadow-xl ring-1 ring-gray-200 rounded-2xl px-8 py-6 w-[90%] max-w-md transition-all duration-300'>
        <h1 className='text-2xl font-bold mb-4 text-center'>Admin Panel</h1>
        <form onSubmit={onSubmitHandler}>
          <div className='mb-4'>
            <p className='text-sm font-medium text-gray-700 mb-2'>Admin ID</p>
            <input
              onChange={(e) => setUserId(e.target.value)}
              value={userId}
              className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none focus:ring-2 focus:ring-black'
              type='text'
              placeholder='your@gmail.com'
              required
            />
          </div>
          <div className='mb-4'>
            <p className='text-sm font-medium text-gray-700 mb-2'>Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none focus:ring-2 focus:ring-black'
              type='password'
              placeholder='Enter your password'
              required
            />
          </div>
          <button
            className='w-full py-2 px-4 rounded-md text-white bg-black hover:bg-gray-800 transition-colors'
            type='submit'
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;