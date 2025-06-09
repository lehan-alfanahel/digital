'use client'
import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Users, Send, Eye, Clock, CheckCircle } from 'lucide-react'
const deliveryData = [
 { name: 'Mon', sent: 120, delivered: 115, opened: 89 },
 { name: 'Tue', sent: 98, delivered: 94, opened: 76 },
 { name: 'Wed', sent: 156, delivered: 149, opened: 112 },
 { name: 'Thu', sent: 87, delivered: 82, opened: 65 },
 { name: 'Fri', sent: 203, delivered: 195, opened: 145 },
 { name: 'Sat', sent: 145, delivered: 138, opened: 98 },
 { name: 'Sun', sent: 67, delivered: 63, opened: 44 },
]
const audienceData = [
 { name: 'Students', value: 1200, color: '#3B82F6' },
 { name: 'Teachers', value: 150, color: '#10B981' },
 { name: 'Parents', value: 800, color: '#F59E0B' },
 { name: 'Admin', value: 25, color: '#EF4444' },
]
export default function NotificationStats() {
 return (
   <div className="space-y-8">
     {/* Overview Cards */}
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
       <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
         <div className="flex items-center justify-between">
           <div>
             <p className="text-sm text-gray-600">Total Sent</p>
             <p className="text-2xl font-bold text-gray-900">2,876</p>
             <p className="text-xs text-green-600 flex items-center mt-1">
               <TrendingUp className="h-3 w-3 mr-1" />
               +12% from last week
             </p>
           </div>
           <div className="bg-blue-100 p-3 rounded-lg">
             <Send className="h-6 w-6 text-blue-600" />
           </div>
         </div>
       </div>
       <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
         <div className="flex items-center justify-between">
           <div>
             <p className="text-sm text-gray-600">Delivered</p>
             <p className="text-2xl font-bold text-gray-900">2,736</p>
             <p className="text-xs text-green-600 flex items-center mt-1">
               <CheckCircle className="h-3 w-3 mr-1" />
               95.1% delivery rate
             </p>
           </div>
           <div className="bg-green-100 p-3 rounded-lg">
             <CheckCircle className="h-6 w-6 text-green-600" />
           </div>
         </div>
       </div>
       <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
         <div className="flex items-center justify-between">
           <div>
             <p className="text-sm text-gray-600">Opened</p>
             <p className="text-2xl font-bold text-gray-900">1,829</p>
             <p className="text-xs text-blue-600 flex items-center mt-1">
               <Eye className="h-3 w-3 mr-1" />
               66.8% open rate
             </p>
           </div>
           <div className="bg-purple-100 p-3 rounded-lg">
             <Eye className="h-6 w-6 text-purple-600" />
           </div>
         </div>
       </div>
       <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
         <div className="flex items-center justify-between">
           <div>
             <p className="text-sm text-gray-600">Active Users</p>
             <p className="text-2xl font-bold text-gray-900">2,175</p>
             <p className="text-xs text-orange-600 flex items-center mt-1">
               <Users className="h-3 w-3 mr-1" />
               Total subscribers
             </p>
           </div>
           <div className="bg-orange-100 p-3 rounded-lg">
             <Users className="h-6 w-6 text-orange-600" />
           </div>
         </div>
       </div>
     </div>
     {/* Charts */}
     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
       {/* Delivery Chart */}
       <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
         <h3 className="text-lg font-semibold text-gray-900 mb-6">Weekly Performance</h3>
         <div className="h-80">
           <ResponsiveContainer width="100%" height="100%">
             <BarChart data={deliveryData}>
               <CartesianGrid strokeDasharray="3 3" />
               <XAxis dataKey="name" />
               <YAxis />
               <Tooltip />
               <Bar dataKey="sent" fill="#3B82F6" name="Sent" />
               <Bar dataKey="delivered" fill="#10B981" name="Delivered" />
               <Bar dataKey="opened" fill="#F59E0B" name="Opened" />
             </BarChart>
           </ResponsiveContainer>
         </div>
       </div>
       {/* Audience Distribution */}
       <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
         <h3 className="text-lg font-semibold text-gray-900 mb-6">Audience Distribution</h3>
         <div className="h-80">
           <ResponsiveContainer width="100%" height="100%">
             <PieChart>
               <Pie
                 data={audienceData}
                 cx="50%"
                 cy="50%"
                 outerRadius={80}
                 fill="#8884d8"
                 dataKey="value"
                 label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
               >
                 {audienceData.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={entry.color} />
                 ))}
               </Pie>
               <Tooltip />
             </PieChart>
           </ResponsiveContainer>
         </div>
       </div>
     </div>
     {/* Recent Notifications */}
     <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
       <div className="p-6 border-b border-gray-200">
         <h3 className="text-lg font-semibold text-gray-900">Recent Notifications</h3>
       </div>
       <div className="overflow-x-auto">
         <table className="w-full">
           <thead className="bg-gray-50">
             <tr>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Message
               </th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Audience
               </th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Sent
               </th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Delivered
               </th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Opened
               </th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Status
               </th>
             </tr>
           </thead>
           <tbody className="bg-white divide-y divide-gray-200">
             <tr>
               <td className="px-6 py-4 whitespace-nowrap">
                 <div>
                   <div className="text-sm font-medium text-gray-900">Welcome to New Semester</div>
                   <div className="text-sm text-gray-500">Welcome message for students...</div>
                 </div>
               </td>
               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">All Students</td>
               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1,200</td>
               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1,156</td>
               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">892</td>
               <td className="px-6 py-4 whitespace-nowrap">
                 <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                   Delivered
                 </span>
               </td>
             </tr>
             <tr>
               <td className="px-6 py-4 whitespace-nowrap">
                 <div>
                   <div className="text-sm font-medium text-gray-900">Parent-Teacher Meeting</div>
                   <div className="text-sm text-gray-500">Reminder for upcoming meeting...</div>
                 </div>
               </td>
               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Parents</td>
               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">800</td>
               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">784</td>
               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">567</td>
               <td className="px-6 py-4 whitespace-nowrap">
                 <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                   Delivered
                 </span>
               </td>
             </tr>
             <tr>
               <td className="px-6 py-4 whitespace-nowrap">
                 <div>
                   <div className="text-sm font-medium text-gray-900">System Maintenance</div>
                   <div className="text-sm text-gray-500">Scheduled maintenance notice...</div>
                 </div>
               </td>
               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">All Users</td>
               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2,175</td>
               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2,096</td>
               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1,234</td>
               <td className="px-6 py-4 whitespace-nowrap">
                 <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                   Sending
                 </span>
               </td>
             </tr>
           </tbody>
         </table>
       </div>
     </div>
   </div>
 )
}
