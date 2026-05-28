import React, { useState, useEffect } from 'react';
import { Api } from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

function Login() {
  const [email, setEmail] = useState('ahmedmustafa@gmail.com');
  const [password, setPassword] = useState('ahmed123');
  const [loading, setLoading] = useState(false);

  const nav = useNavigate();
  useEffect(() => {
    if (localStorage.getItem('token')) {
      nav('/');
    }
  }, [nav]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await Api.post('/user/login', { email, password });

      if (data.success) {
        localStorage.setItem('token', data.token);
        toast.success("تم تسجيل الدخول بنجاح");
        nav('/');
      } else {
        toast.error(data.message || "بيانات الدخول غير صحيحة");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "حدث خطأ غير متوقع";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0f1d] text-slate-100 font-sans p-4">
      <div className="w-full max-w-md bg-[#111827]/40 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-500 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">The Smart Gate</h2>
          <p className="text-sm text-slate-400 mt-1">Admin Portal Access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@smartgate.com"
              required
              className="w-full bg-[#0a0f1d]/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-[#0a0f1d]/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full font-medium text-sm py-3 rounded-xl shadow-lg transition-all duration-200 mt-2 ${
              loading 
                ? 'bg-blue-800 cursor-not-allowed opacity-70' 
                : 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 shadow-blue-600/20'
            } text-white`}
          >
            {loading ? "Signing in..." : "Sign In As Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;