import React, { useEffect, useState } from 'react'
import { UserCircle2, Power, Unlock, Lock, Radio } from 'lucide-react' 
import { dataSight } from '../utiles/SidebarData'
import { ShareContext } from '../Appcontext/Context'
import { Api } from '../api/axios' 
import toast from 'react-hot-toast'

function Overview() {
  // سحب الدالة والداتا من الـ Context
  const { getDashboardData, data } = ShareContext() || {};

  const [gates, setGates] = useState([]);
  const [loadingGates, setLoadingGates] = useState(true);

  // جلب كل البوابات
  const fetchAllGates = async () => {
    try {
      setLoadingGates(true);
      const res = await Api.get('/gate/all'); 
      if (res.data && res.data.success) {
        setGates(res.data.data); 
      }
    } catch (error) {
      console.log("Error fetching gates in Overview:", error.message);
    } finally {
      setLoadingGates(false);
    }
  };

  const handleToggleGate = async (gateId, currentStatus) => {
    const nextStatus = currentStatus === 'open' ? 'closed' : 'open';
    try {
      const res = await Api.patch(`/gate/toggle/${gateId}`, { status: nextStatus });
      if (res.data && res.data.success) {
        toast.success(`تم ${nextStatus === 'open' ? 'فتح' : 'غلق'} البوابة بنجاح`);
        
        setGates(prevGates => 
          prevGates.map(g => g._id === gateId ? { ...g, status: nextStatus } : g)
        );
        
        if (getDashboardData) getDashboardData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "فشل التحكم في البوابة");
    }
  };

  useEffect(() => {
    if (getDashboardData) getDashboardData();
    fetchAllGates();
  }, []);

  return (
    <div className='flex flex-col w-full text-white min-h-full'>

      {/* 1. جزء الترحيب */}
      <div className='flex items-center justify-end gap-3 w-full pb-4 border-b border-white/5'>
        <div className='text-right'>
          <p className='text-sm md:text-base font-semibold tracking-wide text-gray-200'>
            Welcome, Ahmed Mostafa <span className='text-xs text-cyan-400 font-medium bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20 mr-1'>(Super Admin)</span>
          </p>
        </div>
        <UserCircle2 size={36} className='text-gray-400' strokeWidth={1.5} />
      </div>

      {/* 2. الـ Stats Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-10 w-full'>
        {dataSight && dataSight.map((sights, index) => {
          const IconComponent = sights.icon || UserCircle2; 

          let liveNum = 0; 
          if (data) {
            if (index === 0) liveNum = data.totalOpenGates ?? 0;
            if (index === 1) liveNum = data.totalClosedGates ?? 0;
            if (index === 2) liveNum = data.totalResidents ?? 0;
          }

          return (
            <div 
              key={sights.id || index} 
              className='bg-[#1e293b]/40 backdrop-blur-md border border-white/5 rounded-2xl h-[120px] p-5 flex items-center justify-between transition-all hover:border-white/10 hover:bg-[#1e293b]/60'
            >
              <div className='flex flex-col justify-between h-full items-start text-left'>
                <p className='text-[11px] uppercase tracking-widest font-bold text-gray-500'>
                  {sights.title}
                </p>
                <h3 className='text-3xl font-extrabold tracking-tight text-white mt-1'>
                  {liveNum}
                </h3>
              </div>

              <div className='flex flex-col items-end justify-between h-full'>
                {sights.status ? (
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-black tracking-wider border
                    ${index === 0 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}
                  >
                    <IconComponent size={10} className={`${index === 0 ? 'text-emerald-400 animate-pulse' : 'text-rose-400'}`} />
                    <span>{sights.status}</span>
                  </div>
                ) : (
                  <div className='h-5' />
                )}

                <div className='p-2 bg-white/5 rounded-xl border border-white/5 text-gray-400'>
                  <IconComponent size={20} strokeWidth={1.8} />
                </div>
              </div>

            </div>
          )
        })}
      </div>

      {/* 3. جزء الـ Live Control (تصميم احترافي عالي بأيقونات متوافقة 100% 🔥) */}
      <div className='mt-10 bg-[#1e293b]/10 border border-white/5 rounded-3xl p-8 flex-1 flex flex-col'>
        <div className='flex items-center justify-between mb-8'>
          <h3 className='text-sm font-bold uppercase tracking-wider text-gray-400 text-left'>
            Live Gates Control
          </h3>
          <p className='text-xs text-gray-600 italic'>مراقبة وتحكم فوري بالبوابات النشطة</p>
        </div>
        
        {loadingGates ? (
          <p className='text-xs text-gray-500 italic text-center py-10'>جاري تحميل البوابات النشطة...</p>
        ) : gates.length === 0 ? (
          <p className='text-xs text-gray-500 italic text-center py-10'>لا توجد بوابات مسجلة للتحكم بها حالياً.</p>
        ) : (
          <div className='flex flex-col gap-4 w-full'>
            {gates.map((gate) => (
              <div 
                key={gate._id} 
                className='flex items-center justify-between p-5 bg-[#1e293b]/50 backdrop-blur-md border border-white/5 rounded-2xl hover:bg-[#1e293b]/70 hover:border-white/10 transition-all group'
              >
                {/* بيانات البوبة المتطورة */}
                <div className='flex items-center gap-5 text-left'>
                  <div className={`p-3 rounded-2xl border ${gate.status === 'open' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-gray-500/10 border-white/5 text-gray-500'}`}>
                    {gate.status === 'open' 
                      ? <Unlock size={20} className='animate-pulse' />
                      : <Lock size={20} />
                    }
                  </div>
                  <div>
                    <div className='flex items-center gap-2'>
                      <h4 className='text-base font-semibold text-white tracking-wide'>{gate.gateName}</h4>
                      <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider border
                        ${gate.status === 'open'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-gray-500/10 text-gray-400 border-white/5'
                        }`}
                      >
                        <Radio size={8} />
                        {gate.status === 'open' ? 'OPEN' : 'CLOSED'}
                      </span>
                    </div>
                    <p className='text-[12px] text-gray-500 font-sans mt-1.5'>
                      IP: {gate.ipAddress} • <span className='uppercase font-bold tracking-wider text-[11px] text-gray-600'>{gate.type}</span>
                    </p>
                  </div>
                </div>

                {/* زرار التحكم */}
                <button
                  onClick={() => handleToggleGate(gate._id, gate.status)}
                  className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-xs font-bold transition-all border active:scale-95 shadow-lg
                    ${gate.status === 'open'
                      ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/20 shadow-rose-500/10'
                      : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20 shadow-emerald-500/10'
                    }`}
                >
                  <Power size={14} />
                  {gate.status === 'open' ? 'Close Gate Now' : 'Open Gate Now'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

export default Overview;