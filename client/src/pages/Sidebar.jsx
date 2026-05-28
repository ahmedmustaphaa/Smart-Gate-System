import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, LogOut } from 'lucide-react';
import { Data } from '../utiles/SidebarData';
import { Link, useLocation } from 'react-router-dom'; 

function Sidebar({isOpen,setIsOpen}) {
  const location = useLocation();
  const [hoveredIndex, setHoveredIndex] = useState(null);

   const handleLogout = () => {

  localStorage.removeItem('token');
  

  localStorage.removeItem('user'); 


  window.location.href = '/login'; 

};

  const sidebarVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.1 } 
    }
  };

  // أنيميشن ظهور اللينكات واحد ورا التاني (Stagger Effect)
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
  };

  return (
    <>
      {/* الـ SVG المخصص لتدرج ألوان الأيقونة الرئيسية */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4ade80" /> {/* أخضر مودرن */}
          <stop offset="100%" stopColor="#22d3ee" /> {/* سيان واجهة المستخدم */}
        </linearGradient>
      </svg>

      <motion.div 
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
        className="w-full md:w-[280px] bg-[#0f172a]/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-[calc(100vh-2rem)] flex flex-col justify-between shadow-2xl overflow-hidden"
      >
        {/* الجزء العلوي: اللوجو واللينكات */}
        <div className="flex flex-col h-full">
          
          {/* الـ Header (اللوجو والعنوان) */}
          <div className="flex justify-between items-center border-b border-white/5 pb-6">
            <div className="flex flex-col">
              <h2 className="uppercase text-white font-extrabold text-sm tracking-widest leading-tight">
                The Smart <br />
                <span className="text-gray-400 font-medium">Gate Village</span>
              </h2>
            </div>
            {/* أيقونة اللوجو متحركة بتأثير نبض خفيف */}
            <motion.div 
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="p-2 bg-white/5 rounded-xl border border-white/10"
            >
              <Home size={28} stroke="url(#logo-gradient)" strokeWidth={1.5} />
            </motion.div>
          </div>

          {/* اسم البوابة الحالي */}
          <p className="text-gray-500 uppercase text-[10px] font-bold tracking-widest pt-8 pb-4 pl-2">
            Main Entrance Gates
          </p>

          {/* قائمة اللينكات (Navigation) */}
          <nav className="flex flex-col gap-1.5 flex-1 overflow-y-auto pr-1">
            {Data.map((item, index) => {
              const IconComponent = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  onHoverStart={() => setHoveredIndex(index)}
                  onHoverEnd={() => setHoveredIndex(null)}
                  className="relative"
                >
                  <Link
                onClick={()=>    setIsOpen(false)}
                    to={item.path}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-colors relative z-10 select-none group
                      ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    {/* اسم اللينك */}
                    <span className="text-[13px] font-medium tracking-wide transition-transform duration-300 group-hover:translate-x-1">
                      {item.title}
                    </span>

                    {/* الأيقونة */}
                    <IconComponent 
                      size={18} 
                      className={`transition-transform duration-300 group-hover:rotate-6 ${isActive ? 'text-cyan-400' : 'text-gray-400 group-hover:text-white'}`} 
                      strokeWidth={1.8}
                    />

                    {/* خلفية التوهج العائمة للـ Hover تأثير زجاجي متحرك ومطاطي */}
                    {hoveredIndex === index && !isActive && (
                      <motion.div
                        layoutId="hoverBg"
                        className="absolute inset-0 bg-white/[0.04] backdrop-blur-md rounded-xl -z-10 border border-white/5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}

         
                    {isActive && (
                      <motion.div
                        layoutId="activeBg"
                        className="absolute inset-0 bg-white/[0.07] backdrop-blur-md rounded-xl -z-10 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>
        </div>

        {/* الجزء السفلي: زر تسجيل الخروج المصمم باحترافية */}
        <div className="border-t border-white/5 pt-4 mt-auto">
          <motion.button 

          onClick={handleLogout}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-between px-4 py-3.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300 group"
          >
            <span className="text-[13px] font-medium tracking-wide">Log Out</span>
            <LogOut size={18} className="transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.8} />
          </motion.button>
        </div>

      </motion.div>
    </>
  );
}

export default Sidebar;