'use client';
import React, { useState, useEffect } from 'react';
import { Users, Send, Eye, TrendingUp, Smartphone, Globe, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
interface NotificationStatsData {
 totalSubscribers: number;
 totalSent: number;
 deliveryRate: number;
 clickRate: number;
 recentNotifications: Array<{
   id: string;
   title: string;
   sent: number;
   delivered: number;
   clicked: number;
   timestamp: string;
 }>;
}
export default function NotificationStats() {
 const [stats, setStats] = useState<NotificationStatsData>({
   totalSubscribers: 0,
   totalSent: 0,
   deliveryRate: 0,
   clickRate: 0,
   recentNotifications: []
 });
 const [loading, setLoading] = useState(true);
 useEffect(() => {
   // Simulate loading stats from OneSignal API
   const loadStats = async () => {
     try {
       // This would be replaced with actual OneSignal API calls
       await new Promise(resolve => setTimeout(resolve, 1000));
   setStats({
     totalSubscribers: 1247,
     totalSent: 156,
     deliveryRate: 92.5,
     clickRate: 15.8,
     recentNotifications: [
       {
         id: '1',
         title: 'Pengumuman Penting Sekolah',
         sent: 1200,
         delivered: 1150,
         clicked: 180,
         timestamp: '2024-06-10T10:30:00Z'
       },
       {
         id: '2',
         title: 'Reminder Absensi Siswa',
         sent: 950,
         delivered: 920,
         clicked: 95,
         timestamp: '2024-06-09T08:15:00Z'
       },
       {
         id: '3',
         title: 'Update Jadwal Pelajaran',
         sent: 800,
         delivered: 785,
         clicked: 120,
         timestamp: '2024-06-08T14:20:00Z'
       }
     ]
   });
 } catch (error) {
   console.error('Error loading stats:', error);
 } finally {
   setLoading(false);
 }

};
loadStats();
}, []);
const formatDate = (timestamp: string) => {
return new Date(timestamp).toLocaleDateString('id-ID', {
day: 'numeric',
month: 'long',
year: 'numeric',
hour: '2-digit',
minute: '2-digit'
});
};
if (loading) {
return (
<div className="animate-pulse space-y-6">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
{[...Array(4)].map((_, i) => (
<div key={i} className="bg-gray-200 h-32 rounded-xl"></div>
))}
</div>
<div className="bg-gray-200 h-64 rounded-xl"></div>
</div>
);
}
return (


   <div className="space-y-6">
     {/* Stats Cards */}
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.1 }}
         className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white"
       >
         <div className="flex items-center justify-between">
           <div>
             <p className="text-blue-100 text-sm font-medium">Total Subscribers</p>
             <p className="text-3xl font-bold">{stats.totalSubscribers.toLocaleString()}</p>
           </div>
           <div className="bg-blue-400 bg-opacity-30 p-3 rounded-lg">
             <Smartphone className="h-8 w-8 text-white" />
           </div>
         </div>
         <div className="flex items-center mt-4 text-blue-100">
           <TrendingUp className="h-4 w-4 mr-1" />
           <span className="text-sm">+12% dari bulan lalu</span>
         </div>
       </motion.div>
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.2 }}
         className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white"
       >
         <div className="flex items-center justify-between">
           <div>
             <p className="text-green-100 text-sm font-medium">Total Terkirim</p>
             <p className="text-3xl font-bold">{stats.totalSent}</p>
           </div>
           <div className="bg-green-400 bg-opacity-30 p-3 rounded-lg">
             <Send className="h-8 w-8 text-white" />
           </div>
         </div>
         <div className="flex items-center mt-4 text-green-100">
           <Clock className="h-4 w-4 mr-1" />
           <span className="text-sm">Bulan ini</span>
         </div>
       </motion.div>
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.3 }}
         className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white"
       >
         <div className="flex items-center justify-between">
           <div>
             <p className="text-purple-100 text-sm font-medium">Delivery Rate</p>
             <p className="text-3xl font-bold">{stats.deliveryRate}%</p>
           </div>
           <div className="bg-purple-400 bg-opacity-30 p-3 rounded-lg">
             <CheckCircle className="h-8 w-8 text-white" />
           </div>
         </div>
         <div className="flex items-center mt-4 text-purple-100">
           <TrendingUp className="h-4 w-4 mr-1" />
           <span className="text-sm">Rata-rata delivery</span>
         </div>
       </motion.div>
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.4 }}
         className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white"
       >
         <div className="flex items-center justify-between">
           <div>
             <p className="text-orange-100 text-sm font-medium">Click Rate</p>
             <p className="text-3xl font-bold">{stats.clickRate}%</p>
           </div>
           <div className="bg-orange-400 bg-opacity-30 p-3 rounded-lg">
             <Eye className="h-8 w-8 text-white" />
           </div>
         </div>
         <div className="flex items-center mt-4 text-orange-100">
           <Globe className="h-4 w-4 mr-1" />
           <span className="text-sm">Engagement rate</span>
         </div>
       </motion.div>
     </div>
     {/* Recent Notifications */}
     <motion.div
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ delay: 0.5 }}
       className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
     >
       <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4">
         <h3 className="text-lg font-semibold text-white">Riwayat Notifikasi Terakhir</h3>
       </div>
   <div className="overflow-x-auto">
     <table className="w-full">
       <thead className="bg-gray-50">
         <tr>
           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
             Judul
           </th>
           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
             Terkirim
           </th>
           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
             Delivered
           </th>
           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
             Clicked
           </th>
           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
             Waktu
           </th>
         </tr>
       </thead>
       <tbody className="divide-y divide-gray-200">
         {stats.recentNotifications.map((notification, index) => (
           <motion.tr
             key={notification.id}
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.6 + index * 0.1 }}
             className="hover:bg-gray-50"
           >
             <td className="px-6 py-4 whitespace-nowrap">
               <div className="text-sm font-medium text-gray-900">
                 {notification.title}
               </div>
             </td>
             <td className="px-6 py-4 whitespace-nowrap">
               <div className="text-sm text-gray-900">{notification.sent.toLocaleString()}</div>
             </td>
             <td className="px-6 py-4 whitespace-nowrap">
               <div className="text-sm text-gray-900">{notification.delivered.toLocaleString()}</div>
               <div className="text-xs text-gray-500">
                 {((notification.delivered / notification.sent) * 100).toFixed(1)}%
               </div>
             </td>
             <td className="px-6 py-4 whitespace-nowrap">
               <div className="text-sm text-gray-900">{notification.clicked.toLocaleString()}</div>
               <div className="text-xs text-gray-500">
                 {((notification.clicked / notification.delivered) * 100).toFixed(1)}%
               </div>
             </td>
             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
               {formatDate(notification.timestamp)}
             </td>
           </motion.tr>
         ))}
       </tbody>
     </table>
   </div>
 </motion.div>

   </div>
 );
}