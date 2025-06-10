"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Info, Bell, Users, Send, BarChart3, Settings, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import Link from "next/link";
import PushNotificationForm from "@/components/PushNotificationForm";
export default function InformasiPage() {
 const { user, userRole } = useAuth();
 const router = useRouter();
 const [loading, setLoading] = useState(true);
 const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
 const [appStats, setAppStats] = useState<any>(null);
 // Check OneSignal connection status
 const checkConnection = async () => {
   try {
     const response = await fetch('/api/onesignal?action=app_stats');
     const result = await response.json();
 if (result.success) {
   setConnectionStatus('connected');
   setAppStats(result.data);
 } else {
   setConnectionStatus('disconnected');
 }

} catch (error) {
console.error('Connection check error:', error);
setConnectionStatus('disconnected');
}
};
// Check if user has super admin access
useEffect(() => {
const checkSuperAdminAccess = () => {
// Only specific emails can access this page
const superAdminEmails = ["lehan.virtual@gmail.com", "alfanahel@gmail.com", "admin@alfanahel.com"];
if (!user || !superAdminEmails.includes(user.email || "")) {
toast.error("Akses ditolak. Anda tidak memiliki izin Super Admin.");
router.push("/dashboard");
return;
}
setLoading(false);
checkConnection();
};
if (user !== null) {
checkSuperAdminAccess();
}
}, [user, router]);
if (loading) {
return (
<div className="flex justify-center items-center h-screen">
<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
</div>
);
}
return (


   <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-6">
     {/* Header */}
     <div className="bg-white border-b border-gray-200 shadow-sm">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
         <div className="flex items-center justify-between">
           <div className="flex items-center space-x-3">
             <Link
               href="/dashboard/alfanahel"
               className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
             >
               <ArrowLeft className="h-6 w-6 text-gray-600" />
             </Link>
             <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-lg">
               <Info className="h-8 w-8 text-white" />
             </div>
             <div>
               <h1 className="text-3xl font-bold text-gray-900">Informasi & Notifikasi</h1>
               <p className="text-gray-600 mt-1">Panel kontrol untuk mengirim push notification</p>
             </div>
           </div>
           <div className={`hidden md:flex items-center space-x-2 px-4 py-2 rounded-lg border ${
             connectionStatus === 'connected'
               ? 'bg-gradient-to-r from-green-50 to-blue-50 border-green-200'
               : connectionStatus === 'disconnected'
               ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200'
               : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
           }`}>
             <div className={`w-3 h-3 rounded-full ${
               connectionStatus === 'connected'
                 ? 'bg-green-500 animate-pulse'
                 : connectionStatus === 'disconnected'
                 ? 'bg-red-500'
                 : 'bg-gray-400 animate-pulse'
             }`}></div>
             <span className={`font-medium ${
               connectionStatus === 'connected'
                 ? 'text-green-700'
                 : connectionStatus === 'disconnected'
                 ? 'text-red-700'
                 : 'text-gray-700'
             }`}>
               {connectionStatus === 'connected' ? 'OneSignal Connected' :
                connectionStatus === 'disconnected' ? 'Connection Failed' :
                'Checking Connection...'}
             </span>
           </div>
         </div>
       </div>
     </div>
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       {/* Info Cards */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg"
         >
           <div className="flex items-center justify-between">
             <div>
               <p className="text-blue-100 text-sm font-medium">OneSignal App ID</p>
               <p className="text-lg font-bold">c8ac779e-241b-4903-8ed4-6766936a4fee</p>
             </div>
             <Settings className="h-10 w-10 text-blue-200" />
           </div>
         </motion.div>
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
           className={`bg-gradient-to-r rounded-xl p-6 text-white shadow-lg ${
             connectionStatus === 'connected'
               ? 'from-green-500 to-green-600'
               : 'from-red-500 to-red-600'
           }`}
         >
           <div className="flex items-center justify-between">
             <div>
               <p className={`text-sm font-medium ${
                 connectionStatus === 'connected' ? 'text-green-100' : 'text-red-100'
               }`}>Status Koneksi</p>
               <p className="text-lg font-bold">
                 {connectionStatus === 'connected' ? 'Terhubung' : 'Terputus'}
               </p>
             </div>
             {connectionStatus === 'connected' ? (
               <CheckCircle className="h-10 w-10 text-green-200" />
             ) : (
               <AlertCircle className="h-10 w-10 text-red-200" />
             )}
           </div>
         </motion.div>
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2 }}
           className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg"
         >
           <div className="flex items-center justify-between">
             <div>
               <p className="text-purple-100 text-sm font-medium">Total Devices</p>
               <p className="text-lg font-bold">{appStats?.players || 0}</p>
             </div>
             <Users className="h-10 w-10 text-purple-200" />
           </div>
         </motion.div>
       </div>
       {/* Main Content */}
       <div className="grid grid-cols-1 gap-8">
         {/* Push Notification Form */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.3 }}
         >
           <PushNotificationForm />
         </motion.div>
         {/* Additional Information */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.4 }}
           className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
         >
           <div className="flex items-center mb-4">
             <div className="bg-amber-100 p-3 rounded-lg mr-3">
               <BarChart3 className="h-6 w-6 text-amber-600" />
             </div>
             <div>
               <h3 className="text-lg font-semibold">Informasi Sistem</h3>
               <p className="text-gray-600 text-sm">Detail konfigurasi OneSignal</p>
             </div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-4">
               <div>
                 <h4 className="font-medium text-gray-800 mb-2">Konfigurasi OneSignal</h4>
                 <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                   <div className="flex justify-between">
                     <span className="text-sm text-gray-600">App ID:</span>
                     <span className="text-sm font-mono text-gray-800">c8ac779e-241b-4903-8ed4-6766936a4fee</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-sm text-gray-600">API Key:</span>
                     <span className="text-sm font-mono text-gray-800">os_v2_app_zc...2ui</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-sm text-gray-600">Platform:</span>
                     <span className="text-sm text-gray-800">Android WebView</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-sm text-gray-600">Status:</span>
                     <span className={`text-sm font-medium ${
                       connectionStatus === 'connected' ? 'text-green-600' : 'text-red-600'
                     }`}>
                       {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
                     </span>
                   </div>
                 </div>
               </div>
             </div>
             <div className="space-y-4">
               <div>
                 <h4 className="font-medium text-gray-800 mb-2">Fitur Notifikasi</h4>
                 <div className="space-y-2">
                   <div className="flex items-center text-sm text-gray-600">
                     <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                     Push Notification
                   </div>
                   <div className="flex items-center text-sm text-gray-600">
                     <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                     Big Picture Notification
                   </div>
                   <div className="flex items-center text-sm text-gray-600">
                     <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                     Action Buttons
                   </div>
                   <div className="flex items-center text-sm text-gray-600">
                     <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                     Custom Targeting
                   </div>
                   <div className="flex items-center text-sm text-gray-600">
                     <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                     Server-side Proxy
                   </div>
                 </div>
               </div>
             </div>
           </div>
           {/* Connection Test Button */}
           <div className="mt-6 pt-4 border-t border-gray-200">
             <button
               onClick={checkConnection}
               className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
             >
               <Settings className="h-4 w-4" />
               <span>Test Connection</span>
             </button>
           </div>
         </motion.div>
       </div>
     </div>
   </div>
 );
}
