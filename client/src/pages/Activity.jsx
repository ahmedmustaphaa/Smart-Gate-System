import React, { useEffect, useState } from 'react';
import { Calendar, ChevronDown, Search, CheckCircle2, AlertTriangle, Radio } from 'lucide-react';
import { Api } from '../api/axios';
import io from 'socket.io-client';

// ربط السوكيت بسيرفر الباك إيند المركزي
const BACKEND_URL = "http://localhost:5000"; 

function Activity() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. جلب السجلات من قاعدة البيانات أول ما الصفحة تفتح
  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await Api.get('/logs/get'); // مسار جلب اللوجز في الباك إيند
      if (res.data && res.data.success) {
        setLogs(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching logs:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. تشغيل السوكيت لطلب داتا لحظية (Real-time Stream 🔥)
  useEffect(() => {
    fetchLogs();

    const socket = io(BACKEND_URL);

    // الاستماع لحدث 'new_activity' المنبثق من الـ Controller في الباك
    socket.on('new_activity', (savedLog) => {
      console.log("New Live Log Inserted:", savedLog);
      // وضع السجل الجديد في أعلى الجدول مباشرة دون ريفريش
      setLogs((prevLogs) => [savedLog, ...prevLogs]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // 3. دالتين لفصل الـ createdAt إلى تاريخ ووقت منسقين
  const extractDate = (dateString) => {
    if (!dateString) return "---";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  const extractTime = (dateString) => {
    if (!dateString) return "---";
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // 4. فلترة الجدول بناءً على كلمة البحث (Search Bar)
  const filteredLogs = logs.filter(log => {
    const ownerName = log.owner?.name?.toLowerCase() || "system admin (remote overview)";
    const gateName = log.gateName?.toLowerCase() || "";
    const activity = log.activityType?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();

    return ownerName.includes(search) || gateName.includes(search) || activity.includes(search);
  });

  return (
    <div className="flex flex-col w-full text-white min-h-full gap-6">
      
      {/* 1. العنوان والهيدر العلوي */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-white/5 pb-4">
        <div className="flex flex-col text-left">
          <h1 className="text-xl font-bold tracking-wide text-white">Live Activity Logs</h1>
          <p className="text-xs text-gray-500 mt-0.5">Real-time monitoring of gate access and system events.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/5 px-3 py-1 rounded-xl border border-emerald-500/10 text-emerald-400 text-xs font-mono font-bold animate-pulse">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
          SOCKET LIVE
        </div>
      </div>

      {/* 2. شريط الفلاتر والبحث (الـ 4 أزرار الفوقانية) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
        
        {/* فلتر Date Range */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#1e293b]/40 backdrop-blur-md border border-white/5 rounded-xl cursor-pointer hover:border-white/10 transition-all text-sm text-gray-400 group">
          <Calendar size={16} className="group-hover:text-white transition-colors" />
          <span className="font-medium group-hover:text-white transition-colors">Date Range</span>
        </div>

        {/* فلتر Gate Select */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#1e293b]/40 backdrop-blur-md border border-white/5 rounded-xl cursor-pointer hover:border-white/10 transition-all text-sm text-gray-400 group">
          <ChevronDown size={16} className="group-hover:text-white transition-colors" />
          <span className="font-medium group-hover:text-white transition-colors">Gate Select</span>
        </div>

        {/* فلتر Activity Type */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#1e293b]/40 backdrop-blur-md border border-white/5 rounded-xl cursor-pointer hover:border-white/10 transition-all text-sm text-gray-400 group">
          <ChevronDown size={16} className="group-hover:text-white transition-colors" />
          <span className="font-medium group-hover:text-white transition-colors">Activity Type</span>
        </div>

        {/* صندوق البحث الحقيقي Search Bar */}
        <div className="relative flex items-center w-full">
          <Search size={16} className="absolute left-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search logs..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-4 pl-10 py-2.5 bg-[#1e293b]/40 backdrop-blur-md border border-white/5 rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-all text-left"
          />
        </div>

      </div>

      {/* 3. حاوية الجدول الزجاجية مع دعم السكرول والبيانات الحية */}
      <div className="w-full bg-[#1e293b]/10 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="w-full overflow-x-auto custom-scrollbar">
          
          {loading ? (
            <p className="text-xs text-gray-500 italic text-center py-20">جاري الاتصال بقاعدة البيانات وجلب الحركات...</p>
          ) : filteredLogs.length === 0 ? (
            <p className="text-xs text-gray-500 italic text-center py-20">لا توجد سجلات حركات تطابق البحث حالياً.</p>
          ) : (
            <table className="w-full min-w-[800px] text-left border-collapse select-none">
              
              {/* رأس الجدول (Table Header) */}
              <thead>
                <tr className="border-b border-white/5 text-[11px] uppercase tracking-wider font-bold text-gray-400 bg-white/[0.01]">
                  <th className="py-4 px-6">Resident Name</th>
                  <th className="py-4 px-6">Gate</th>
                  <th className="py-4 px-6">Activity Type</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Time</th>
                </tr>
              </thead>

              {/* محتوى الجدول الداخلي المتغير ريل تايم (Table Body) */}
              <tbody className="divide-y divide-white/[0.03]">
                {filteredLogs.map((log) => {
                  const statusLower = log.status?.toLowerCase();
                  
                  return (
                    <tr 
                      key={log._id} 
                      className="text-[13px] text-gray-300 hover:bg-white/[0.02] transition-colors duration-150 group"
                    >
                      {/* اسم الساكن المسترجع (لو مفيش يبقى السيستم أدمن اللي فتح البوابة عن بعد) */}
                      <td className="py-4 px-6 font-medium text-white tracking-wide">
                        {log.owner?.name || "System Admin (Remote Overview)"}
                      </td>
                      
                      {/* اسم البوابة */}
                      <td className="py-4 px-6 text-gray-400 group-hover:text-gray-300 transition-colors">
                        {log.gateName || "Unknown Gate"}
                      </td>
                      
                      {/* نوع الحركة */}
                      <td className="py-4 px-6 font-sans text-gray-300">
                        {log.activityType || "N/A"}
                      </td>
                      
                      {/* الحالة الذكية والمضيئة بناءً على داتا الباك إيند الحقيقية */}
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          
                          {/* 1. حالة الـ success (Allowed أو العبور الناجح المضيء) */}
                          {statusLower === 'success' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <Radio size={10} className="animate-pulse" />
                              Allowed
                            </span>
                          )}

                          {/* 2. حالة الـ denied أو الرفض الأمني */}
                          {statusLower === 'denied' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wide bg-rose-500/10 text-rose-400 border border-rose-500/20">
                              <Radio size={10} className="animate-pulse" />
                              Denied
                            </span>
                          )}

                          {/* 3. حالة طارئة أو فتح إجباري (Force Open / Danger Glow) */}
                          {statusLower === 'force-open' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-extrabold tracking-wide bg-rose-500/20 text-rose-500 border border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.15)] animate-pulse">
                              <AlertTriangle size={10} />
                              Force Open
                            </span>
                          )}

                          {/* 4. الحالات المكتملة الأخرى مع علامة الصح */}
                          {statusLower === 'completed' && (
                            <span className="inline-flex items-center gap-1.5 text-[12px] font-bold text-emerald-400">
                              <CheckCircle2 size={14} className="text-emerald-400" />
                              Completed
                            </span>
                          )}

                          {/* حالة احتياطية لو الباك رجع كلمة تانية خالص */}
                          {!['success', 'denied', 'force-open', 'completed'].includes(statusLower) && (
                            <span className="text-[12px] font-medium text-gray-400 capitalize">
                              {log.status || "Unknown"}
                            </span>
                          )}

                        </div>
                      </td>
                      
                      {/* التاريخ المفصول */}
                      <td className="py-4 px-6 font-sans text-gray-400 tracking-tight">
                        {extractDate(log.createdAt)}
                      </td>
                      
                      {/* الوقت الفعلي بالثانية مفصول */}
                      <td className="py-4 px-6 font-sans text-gray-500 tracking-tight group-hover:text-gray-400 transition-colors">
                        {extractTime(log.createdAt)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>

            </table>
          )}
        </div>
      </div>

    </div>
  );
}

export default Activity;