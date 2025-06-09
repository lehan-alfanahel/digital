'use client'
import React from 'react'
import { BarChart3, Users, Send, Eye, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
export default function NotificationStats() {
 return (
   <div className="space-y-6">
     {/* Stats Overview */}
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.1 }}
         className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
       >
         <div className="flex items-center justify-between">
           <div>
             <p className="text-sm font-medium text-gray-600">Total Sent</p>
             <p className="text-2xl font-bold text-gray-900">12,345</p>
           </div>
           <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
             <Send className="h-6 w-6 text-blue-600" />
           </div>
         </div>
         <div className="mt-4 flex items-center">
           <TrendingUp className="h-4 w-4 text-green-500" />
           <span className="text-sm text-green-600 ml-1">+12.5% from last month</span>
         </div>
       </motion.div>
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.2 }}
         className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
       >
         <div className="flex items-center justify-between">
           <div>
             <p className="text-sm font-medium text-gray-600">Delivered</p>
             <p className="text-2xl font-bold text-gray-900">11,892</p>
           </div>
           <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
             <Users className="h-6 w-6 text-green-600" />
           </div>
         </div>
         <div className="mt-4 flex items-center">
           <span className="text-sm text-gray-600">96.3% delivery rate</span>
         </div>
       </motion.div>
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.3 }}
         className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
       >
         <div className="flex items-center justify-between">
           <div>
             <p className="text-sm font-medium text-gray-600">Opened</p>
             <p className="text-2xl font-bold text-gray-900">8,567</p>
           </div>
           <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
             <Eye className="h-6 w-6 text-purple-600" />
           </div>
         </div>
         <div className="mt-4 flex items-center">
           <span className="text-sm text-gray-600">72.1% open rate</span>
         </div>
       </motion.div>
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.4 }}
         className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
       >
         <div className="flex items-center justify-between">
           <div>
             <p className="text-sm font-medium text-gray-600">Click Rate</p>
             <p className="text-2xl font-bold text-gray-900">24.8%</p>
           </div>
           <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
             <BarChart3 className="h-6 w-6 text-orange-600" />
           </div>
         </div>
         <div className="mt-4 flex items-center">
           <TrendingUp className="h-4 w-4 text-green-500" />
           <span className="text-sm text-green-600 ml-1">+5.2% from last month</span>
         </div>
       </motion.div>
     </div>
     {/* Recent Notifications */}
     <motion.div
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ delay: 0.5 }}
       className="bg-white rounded-xl shadow-sm border border-gray-200"
     >
       <div className="p-6 border-b border-gray-200">
         <h3 className="text-lg font-semibold text-gray-900">Recent Notifications</h3>
       </div>
       <div className="p-6">
         <div className="space-y-4">
           {[1, 2, 3, 4, 5].map((item) => (
             <div key={item} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
               <div className="flex items-center space-x-4">
                 <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                   <Send className="h-5 w-5 text-blue-600" />
                 </div>
                 <div>
                   <h4 className="text-sm font-medium text-gray-900">Welcome to our app!</h4>
                   <p className="text-xs text-gray-500">Sent 2 hours ago</p>
                 </div>
               </div>
               <div className="text-right">
                 <p className="text-sm font-medium text-gray-900">1,234</p>
                 <p className="text-xs text-gray-500">Recipients</p>
               </div>
             </div>
           ))}
         </div>
       </div>
     </motion.div>
   </div>
 )
}
