import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Phone, Home, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { Api } from '../axios/Api';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ phone: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.phone || !formData.password) {
      return toast.error("برجاء ملء جميع الحقول المطلوبة");
    }

    try {
      setLoading(true);
      
      const res = await Api.post('/auth/resident-login', {
        phone: formData.phone,      // رقم الموبايل
       unitNumber: formData.password
      });

      console.log(res.data)

      if (res.data && res.data.success) {
        toast.success(`مرحباً بك مجدداً، أ. ${res.data.user.name}`);
        localStorage.setItem('residentToken', res.data.token);
        localStorage.setItem('residentInfo', JSON.stringify(res.data.user));
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Login Error:", error);
      const errorMsg = error.response?.data?.message || "فشل تسجيل الدخول، تأكد من البيانات";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0b0f19] flex flex-col justify-center items-center px-4 relative overflow-hidden font-sans select-none">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#111827]/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.4)] relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 border border-cyan-500/20 text-cyan-400 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.15)] mb-4">
            <ShieldCheck size={32} strokeWidth={1.5} />
          </div>
          <h1 className="text-xl font-black tracking-wide text-white">RESIDENT PORTAL</h1>
          <p className="text-xs text-gray-500 mt-1">Smart Gate Access & Visitor Management</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* حقل رقم الموبايل */}
          <div className="flex flex-col gap-1.5 w-full text-right">
            <label className="text-xs font-bold text-gray-400 px-1">رقم الموبايل المسجل</label>
            <div className="relative flex items-center w-full">
              <Phone size={16} className="absolute left-4 text-gray-500" />
              <input 
                type="tel" 
                name="phone"
                placeholder="01xxxxxxxxx"
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
                className="w-full pl-12 pr-4 py-3 bg-[#1e293b]/30 backdrop-blur-sm border border-white/5 rounded-2xl text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyan-500/40 focus:shadow-[0_0_15px_rgba(6,182,212,0.05)] transition-all font-mono"
              />
            </div>
          </div>

          {/* حقل رقم الفيلا أو الوحدة */}
          <div className="flex flex-col gap-1.5 w-full text-right">
            <label className="text-xs font-bold text-gray-400 px-1">رقم الفيلا / الوحدة</label>
            <div className="relative flex items-center w-full">
              <Home size={16} className="absolute left-4 text-gray-500" />
              <input 
                type="text" 
                name="password" // سيبنا المسمى password عشان يربط أوتوماتيك مع الـ Controller
                placeholder="ادخل رقم الفيلا الخاصة بك"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                className="w-full pl-12 pr-4 py-3 bg-[#1e293b]/30 backdrop-blur-sm border border-white/5 rounded-2xl text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyan-500/40 focus:shadow-[0_0_15px_rgba(6,182,212,0.05)] transition-all font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 text-sm font-black tracking-wider py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(6,182,212,0.25)] hover:shadow-[0_4px_25px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {loading ? (
              <span className="flex items-center gap-2 font-medium text-xs text-slate-900 italic animate-pulse">
                جاري التحقق من الهوية...
              </span>
            ) : (
              <>
                <span>SIGN IN</span>
                <ArrowRight size={16} strokeWidth={2.5} />
              </>
            )}
          </button>
        </form>

        <p className="text-[10px] text-center text-gray-600 mt-8 uppercase tracking-widest">
          Secured by Compound OS v2.0
        </p>
      </div>
    </div>
  );
}

export default Login;