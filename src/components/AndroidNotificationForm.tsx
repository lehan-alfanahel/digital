'use client';
import React, { useState } from 'react';
import { Send, Smartphone, Users, Settings, Image, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
interface NotificationData {
title: string;
message: string;
url?: string;
imageUrl?: string;
targetSegment: string;
scheduledTime?: string;
actionButtons: Array<{
id: string;
text: string;
url: string;
}>;
}
export default function AndroidNotificationForm() {
const [formData, setFormData] = useState<NotificationData>({
title: '',
message: '',
url: '',
imageUrl: '',
targetSegment: 'All',
scheduledTime: '',
actionButtons: []
});


const [isLoading, setIsLoading] = useState(false);
const [showAdvanced, setShowAdvanced] = useState(false);
const [previewMode, setPreviewMode] = useState(false);
const handleInputChange = (field: keyof NotificationData, value: string) => {
setFormData(prev => ({
...prev,
[field]: value
}));
};
const addActionButton = () => {
if (formData.actionButtons.length < 3) {
setFormData(prev => ({
...prev,
actionButtons: [...prev.actionButtons, { id: btn_${Date.now()}, text: '', url: '' }]
}));
}
};
const removeActionButton = (index: number) => {
setFormData(prev => ({
...prev,
actionButtons: prev.actionButtons.filter((_, i) => i !== index)
}));
};
const updateActionButton = (index: number, field: 'text' | 'url', value: string) => {
setFormData(prev => ({
...prev,
actionButtons: prev.actionButtons.map((btn, i) =>
i === index ? { ...btn, [field]: value } : btn
)
}));
};
const sendNotification = async () => {
if (!formData.title.trim() || !formData.message.trim()) {
toast.error('Judul dan pesan harus diisi');
return;
}
setIsLoading(true);
try {
const response = await fetch('/api/send-notification', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
},
body: JSON.stringify({
title: formData.title,
message: formData.message,
url: formData.url,
imageUrl: formData.imageUrl,
targetSegment: formData.targetSegment,
actionButtons: formData.actionButtons.filter(btn => btn.text && btn.url),
scheduledTime: formData.scheduledTime
}),
});
const result = await response.json();


 if (result.success) {
   toast.success(`Notifikasi berhasil dikirim ke ${result.recipients || 0} pengguna`);
   // Reset form
   setFormData({
     title: '',
     message: '',
     url: '',
     imageUrl: '',
     targetSegment: 'All',
     scheduledTime: '',
     actionButtons: []
   });
 } else {
   toast.error(result.error || 'Gagal mengirim notifikasi');
 }

} catch (error) {
console.error('Error sending notification:', error);
toast.error('Terjadi kesalahan saat mengirim notifikasi');
} finally {
setIsLoading(false);
}
};
return (


   <div className="space-y-6">
     {/* Notification Form */}
     <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
       <div className="bg-gradient-to-r from-green-600 to-blue-600 px-6 py-4">
         <div className="flex items-center space-x-3">
           <div className="bg-white/20 p-2 rounded-lg">
             <Smartphone className="h-6 w-6 text-white" />
           </div>
           <div>
             <h2 className="text-xl font-semibold text-white">Kirim Push Notification</h2>
             <p className="text-blue-100 text-sm">Kirim notifikasi ke pengguna aplikasi Android</p>
           </div>
         </div>
       </div>
       <div className="p-6 space-y-6">
         {/* Basic Information */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <div className="space-y-4">
             <div>
               <label className="block text-sm font-semibold text-gray-700 mb-2">
                 Judul Notifikasi *
               </label>
               <input
                 type="text"
                 value={formData.title}
                 onChange={(e) => handleInputChange('title', e.target.value)}
                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                 placeholder="Masukkan judul notifikasi..."
                 maxLength={65}
               />
               <p className="text-xs text-gray-500 mt-1">{formData.title.length}/65 karakter</p>
             </div>
             <div>
               <label className="block text-sm font-semibold text-gray-700 mb-2">
                 Pesan Notifikasi *
               </label>
               <textarea
                 value={formData.message}
                 onChange={(e) => handleInputChange('message', e.target.value)}
                 rows={4}
                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                 placeholder="Masukkan pesan notifikasi..."
                 maxLength={240}
               />
               <p className="text-xs text-gray-500 mt-1">{formData.message.length}/240 karakter</p>
             </div>
           </div>
           {/* Preview */}
           <div>
             <label className="block text-sm font-semibold text-gray-700 mb-2">
               Preview Notifikasi
             </label>
             <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
               <div className="bg-white rounded-lg shadow-md p-4 max-w-sm">
                 <div className="flex items-start space-x-3">
                   <div className="flex-shrink-0">
                     <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                       <Smartphone className="w-4 h-4 text-white" />
                     </div>
                   </div>
                   <div className="flex-1 min-w-0">
                     <p className="text-sm font-semibold text-gray-900 truncate">
                       {formData.title || 'Judul Notifikasi'}
                     </p>
                     <p className="text-xs text-gray-600 mt-1">
                       {formData.message || 'Pesan notifikasi akan ditampilkan di sini...'}
                     </p>
                     {formData.imageUrl && (
                       <div className="mt-2">
                         <img
                           src={formData.imageUrl}
                           alt="Preview"
                           className="w-full h-20 object-cover rounded"
                           onError={(e) => {
                             e.currentTarget.style.display = 'none';
                           }}
                         />
                       </div>
                     )}
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </div>
         {/* Target Audience */}
         <div>
           <label className="block text-sm font-semibold text-gray-700 mb-2">
             Target Pengguna
           </label>
           <select
             value={formData.targetSegment}
             onChange={(e) => handleInputChange('targetSegment', e.target.value)}
             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
           >
             <option value="All">Semua Pengguna</option>
             <option value="Active Users">Pengguna Aktif</option>
             <option value="Engaged Users">Pengguna Terlibat</option>
             <option value="Inactive Users">Pengguna Tidak Aktif</option>
           </select>
         </div>
         {/* Advanced Options */}
         <div>
           <button
             type="button"
             onClick={() => setShowAdvanced(!showAdvanced)}
             className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
           >
             <Settings className="w-4 h-4" />
             <span>Pengaturan Lanjutan</span>
             <motion.div
               animate={{ rotate: showAdvanced ? 180 : 0 }}
               transition={{ duration: 0.2 }}
             >
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
               </svg>
             </motion.div>
           </button>
           <AnimatePresence>
             {showAdvanced && (
               <motion.div
                 initial={{ opacity: 0, height: 0 }}
                 animate={{ opacity: 1, height: 'auto' }}
                 exit={{ opacity: 0, height: 0 }}
                 transition={{ duration: 0.3 }}
                 className="mt-4 space-y-4 border-t pt-4"
               >
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       URL Tujuan (Opsional)
                     </label>
                     <input
                       type="url"
                       value={formData.url}
                       onChange={(e) => handleInputChange('url', e.target.value)}
                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       placeholder="https://example.com"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       URL Gambar (Opsional)
                     </label>
                     <input
                       type="url"
                       value={formData.imageUrl}
                       onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       placeholder="https://example.com/image.jpg"
                     />
                   </div>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Jadwal Pengiriman (Opsional)
                   </label>
                   <input
                     type="datetime-local"
                     value={formData.scheduledTime}
                     onChange={(e) => handleInputChange('scheduledTime', e.target.value)}
                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                   />
                 </div>
                 {/* Action Buttons */}
                 <div>
                   <div className="flex items-center justify-between mb-2">
                     <label className="block text-sm font-medium text-gray-700">
                       Tombol Aksi (Maksimal 3)
                     </label>
                     <button
                       type="button"
                       onClick={addActionButton}
                       disabled={formData.actionButtons.length >= 3}
                       className="text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400"
                     >
                       + Tambah Tombol
                     </button>
                   </div>
               <div className="space-y-2">
                 {formData.actionButtons.map((button, index) => (
                   <div key={button.id} className="flex space-x-2">
                     <input
                       type="text"
                       value={button.text}
                       onChange={(e) => updateActionButton(index, 'text', e.target.value)}
                       placeholder="Teks tombol"
                       className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     />
                     <input
                       type="url"
                       value={button.url}
                       onChange={(e) => updateActionButton(index, 'url', e.target.value)}
                       placeholder="URL tombol"
                       className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     />
                     <button
                       type="button"
                       onClick={() => removeActionButton(index)}
                       className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                     >
                       ×
                     </button>
                   </div>
                 ))}
               </div>
             </div>
           </motion.div>
         )}
       </AnimatePresence>
     </div>
     {/* Send Button */}
     <div className="flex justify-end pt-4 border-t">
       <button
         onClick={sendNotification}
         disabled={isLoading || !formData.title.trim() || !formData.message.trim()}
         className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
       >
         {isLoading ? (
           <>
             <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
             <span>Mengirim...</span>
           </>
         ) : (
           <>
             <Send className="w-5 h-5" />
             <span>Kirim Notifikasi</span>
           </>
         )}
       </button>
     </div>
   </div>
 </div>

   </div>
 );
}
