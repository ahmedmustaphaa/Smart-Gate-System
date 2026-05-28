import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { User, LogOut, UserPlus, RefreshCw, ShieldCheck, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import { Api } from '../axios/Api';

function ResidentDashboard() {
  const navigate = useNavigate();
  const [resident, setResident] = useState(null);
  const [qrToken, setQrToken] = useState("");
  const [loadingQr, setLoadingQr] = useState(false);
  const [countdown, setCountdown] = useState(120); 

  // 1. التحقق من وجود المالك وتأمين الصفحة
  useEffect(() => {
    const storedInfo = localStorage.getItem('residentInfo');
    const token = localStorage.getItem('residentToken');

    if (!storedInfo || !token) {
      toast.error("جلسة غير صالحة، برجاء تسجيل الدخول");
      navigate('/');
      return;
    }

    setResident(JSON.parse(storedInfo));
  }, [navigate]);

  // 2. دالة جلب الـ QR Token (المحدثة لإرسال التوكن في الـ Header)
  const generateQrToken = async () => {
    try {
      setLoadingQr(true);
      const token = localStorage.getItem('residentToken');

      
      const res = await Api.post('/qr/generate-personal', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }); 

      if (res.data && res.data.success) {
        setQrToken(res.data.qrToken);
        setCountdown(120); 
      }
    } catch (error) {
      console.error("Error generating QR:", error);
      toast.error("فشل في تحديث كود الدخول، يرجى إعادة تسجيل الدخول");
    } finally {
      setLoadingQr(false);
    }
  };

  // 3. تشغيل الـ التحديث التلقائي للكود
  useEffect(() => {
    if (!resident) return;

    generateQrToken();

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          generateQrToken();
          return 120;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [resident]);

  const handleLogout = () => {
    localStorage.clear();
    toast.success("تم تسجيل الخروج بنجاح");
    navigate('/');
  };

  if (!resident) return null;

  return (
    <div className="min-h-screen w-full bg-[#0b0f19] text-white flex flex-col justify-between p-6 relative overflow-hidden select-none font-sans">
      
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* الهيدر */}
      <div className="flex items-center justify-between w-full bg-[#111827]/30 backdrop-blur-md border border-white/5 p-4 rounded-2xl z-10">
        <button onClick={handleLogout} className="p-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl transition-all">
          <LogOut size={18} />
        </button>
        <div className="text-right">
          <p className="text-xs text-gray-500">مرحباً بك</p>
          <h2 className="text-sm font-bold text-gray-200 tracking-wide">{resident.name}</h2>
        </div>
      </div>

      {/* منطقة الـ QR */}
      <div className="flex-1 flex flex-col items-center justify-center my-8 z-10">
        <div className="bg-[#111827]/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 flex flex-col items-center shadow-[0_25px_50px_rgba(0,0,0,0.5)] max-w-xs w-full relative group">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black tracking-widest px-4 py-1 rounded-full uppercase flex items-center gap-1">
            <KeyRound size={10} /> Personal Pass
          </div>

          <div className="p-4 bg-white rounded-3xl mt-2 shadow-[0_0_30px_rgba(6,182,212,0.15)] relative">
            {loadingQr ? (
              <div className="w-[180px] h-[180px] flex items-center justify-center bg-gray-50 rounded-2xl">
                <RefreshCw size={24} className="text-cyan-500 animate-spin" />
              </div>
            ) : qrToken ? (
              <QRCodeSVG value={qrToken} size={180} bgColor={"#ffffff"} fgColor={"#000000"} level={"H"} />
            ) : (
              <div className="w-[180px] h-[180px] flex items-center justify-center bg-gray-50 rounded-2xl text-xs text-gray-400 italic">
                جاري التوليد...
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col items-center gap-1">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <span>يتغير الكود تلقائياً خلال:</span>
              <span className="font-mono font-bold text-cyan-400">{countdown}s</span>
            </div>
            <button onClick={generateQrToken} disabled={loadingQr} className="mt-2 flex items-center gap-1 text-[11px] font-bold text-gray-500 hover:text-cyan-400 transition-colors disabled:opacity-50">
              <RefreshCw size={12} className={loadingQr ? "animate-spin" : ""} />
              تحديث يدوي
            </button>
          </div>
        </div>

        <div className="mt-6 bg-[#121b2e]/40 border border-white/5 rounded-2xl px-6 py-3 flex items-center gap-3 text-sm text-gray-400 max-w-xs w-full justify-center">
          <ShieldCheck size={16} className="text-emerald-400" />
          <span>رقم العقار: <span className="text-white font-mono font-bold">{resident.unitNumber || resident.propertyId || "N/A"}</span></span>
        </div>
      </div>

      <div className="w-full bg-[#111827]/40 backdrop-blur-md border border-white/5 p-3 rounded-2xl z-10 flex items-center justify-center">
        <button onClick={() => navigate('/invite')} className="w-full max-w-sm bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 text-xs font-black tracking-wider py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all">
          <UserPlus size={16} strokeWidth={2.5} />
          <span>CREATE GUEST INVITATION</span>
        </button>
      </div>
    </div>
  );
}

export default ResidentDashboard;