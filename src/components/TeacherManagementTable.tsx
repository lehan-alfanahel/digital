"use client";
import React from "react";
import { User, Mail, School, Calendar, Phone, IdCard, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import AccountToggle from "@/components/AccountToggle";
interface TeacherData {
 id: string;
 name: string;
 email: string;
 schoolId: string;
 schoolName: string;
 role: string;
 isActive: boolean;
 createdAt: any;
 lastLogin?: any;
 phone?: string;
 nik?: string;
}
interface TeacherManagementTableProps {
 teachers: TeacherData[];
 loading: boolean;
 onToggleStatus: (teacherId: string, currentStatus: boolean) => void;
}
export default function TeacherManagementTable({
 teachers,
 loading,
 onToggleStatus
}: TeacherManagementTableProps) {
 const formatDate = (timestamp: any) => {
   try {
     if (!timestamp) return "-";

     let date;
     if (timestamp.toDate) {
       date = timestamp.toDate();
     } else if (timestamp.seconds) {
       date = new Date(timestamp.seconds * 1000);
     } else {
       date = new Date(timestamp);
     }

     return format(date, "dd MMM yyyy", { locale: id });
   } catch (error) {
     return "-";
   }
 };
 if (loading) {
   return (
     <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
       <Loader2 className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
       <p className="text-gray-600">Memuat data pendidik...</p>
     </div>
   );
 }
 if (teachers.length === 0) {
   return (
     <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
       <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
       <p className="text-gray-500 text-lg font-medium mb-2">Tidak ada data pendidik</p>
       <p className="text-gray-400">Coba ubah filter pencarian atau refresh data</p>
     </div>
   );
 }
 return (
   <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
     <div className="overflow-x-auto">
       <table className="w-full">
         <thead>
           <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            
             <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
               Informasi Pendidik
             </th>
             <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
               Email
             </th>
             <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
               Sekolah
             </th>
             
             <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
               Status Akun
             </th>
           </tr>
         </thead>
         <tbody className="divide-y divide-gray-200">
           {teachers.map((teacher, index) => (
             <tr
               key={teacher.id}
               className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
             >
               

               <td className="px-6 py-4 whitespace-nowrap">
                 <div className="flex items-center">
                   <div className="flex-shrink-0 h-12 w-12">
                     <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                       <User className="h-6 w-6 text-white" />
                     </div>
                   </div>
                   <div className="ml-4">
                     <div className="text-sm font-medium text-gray-900">
                       {teacher.name}
                     </div>
                     <div className="text-sm text-gray-500 flex items-center mt-1">
                       <IdCard className="h-3 w-3 mr-1" />
                       {teacher.role === 'teacher' ? 'Guru' : 'Tenaga Kependidikan'}
                       {teacher.nik && (
                         <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded">
                           NIK: {teacher.nik}
                         </span>
                       )}
                     </div>
                     {teacher.phone && (
                       <div className="text-xs text-gray-400 flex items-center mt-1">
                         <Phone className="h-3 w-3 mr-1" />
                         {teacher.phone}
                       </div>
                     )}
                   </div>
                 </div>
               </td>

               <td className="px-6 py-4 whitespace-nowrap">
                 <div className="flex items-center text-sm text-gray-900">
                   <Mail className="h-4 w-4 text-gray-400 mr-2" />
                   <a
                     href={`mailto:${teacher.email}`}
                     className="hover:text-blue-600 transition-colors"
                   >
                     {teacher.email}
                   </a>
                 </div>
               </td>

               <td className="px-6 py-4 whitespace-nowrap">
                 <div className="flex items-center text-sm text-gray-900">
                   <School className="h-4 w-4 text-gray-400 mr-2" />
                   <div>
                     <div className="font-medium">{teacher.schoolName}</div>
                     <div className="text-xs text-gray-500">ID: {teacher.schoolId}</div>
                   </div>
                 </div>
               </td>


               <td className="px-6 py-4 whitespace-nowrap text-center">
                 <AccountToggle
                   isActive={teacher.isActive}
                   onToggle={() => onToggleStatus(teacher.id, teacher.isActive)}
                   teacherName={teacher.name}
                 />
               </td>
             </tr>
           ))}
         </tbody>
       </table>
     </div>

     <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
       <div className="flex items-center justify-between">
         <div className="text-sm text-gray-500">
           Menampilkan {teachers.length} pendidik
         </div>
         <div className="text-sm text-gray-500">
           Total email guru: {teachers.map(t => t.email).filter(Boolean).length}
         </div>
       </div>
     </div>
   </div>
 );
}
