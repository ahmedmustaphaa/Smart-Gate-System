import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Key, X, Radio, Smartphone, Car } from 'lucide-react';
import { Api } from '../api/axios';
import toast from 'react-hot-toast';
import { ShareContext } from '../Appcontext/Context';

function Gate() {
  const { AddGate } = ShareContext();
  
  // 1. تعريف الـ States الأساسية
  const [gates, setGates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGate, setEditingGate] = useState(null); 
  const [formData, setFormData] = useState({ gateName: '', type: 'Vehicle', ipAddress: '' });

  // 2. جلب البيانات من الباك إيند أول ما الصفحة تفتح
  const fetchGates = async () => {
    try {
      setLoading(true);
      const { data } = await Api.get('/gate/all');
      if (data.success) {
        setGates(data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "فشل في جلب البيانات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGates();
  }, []);

  // 3. فتح مودال الإضافة
  const handleOpenAddModal = () => {
    setEditingGate(null);
    setFormData({ gateName: '', type: 'Vehicle', ipAddress: '' });
    setIsModalOpen(true);
  };

  // 4. فتح مودال التعديل
  const handleOpenEditModal = (gate) => {
    setEditingGate(gate);
    setFormData({ gateName: gate.gateName, type: gate.type, ipAddress: gate.ipAddress });
    setIsModalOpen(true);
  };

  // 5. حفظ البيانات (إضافة أو تعديل) بالربط مع الباك إيند
  const handleSaveGate = async (e) => {
    e.preventDefault();
    if (editingGate) {
      // أكشن التعديل (PUT)
      try {
        const { data } = await Api.put(`/gate/update/${editingGate._id}`, formData);
        if (data.success) {
          toast.success("تم تعديل البوابة بنجاح");
          fetchGates(); // تحديث الجدول
          setIsModalOpen(false);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "فشل التعديل");
      }
    } else {
      // أكشن الإضافة باستخدام الـ Context الفانكشن اللي راجعة true/false
      const success = await AddGate(formData);
      if (success) {
        fetchGates(); // تحديث الجدول بالبيانات الجديدة
        setIsModalOpen(false);
      }
    }
  };

  // 6. حذف البوابة (DELETE)
  const handleDeleteGate = async (id) => {
    if (window.confirm('Are you sure you want to delete this gate?')) {
      try {
        const { data } = await Api.delete(`/gate/delete/${id}`);
        if (data.success) {
          toast.success("تم مسح البوابة بنجاح");
          setGates(gates.filter((g) => g._id !== id));
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "فشل الحذف");
      }
    }
  };

  // 7. تجديد المفتاح السري (تحديث الـ apiKey عشوائياً للـ Hardware)
  const handleRegenerateKey = async (gate) => {
    const newKey = `sk_live_${Math.random().toString(36).substring(2, 11)}${Math.random().toString(36).substring(2, 7)}`;
    try {
      const { data } = await Api.put(`/gate/update/${gate._id}`, {
        gateName: gate.gateName,
        type: gate.type,
        ipAddress: gate.ipAddress,
        apiKey: newKey
      });
      if (data.success) {
        toast.success("تم تحديث الـ API Key بنجاح!");
        fetchGates();
      }
    } catch (error) {
      toast.error("فشل تحديث المفتاح");
    }
  };

  return (
    <div className="flex flex-col w-full text-white min-h-full gap-6 relative">
      
      {/* الهيدر */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold tracking-wide">Gate Management</h1>
          <p className="text-xs text-gray-500 mt-0.5">Configure, update, and manage your village smart gates control.</p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-500/10 active:scale-95 transition-all"
        >
          <Plus size={16} />
          Add New Gate
        </button>
      </div>

      {/* جدول البيانات */}
      <div className="w-full bg-[#1e293b]/10 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="w-full overflow-x-auto custom-scrollbar">
          {loading ? (
            <div className="py-10 text-center text-sm text-gray-400">جاري تحميل البوابات...</div>
          ) : gates.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-400">لا يوجد بوابات مسجلة حالياً.</div>
          ) : (
            <table className="w-full min-w-[900px] text-left border-collapse select-none">
              <thead>
                <tr className="border-b border-white/5 text-[11px] uppercase tracking-wider font-bold text-gray-400 bg-white/[0.01]">
                  <th className="py-4 px-6">Gate Name</th>
                  <th className="py-4 px-6">Type</th>
                  <th className="py-4 px-6">IP Address / Serial</th>
                  <th className="py-4 px-6">Secret API Key</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {gates.map((gate) => (
                  <tr key={gate._id} className="text-[13px] text-gray-300 hover:bg-white/[0.02] transition-colors duration-150 group">
                    <td className="py-4 px-6 font-semibold text-white tracking-wide">{gate.gateName}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 text-gray-300 border border-white/5 text-[11px]">
                        {gate.type === 'Vehicle' ? <Car size={12} className="text-cyan-400" /> : <Smartphone size={12} className="text-amber-400" />}
                        {gate.type}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-sans text-gray-400 font-medium">{gate.ipAddress}</td>
                    <td className="py-4 px-6 font-mono text-gray-500 text-xs tracking-tight">{gate.apiKey || '---'}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border
                        ${gate.status === 'open' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-gray-500/10 text-gray-400 border-white/5'}`}
                      >
                        <Radio size={8} className={gate.status === 'open' ? 'animate-pulse' : ''} />
                        {gate.status === 'open' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleOpenEditModal(gate)}
                          className="p-2 bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-400 rounded-lg border border-white/5 transition-colors"
                          title="Edit Gate"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => handleRegenerateKey(gate)}
                          className="p-2 bg-white/5 hover:bg-amber-500/20 hover:text-amber-400 rounded-lg border border-white/5 transition-colors"
                          title="Regenerate Secret Key"
                        >
                          <Key size={14} />
                        </button>
                        <button 
                          onClick={() => handleDeleteGate(gate._id)}
                          className="p-2 bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 rounded-lg border border-white/5 transition-colors"
                          title="Delete Gate"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* المودال الشغال للإضافة والتعديل */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="bg-[#111827] border border-white/10 rounded-2xl w-full max-w-md p-6 relative z-10 shadow-2xl">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white bg-white/5 p-1.5 rounded-lg border border-white/5"
            >
              <X size={16} />
            </button>
            <h2 className="text-lg font-bold tracking-wide mb-6">
              {editingGate ? 'Modify Existing Gate' : 'Register New Gate'}
            </h2>
            <form onSubmit={handleSaveGate} className="flex flex-col gap-4 text-left">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Gate Name</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g., North Gate, Garage B"
                  value={formData.gateName}
                  onChange={(e) => setFormData({ ...formData, gateName: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#1e293b]/50 border border-white/5 focus:border-cyan-500/50 rounded-xl text-sm focus:outline-none text-white"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Gate Type</label>
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#1e293b]/50 border border-white/5 focus:border-cyan-500/50 rounded-xl text-sm focus:outline-none text-white"
                >
                  <option value="Vehicle" className="bg-[#111827]">Vehicle (عربيات)</option>
                  <option value="Pedestrian" className="bg-[#111827]">Pedestrian (أفراد)</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">IP Address / Serial Number</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g., 192.168.1.100"
                  value={formData.ipAddress}
                  onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#1e293b]/50 border border-white/5 focus:border-cyan-500/50 rounded-xl text-sm focus:outline-none text-white font-sans"
                />
              </div>
              <div className="flex gap-3 mt-4 justify-end">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  {editingGate ? 'Update Gate' : 'Confirm & Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gate;