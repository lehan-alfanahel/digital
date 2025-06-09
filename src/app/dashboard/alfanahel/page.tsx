"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Users, Settings, Bell, Shield, Calendar, AlertTriangle, Info, Send } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import Link from "next/link";
import SuperAdminTable from "@/components/SuperAdminTable";
import AnnouncementForm from "@/components/AnnouncementForm";
export default function AlfanahelSuperAdmin() {
 const { user, userRole } = useAuth();
 const router = useRouter();
 const [loading, setLoading] = useState(true);
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
   };
   if (user !== null) {
     checkSuperAdminAccess();
   }
 }, [user, router]);
 if (loading) {
   return (
     <div className="flex justify-center items-center h-screen">
       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
     </div>
   );
 }
 return (
   <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-20 md:pb-6">
     {/* Header */}
     <div className="bg-white border-b border-gray-200 shadow-sm">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
         <div className="flex items-center justify-between">
           <div className="flex items-center space-x-3">
             <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-lg">
               <Shield className="h-8 w-8 text-white" />
             </div>
             <div>
               <h1 className="text-3xl font-bold text-gray-900">Alfanahel Super Admin</h1>
               <p className="text-gray-600 mt-1">Panel kontrol untuk manajemen sistem</p>
             </div>
           </div>
           <div className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-green-50 to-blue-50 px-4 py-2 rounded-lg border border-green-200">
             <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
             <span className="text-green-700 font-medium">Sistem Aktif</span>
           </div>
         </div>
       </div>
     </div>
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       {/* Navigation Cards */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           whileHover={{ scale: 1.02 }}
           className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
         >
           <Link href="/dashboard/alfanahel/informasi" className="block p-6 hover:bg-gray-50 transition-colors">
             <div className="flex items-center space-x-4">
               <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-xl">
                 <Info className="h-8 w-8 text-white" />
               </div>
               <div className="flex-1">
                 <h3 className="text-xl font-bold text-gray-900 mb-2">INFORMASI</h3>
                 <p className="text-gray-600 mb-3">Panel untuk mengirim push notification ke aplikasi Android</p>
                 <div className="flex items-center text-sm text-blue-600">
                   <Send className="h-4 w-4 mr-1" />
                   <span>Kirim Notifikasi</span>
                 </div>
               </div>
             </div>
           </Link>
         </motion.div>
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
           whileHover={{ scale: 1.02 }}
           className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
         >
           <div className="p-6">
             <div className="flex items-center space-x-4">
               <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-xl">
                 <Settings className="h-8 w-8 text-white" />
               </div>
               <div className="flex-1">
                 <h3 className="text-xl font-bold text-gray-900 mb-2">PENGATURAN</h3>
                 <p className="text-gray-600 mb-3">Kelola pengaturan sistem dan konfigurasi aplikasi</p>
                 <div className="flex items-center text-sm text-green-600">
                   <Settings className="h-4 w-4 mr-1" />
                   <span>Konfigurasi Sistem</span>
                 </div>
               </div>
             </div>
           </div>
         </motion.div>
       </div>
       {/* Stats Cards */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
         <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
           <div className="flex items-center justify-between">
             <div>
               <p className="text-blue-100 text-sm font-medium">Total Sekolah</p>
               <p className="text-3xl font-bold">0</p>
             </div>
             <Users className="h-10 w-10 text-blue-200" />
           </div>
         </div>

         <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
           <div className="flex items-center justify-between">
             <div>
               <p className="text-green-100 text-sm font-medium">Akun Aktif</p>
               <p className="text-3xl font-bold">0</p>
             </div>
             <Calendar className="h-10 w-10 text-green-200" />
           </div>
         </div>

         <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
           <div className="flex items-center justify-between">
             <div>
               <p className="text-orange-100 text-sm font-medium">Akan Berakhir</p>
               <p className="text-3xl font-bold">0</p>
             </div>
             <AlertTriangle className="h-10 w-10 text-orange-200" />
           </div>
         </div>

         <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
           <div className="flex items-center justify-between">
             <div>
               <p className="text-purple-100 text-sm font-medium">Pengumuman</p>
               <p className="text-3xl font-bold">1</p>
             </div>
             <Bell className="h-10 w-10 text-purple-200" />
           </div>
         </div>
       </div>
       {/* Main Content */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* School Accounts Table */}
         <div className="lg:col-span-2">
           <SuperAdminTable />
         </div>

         {/* Announcement Form */}
         <div className="lg:col-span-1">
           <AnnouncementForm />
         </div>
       </div>
     </div>
   </div>
 );
}
