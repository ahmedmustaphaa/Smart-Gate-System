"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  X,
  MessageCircle,
  Download,
  Copy,
  Check
} from "lucide-react";

import { QRCodeSVG } from "qrcode.react";
import { Api } from "../api/axios";

export default function Permissions() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOwnerQr, setSelectedOwnerQr] = useState(null);

  const [copied, setCopied] = useState(false);

  // Form Modal
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    unitNumber: "",
    carNumber: ""
  });

  // =========================================
  // FETCH OWNERS
  // =========================================

  const fetchOwners = async () => {
    try {
      setLoading(true);

      const { data } = await Api.get("/owner/get-Owner");

      if (data.success) {
        setOwners(data.data);
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  // =========================================
  // DELETE OWNER
  // =========================================

  const handleDelete = async (id) => {
    if (confirm("هل أنت متأكد من حذف هذا المالك؟")) {
      try {
        const response = await Api.delete(`/owner/delete/${id}`);

        if (response.data.success) {
          fetchOwners();
        }
      } catch (error) {
        console.error(error.message);
      }
    }
  };

  // =========================================
  // CREATE / UPDATE OWNER
  // =========================================

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        const response = await Api.put("/owner/update", {
          ...formData,
          id: currentId
        });

        if (response.data.success) {
          fetchOwners();
          closeModalHandler();
        }
      } else {
        const response = await Api.post("/owner/create", formData);

        if (response.data.success) {
          fetchOwners();
          closeModalHandler();
        }
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  // =========================================
  // OPEN EDIT
  // =========================================

  const handleOpenEdit = (owner) => {
    setIsEditing(true);

    setCurrentId(owner._id);

    setFormData({
      name: owner.name,
      email: owner.email,
      phone: owner.phone,
      unitNumber: owner.unitNumber,
      carNumber: owner.carNumber || ""
    });

    setShowFormModal(true);
  };

  // =========================================
  // CLOSE MODAL
  // =========================================

  const closeModalHandler = () => {
    setShowFormModal(false);

    setIsEditing(false);

    setCurrentId(null);

    setFormData({
      name: "",
      email: "",
      phone: "",
      unitNumber: "",
      carNumber: ""
    });
  };

  // =========================================
  // WHATSAPP SEND
  // =========================================

  const handleSendWhatsApp = (owner) => {
    const phone = owner.phone.replace(/\s+/g, "");

    const qrLink = `https://your-domain.com/owner/${owner._id}`;

    const message = `
🏡 Village Gate Pass

Owner: ${owner.name}
Unit: ${owner.unitNumber}
Phone: ${owner.phone}

🔐 QR Pass:
${qrLink}

Welcome.
`;

    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");
  };

  // =========================================
  // COPY QR LINK
  // =========================================

  const handleCopy = async (owner) => {
    const qrLink = `https://your-domain.com/owner/${owner._id}`;

    await navigator.clipboard.writeText(qrLink);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  // =========================================
  // DOWNLOAD QR
  // =========================================

  const handleDownloadQR = (owner) => {
    const svg = document.getElementById("qr-code");

    const svgData = new XMLSerializer().serializeToString(svg);

    const canvas = document.createElement("canvas");

    const ctx = canvas.getContext("2d");

    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");

      downloadLink.download = `${owner.name}-qr.png`;

      downloadLink.href = pngFile;

      downloadLink.click();
    };

    img.src =
      "data:image/svg+xml;base64," +
      btoa(unescape(encodeURIComponent(svgData)));
  };

  // =========================================
  // ANIMATION
  // =========================================

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },

    visible: {
      opacity: 1,
      y: 0,

      transition: {
        duration: 0.4,
        staggerChildren: 0.08
      }
    }
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
      className="p-3 sm:p-4 md:p-6 text-slate-100 min-h-screen bg-transparent overflow-hidden"
    >
      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3 tracking-wide">
            <Shield className="w-8 h-8 text-blue-500" />

            Permissions & Owners
          </h1>

          <p className="text-sm text-slate-400 mt-1">
            Manage village owners and digital passes.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setIsEditing(false);
            setShowFormModal(true);
          }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-5 py-3 rounded-xl transition-colors shadow-lg shadow-blue-600/20 text-sm cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />

          Add New Owner
        </motion.button>
      </div>

      {/* SEARCH */}

      <div className="mb-5 flex flex-col sm:flex-row gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />

          <input
            type="text"
            placeholder="Search by name, email or unit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/40 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 backdrop-blur-md transition-colors"
          />
        </div>
      </div>

      {/* TABLE */}

      <div className="w-full overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/20 backdrop-blur-md shadow-2xl">
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />

            <span>Loading owners...</span>
          </div>
        ) : (
          <table className="min-w-[950px] w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/40 text-slate-400 font-semibold uppercase tracking-wider text-xs">
                <th className="px-4 sm:px-6 py-4">Owner</th>
                <th className="px-4 sm:px-6 py-4">Phone</th>
                <th className="px-4 sm:px-6 py-4">Unit</th>
                <th className="px-4 sm:px-6 py-4">Car</th>
                <th className="px-4 sm:px-6 py-4">Status</th>
                <th className="px-4 sm:px-6 py-4">Pass</th>
                <th className="px-4 sm:px-6 py-4 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60">
              {owners
                .filter(
                  (o) =>
                    o.name
                      ?.toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    o.email
                      ?.toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    o.unitNumber
                      ?.toLowerCase()
                      .includes(searchTerm.toLowerCase())
                )
                .map((owner) => (
                  <motion.tr
                    key={owner._id}
                    variants={itemVariants}
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    {/* OWNER */}

                    <td className="px-4 sm:px-6 py-4 font-medium text-slate-200">
                      <div className="flex flex-col">
                        <span>{owner.name}</span>

                        <span className="text-xs text-slate-500 font-normal mt-0.5">
                          {owner.email}
                        </span>
                      </div>
                    </td>

                    {/* PHONE */}

                    <td className="px-4 sm:px-6 py-4 text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-500" />

                        <span>{owner.phone}</span>
                      </div>
                    </td>

                    {/* UNIT */}

                    <td className="px-4 sm:px-6 py-4 text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Home className="w-3.5 h-3.5 text-blue-400/80" />

                        <span>{owner.unitNumber}</span>
                      </div>
                    </td>

                    {/* CAR */}

                    <td className="px-4 sm:px-6 py-4 text-slate-400">
                      {owner.carNumber ? (
                        <div className="flex items-center gap-1.5 bg-slate-800/50 border border-slate-700/50 px-2 py-1 rounded-md w-fit text-xs">
                          <Car className="w-3.5 h-3.5 text-purple-400" />

                          <span className="font-mono text-slate-300">
                            {owner.carNumber}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-600">
                          No Car
                        </span>
                      )}
                    </td>

                    {/* STATUS */}

                    <td className="px-4 sm:px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />

                        Active
                      </span>
                    </td>

                    {/* QR */}

                    <td className="px-4 sm:px-6 py-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedOwnerQr(owner)}
                        className="p-2 bg-slate-800 hover:bg-blue-600/20 hover:text-blue-400 border border-slate-700/60 rounded-lg text-slate-400 transition-colors cursor-pointer"
                      >
                        <QrCode className="w-4 h-4" />
                      </motion.button>
                    </td>

                    {/* ACTIONS */}

                    <td className="px-4 sm:px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(owner)}
                          className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(owner._id)}
                          className="p-2 hover:bg-rose-950/40 rounded-lg text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                        >
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

      {/* QR MODAL */}

      <AnimatePresence>
        {selectedOwnerQr && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOwnerQr(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 max-w-sm w-full text-center shadow-2xl z-10 mx-2"
            >
              <h3 className="text-lg font-bold text-slate-100">
                {selectedOwnerQr.name}'s Pass
              </h3>

              <p className="text-xs text-slate-400 mt-1">
                Authorized for property:
                {" "}
                {selectedOwnerQr.unitNumber}
              </p>

              {/* QR */}

              <div className="my-6 mx-auto bg-white p-3 sm:p-4 w-36 h-36 sm:w-44 sm:h-44 rounded-xl flex items-center justify-center shadow-lg">
                <QRCodeSVG
                  id="qr-code"
                  value={`https://your-domain.com/owner/${selectedOwnerQr._id}`}
                  size={window.innerWidth < 640 ? 120 : 152}
                  level="H"
                />
              </div>

              {/* ID */}

              <div className="text-xs text-slate-500 bg-slate-950/50 py-2 rounded-lg border border-slate-800/80 mb-4 break-all px-2">
                Owner ID:
                {" "}
                <span className="text-blue-400 font-mono">
                  {selectedOwnerQr._id}
                </span>
              </div>

              {/* ACTION BUTTONS */}

              <div className="grid grid-cols-2 gap-3 mb-4">
                {/* WHATSAPP */}

                <button
                  onClick={() =>
                    handleSendWhatsApp(selectedOwnerQr)
                  }
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white py-2 rounded-xl text-sm font-medium transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />

                  WhatsApp
                </button>

                {/* DOWNLOAD */}

                <button
                  onClick={() =>
                    handleDownloadQR(selectedOwnerQr)
                  }
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-xl text-sm font-medium transition-colors"
                >
                  <Download className="w-4 h-4" />

                  Download
                </button>
              </div>

              {/* COPY */}

              <button
                onClick={() => handleCopy(selectedOwnerQr)}
                className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-2 rounded-xl text-sm transition-colors mb-3"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />

                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />

                    Copy QR Link
                  </>
                )}
              </button>

              {/* CLOSE */}

              <button
                onClick={() => setSelectedOwnerQr(null)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-2 rounded-xl text-sm transition-colors"
              >
                Close Preview
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}