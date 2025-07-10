import React, { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const { setLoginComp, backendURL, setToken } = useContext(UserContext);

  const [step, setStep] = useState('login'); // login | signup | otp
  const [srn, setSRN] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [userstate, setUserState] = useState('student'); // 'student' | 'faculty'

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${backendURL}/api/user/login`, {
        srn,
        password,
        usertype: userstate,
      });

      if (res.data.success) {
        setToken(res.data.token);
        localStorage.setItem('token', res.data.token);
        toast.success('Logged in successfully!');
        setLoginComp(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error('Login failed');
    }
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();

    if (!email || !srn || !password) {
      return toast.error('Fill all fields');
    }

    try {
      const res = await axios.post(`${backendURL}/api/auth/send-otp`, { email });

      if (res.data.success) {
        toast.success('OTP sent to your email!');
        setStep('otp');
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error('Failed to send OTP');
    }
  };

  const handleVerifyOtpAndRegister = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) return toast.error('Enter 6-digit OTP');

    try {
      const verifyRes = await axios.post(`${backendURL}/api/auth/verify-otp`, {
        email,
        otp,
      });

      if (verifyRes.data.success) {
        const registerRes = await axios.post(`${backendURL}/api/user/register`, {
          srn,
          email,
          password,
          usertype: userstate,
        });

        if (registerRes.data.success) {
          setToken(registerRes.data.token);
          localStorage.setItem('token', registerRes.data.token);
          toast.success('Account created successfully!');
          setLoginComp(false);
        } else {
          toast.error(registerRes.data.message);
        }
      } else {
        toast.error(verifyRes.data.message);
      }
    } catch (err) {
      toast.error('OTP verification failed');
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
          <p className="prata-regular text-2xl sm:text-3xl text-gray-800 capitalize">
            {step === 'login' ? 'Login' : step === 'signup' ? 'Sign Up' : 'Verify OTP'}
          </p>
          <div className="w-8 h-[2px] bg-gray-800 mx-auto mt-1" />
        </div>

        {/* Role Toggle */}
        <div className="flex justify-center items-center gap-6 mb-4">
          <div
            className={`flex items-center gap-2 cursor-pointer select-none ${userstate === 'student' ? 'text-black font-semibold' : 'text-gray-500'}`}
            onClick={() => setUserState('student')}
          >
            <div className={`w-4 h-4 rounded-full border-2 ${userstate === 'student' ? 'bg-black border-black' : 'border-gray-400'}`} />
            <span className="text-sm">Student</span>
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer select-none ${userstate === 'faculty' ? 'text-black font-semibold' : 'text-gray-500'}`}
            onClick={() => setUserState('faculty')}
          >
            <div className={`w-4 h-4 rounded-full border-2 ${userstate === 'faculty' ? 'bg-black border-black' : 'border-gray-400'}`} />
            <span className="text-sm">Faculty</span>
          </div>
        </div>

        {/* LOGIN FORM */}
        {step === 'login' && (
          <form onSubmit={handleLogin} className="flex flex-col items-center gap-4 text-gray-800">
            <input
              value={srn}
              onChange={(e) => setSRN(e.target.value.toUpperCase())}
              type="text"
              placeholder={userstate === 'faculty' ? 'FR Number' : 'SR Number'}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              required
            />

            <div className="w-full flex justify-between text-sm text-gray-600 px-1 mt-[-6px]">
              <p className="cursor-pointer hover:underline">Forgot Password?</p>
              <p
                className="cursor-pointer text-blue-600 hover:underline"
                onClick={() => {
                  setStep('signup');
                  setPassword('');
                }}
              >
                Create Account
              </p>
            </div>

            <button type="submit" className="w-full bg-black text-white font-medium rounded-xl py-3 mt-1 hover:bg-gray-900 transition">
              Sign In
            </button>
          </form>
        )}

        {/* SIGNUP FORM */}
        {step === 'signup' && (
          <form onSubmit={handleRequestOtp} className="flex flex-col items-center gap-4 text-gray-800">
            <input
              value={srn}
              onChange={(e) => setSRN(e.target.value.toUpperCase())}
              type="text"
              placeholder={userstate === 'faculty' ? 'FR Number' : 'SR Number'}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email address"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              required
            />

            <div className="w-full text-center text-sm text-gray-600 px-1 mt-[-6px]">
              <p
                className="cursor-pointer text-blue-600 hover:underline"
                onClick={() => {
                  setStep('login');
                  setPassword('');
                }}
              >
                Login here
              </p>
            </div>

            <button type="submit" className="w-full bg-black text-white font-medium rounded-xl py-3 mt-1 hover:bg-gray-900 transition">
              Get OTP
            </button>
          </form>
        )}

        {/* VERIFY OTP FORM */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtpAndRegister} className="flex flex-col items-center gap-4 text-gray-800">
            <p className="text-sm text-center text-gray-600">
              OTP sent to <span className="font-semibold">{email}</span>
            </p>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              type="text"
              placeholder="Enter 6-digit OTP"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              maxLength={6}
              required
            />

            <button type="submit" className="w-full bg-black text-white font-medium rounded-xl py-3 hover:bg-gray-900 transition">
              Sign Up
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;