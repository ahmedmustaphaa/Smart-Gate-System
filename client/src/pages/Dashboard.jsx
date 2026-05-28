import React, { useState } from 'react'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='h-screen w-screen flex bg-[#0f172a] p-4 gap-4 overflow-hidden select-none relative'>
      
      {/* زرار المنيو للموبايل */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-6 right-6 z-50 p-2.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-white active:scale-95 transition-transform"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

  
      <div className={`
      
        fixed inset-y-4 left-4 z-40 w-[280px] h-[calc(100vh-2rem)] 
        transition-all duration-500 ease-out transform
        
       
        md:static md:block md:translate-x-0 md:opacity-100 flex-shrink-0
      
        ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 md:opacity-100'}
      `}>
        <Sidebar  setIsOpen={setIsOpen} isOpen={isOpen} closeMenu={() => setIsOpen(false)} />
      </div>


      <div 
        onClick={() => setIsOpen(false)} 
        className={`
          md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30
          transition-opacity duration-500 ease-out
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      />

      {/* محتوى لوحة التحكم الأساسي */}
      <main className="flex-1 h-full rounded-2xl p-6 md:py-12 overflow-y-auto custom-scrollbar">
        <Outlet />
      </main>
      
    </div>
  )
}

export default Dashboard