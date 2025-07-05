import React, { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const { setLoginComp, backendURL, setToken } = useContext(UserContext);
  const [currentState, setCurrentState] = useState('Login');
  const [srn, setSRN] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      let endpoint = '';
      let payload = {};

      if (currentState === 'Sign Up') {
        endpoint = '/api/user/register';
        payload = { srn, email, password };
      } else {
        endpoint = '/api/user/login';
        payload = { srn, password };
      }

      const response = await axios.post(backendURL + endpoint, payload);

      if (response.data.success) {
        // ✅ Set token to context and localStorage
        const receivedToken = response.data.token;
        setToken(receivedToken);
        localStorage.setItem('token', receivedToken);

        toast.success(
          currentState === 'Login'
            ? 'Logged in successfully!'
            : 'Account created successfully!'
        );

        setLoginComp(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 px-4">
      <div className="relative w-full max-w-sm bg-white px-6 py-8 rounded-2xl shadow-xl transition-all">

        {/* ❌ Close Button */}
        <button
          onClick={() => setLoginComp(false)}
          className="absolute top-3 right-4 text-gray-500 text-2xl font-bold hover:text-red-500 transition"
        >
          x
        </button>

        {/* Title */}
        <div className="text-center mb-6">
          <p className="prata-regular text-2xl sm:text-3xl text-gray-800">{currentState}</p>
          <div className="w-8 h-[2px] bg-gray-800 mx-auto mt-1" />
        </div>

        {/* Form */}
        <form onSubmit={onSubmitHandler} className="flex flex-col items-center gap-4 text-gray-800">

          <input
            value={srn}
            onChange={(e) => setSRN(e.target.value.toUpperCase())}
            type="text"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="SR Number"
            required
          />

          {currentState === 'Sign Up' && (
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Email address"
              required
            />
          )}

          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Password"
            required
          />

          {/* Footer Actions */}
          {currentState === 'Login' ? (
            <div className="w-full flex justify-between text-sm text-gray-600 px-1 mt-[-6px]">
              <p className="cursor-pointer hover:underline">Forgot Password?</p>
              <p
                className="cursor-pointer text-blue-600 hover:underline"
                onClick={() => {
                  setCurrentState('Sign Up');
                  setPassword('');
                  setEmail('');
                }}
              >
                Create Account
              </p>
            </div>
          ) : (
            <div className="w-full text-center text-sm text-gray-600 px-1 mt-[-6px]">
              <p
                className="cursor-pointer text-blue-600 hover:underline"
                onClick={() => {
                  setCurrentState('Login');
                  setPassword('');
                }}
              >
                Login here
              </p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-black text-white font-medium rounded-xl py-3 mt-1 hover:bg-gray-900 transition"
          >
            {currentState === 'Login' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;