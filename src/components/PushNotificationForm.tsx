'use client';
import React, { useState, useEffect } from 'react';
import { Send, Image, Users, Tag, Bell, Loader2, Plus, X, Info, Target, MessageSquare, Settings, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { sendNotification, sendBulkNotification, getNotificationStats } from '@/lib/onesignal-api';
interface NotificationStats {
 total_count: number;
 active_count: number;
 name: string;
}
export default function PushNotificationForm() {
 const [title, setTitle] = useState('');
 const [message, setMessage] = useState('');
 const [imageUrl, setImageUrl] = useState('');
 const [targetType, setTargetType] = useState<'all' | 'role' | 'school' | 'custom'>('all');
 const [targetRole, setTargetRole] = useState('');
 const [schoolId, setSchoolId] = useState('');
 const [customTags, setCustomTags] = useState<Array<{key: string, value: string}>>([]);
 const [actionButtons, setActionButtons] = useState<Array<{id: string, text: string, url?: string}>>([]);
 const [sending, setSending] = useState(false);
 const [stats, setStats] = useState<NotificationStats | null>(null);
 const [loadingStats, setLoadingStats] = useState(false);
 useEffect(() => {
   loadStats();
 }, []);
 const loadStats = async () => {
   setLoadingStats(true);
   try {
     const statsData = await getNotificationStats();
     setStats(statsData);
   } catch (error) {
     console.error('Error loading stats:', error);
   } finally {
     setLoadingStats(false);
   }
 };
 const addCustomTag = () => {
   setCustomTags([...customTags, { key: '', value: '' }]);
 };
 const removeCustomTag = (index: number) => {
   setCustomTags(customTags.filter((_, i) => i !== index));
 };
 const updateCustomTag = (index: number, field: 'key' | 'value', value: string) => {
   const updatedTags = [...customTags];
   updatedTags[index][field] = value;
   setCustomTags(updatedTags);
 };
 const addActionButton = () => {
   setActionButtons([...actionButtons, { id: `btn_${Date.now()}`, text: '', url: '' }]);
 };
 const removeActionButton = (index: number) => {
   setActionButtons(actionButtons.filter((_, i) => i !== index));
 };
 const updateActionButton = (index: number, field: 'text' | 'url', value: string) => {
   const updatedButtons = [...actionButtons];
   updatedButtons[index][field] = value;
   setActionButtons(updatedButtons);
 };
 const sendNotificationHandler = async () => {
   if (!title.trim() || !message.trim()) {
     toast.error('Judul dan pesan harus diisi');
     return;
   }
   setSending(true);
   try {
     let targetTags: Record<string, string> = {};
     // Build target tags based on selection
     if (targetType === 'role' && targetRole) {
       targetTags.user_role = targetRole;
     } else if (targetType === 'school' && schoolId) {
       targetTags.school_id = schoolId;
     } else if (targetType === 'custom') {
       customTags.forEach(tag => {
         if (tag.key && tag.value) {
           targetTags[tag.key] = tag.value;
         }
       });
     }
     const result = await sendNotification(
       message,
       title,
       undefined,
       Object.keys(targetTags).length > 0 ? targetTags : undefined,
       imageUrl || undefined,
       actionButtons.filter(btn => btn.text.trim()).length > 0
         ? actionButtons.filter(btn => btn.text.trim())
         : undefined
     );
     if (result.recipients) {
       toast.success(`Notifikasi berhasil dikirim ke ${result.recipients} pengguna`);
       // Reset form
       setTitle('');
       setMessage('');
       setImageUrl('');
       setCustomTags([]);
       setActionButtons([]);
       loadStats(); // Refresh stats
     } else {
       toast.success('Notifikasi berhasil dikirim');
     }
   } catch (error: any) {
     console.error('Error sending notification:', error);
     toast.error(`Gagal mengirim notifikasi: ${error.message || 'Unknown error'}`);
   } finally {
     setSending(false);
   }
 };
 return (
   <div className="space-y-6">
     {/* Stats Card */}
     <motion.div
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white"
     >
       <div className="flex items-center justify-between">
         <div className="flex items-center space-x-3">
           <div className="bg-white/20 p-3 rounded-lg">
             <BarChart3 className="h-6 w-6" />
           </div>
           <div>
             <h3 className="text-lg font-semibold">Statistik Aplikasi</h3>
             <p className="text-blue-100 text-sm">Data pengguna aplikasi Android</p>
           </div>
         </div>
         {loadingStats ? (
           <Loader2 className="h-5 w-5 animate-spin" />
         ) : stats && (
           <div className="text-right">
             <div className="text-2xl font-bold">{stats.total_count?.toLocaleString() || '0'}</div>
             <div className="text-sm text-blue-100">Total Pengguna</div>
             <div className="text-lg font-semibold">{stats.active_count?.toLocaleString() || '0'}</div>
             <div className="text-xs text-blue-100">Aktif</div>
           </div>
         )}
       </div>
     </motion.div>
     {/* Main Form */}
     <motion.div
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ delay: 0.1 }}
       className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
     >
       <div className="flex items-center mb-6">
         <div className="bg-blue-100 p-3 rounded-lg mr-3">
           <Bell className="h-6 w-6 text-blue-600" />
         </div>
         <div>
           <h2 className="text-xl font-semibold">Kirim Push Notification</h2>
           <p className="text-gray-600 text-sm">Kirim notifikasi ke pengguna aplikasi Android</p>
         </div>
       </div>
       <div className="space-y-6">
         {/* Title */}
         <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">
             <MessageSquare className="inline h-4 w-4 mr-1" />
             Judul Notifikasi
           </label>
           <input
             type="text"
             value={title}
             onChange={(e) => setTitle(e.target.value)}
             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
             placeholder="Masukkan judul notifikasi..."
             maxLength={50}
           />
           <div className="flex justify-between items-center mt-1">
             <p className="text-xs text-gray-500">{title.length}/50 karakter</p>
             {title.length > 40 && (
               <p className="text-xs text-amber-600">Judul terlalu panjang untuk tampilan optimal</p>
             )}
           </div>
         </div>
         {/* Message */}
         <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">
             <MessageSquare className="inline h-4 w-4 mr-1" />
             Pesan
           </label>
           <textarea
             value={message}
             onChange={(e) => setMessage(e.target.value)}
             rows={4}
             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
             placeholder="Tulis pesan notifikasi..."
             maxLength={200}
           />
           <div className="flex justify-between items-center mt-1">
             <p className="text-xs text-gray-500">{message.length}/200 karakter</p>
             {message.length > 150 && (
               <p className="text-xs text-amber-600">Pesan mungkin terpotong pada beberapa perangkat</p>
             )}
           </div>
         </div>
         {/* Image URL */}
         <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">
             <Image className="inline h-4 w-4 mr-1" />
             URL Gambar (Opsional)
           </label>
           <input
             type="url"
             value={imageUrl}
             onChange={(e) => setImageUrl(e.target.value)}
             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
             placeholder="https://example.com/image.jpg"
           />
           <p className="text-xs text-gray-500 mt-1">
             Gambar akan ditampilkan sebagai big picture notification
           </p>
         </div>
         {/* Target Selection */}
         <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">
             <Target className="inline h-4 w-4 mr-1" />
             Target Pengguna
           </label>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
             {[
               { value: 'all', label: 'Semua Pengguna', icon: Users },
               { value: 'role', label: 'Berdasarkan Peran', icon: Tag },
               { value: 'school', label: 'Berdasarkan Sekolah', icon: Settings },
               { value: 'custom', label: 'Custom Tags', icon: Target }
             ].map(({ value, label, icon: Icon }) => (
               <motion.button
                 key={value}
                 type="button"
                 onClick={() => setTargetType(value as any)}
                 whileHover={{ scale: 1.02 }}
                 whileTap={{ scale: 0.98 }}
                 className={`p-3 rounded-lg border-2 transition-all ${
                   targetType === value
                     ? 'border-blue-500 bg-blue-50 text-blue-700'
                     : 'border-gray-200 hover:border-gray-300 text-gray-700'
                 }`}
               >
                 <Icon className="h-5 w-5 mx-auto mb-1" />
                 <div className="text-xs font-medium">{label}</div>
               </motion.button>
             ))}
           </div>
         </div>
         {/* Role Selection */}
         {targetType === 'role' && (
           <motion.div
             initial={{ opacity: 0, height: 0 }}
             animate={{ opacity: 1, height: 'auto' }}
             exit={{ opacity: 0, height: 0 }}
           >
             <label className="block text-sm font-medium text-gray-700 mb-2">
               Pilih Peran
             </label>
             <select
               value={targetRole}
               onChange={(e) => setTargetRole(e.target.value)}
               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
             >
               <option value="">Pilih Peran</option>
               <option value="admin">Administrator</option>
               <option value="teacher">Guru</option>
               <option value="student">Siswa</option>
             </select>
           </motion.div>
         )}
         {/* School Selection */}
         {targetType === 'school' && (
           <motion.div
             initial={{ opacity: 0, height: 0 }}
             animate={{ opacity: 1, height: 'auto' }}
             exit={{ opacity: 0, height: 0 }}
           >
             <label className="block text-sm font-medium text-gray-700 mb-2">
               ID Sekolah
             </label>
             <input
               type="text"
               value={schoolId}
               onChange={(e) => setSchoolId(e.target.value)}
               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
               placeholder="Masukkan ID sekolah"
             />
           </motion.div>
         )}
         {/* Custom Tags */}
         {targetType === 'custom' && (
           <motion.div
             initial={{ opacity: 0, height: 0 }}
             animate={{ opacity: 1, height: 'auto' }}
             exit={{ opacity: 0, height: 0 }}
           >
             <div className="flex items-center justify-between mb-3">
               <label className="block text-sm font-medium text-gray-700">
                 Custom Tags
               </label>
               <button
                 type="button"
                 onClick={addCustomTag}
                 className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
               >
                 <Plus className="h-4 w-4" />
                 Tambah Tag
               </button>
             </div>
             <div className="space-y-3">
               {customTags.map((tag, index) => (
                 <div key={index} className="flex gap-3 items-center">
                   <input
                     type="text"
                     value={tag.key}
                     onChange={(e) => updateCustomTag(index, 'key', e.target.value)}
                     className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                     placeholder="Key"
                   />
                   <input
                     type="text"
                     value={tag.value}
                     onChange={(e) => updateCustomTag(index, 'value', e.target.value)}
                     className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                     placeholder="Value"
                   />
                   <button
                     type="button"
                     onClick={() => removeCustomTag(index)}
                     className="text-red-500 hover:text-red-700"
                   >
                     <X className="h-4 w-4" />
                   </button>
                 </div>
               ))}
             </div>
           </motion.div>
         )}
         {/* Action Buttons */}
         <div>
           <div className="flex items-center justify-between mb-3">
             <label className="block text-sm font-medium text-gray-700">
               Tombol Aksi (Opsional)
             </label>
             <button
               type="button"
               onClick={addActionButton}
               className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
             >
               <Plus className="h-4 w-4" />
               Tambah Tombol
             </button>
           </div>
           <div className="space-y-3">
             {actionButtons.map((button, index) => (
               <div key={index} className="flex gap-3 items-center">
                 <input
                   type="text"
                   value={button.text}
                   onChange={(e) => updateActionButton(index, 'text', e.target.value)}
                   className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                   placeholder="Teks tombol"
                 />
                 <input
                   type="url"
                   value={button.url || ''}
                   onChange={(e) => updateActionButton(index, 'url', e.target.value)}
                   className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                   placeholder="URL (opsional)"
                 />
                 <button
                   type="button"
                   onClick={() => removeActionButton(index)}
                   className="text-red-500 hover:text-red-700"
                 >
                   <X className="h-4 w-4" />
                 </button>
               </div>
             ))}
           </div>
         </div>
       </div>
       {/* Send Button */}
       <div className="mt-8">
         <motion.button
           onClick={sendNotificationHandler}
           disabled={sending || !title.trim() || !message.trim()}
           className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
           whileHover={{ scale: sending ? 1 : 1.02 }}
           whileTap={{ scale: sending ? 1 : 0.98 }}
         >
           <div className="flex items-center justify-center space-x-2">
             {sending ? (
               <Loader2 className="h-5 w-5 animate-spin" />
             ) : (
               <Send className="h-5 w-5" />
             )}
             <span>{sending ? 'Mengirim...' : 'Kirim Notifikasi'}</span>
           </div>
         </motion.button>
       </div>
       {/* Instructions */}
       <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
         <div className="flex items-start space-x-3">
           <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
           <div>
             <h4 className="font-medium text-blue-800 mb-2">Panduan Penggunaan:</h4>
             <ul className="text-sm text-blue-700 space-y-1">
               <li>• Judul maksimal 50 karakter untuk tampilan optimal</li>
               <li>• Pesan maksimal 200 karakter</li>
               <li>• Gambar akan ditampilkan sebagai big picture notification</li>
               <li>• Custom tags berguna untuk targeting spesifik</li>
               <li>• Tombol aksi akan muncul di notifikasi (maksimal 3 tombol)</li>
               <li>• Notifikasi akan dikirim ke semua perangkat yang berlangganan</li>
             </ul>
           </div>
         </div>
       </div>
     </motion.div>
   </div>
 );
}