"use client";
import React, { useState, useEffect } from 'react';
import { Send, Image, Users, Settings, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
interface NotificationStats {
total_count: number;
successful: number;
failed: number;
errored: number;
}
export default function PushNotificationForm() {
const [title, setTitle] = useState('');
const [message, setMessage] = useState('');
const [imageUrl, setImageUrl] = useState('');
const [actionUrl, setActionUrl] = useState('');
const [sending, setSending] = useState(false);
const [stats, setStats] = useState<NotificationStats | null>(null);
const [loadingStats, setLoadingStats] = useState(false);
// Load OneSignal stats
const loadStats = async () => {
setLoadingStats(true);
try {
const response = await fetch('/api/onesignal?action=app_stats');
const result = await response.json();
if (result.success) {
setStats({
total_count: result.data.players || 0,
successful: 0,
failed: 0,
errored: 0
});
}
} catch (error) {
console.error('Error loading stats:', error);
} finally {
setLoadingStats(false);
}
};
// Send notification
const sendNotification = async () => {
if (!title.trim() || !message.trim()) {
toast.error('Judul dan pesan harus diisi');
return;
}
setSending(true);
try {
const notificationData = {
title,
message,
...(imageUrl && { big_picture: imageUrl }),
...(actionUrl && { url: actionUrl }),
};
const response = await fetch('/api/onesignal', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
},
body: JSON.stringify({
action: 'send_notification',
data: notificationData,
}),
});
const result = await response.json();
if (result.success) {
toast.success('Notifikasi berhasil dikirim!');
setTitle('');
setMessage('');
setImageUrl('');
setActionUrl('');
loadStats(); // Refresh stats
} else {
throw new Error(result.error?.errors?.[0] || 'Gagal mengirim notifikasi');
}
} catch (error) {
console.error('Error sending notification:', error);
toast.error(Gagal mengirim notifikasi: ${error});
} finally {
setSending(false);
}
};
useEffect(() => {
loadStats();
}, []);
return (


   <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
     {/* Header */}
     <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
       <div className="flex items-center justify-between">
         <div className="flex items-center space-x-3">
           <Send className="h-6 w-6 text-white" />
           <h2 className="text-xl font-semibold text-white">Kirim Push Notification</h2>
         </div>
         <button
           onClick={loadStats}
           disabled={loadingStats}
           className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-medium hover:bg-white/30 transition-colors flex items-center space-x-2"
         >
           {loadingStats ? (
             <Loader2 className="h-4 w-4 animate-spin" />
           ) : (
             <Settings className="h-4 w-4" />
           )}
           <span>Refresh Stats</span>
         </button>
       </div>
     </div>
     <div className="p-6">
       {/* Stats Cards */}
       {stats && (
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="bg-blue-50 rounded-lg p-4 border border-blue-200"
           >
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-blue-600 text-sm font-medium">Total Devices</p>
                 <p className="text-2xl font-bold text-blue-800">{stats.total_count}</p>
               </div>
               <Users className="h-8 w-8 text-blue-400" />
             </div>
           </motion.div>
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="bg-green-50 rounded-lg p-4 border border-green-200"
           >
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-green-600 text-sm font-medium">Successful</p>
                 <p className="text-2xl font-bold text-green-800">{stats.successful}</p>
               </div>
               <CheckCircle className="h-8 w-8 text-green-400" />
             </div>
           </motion.div>
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="bg-red-50 rounded-lg p-4 border border-red-200"
           >
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-red-600 text-sm font-medium">Failed</p>
                 <p className="text-2xl font-bold text-red-800">{stats.failed}</p>
               </div>
               <AlertCircle className="h-8 w-8 text-red-400" />
             </div>
           </motion.div>
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3 }}
             className="bg-amber-50 rounded-lg p-4 border border-amber-200"
           >
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-amber-600 text-sm font-medium">Errored</p>
                 <p className="text-2xl font-bold text-amber-800">{stats.errored}</p>
               </div>
               <AlertCircle className="h-8 w-8 text-amber-400" />
             </div>
           </motion.div>
         </div>
       )}
       {/* Notification Form */}
       <div className="space-y-6">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">
               Judul Notifikasi *
             </label>
             <input
               type="text"
               value={title}
               onChange={(e) => setTitle(e.target.value)}
               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
               placeholder="Masukkan judul notifikasi"
               maxLength={50}
             />
             <p className="text-xs text-gray-500 mt-1">{title.length}/50 karakter</p>
           </div>
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">
               URL Gambar (Opsional)
             </label>
             <div className="relative">
               <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
               <input
                 type="url"
                 value={imageUrl}
                 onChange={(e) => setImageUrl(e.target.value)}
                 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 placeholder="https://example.com/image.jpg"
               />
             </div>
           </div>
         </div>
         <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">
             Pesan Notifikasi *
           </label>
           <textarea
             value={message}
             onChange={(e) => setMessage(e.target.value)}
             rows={4}
             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
             placeholder="Masukkan pesan notifikasi yang ingin dikirim..."
             maxLength={200}
           />
           <p className="text-xs text-gray-500 mt-1">{message.length}/200 karakter</p>
         </div>
         <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">
             URL Action (Opsional)
           </label>
           <input
             type="url"
             value={actionUrl}
             onChange={(e) => setActionUrl(e.target.value)}
             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
             placeholder="https://example.com/action"
           />
           <p className="text-xs text-gray-500 mt-1">URL yang akan dibuka saat notifikasi diklik</p>
         </div>
         {/* Preview */}
         {(title || message) && (
           <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
             <h4 className="text-sm font-medium text-gray-700 mb-3">Preview Notifikasi:</h4>
             <div className="bg-white rounded-lg p-4 shadow-sm border max-w-sm">
               <div className="flex items-start space-x-3">
                 <div className="bg-blue-500 rounded-full p-2">
                   <Send className="h-4 w-4 text-white" />
                 </div>
                 <div className="flex-1">
                   <h5 className="font-medium text-gray-900 text-sm">{title || 'Judul Notifikasi'}</h5>
                   <p className="text-gray-600 text-sm mt-1">{message || 'Pesan notifikasi'}</p>
                   {imageUrl && (
                     <div className="mt-2">
                       <img
                         src={imageUrl}
                         alt="Preview"
                         className="rounded-lg max-w-full h-20 object-cover"
                         onError={(e) => {
                           (e.target as HTMLImageElement).style.display = 'none';
                         }}
                       />
                     </div>
                   )}
                 </div>
               </div>
             </div>
           </div>
         )}
         {/* Send Button */}
         <div className="flex justify-end">
           <motion.button
             onClick={sendNotification}
             disabled={sending || !title.trim() || !message.trim()}
             className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
             whileHover={{ scale: 1.02 }}
             whileTap={{ scale: 0.98 }}
           >
             {sending ? (
               <Loader2 className="h-5 w-5 animate-spin" />
             ) : (
               <Send className="h-5 w-5" />
             )}
             <span>{sending ? 'Mengirim...' : 'Kirim Notifikasi'}</span>
           </motion.button>
         </div>
       </div>
     </div>
   </div>
 );
}
