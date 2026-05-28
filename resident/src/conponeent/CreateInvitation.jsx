import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowRight, UserPlus, Share2, Copy, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { Api } from '../axios/Api';

function CreateInvitation() {
  const navigate = useNavigate();
  const [guestName, setGuestName] = useState("");
  const [loading, setLoading] = useState(false);
  const [invitationQr, setInvitationQr] = useState(""); 
  const [isGenerated, setIsGenerated] = useState(false);
  const handleGenerateInvitation = async (e) => {
    e.preventDefault();

    if (!guestName.trim()) {
      return toast.error("برجاء إدخال اسم الضيف أولاً");
    }

    try {
      setLoading(true);
      
      // جلب التوكن من الـ localStorage
      const token = localStorage.getItem('residentToken');

      // إرسال الطلب مع الـ Authorization Header
      const res = await Api.post('/qr/generate-visitor', 
        { guestName }, 
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.data && res.data.success) {
        setInvitationQr(res.data.visitorToken);
        setIsGenerated(true);
        toast.success("تم توليد باركود الزيارة بنجاح");
      }
    } catch (error) {
      console.error("Error creating invitation:", error);
      toast.error(error.response?.data?.message || "فشل في توليد تصريح الزيارة");
    } finally {
      setLoading(false);
    }
  };

  const handleShareWhatsApp = () => {
    const message = `أهلاً بك يا ${guestName}، تفضل كود دخول البوابة الإلكترونية الخاص بزيارتك.\n\nالكود صالح للاستخدام مرة واحدة فقط.`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(invitationQr);
    toast.success("تم نسخ كود التصريح للحافظة");
  };

  return (
    <div className="min-h-screen w-full bg-[#0b0f19] text-white flex flex-col justify-center items-center px-4 relative overflow-hidden font-sans select-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#111827]/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.4)] relative z-10">
        <button 
          onClick={() => navigate('/dashboard')}
          className="absolute top-6 left-6 p-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-gray-400 transition-all"
        >
          <ArrowLeft size={16} />
        </button>

        <div className="flex flex-col items-center mb-8 text-center mt-4">
          <div className="p-4 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl mb-4">
            <UserPlus size={28} strokeWidth={1.5} />
          </div>
          <h1 className="text-lg font-black tracking-wide text-white uppercase">Guest Invitation</h1>
        </div>

        {!isGenerated ? (
          <form onSubmit={handleGenerateInvitation} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5 w-full text-right">
              <label className="text-xs font-bold text-gray-400 px-1">اسم الضيف الثلاثي</label>
              <input 
                type="text"
                placeholder="برجاء كتابة اسم الزائر"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                disabled={loading}
                className="w-full px-5 py-3.5 bg-[#1e293b]/30 backdrop-blur-sm border border-white/5 rounded-2xl text-sm focus:border-emerald-500/40 transition-all text-right"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 text-sm font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(16,185,129,0.2)] transition-all"
            >
              {loading ? "جاري الإصدار..." : (
                <>
                  <span>توليد باركود الزيارة</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="flex flex-col items-center">
            <div className="p-4 bg-white rounded-3xl mb-6">
              <QRCodeSVG value={invitationQr} size={160} level={"H"} />
            </div>
            <p className="text-xs text-gray-400 font-medium mb-6">
              تم إنشاء باركود دخول لـ: <span className="text-emerald-400 font-bold">{guestName}</span>
            </p>
            <div className="flex flex-col gap-3 w-full">
              <button onClick={handleShareWhatsApp} className="w-full bg-[#25D366] text-white text-xs font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2">
                <Share2 size={14} /> SHARE VIA WHATSAPP
              </button>
              <button onClick={handleCopyLink} className="w-full bg-[#1e293b]/40 border border-white/5 text-gray-300 text-xs font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2">
                <Copy size={14} /> نسخ رمز التصريح
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateInvitation;