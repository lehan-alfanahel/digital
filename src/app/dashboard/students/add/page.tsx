"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { User, Hash, Calendar, MapPin, Phone, Save, ArrowLeft, Loader2, CheckCircle, Mail } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
export default function AddStudent() {
 const { schoolId } = useAuth();
 const router = useRouter();
 const [loading, setLoading] = useState(false);
 const [saving, setSaving] = useState(false);
 const [saveSuccess, setSaveSuccess] = useState(false);
 const [classes, setClasses] = useState<any[]>([]);
 const [loadingClasses, setLoadingClasses] = useState(true);
 const [studentData, setStudentData] = useState({
   name: "",
   nisn: "",
   class: "",
   gender: "male",
   birthPlace: "",
   birthDate: "",
   telegramNumber: "",
   address: "",
   email: ""
 });
 // Load classes from database
 useEffect(() => {
   const fetchClasses = async () => {
     if (!schoolId) return;

     try {
       setLoadingClasses(true);
       const { collection, getDocs, orderBy, query } = await import('firebase/firestore');
       const { db } = await import('@/lib/firebase');

       const classesRef = collection(db, `schools/${schoolId}/classes`);
       const classesQuery = query(classesRef, orderBy('name', 'asc'));
       const snapshot = await getDocs(classesQuery);

       const classesList: any[] = [];
       snapshot.forEach(doc => {
         const data = doc.data();
         classesList.push({
           id: doc.id,
           name: data.name,
           level: data.level,
           teacherName: data.teacherName
         });
       });

       setClasses(classesList);
     } catch (error) {
       console.error("Error fetching classes:", error);
       toast.error("Gagal memuat data kelas");
     } finally {
       setLoadingClasses(false);
     }
   };
   fetchClasses();
 }, [schoolId]);
 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
   const { name, value } = e.target;
   setStudentData(prev => ({
     ...prev,
     [name]: value
   }));
 };
 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();
   if (!schoolId) {
     toast.error("Tidak dapat mengakses data sekolah");
     return;
   }
   try {
     setSaving(true);
     // Add student data
     const { studentApi } = await import('@/lib/api');
     await studentApi.create(schoolId, studentData);
     // Show success animation
     setSaveSuccess(true);
     toast.success("Data siswa berhasil ditambahkan");
     // Redirect after successful creation
     setTimeout(() => {
       router.push("/dashboard/students");
     }, 1500);
   } catch (error) {
     console.error("Error adding student:", error);
     toast.error("Gagal menambahkan data siswa");
   } finally {
     setSaving(false);
   }
 };
 return (
   <div className="w-full max-w-3xl mx-auto pb-20 md:pb-6 px-3 sm:px-4 md:px-6">
     <div className="flex items-center mb-6">
       <Link href="/dashboard/students" className="p-2 mr-2 hover:bg-gray-100 rounded-full">
         <ArrowLeft size={20} />
       </Link>
       <h1 className="text-2xl font-bold text-gray-800">Tambah Data Siswa</h1>
     </div>

     <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6">
       <form onSubmit={handleSubmit}>
         <div className="space-y-6">
           {/* Student Information */}
           <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-6">
             <div>
               <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                 Nama Lengkap
               </label>
               <div className="relative">
                 <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                 <input
                   type="text"
                   id="name"
                   name="name"
                   value={studentData.name}
                   onChange={handleChange}
                   className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-white"
                   placeholder="Nama lengkap siswa"
                   required
                 />
               </div>
             </div>

             <div>
               <label htmlFor="nisn" className="block text-sm font-medium text-gray-700 mb-1">
                 NISN
               </label>
               <div className="relative">
                 <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                 <input
                   type="text"
                   id="nisn"
                   name="nisn"
                   value={studentData.nisn}
                   onChange={handleChange}
                   className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-white"
                   placeholder="Nomor NISN"
                   required
                 />
               </div>
             </div>

             <div>
               <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-1">
                 Kelas
               </label>
               {loadingClasses ? (
                 <div className="flex items-center justify-center py-2.5 border border-gray-300 rounded-lg bg-gray-50">
                   <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                   <span className="ml-2 text-sm text-gray-500">Memuat data kelas...</span>
                 </div>
               ) : (
                 <select
                   id="class"
                   name="class"
                   value={studentData.class}
                   onChange={handleChange}
                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-white"
                   required
                 >
                   <option value="" disabled>Pilih Kelas</option>
                   {classes.map(cls => (
                     <option key={cls.id} value={cls.name}>
                       {cls.name} - {cls.teacherName}
                     </option>
                   ))}
                 </select>
               )}
               {!loadingClasses && classes.length === 0 && (
                 <p className="text-sm text-amber-600 mt-1">
                   Belum ada kelas tersedia. Silakan tambah kelas terlebih dahulu di menu Manajemen Kelas.
                 </p>
               )}
             </div>

             <div>
               <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                 Jenis Kelamin
               </label>
               <select
                 id="gender"
                 name="gender"
                 value={studentData.gender}
                 onChange={handleChange}
                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-white"
                 required
               >
                 <option value="male">Laki-laki</option>
                 <option value="female">Perempuan</option>
               </select>
             </div>

             <div>
               <label htmlFor="birthPlace" className="block text-sm font-medium text-gray-700 mb-1">
                 Tempat Lahir
               </label>
               <div className="relative">
                 <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                 <input
                   type="text"
                   id="birthPlace"
                   name="birthPlace"
                   value={studentData.birthPlace}
                   onChange={handleChange}
                   className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-white"
                   placeholder="Tempat lahir"
                 />
               </div>
             </div>

             <div>
               <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
                 Tanggal Lahir
               </label>
               <div className="relative">
                 <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                 <input
                   type="date"
                   id="birthDate"
                   name="birthDate"
                   value={studentData.birthDate}
                   onChange={handleChange}
                   className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-white"
                 />
               </div>
             </div>

             <div>
               <label htmlFor="telegramNumber" className="block text-sm font-medium text-gray-700 mb-1">
                 Nomor Telegram
               </label>
               <div className="relative">
                 <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                 <input
                   type="text"
                   id="telegramNumber"
                   name="telegramNumber"
                   value={studentData.telegramNumber}
                   onChange={handleChange}
                   className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-white"
                   placeholder="Nomor Telegram"
                 />
               </div>
             </div>

             <div>
               <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                 Email
               </label>
               <div className="relative">
                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                 <input
                   type="email"
                   id="email"
                   name="email"
                   value={studentData.email}
                   onChange={handleChange}
                   className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-white"
                   placeholder="Email siswa"
                 />
               </div>
             </div>

             <div className="md:col-span-2">
               <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                 Alamat
               </label>
               <div className="relative">
                 <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                 <textarea
                   id="address"
                   name="address"
                   value={studentData.address}
                   onChange={handleChange}
                   rows={3}
                   className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-white"
                   placeholder="Alamat lengkap"
                 />
               </div>
             </div>
           </div>

           <div className="flex justify-end">
             <motion.button
               type="submit"
               disabled={saving || classes.length === 0}
               className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
               whileTap={{ scale: 0.95 }}
             >
               {saving ? (
                 <Loader2 className="h-5 w-5 animate-spin" />
               ) : saveSuccess ? (
                 <CheckCircle size={20} />
               ) : (
                 <Save size={20} />
               )}
               <span>{saving ? "Menyimpan..." : saveSuccess ? "Tersimpan" : "Simpan Data"}</span>
             </motion.button>
           </div>
         </div>
       </form>
     </div>
   </div>
 );
}
