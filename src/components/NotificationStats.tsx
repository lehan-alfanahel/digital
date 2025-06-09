'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
 BarChart3,
 Users,
 Send,
 Eye,
 Clock,
 TrendingUp,
 Target,
 CheckCircle,
 XCircle,
 Calendar
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
// Mock data - replace with real data from your backend
const mockStats = {
 totalSent: 15420,
 delivered: 14890,
 opened: 8934,
 clicked: 2156,
 deliveryRate: 96.6,
 openRate: 60.0,
 clickRate: 14.0
}
const mockChartData = [
 { name: 'Mon', sent: 1200, delivered: 1150, opened: 690, clicked: 105 },
 { name: 'Tue', sent: 1100, delivered: 1065, opened: 650, clicked: 98 },
 { name: 'Wed', sent: 1300, delivered: 1250, opened: 780, clicked: 140 },
 { name: 'Thu', sent: 1450, delivered: 1400, opened: 850, clicked: 170 },
 { name: 'Fri', sent: 1600, delivered: 1520, opened: 920, clicked: 185 },
 { name: 'Sat', sent: 900, delivered: 870, opened: 500, clicked: 85 },
 { name: 'Sun', sent: 800, delivered: 780, opened: 450, clicked: 72 }
]
const deviceData = [
 { name: 'Android', value: 68, color: '#4CAF50' },
 { name: 'iOS', value: 28, color: '#2196F3' },
 { name: 'Web', value: 4, color: '#FF9800' }
]
const recentNotifications = [
 {
   id: 1,
   title: 'Welcome New Students',
   message: 'Selamat datang di sistem absensi digital...',
   sentAt: '2025-06-09T10:30:00Z',
   recipients: 245,
   delivered: 240,
   opened: 156,
   status: 'completed'
 },
 {
   id: 2,
   title: 'System Maintenance',
   message: 'Sistem akan mengalami maintenance...',
   sentAt: '2025-06-08T14:15:00Z',
   recipients: 1200,
   delivered: 1180,
   opened: 890,
   status: 'completed'
 },
 {
   id: 3,
   title: 'Monthly Report Available',
   message: 'Laporan bulanan telah tersedia...',
   sentAt: '2025-06-07T09:00:00Z',
   recipients: 180,
   delivered: 175,
   opened: 120,
   status: 'completed'
 }
]
export default function NotificationStats() {
 const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d')
 const [loading, setLoading] = useState(true)
 useEffect(() => {
   // Simulate loading
   const timer = setTimeout(() => setLoading(false), 1000)
   return () => clearTimeout(timer)
 }, [])
 const formatDate = (dateString: string) => {
   return new Date(dateString).toLocaleDateString('id-ID', {
     day: 'numeric',
     month: 'short',
     hour: '2-digit',
     minute: '2-digit'
   })
 }
 if (loading) {
   return (
     <div className="flex items-center justify-center h-64">
       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
     </div>
   )
 }
 return (
   <motion.div
     initial={{ opacity: 0, y: 20 }}
     animate={{ opacity: 1, y: 0 }}
     className="space-y-6"
   >
     {/* Time Range Selector */}
     <div className="flex items-center justify-between">
       <h2 className="text-2xl font-bold text-gray-900">Notification Analytics</h2>
       <div className="bg-white rounded-lg border border-gray-200 p-1 flex">
         {(['7d', '30d', '90d'] as const).map((range) => (
           <button
             key={range}
             onClick={() => setTimeRange(range)}
             className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
               timeRange === range
                 ? 'bg-blue-600 text-white shadow-sm'
                 : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
             }`}
           >
             {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
           </button>
         ))}
       </div>
     </div>
     {/* Stats Overview */}
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
       <motion.div
         initial={{ opacity: 0, scale: 0.9 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ delay: 0.1 }}
         className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
       >
         <div className="flex items-center justify-between">
           <div>
             <p className="text-sm font-medium text-gray-600">Total Sent</p>
             <p className="text-3xl font-bold text-gray-900">{mockStats.totalSent.toLocaleString()}</p>
           </div>
           <div className="bg-blue-100 p-3 rounded-lg">
             <Send className="h-6 w-6 text-blue-600" />
           </div>
         </div>
         <div className="mt-4 flex items-center">
           <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
           <span className="text-sm text-green-600 font-medium">+12.5%</span>
           <span className="text-sm text-gray-500 ml-1">vs last period</span>
         </div>
       </motion.div>
       <motion.div
         initial={{ opacity: 0, scale: 0.9 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ delay: 0.2 }}
         className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
       >
         <div className="flex items-center justify-between">
           <div>
             <p className="text-sm font-medium text-gray-600">Delivery Rate</p>
             <p className="text-3xl font-bold text-gray-900">{mockStats.deliveryRate}%</p>
           </div>
           <div className="bg-green-100 p-3 rounded-lg">
             <CheckCircle className="h-6 w-6 text-green-600" />
           </div>
         </div>
         <div className="mt-4 flex items-center">
           <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
           <span className="text-sm text-green-600 font-medium">+2.1%</span>
           <span className="text-sm text-gray-500 ml-1">vs last period</span>
         </div>
       </motion.div>
       <motion.div
         initial={{ opacity: 0, scale: 0.9 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ delay: 0.3 }}
         className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
       >
         <div className="flex items-center justify-between">
           <div>
             <p className="text-sm font-medium text-gray-600">Open Rate</p>
             <p className="text-3xl font-bold text-gray-900">{mockStats.openRate}%</p>
           </div>
           <div className="bg-purple-100 p-3 rounded-lg">
             <Eye className="h-6 w-6 text-purple-600" />
           </div>
         </div>
         <div className="mt-4 flex items-center">
           <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
           <span className="text-sm text-green-600 font-medium">+5.3%</span>
           <span className="text-sm text-gray-500 ml-1">vs last period</span>
         </div>
       </motion.div>
       <motion.div
         initial={{ opacity: 0, scale: 0.9 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ delay: 0.4 }}
         className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
       >
         <div className="flex items-center justify-between">
           <div>
             <p className="text-sm font-medium text-gray-600">Click Rate</p>
             <p className="text-3xl font-bold text-gray-900">{mockStats.clickRate}%</p>
           </div>
           <div className="bg-orange-100 p-3 rounded-lg">
             <Target className="h-6 w-6 text-orange-600" />
           </div>
         </div>
         <div className="mt-4 flex items-center">
           <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
           <span className="text-sm text-green-600 font-medium">+8.7%</span>
           <span className="text-sm text-gray-500 ml-1">vs last period</span>
         </div>
       </motion.div>
     </div>
     {/* Charts Section */}
     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
       {/* Performance Chart */}
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.5 }}
         className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6"
       >
         <div className="flex items-center justify-between mb-6">
           <h3 className="text-lg font-semibold text-gray-900">Performance Overview</h3>
           <BarChart3 className="h-5 w-5 text-gray-400" />
         </div>
         <div style={{ width: '100%', height: 300 }}>
           <ResponsiveContainer>
             <BarChart data={mockChartData}>
               <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
               <XAxis dataKey="name" stroke="#666" fontSize={12} />
               <YAxis stroke="#666" fontSize={12} />
               <Tooltip
                 contentStyle={{
                   backgroundColor: 'white',
                   border: '1px solid #e5e7eb',
                   borderRadius: '8px',
                   boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                 }}
               />
               <Bar dataKey="sent" fill="#3b82f6" name="Sent" radius={[2, 2, 0, 0]} />
               <Bar dataKey="delivered" fill="#10b981" name="Delivered" radius={[2, 2, 0, 0]} />
               <Bar dataKey="opened" fill="#8b5cf6" name="Opened" radius={[2, 2, 0, 0]} />
               <Bar dataKey="clicked" fill="#f59e0b" name="Clicked" radius={[2, 2, 0, 0]} />
             </BarChart>
           </ResponsiveContainer>
         </div>
       </motion.div>
       {/* Device Distribution */}
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.6 }}
         className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
       >
         <div className="flex items-center justify-between mb-6">
           <h3 className="text-lg font-semibold text-gray-900">Device Distribution</h3>
           <Users className="h-5 w-5 text-gray-400" />
         </div>
         <div style={{ width: '100%', height: 200 }}>
           <ResponsiveContainer>
             <PieChart>
               <Pie
                 data={deviceData}
                 cx="50%"
                 cy="50%"
                 outerRadius={60}
                 fill="#8884d8"
                 dataKey="value"
                 label={({ name, value }) => `${name}: ${value}%`}
                 labelLine={false}
               >
                 {deviceData.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={entry.color} />
                 ))}
               </Pie>
               <Tooltip />
             </PieChart>
           </ResponsiveContainer>
         </div>
         <div className="mt-4 space-y-3">
           {deviceData.map((device, index) => (
             <div key={index} className="flex items-center justify-between">
               <div className="flex items-center space-x-2">
                 <div
                   className="w-3 h-3 rounded-full"
                   style={{ backgroundColor: device.color }}
                 ></div>
                 <span className="text-sm text-gray-600">{device.name}</span>
               </div>
               <span className="text-sm font-medium text-gray-900">{device.value}%</span>
             </div>
           ))}
         </div>
       </motion.div>
     </div>
     {/* Recent Notifications */}
     <motion.div
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ delay: 0.7 }}
       className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
     >
       <div className="flex items-center justify-between mb-6">
         <h3 className="text-lg font-semibold text-gray-900">Recent Notifications</h3>
         <Calendar className="h-5 w-5 text-gray-400" />
       </div>
       <div className="overflow-x-auto">
         <table className="w-full">
           <thead>
             <tr className="border-b border-gray-200">
               <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Message</th>
               <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Sent At</th>
               <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Recipients</th>
               <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Delivered</th>
               <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Opened</th>
               <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Status</th>
             </tr>
           </thead>
           <tbody>
             {recentNotifications.map((notification) => (
               <tr key={notification.id} className="border-b border-gray-100 hover:bg-gray-50">
                 <td className="py-4 px-4">
                   <div>
                     <p className="font-medium text-gray-900 text-sm">{notification.title}</p>
                     <p className="text-gray-500 text-xs truncate max-w-xs">{notification.message}</p>
                   </div>
                 </td>
                 <td className="py-4 px-4 text-sm text-gray-600">
                   {formatDate(notification.sentAt)}
                 </td>
                 <td className="py-4 px-4 text-sm font-medium text-gray-900">
                   {notification.recipients.toLocaleString()}
                 </td>
                 <td className="py-4 px-4 text-sm text-gray-600">
                   {notification.delivered.toLocaleString()}
                   <span className="text-xs text-gray-400 ml-1">
                     ({Math.round((notification.delivered / notification.recipients) * 100)}%)
                   </span>
                 </td>
                 <td className="py-4 px-4 text-sm text-gray-600">
                   {notification.opened.toLocaleString()}
                   <span className="text-xs text-gray-400 ml-1">
                     ({Math.round((notification.opened / notification.delivered) * 100)}%)
                   </span>
                 </td>
                 <td className="py-4 px-4">
                   <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                     <CheckCircle className="h-3 w-3 mr-1" />
                     {notification.status}
                   </span>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
     </motion.div>
   </motion.div>
 )
}