'use client';
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Smartphone, BarChart3, Send, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import AndroidNotificationForm from '@/components/AndroidNotificationForm';
import NotificationStats from '@/components/NotificationStats';
export default function AndroidNotificationsPage() {
 const { userRole } = useAuth();
 const [activeTab, setActiveTab] = useState<'send' | 'stats' | 'settings'>('send');
 // Redirect if not admin
 if (userRole !== 'admin') {
   return (
     <div className="flex items-center justify-center h-64">
       <div className="text-center">
         <h2 className="text-xl font-semibold text-gray-800 mb-2">Akses Ditolak</h2>
         <p className="text-gray-600">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
       </div>
     </div>
   );
 }
 const tabs = [
   { id: 'send', label: 'Kirim Notifikasi', icon: Send },
   { id: 'stats', label: 'Statistik', icon: BarChart3 },
   { id: 'settings', label: 'Pengaturan', icon: Settings }
 ];
 return (
   <div className="space-y-6">
     {/* Header */}
     <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 rounded-xl p-6 text-white">
       <div className="flex items-center space-x-4">
         <div className="bg-white/20 p-3 rounded-full">
           <Smartphone className="h-8 w-8 text-white" />
         </div>
         <div>
           <h1 className="text-3xl font-bold">PESAN ANDROID</h1>
           <p className="text-blue-100 mt-1">
             Kelola dan kirim push notification ke pengguna aplikasi Android
           </p>
         </div>
       </div>
   {/* OneSignal Info */}
   <div className="mt-4 bg-white/10 rounded-lg p-4">
     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
       <div>
         <span className="text-blue-200">OneSignal App ID:</span>
         <p className="font-mono text-white">c8ac779e-241b-4903-8ed4-6766936a4fee</p>
       </div>
       <div>
         <span className="text-blue-200">Status:</span>
         <p className="flex items-center">
           <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
           Terhubung
         </p>
       </div>
       <div>
         <span className="text-blue-200">Platform:</span>
         <p>Android WebView</p>
       </div>
     </div>
   </div>
 </div>
 {/* Navigation Tabs */}
 <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
   <div className="border-b border-gray-200">
     <nav className="flex space-x-0">
       {tabs.map((tab) => {
         const Icon = tab.icon;
         return (
           <button
             key={tab.id}
             onClick={() => setActiveTab(tab.id as 'send' | 'stats' | 'settings')}
             className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-all ${
               activeTab === tab.id
                 ? 'border-blue-500 text-blue-600 bg-blue-50'
                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
             }`}
           >
             <Icon className="w-5 h-5" />
             <span>{tab.label}</span>
           </button>
         );
       })}
     </nav>
   </div>
   <div className="p-6">
     {/* Tab Content */}
     <motion.div
       key={activeTab}
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.3 }}
     >
       {activeTab === 'send' && <AndroidNotificationForm />}
       {activeTab === 'stats' && <NotificationStats />}
       {activeTab === 'settings' && (
         <div className="space-y-6">
           <div className="bg-gray-50 rounded-lg p-6">
             <h3 className="text-lg font-semibold text-gray-800 mb-4">Konfigurasi OneSignal</h3>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   App ID
                 </label>
                 <input
                   type="text"
                   value="c8ac779e-241b-4903-8ed4-6766936a4fee"
                   readOnly
                   className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 font-mono text-sm"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   API Key
                 </label>
                 <input
                   type="password"
                   value="os_v2_app_zcwhphredneqhdwum5tjg2sp5zlobxnaq2oegheswznxni45eipldyel2hh5hbjrqctcbv2oy6fjs66u26ywel323msitf4r5l2u2ui"
                   readOnly
                   className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 font-mono text-sm"
                 />
               </div>
             </div>
           </div>
           <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
             <div className="flex">
               <div className="flex-shrink-0">
                 <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                   <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                 </svg>
               </div>
               <div className="ml-3">
                 <h3 className="text-sm font-medium text-yellow-800">
                   Pengaturan OneSignal
                 </h3>
                 <p className="mt-1 text-sm text-yellow-700">
                   Kredensial OneSignal sudah dikonfigurasi dan tidak dapat diubah melalui interface ini.
                   Hubungi developer untuk mengubah konfigurasi.
                 </p>
               </div>
             </div>
           </div>
         </div>
       )}
     </motion.div>
   </div>
 </div>

   </div>
 );
}