"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Users, Search, Filter, RefreshCw, Loader2, Shield, School, Mail } from "lucide-react";
import { toast } from "react-hot-toast";
import { collection, getDocs, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import TeacherManagementTable from "@/components/TeacherManagementTable";
import TeacherFilters from "@/components/TeacherFilters";
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
export default function PendidikPage() {
 const { userRole } = useAuth();
 const [loading, setLoading] = useState(true);
 const [teachers, setTeachers] = useState<TeacherData[]>([]);
 const [filteredTeachers, setFilteredTeachers] = useState<TeacherData[]>([]);
 const [searchQuery, setSearchQuery] = useState("");
 const [schoolFilter, setSchoolFilter] = useState("all");
 const [statusFilter, setStatusFilter] = useState("all");
 const [schools, setSchools] = useState<{id: string, name: string}[]>([]);
 // Check if user is super admin
 useEffect(() => {
   if (userRole !== 'admin') {
     toast.error("Anda tidak memiliki akses ke halaman ini");
     window.location.href = '/dashboard';
   }
 }, [userRole]);
 // Fetch all teachers and schools data
 useEffect(() => {
   fetchTeachersData();
   fetchSchoolsData();
 }, []);
 // Apply filters when search or filter changes
 useEffect(() => {
   applyFilters();
 }, [teachers, searchQuery, schoolFilter, statusFilter]);
 const fetchSchoolsData = async () => {
   try {
     const schoolsRef = collection(db, "schools");
     const schoolsSnapshot = await getDocs(schoolsRef);
     const schoolsList: {id: string, name: string}[] = [];

     schoolsSnapshot.forEach(doc => {
       const data = doc.data();
       schoolsList.push({
         id: doc.id,
         name: data.name || "Sekolah Tidak Diketahui"
       });
     });

     setSchools(schoolsList);
   } catch (error) {
     console.error("Error fetching schools:", error);
     toast.error("Gagal memuat data sekolah");
   }
 };
 const fetchTeachersData = async () => {
   try {
     setLoading(true);

     // Fetch all users with teacher or staff role
     const usersRef = collection(db, "users");
     const usersQuery = query(usersRef, orderBy("name", "asc"));
     const usersSnapshot = await getDocs(usersQuery);

     const teachersList: TeacherData[] = [];

     // Fetch schools data for mapping
     const schoolsRef = collection(db, "schools");
     const schoolsSnapshot = await getDocs(schoolsRef);
     const schoolsMap = new Map();

     schoolsSnapshot.forEach(doc => {
       const data = doc.data();
       schoolsMap.set(doc.id, data.name || "Sekolah Tidak Diketahui");
     });
     usersSnapshot.forEach(doc => {
       const data = doc.data();
       if (data.role === 'teacher' || data.role === 'staff') {
         teachersList.push({
           id: doc.id,
           name: data.name || "Nama Tidak Diketahui",
           email: data.email || "",
           schoolId: data.schoolId || "",
           schoolName: schoolsMap.get(data.schoolId) || "Sekolah Tidak Diketahui",
           role: data.role || "teacher",
           isActive: data.isActive !== false, // Default to true if not specified
           createdAt: data.createdAt,
           lastLogin: data.lastLogin,
           phone: data.phone,
           nik: data.nik
         });
       }
     });
     setTeachers(teachersList);
     setFilteredTeachers(teachersList);
   } catch (error) {
     console.error("Error fetching teachers:", error);
     toast.error("Gagal memuat data pendidik");
   } finally {
     setLoading(false);
   }
 };
 const applyFilters = () => {
   let filtered = [...teachers];
   // Apply search filter
   if (searchQuery) {
     const query = searchQuery.toLowerCase();
     filtered = filtered.filter(teacher =>
       teacher.name.toLowerCase().includes(query) ||
       teacher.email.toLowerCase().includes(query) ||
       teacher.schoolName.toLowerCase().includes(query)
     );
   }
   // Apply school filter
   if (schoolFilter !== "all") {
     filtered = filtered.filter(teacher => teacher.schoolId === schoolFilter);
   }
   // Apply status filter
   if (statusFilter !== "all") {
     filtered = filtered.filter(teacher =>
       statusFilter === "active" ? teacher.isActive : !teacher.isActive
     );
   }
   setFilteredTeachers(filtered);
 };
 const handleToggleAccountStatus = async (teacherId: string, currentStatus: boolean) => {
   try {
     const userRef = doc(db, "users", teacherId);
     await updateDoc(userRef, {
       isActive: !currentStatus,
       updatedAt: new Date()
     });
     // Update local state
     setTeachers(prev => prev.map(teacher =>
       teacher.id === teacherId
         ? { ...teacher, isActive: !currentStatus }
         : teacher
     ));
     toast.success(`Akun berhasil ${!currentStatus ? 'diaktifkan' : 'dinonaktifkan'}`);
   } catch (error) {
     console.error("Error updating account status:", error);
     toast.error("Gagal mengubah status akun");
   }
 };
 const handleRefresh = () => {
   fetchTeachersData();
   toast.success("Data berhasil diperbarui");
 };
 return (
   <div className="pb-20 md:pb-6">
     <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
       <div className="flex items-center mb-4 md:mb-0">
         <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-lg mr-4 shadow-lg">
           <Users className="h-7 w-7 text-white" />
         </div>
         <div>
           <h1 className="text-2xl font-bold text-gray-800">Manajemen Pendidik</h1>
           <p className="text-gray-600 text-sm">Kelola akun guru dari semua sekolah</p>
         </div>
       </div>

       <center><button
         onClick={handleRefresh}
         disabled={loading}
         className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2.5 rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md"
       >
         {loading ? (
           <Loader2 className="h-5 w-5 animate-spin" />
         ) : (
           <RefreshCw className="h-5 w-5" />
         )}
         Refresh Data
       </button></center>
     </div>
     {/* Statistics Cards */}
     <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
       <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
         <div className="flex items-center">
           <div className="bg-blue-500 p-2 rounded-lg mr-3">
             <Users className="h-5 w-5 text-white" />
           </div>
           <div>
             <p className="text-sm text-gray-600">Total Pendidik</p>
             <p className="text-2xl font-bold text-gray-800">{teachers.length}</p>
           </div>
         </div>
       </div>

       <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
         <div className="flex items-center">
           <div className="bg-green-500 p-2 rounded-lg mr-3">
             <Shield className="h-5 w-5 text-white" />
           </div>
           <div>
             <p className="text-sm text-gray-600">Akun Aktif</p>
             <p className="text-2xl font-bold text-gray-800">
               {teachers.filter(t => t.isActive).length}
             </p>
           </div>
         </div>
       </div>

       <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
         <div className="flex items-center">
           <div className="bg-red-500 p-2 rounded-lg mr-3">
             <Shield className="h-5 w-5 text-white" />
           </div>
           <div>
             <p className="text-sm text-gray-600">Akun Nonaktif</p>
             <p className="text-2xl font-bold text-gray-800">
               {teachers.filter(t => !t.isActive).length}
             </p>
           </div>
         </div>
       </div>

       <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
         <div className="flex items-center">
           <div className="bg-purple-500 p-2 rounded-lg mr-3">
             <School className="h-5 w-5 text-white" />
           </div>
           <div>
             <p className="text-sm text-gray-600">Total Sekolah</p>
             <p className="text-2xl font-bold text-gray-800">{schools.length}</p>
           </div>
         </div>
       </div>
     </div>
     {/* Filters */}
     <TeacherFilters
       searchQuery={searchQuery}
       setSearchQuery={setSearchQuery}
       schoolFilter={schoolFilter}
       setSchoolFilter={setSchoolFilter}
       statusFilter={statusFilter}
       setStatusFilter={setStatusFilter}
       schools={schools}
     />
     {/* Teachers Table */}
     <TeacherManagementTable
       teachers={filteredTeachers}
       loading={loading}
       onToggleStatus={handleToggleAccountStatus}
     />
    <hr className="border-t border-none mb-5" />
   </div>
  
 );
 
}
