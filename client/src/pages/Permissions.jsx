"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, 
  Shield, 
  QrCode, 
  Edit3, 
  Trash2, 
  Search,
  Home,
  Car,
  Phone,
  Loader2,
  X
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react'; // مكتبة توليد الـ QR الحقيقية ديناميكياً
import { Api } from '../api/axios';

export default function Permissions() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOwnerQr, setSelectedOwnerQr] = useState(null);

  // حالات التحكم في مودال الإضافة والتعديل
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    unitNumber: '',
    carNumber: ''
  });

  // 1. دالة جلب البيانات من السيرفر فور فتح الصفحة
  const fetchOwners = async () => {
    try {
      setLoading(true);
      // افترضنا هنا أن هناك راوت عام لجلب الملاك، عدله حسب اسم دالتك بالجلب
      const {data} = await Api.get('/owner/get-Owner'); 
      console.log(data)
      if (data.success) {
        setOwners(data.data);
      }
    } catch (error) {
      console.error("Error fetching owners:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  // 2. دالة الحذف (DELETE عن طريق الـ Params)
  const handleDelete = async (id) => {
    if (confirm("هل أنت متأكد من حذف هذا المالك نهائياً؟")) {
      try {
        const response = await Api.delete(`/owner/delete/${id}`);
        if (response.data.success) {
          fetchOwners(); // إعادة تحديث الجدول فوراً
        }
      } catch (error) {
        console.error("Error deleting owner:", error.message);
      }
    }
  };

  // 3. دالة إرسال الفورم (إنشاء جديد أو تحديث الحالي)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // تحديث: يتم إرسال الـ id داخل الـ body مع بقية البيانات كما حددنا بكود الـ Update الخاص بك
        const response = await Api.put('/owner/update', { ...formData, id: currentId });
        if (response.data.success) {
          fetchOwners();
          closeModalHandler();
        }
      } else {
        // إنشاء جديد
        const response = await Api.post('/owner/create', formData);
        console.log(response.data)
        if (response.data.success) {
          fetchOwners();
          closeModalHandler();
        }
      }
    } catch (error) {
      console.error("Error saving owner:", error.message);
    }
  };

  // فتح المودال في حالة التعديل وملء البيانات تلقائياً
  const handleOpenEdit = (owner) => {
    setIsEditing(true);
    setCurrentId(owner._id);
    setFormData({
      name: owner.name,
      email: owner.email,
      phone: owner.phone,
      unitNumber: owner.unitNumber,
      carNumber: owner.carNumber || ''
    });
    setShowFormModal(true);
  };

  const closeModalHandler = () => {
    setShowFormModal(false);
    setIsEditing(false);
    setCurrentId(null);
    setFormData({ name: '', email: '', phone: '', unitNumber: '', carNumber: '' });
  };

  // إعدادات الـ Framer Motion للأنيميشن السينمائي
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 text-slate-100 min-h-screen bg-transparent"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 tracking-wide">
            <Shield className="w-8 h-8 text-blue-500" /> Permissions & Owners
          </h1>
          <p className="text-sm text-slate-400 mt-1">Manage village owners, their properties, and control digital entry passes.</p>
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { setIsEditing(false); setShowFormModal(true); }}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-5 py-2.5 rounded-xl transition-colors shadow-lg shadow-blue-600/20 text-sm self-start md:self-auto cursor-pointer"
        >
          <UserPlus className="w-4 h-4" /> Add New Owner
        </motion.button>
      </div>

      {/* Control Bar (Search) */}
      <div className="mb-6 flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search by name, email or unit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/40 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 backdrop-blur-md transition-colors"
          />
        </div>
      </div>

      {/* Table Glassmorphism Container */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/20 backdrop-blur-md shadow-2xl">
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            <span>Loading owners database...</span>
          </div>
        ) : (
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/40 text-slate-400 font-semibold uppercase tracking-wider text-xs">
                <th className="px-6 py-4">Owner Details</th>
                <th className="px-6 py-4">Phone Number</th>
                <th className="px-6 py-4">Unit / Property</th>
                <th className="px-6 py-4">Car Plate</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Pass</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {owners
                .filter(o => 
                  o.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  o.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  o.unitNumber?.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((owner) => (
                  <motion.tr 
                    key={owner._id} 
                    variants={itemVariants}
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    {/* Name & Email */}
                    <td className="px-6 py-4 font-medium text-slate-200">
                      <div className="flex flex-col">
                        <span>{owner.name}</span>
                        <span className="text-xs text-slate-500 font-normal mt-0.5">{owner.email}</span>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-6 py-4 text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        <span>{owner.phone}</span>
                      </div>
                    </td>

                    {/* Unit Number */}
                    <td className="px-6 py-4 text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Home className="w-3.5 h-3.5 text-blue-400/80" />
                        <span>{owner.unitNumber}</span>
                      </div>
                    </td>

                    {/* Car Plate */}
                    <td className="px-6 py-4 text-slate-400">
                      {owner.carNumber && owner.carNumber !== 'N/A' ? (
                        <div className="flex items-center gap-1.5 bg-slate-800/50 border border-slate-700/50 px-2 py-0.5 rounded-md w-fit text-xs">
                          <Car className="w-3.5 h-3.5 text-purple-400" />
                          <span className="font-mono text-slate-300">{owner.carNumber}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-600">No Car</span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        owner.status === 'Active' || !owner.status ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${owner.status === 'Active' || !owner.status ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                        {owner.status || 'Active'}
                      </span>
                    </td>

                    {/* QR Pass Trigger */}
                    <td className="px-6 py-4">
                      <motion.button 
                        whileHover={{ scale: 1.1, y: -1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedOwnerQr(owner)}
                        className="p-1.5 bg-slate-800 hover:bg-blue-600/20 hover:text-blue-400 border border-slate-700/60 rounded-lg text-slate-400 transition-colors cursor-pointer"
                        title="View Gate Pass"
                      >
                        <QrCode className="w-4 h-4" />
                      </motion.button>
                    </td>

                    {/* Actions CRUD */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleOpenEdit(owner)} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors cursor-pointer">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(owner._id)} className="p-1.5 hover:bg-rose-950/40 rounded-lg text-slate-400 hover:text-rose-400 transition-colors cursor-pointer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
            </tbody>
          </table>
        )}
      </div>

      {/* QR Code Dynamic Modal */}
      <AnimatePresence>
        {selectedOwnerQr && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedOwnerQr(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl z-10">
              <h3 className="text-lg font-bold text-slate-100">{selectedOwnerQr.name}'s Pass</h3>
              <p className="text-xs text-slate-400 mt-1">Authorized for property: {selectedOwnerQr.unitNumber}</p>
              
              {/* توليد الكود الفعلي باستخدام الـ _id المسجل بقاعدة البيانات */}
              <div className="my-6 mx-auto bg-white p-4 w-44 h-44 rounded-xl flex items-center justify-center shadow-lg">
                <QRCodeSVG value={selectedOwnerQr._id} size={152} level="H" />
              </div>
              
              <div className="text-xs text-slate-500 bg-slate-950/50 py-2 rounded-lg border border-slate-800/80 mb-4 break-all px-2">
                Owner ID: <span className="text-blue-400 font-mono">{selectedOwnerQr._id}</span>
              </div>

              <button onClick={() => setSelectedOwnerQr(null)} className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-2 rounded-xl text-sm transition-colors cursor-pointer">
                Close Preview
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add / Edit Owner Form Modal */}
      <AnimatePresence>
        {showFormModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModalHandler} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl z-10 text-left">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-100">{isEditing ? 'Edit Owner Data' : 'Add New Village Owner'}</h3>
                <button onClick={closeModalHandler} className="text-slate-500 hover:text-slate-300 transition-colors"><X className="w-5 h-5"/></button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Full Name</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 text-slate-200" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Email Address</label>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 text-slate-200" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Phone Number</label>
                  <input type="text" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 text-slate-200" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Unit / Villa Number</label>
                    <input type="text" required value={formData.unitNumber} onChange={(e) => setFormData({...formData, unitNumber: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 text-slate-200" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Car Plate (Optional)</label>
                    <input type="text" value={formData.carNumber} onChange={(e) => setFormData({...formData, carNumber: e.target.value})} placeholder="e.g. أ ج د 123" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 text-slate-200" />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button type="button" onClick={closeModalHandler} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-xl text-sm transition-colors cursor-pointer">Cancel</button>
                  <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer">{isEditing ? 'Save Changes' : 'Create Owner'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}    