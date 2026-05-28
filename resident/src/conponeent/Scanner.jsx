import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner'; 
import toast from 'react-hot-toast';
import { Api } from '../axios/Api';

function Scanner() {
  const [loading, setLoading] = useState(false);

  // تعديل الـ handleScan عشان يتأكد إن الداتا موجودة قبل ما يعالجها
  const handleScan = (data) => {
    if (data && data.text && !loading) {
      processScan(data.text);
    }
  };

  const processScan = async (token) => {
    setLoading(true);
    try {
      const res = await Api.post('/qr/verify', { qrToken: token });
      if (res.data && res.data.accessGranted) {
        toast.success("دخول مسموح: " + (res.data.data.guestName || "ساكن"));
      }
    } catch (error) {
      toast.error("دخول مرفوض");
    } finally {
      setTimeout(() => setLoading(false), 3000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white">
      <h2 className="mb-4 text-lg font-bold">بوابة الأمن - مسح الباركود</h2>
      
      <div className="w-80 h-80 border-2 border-emerald-500 rounded-2xl overflow-hidden">
        {/* أضفنا onError و onScan بشكل أبسط لمنع الـ crash */}
        <QrScanner
          delay={1000}
          style={{ width: '100%', height: '100%' }}
          onError={(err) => console.log("Camera Error:", err)}
          onScan={handleScan}
          // تحديد الكاميرا الخلفية للموبايل
          constraints={{ video: { facingMode: "environment" } }}
        />
      </div>
    </div>
  );
}

export default Scanner;