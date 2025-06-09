'use client'
import React, { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { Bell, Send, Upload, X, Eye, Settings, Loader2, BarChart3, Users, Target, Calendar } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'
import NotificationStats from '@/components/NotificationStats'
const notificationSchema = z.object({
 messageName: z.string().min(1, 'Message name is required'),
 title: z.string().min(1, 'Title is required').max(50, 'Title must be 50 characters or less'),
 message: z.string().min(1, 'Message is required').max(200, 'Message must be 200 characters or less'),
 imageUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
 launchUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
 audience: z.enum(['all', 'role', 'tags']),
 targetRole: z.string().optional(),
 tags: z.array(z.string()).optional(),
 scheduleType: z.enum(['immediate', 'scheduled']),
 scheduledTime: z.string().optional(),
})
type NotificationForm = z.infer<typeof notificationSchema>
export default function NotificationsPage() {
 const { userRole } = useAuth()
 const router = useRouter()
 const [sending, setSending] = useState(false)
 const [previewMode, setPreviewMode] = useState(false)
 const [uploadingImage, setUploadingImage] = useState(false)
 const [activeTab, setActiveTab] = useState<'send' | 'stats'>('send')
 // Redirect if not super admin
 React.useEffect(() => {
   if (userRole !== 'admin') {
     toast.error('Akses ditolak. Hanya super admin yang dapat mengakses halaman ini.')
     router.push('/dashboard')
   }
 }, [userRole, router])
 const form = useForm<NotificationForm>({
   resolver: zodResolver(notificationSchema),
   defaultValues: {
     messageName: '',
     title: '',
     message: '',
     imageUrl: '',
     launchUrl: '',
     audience: 'all',
     targetRole: '',
     tags: [],
     scheduleType: 'immediate',
     scheduledTime: '',
   }
 })
 const { register, handleSubmit, watch, setValue, formState: { errors } } = form
 const watchedValues = watch()
 const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
   const file = event.target.files?.[0]
   if (!file) return
   if (file.size > 5 * 1024 * 1024) {
     toast.error('File size must be less than 5MB')
     return
   }
   setUploadingImage(true)
   try {
     // Create a temporary URL for preview
     const imageUrl = URL.createObjectURL(file)
     setValue('imageUrl', imageUrl)
     toast.success('Image uploaded successfully')
   } catch (error) {
     toast.error('Failed to upload image')
   } finally {
     setUploadingImage(false)
   }
 }
 const onSubmit = async (data: NotificationForm) => {
   setSending(true)
   try {
     const response = await fetch('/api/send-notification', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify(data),
     })
     const result = await response.json()
     if (result.success) {
       toast.success(`Notification sent successfully to ${result.recipients} users`)
       form.reset()
     } else {
       throw new Error(result.error || 'Failed to send notification')
     }
   } catch (error) {
     console.error('Error sending notification:', error)
     toast.error(error instanceof Error ? error.message : 'Failed to send notification')
   } finally {
     setSending(false)
   }
 }
 if (userRole !== 'admin') {
   return null
 }
 return (
   <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
     <div className="max-w-7xl mx-auto">
       {/* Header */}
       <motion.div
         initial={{ opacity: 0, y: -20 }}
         animate={{ opacity: 1, y: 0 }}
         className="mb-8"
       >
         <div className="flex items-center justify-between">
           <div className="flex items-center space-x-4">
             <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg">
               <Bell className="h-8 w-8 text-white" />
             </div>
             <div>
               <h1 className="text-3xl font-bold text-gray-900">Push Notification Center</h1>
               <p className="text-gray-600 mt-1">Send notifications to your app users</p>
             </div>
           </div>
           <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
             <div className="flex items-center space-x-2">
               <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
               <span className="text-sm font-medium text-gray-700">OneSignal Connected</span>
             </div>
           </div>
         </div>
       </motion.div>
       {/* Tab Navigation */}
       <motion.div
         initial={{ opacity: 0, y: -10 }}
         animate={{ opacity: 1, y: 0 }}
         className="mb-8"
       >
         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1">
           <div className="flex space-x-1">
             <button
               onClick={() => setActiveTab('send')}
               className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                 activeTab === 'send'
                   ? 'bg-blue-600 text-white shadow-md'
                   : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
               }`}
             >
               <Send className="h-4 w-4" />
               <span>Send Notification</span>
             </button>
             <button
               onClick={() => setActiveTab('stats')}
               className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                 activeTab === 'stats'
                   ? 'bg-blue-600 text-white shadow-md'
                   : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
               }`}
             >
               <BarChart3 className="h-4 w-4" />
               <span>Analytics</span>
             </button>
           </div>
         </div>
       </motion.div>
       {/* Tab Content */}
       {activeTab === 'send' ? (
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Main Form */}
           <motion.div
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             className="lg:col-span-2"
           >
             <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
               {/* Message Configuration */}
               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                 <div className="flex items-center space-x-3 mb-6">
                   <Settings className="h-5 w-5 text-blue-600" />
                   <h2 className="text-xl font-semibold text-gray-900">Message Configuration</h2>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       Message Name
                     </label>
                     <input
                       {...register('messageName')}
                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       placeholder="Enter message name..."
                     />
                     {errors.messageName && (
                       <p className="text-red-500 text-sm mt-1">{errors.messageName.message}</p>
                     )}
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       Labels (0/5)
                     </label>
                     <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                       <option>Select...</option>
                       <option>Urgent</option>
                       <option>News</option>
                       <option>Announcement</option>
                     </select>
                   </div>
                 </div>
               </div>
               {/* Audience */}
               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                 <div className="flex items-center space-x-3 mb-6">
                   <Users className="h-5 w-5 text-green-600" />
                   <h2 className="text-xl font-semibold text-gray-900">1. Audience</h2>
                 </div>
                 <div className="space-y-4">
                   <div className="flex items-center space-x-3">
                     <input
                       {...register('audience')}
                       type="radio"
                       value="all"
                       id="all-users"
                       className="w-4 h-4 text-blue-600"
                     />
                     <label htmlFor="all-users" className="flex items-center space-x-2">
                       <Target className="h-4 w-4 text-blue-600" />
                       <span className="text-gray-900 font-medium">Send to Total Subscriptions</span>
                     </label>
                   </div>
                   <div className="flex items-center space-x-3">
                     <input
                       {...register('audience')}
                       type="radio"
                       value="role"
                       id="role-based"
                       className="w-4 h-4 text-blue-600"
                     />
                     <label htmlFor="role-based" className="text-gray-900 font-medium">Send to Specific Role</label>
                   </div>
                   {watchedValues.audience === 'role' && (
                     <motion.div
                       initial={{ opacity: 0, height: 0 }}
                       animate={{ opacity: 1, height: 'auto' }}
                       className="ml-7"
                     >
                       <select
                         {...register('targetRole')}
                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       >
                         <option value="">Select Role</option>
                         <option value="admin">Administrator</option>
                         <option value="teacher">Teacher</option>
                         <option value="student">Student</option>
                       </select>
                     </motion.div>
                   )}
                 </div>
               </div>
               {/* Message Content */}
               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                 <div className="flex items-center space-x-3 mb-6">
                   <Bell className="h-5 w-5 text-purple-600" />
                   <h2 className="text-xl font-semibold text-gray-900">2. Message</h2>
                 </div>
                 <div className="space-y-6">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       Title
                     </label>
                     <input
                       {...register('title')}
                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       placeholder="Enter notification title..."
                       maxLength={50}
                     />
                     <div className="flex justify-between items-center mt-1">
                       {errors.title && (
                         <p className="text-red-500 text-sm">{errors.title.message}</p>
                       )}
                       <span className="text-xs text-gray-500 ml-auto">
                         {watchedValues.title?.length || 0}/50
                       </span>
                     </div>
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       Message <span className="text-red-500">*</span>
                     </label>
                     <textarea
                       {...register('message')}
                       rows={4}
                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       placeholder="Enter your message here..."
                       maxLength={200}
                     />
                     <div className="flex justify-between items-center mt-1">
                       {errors.message && (
                         <p className="text-red-500 text-sm">{errors.message.message}</p>
                       )}
                       <span className="text-xs text-gray-500 ml-auto">
                         {watchedValues.message?.length || 0}/200
                       </span>
                     </div>
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       Image
                     </label>
                     <div className="flex items-center space-x-4">
                       <div className="flex-1">
                         <input
                           {...register('imageUrl')}
                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                           placeholder="Enter image URL or upload..."
                         />
                       </div>
                       <div className="relative">
                         <input
                           type="file"
                           accept="image/*"
                           onChange={handleImageUpload}
                           className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                         />
                         <button
                           type="button"
                           className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                           disabled={uploadingImage}
                         >
                           {uploadingImage ? (
                             <Loader2 className="h-4 w-4 animate-spin" />
                           ) : (
                             <Upload className="h-4 w-4" />
                           )}
                           <span>Upload</span>
                         </button>
                       </div>
                     </div>
                     {errors.imageUrl && (
                       <p className="text-red-500 text-sm mt-1">{errors.imageUrl.message}</p>
                     )}
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       Launch URL
                     </label>
                     <input
                       {...register('launchUrl')}
                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       placeholder="https://example.com"
                     />
                     {errors.launchUrl && (
                       <p className="text-red-500 text-sm mt-1">{errors.launchUrl.message}</p>
                     )}
                   </div>
                 </div>
               </div>
               {/* Delivery Schedule */}
               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                 <div className="flex items-center space-x-3 mb-6">
                   <Calendar className="h-5 w-5 text-orange-600" />
                   <h2 className="text-xl font-semibold text-gray-900">3. Delivery Schedule</h2>
                 </div>
                 <div className="space-y-4">
                   <div>
                     <p className="text-sm text-gray-600 mb-3">When should this message start sending?</p>
                     <div className="flex items-center space-x-3">
                       <input
                         {...register('scheduleType')}
                         type="radio"
                         value="immediate"
                         id="immediate"
                         className="w-4 h-4 text-blue-600"
                       />
                       <label htmlFor="immediate" className="text-gray-900 font-medium">Immediately</label>
                     </div>
                   </div>
                   <div>
                     <p className="text-sm text-gray-600 mb-3">Per user optimization?</p>
                     <div className="flex items-center space-x-3">
                       <input
                         type="radio"
                         value="same-time"
                         id="same-time"
                         defaultChecked
                         className="w-4 h-4 text-blue-600"
                       />
                       <label htmlFor="same-time" className="text-gray-900 font-medium">Send to everyone at the same time</label>
                     </div>
                   </div>
                 </div>
               </div>
               {/* Submit Button */}
               <motion.button
                 type="submit"
                 disabled={sending}
                 className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
                 whileHover={{ scale: sending ? 1 : 1.02 }}
                 whileTap={{ scale: sending ? 1 : 0.98 }}
               >
                 {sending ? (
                   <>
                     <Loader2 className="h-5 w-5 animate-spin" />
                     <span>Sending Notification...</span>
                   </>
                 ) : (
                   <>
                     <Send className="h-5 w-5" />
                     <span>Review and Send</span>
                   </>
                 )}
               </motion.button>
             </form>
           </motion.div>
           {/* Preview Panel */}
           <motion.div
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="lg:col-span-1"
           >
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
               <div className="flex items-center justify-between mb-6">
                 <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
                 <button
                   type="button"
                   onClick={() => setPreviewMode(!previewMode)}
                   className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                 >
                   <Eye className="h-4 w-4" />
                   <span className="text-sm">Toggle Preview</span>
                 </button>
               </div>
               {/* Mobile Preview */}
               <div className="bg-gray-100 rounded-2xl p-4 mx-auto" style={{ width: '280px' }}>
                 <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                   <div className="flex items-center p-3 bg-gray-50 border-b">
                     <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                       <Bell className="h-3 w-3 text-white" />
                     </div>
                     <div className="flex-1">
                       <div className="flex items-center justify-between">
                         <span className="text-xs font-medium text-gray-900">
                           {watchedValues.messageName || 'ABSENSI DIGITAL SEKOLAH'}
                         </span>
                         <span className="text-xs text-gray-500">now</span>
                       </div>
                     </div>
                   </div>
                   <div className="p-4">
                     <h4 className="font-semibold text-gray-900 text-sm mb-2">
                       {watchedValues.title || 'Notification Title'}
                     </h4>
                     <p className="text-gray-600 text-xs mb-3">
                       {watchedValues.message || 'Your notification message will appear here...'}
                     </p>
                     {watchedValues.imageUrl && (
                       <div className="rounded-lg overflow-hidden mb-3">
                         <img
                           src={watchedValues.imageUrl}
                           alt="Notification"
                           className="w-full h-24 object-cover"
                         />
                       </div>
                     )}
                   </div>
                 </div>
                 <div className="text-center mt-4">
                   <span className="text-xs text-gray-500">Google Android</span>
                 </div>
               </div>
               {/* Stats */}
               <div className="mt-6 space-y-3">
                 <div className="flex justify-between items-center py-2 border-b border-gray-100">
                   <span className="text-sm text-gray-600">Estimated Recipients</span>
                   <span className="text-sm font-semibold text-gray-900">~1,234</span>
                 </div>
                 <div className="flex justify-between items-center py-2 border-b border-gray-100">
                   <span className="text-sm text-gray-600">Delivery Time</span>
                   <span className="text-sm font-semibold text-gray-900">
                     {watchedValues.scheduleType === 'immediate' ? 'Immediate' : 'Scheduled'}
                   </span>
                 </div>
                 <div className="flex justify-between items-center py-2">
                   <span className="text-sm text-gray-600">Character Count</span>
                   <span className="text-sm font-semibold text-gray-900">
                     {(watchedValues.title?.length || 0) + (watchedValues.message?.length || 0)}/250
                   </span>
                 </div>
               </div>
             </div>
           </motion.div>
         </div>
       ) : (
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
         >
           <NotificationStats />
         </motion.div>
       )}
     </div>
   </div>
 )
}
