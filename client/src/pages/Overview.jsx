import React, { useEffect, useState } from 'react'
import { UserCircle2, Power, Unlock, Lock, Radio } from 'lucide-react'
import { dataSight } from '../utiles/SidebarData'
import { ShareContext } from '../Appcontext/Context'
import { Api } from '../api/axios'
import toast from 'react-hot-toast'

function Overview() {
  const { getDashboardData, data } = ShareContext() || {}

  const [gates, setGates] = useState([])
  const [loadingGates, setLoadingGates] = useState(true)

  // جلب كل البوابات
  const fetchAllGates = async () => {
    try {
      setLoadingGates(true)
      const res = await Api.get('/gate/all')

      if (res.data && res.data.success) {
        setGates(res.data.data)
      }
    } catch (error) {
      console.log('Error fetching gates in Overview:', error.message)
    } finally {
      setLoadingGates(false)
    }
  }

  const handleToggleGate = async (gateId, currentStatus) => {
    const nextStatus = currentStatus === 'open' ? 'closed' : 'open'

    try {
      const res = await Api.patch(`/gate/toggle/${gateId}`, {
        status: nextStatus,
      })

      if (res.data && res.data.success) {
        toast.success(
          `تم ${nextStatus === 'open' ? 'فتح' : 'غلق'} البوابة بنجاح`
        )

        setGates((prevGates) =>
          prevGates.map((g) =>
            g._id === gateId ? { ...g, status: nextStatus } : g
          )
        )

        if (getDashboardData) getDashboardData()
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل التحكم في البوابة')
    }
  }

  useEffect(() => {
    if (getDashboardData) getDashboardData()
    fetchAllGates()
  }, [])

  return (
    <div className='flex flex-col w-full text-white min-h-full px-3 sm:px-5 lg:px-0'>

      {/* Header */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full pb-5 border-b border-white/5'>

        <div className='flex items-center gap-3'>
          <UserCircle2
            size={40}
            className='text-gray-400 shrink-0'
            strokeWidth={1.5}
          />

          <div className='text-left'>
            <p className='text-sm sm:text-base md:text-lg font-semibold tracking-wide text-gray-200 leading-relaxed'>
              Welcome, Ahmed Mostafa
            </p>

            <span className='inline-flex mt-1 text-[10px] sm:text-xs text-cyan-400 font-medium bg-cyan-500/10 px-2 py-1 rounded-md border border-cyan-500/20'>
              Super Admin
            </span>
          </div>
        </div>

      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 pt-8 w-full'>

        {dataSight &&
          dataSight.map((sights, index) => {
            const IconComponent = sights.icon || UserCircle2

            let liveNum = 0

            if (data) {
              if (index === 0) liveNum = data.totalOpenGates ?? 0
              if (index === 1) liveNum = data.totalClosedGates ?? 0
              if (index === 2) liveNum = data.totalResidents ?? 0
            }

            return (
              <div
                key={sights.id || index}
                className='bg-[#1e293b]/40 backdrop-blur-md border border-white/5 rounded-2xl min-h-[120px] p-5 flex items-center justify-between transition-all hover:border-white/10 hover:bg-[#1e293b]/60'
              >

                <div className='flex flex-col justify-between h-full items-start text-left'>
                  <p className='text-[10px] sm:text-[11px] uppercase tracking-widest font-bold text-gray-500'>
                    {sights.title}
                  </p>

                  <h3 className='text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-2'>
                    {liveNum}
                  </h3>
                </div>

                <div className='flex flex-col items-end justify-between h-full'>

                  {sights.status ? (
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-black tracking-wider border
                        ${
                          index === 0
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}
                    >
                      <IconComponent
                        size={10}
                        className={`${
                          index === 0
                            ? 'text-emerald-400 animate-pulse'
                            : 'text-rose-400'
                        }`}
                      />

                      <span>{sights.status}</span>
                    </div>
                  ) : (
                    <div className='h-5' />
                  )}

                  <div className='p-2 sm:p-3 bg-white/5 rounded-xl border border-white/5 text-gray-400'>
                    <IconComponent size={20} strokeWidth={1.8} />
                  </div>

                </div>
              </div>
            )
          })}
      </div>

      {/* Live Gates */}
      <div className='mt-10 bg-[#1e293b]/10 border border-white/5 rounded-3xl p-4 sm:p-6 lg:p-8 flex-1 flex flex-col'>

        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-8'>

          <h3 className='text-sm font-bold uppercase tracking-wider text-gray-400 text-left'>
            Live Gates Control
          </h3>

          <p className='text-xs text-gray-600 italic'>
            مراقبة وتحكم فوري بالبوابات النشطة
          </p>
        </div>

        {loadingGates ? (
          <p className='text-xs text-gray-500 italic text-center py-10'>
            جاري تحميل البوابات النشطة...
          </p>
        ) : gates.length === 0 ? (
          <p className='text-xs text-gray-500 italic text-center py-10'>
            لا توجد بوابات مسجلة للتحكم بها حالياً.
          </p>
        ) : (
          <div className='flex flex-col gap-4 w-full'>

            {gates.map((gate) => (
              <div
                key={gate._id}
                className='flex flex-col lg:flex-row lg:items-center justify-between gap-5 p-4 sm:p-5 bg-[#1e293b]/50 backdrop-blur-md border border-white/5 rounded-2xl hover:bg-[#1e293b]/70 hover:border-white/10 transition-all group'
              >

                {/* Gate Info */}
                <div className='flex items-start sm:items-center gap-4 sm:gap-5 text-left w-full'>

                  <div
                    className={`p-3 rounded-2xl border shrink-0 ${
                      gate.status === 'open'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : 'bg-gray-500/10 border-white/5 text-gray-500'
                    }`}
                  >
                    {gate.status === 'open' ? (
                      <Unlock size={20} className='animate-pulse' />
                    ) : (
                      <Lock size={20} />
                    )}
                  </div>

                  <div className='flex-1 min-w-0'>

                    <div className='flex flex-wrap items-center gap-2'>

                      <h4 className='text-sm sm:text-base font-semibold text-white tracking-wide break-words'>
                        {gate.gateName}
                      </h4>

                      <span
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-bold tracking-wider border whitespace-nowrap
                          ${
                            gate.status === 'open'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-gray-500/10 text-gray-400 border-white/5'
                          }`}
                      >
                        <Radio size={8} />

                        {gate.status === 'open'
                          ? 'OPEN'
                          : 'CLOSED'}
                      </span>
                    </div>

                    <p className='text-[11px] sm:text-[12px] text-gray-500 font-sans mt-2 break-all leading-relaxed'>
                      IP: {gate.ipAddress} •{' '}
                      <span className='uppercase font-bold tracking-wider text-[10px] sm:text-[11px] text-gray-600'>
                        {gate.type}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Button */}
                <button
                  onClick={() =>
                    handleToggleGate(gate._id, gate.status)
                  }
                  className={`w-full lg:w-auto flex items-center justify-center gap-2.5 px-5 sm:px-6 py-3 rounded-2xl text-xs font-bold transition-all border active:scale-95 shadow-lg whitespace-nowrap
                    ${
                      gate.status === 'open'
                        ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/20 shadow-rose-500/10'
                        : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20 shadow-emerald-500/10'
                    }`}
                >
                  <Power size={14} />

                  {gate.status === 'open'
                    ? 'Close Gate Now'
                    : 'Open Gate Now'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Overview