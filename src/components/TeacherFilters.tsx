"use client";
import React from "react";
import { Search, Filter, School, Shield } from "lucide-react";
interface TeacherFiltersProps {
 searchQuery: string;
 setSearchQuery: (query: string) => void;
 schoolFilter: string;
 setSchoolFilter: (filter: string) => void;
 statusFilter: string;
 setStatusFilter: (filter: string) => void;
 schools: {id: string, name: string}[];
}
export default function TeacherFilters({
 searchQuery,
 setSearchQuery,
 schoolFilter,
 setSchoolFilter,
 statusFilter,
 setStatusFilter,
 schools
}: TeacherFiltersProps) {
 return (
   <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
     <div className="flex items-center mb-4">
       <Filter className="h-5 w-5 text-gray-500 mr-2" />
       <h3 className="text-lg font-semibold text-gray-800">Filter & Pencarian</h3>
     </div>

     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
       {/* Search Input */}
       <div className="relative">
         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
           <Search className="h-5 w-5 text-gray-400" />
         </div>
         <input
           type="text"
           placeholder="Cari nama, email, atau sekolah..."
           className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
           value={searchQuery}
           onChange={(e) => setSearchQuery(e.target.value)}
         />
       </div>
       {/* School Filter */}
       <div className="relative">
         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
           <School className="h-5 w-5 text-gray-400" />
         </div>
         <select
           className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none"
           value={schoolFilter}
           onChange={(e) => setSchoolFilter(e.target.value)}
         >
           <option value="all">Semua Sekolah</option>
           {schools.map(school => (
             <option key={school.id} value={school.id}>
               {school.name}
             </option>
           ))}
         </select>
       </div>
       {/* Status Filter */}
       <div className="relative">
         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
           <Shield className="h-5 w-5 text-gray-400" />
         </div>
         <select
           className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none"
           value={statusFilter}
           onChange={(e) => setStatusFilter(e.target.value)}
         >
           <option value="all">Semua Status</option>
           <option value="active">Akun Aktif</option>
           <option value="inactive">Akun Nonaktif</option>
         </select>
       </div>
     </div>
   </div>
 );
}